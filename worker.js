// Cloudflare Worker. Settings > Variables and Secrets (add all four as secrets):
//   DEEPL_KEY        your DeepL API Free key (ends in :fx)
//   FIREBASE_API_KEY the apiKey from your Firebase web config
//   SERVICE_ACCOUNT  the full JSON of a Firebase service account key
//   SITE_URL         your site, e.g. https://yourname.github.io/lingo/
const J = { "content-type": "application/json" };
const b64 = (s) => btoa(String.fromCharCode(...new Uint8Array(s))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const enc = (o) => b64(new TextEncoder().encode(JSON.stringify(o)));

async function googleToken(env) {
  const sa = JSON.parse(env.SERVICE_ACCOUNT), n = Math.floor(Date.now() / 1e3);
  const head = enc({ alg: "RS256", typ: "JWT" });
  const body = enc({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/firebase.messaging", aud: "https://oauth2.googleapis.com/token", iat: n, exp: n + 3600 });
  const pem = sa.private_key.replace(/-----[^-]+-----|\s/g, "");
  const k = await crypto.subtle.importKey("pkcs8", Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = b64(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", k, new TextEncoder().encode(head + "." + body)));
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + head + "." + body + "." + sig });
  return (await r.json()).access_token;
}

export default {
  async fetch(req, env) {
    const origin = new URL(env.SITE_URL).origin;
    const cors = { "access-control-allow-origin": origin, "access-control-allow-headers": "authorization,content-type", "access-control-allow-methods": "POST" };
    const out = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...J, ...cors } });
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST" || req.headers.get("origin") !== origin) return out({ error: "forbidden" }, 403);

    // Only signed-in Firebase users may use the Worker
    const idToken = (req.headers.get("authorization") || "").slice(7);
    const who = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + env.FIREBASE_API_KEY, { method: "POST", headers: J, body: JSON.stringify({ idToken }) });
    if (!who.ok) return out({ error: "not signed in" }, 401);

    const path = new URL(req.url).pathname, b = await req.json();

    if (path === "/translate") {
      // Accepts several texts at once (paragraphs or interface strings), capped for the free quota
      let budget = 4000;
      const clipped = (b.texts || [b.text]).map(String).slice(0, 50).map((t) => { const c = t.slice(0, Math.max(0, budget)); budget -= c.length; return c; });
      const idx = [], arr = [];
      clipped.forEach((t, i) => { if (t.trim()) { idx.push(i); arr.push(t); } });
      if (!arr.length) return out({ texts: clipped, text: clipped.join("\n") });
      const r = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST", headers: { authorization: "DeepL-Auth-Key " + env.DEEPL_KEY, ...J },
        body: JSON.stringify({ text: arr, target_lang: b.target, ...(b.source ? { source_lang: b.source } : {}) }),
      });
      if (r.status === 456) return out({ error: "quota" }, 429);
      if (!r.ok) return out({ error: "translation failed" }, 502);
      const t = (await r.json()).translations, res = [...clipped];
      idx.forEach((k, j) => { res[k] = t[j].text; });
      return out({ texts: res, text: res.join("\n"), src: t[0].detected_source_language });
    }

    if (path === "/push") {
      const at = await googleToken(env), pid = JSON.parse(env.SERVICE_ACCOUNT).project_id;
      await Promise.all((b.tokens || []).slice(0, 10).map((t) =>
        fetch(`https://fcm.googleapis.com/v1/projects/${pid}/messages:send`, {
          method: "POST", headers: { authorization: "Bearer " + at, ...J },
          body: JSON.stringify({ message: { token: t, notification: { title: "New message from " + String(b.name).slice(0, 40) }, webpush: { fcm_options: { link: env.SITE_URL } } } }),
        })));
      return out({ ok: true });
    }
    return out({ error: "not found" }, 404);
  },
};
