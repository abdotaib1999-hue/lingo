"use strict";
/* js/features/chat-settings.js - Per-chat settings: color, wallpaper, mute, pin, shared photos. */

const PRC=(()=>{try{return JSON.parse(localStorage.lingoc||"{}")}catch{return{}}})();

const savePRC=()=>{try{localStorage.lingoc=JSON.stringify(PRC)}catch{}};

const WPS=["","linear-gradient(160deg,#fbd3e9,#bb377d33)","linear-gradient(160deg,#c2f0e6,#2bd4c033)","linear-gradient(160deg,#ffe9c7,#ff9a3c33)","linear-gradient(160deg,#cfd9ff,#2F78DB33)","linear-gradient(160deg,#1b2440,#0b0f1c)"];

const COLS=["","#7c3aed","#db2777","#e11d48","#ea580c","#059669","#0891b2"];

function applyChat(cid){const a=PRC[cid]||{},c=$("#chat");a.c?c.style.setProperty("--me",a.c):c.style.removeProperty("--me");$("#msgs").style.background=a.w||""};

const swatches=(box,list,key,paint)=>{list.forEach(v=>{const b=h("button");b.style.cssText="width:34px;height:34px;border-radius:50%;border:2px solid var(--glb);background:"+paint(v);b.onclick=()=>{(PRC[cur.id]=PRC[cur.id]||{})[key]=v;savePRC();applyChat(cur.id)};box.append(b)})};

swatches($("#cs"),COLS,"c",v=>v||"#2F78DB");

swatches($("#ws"),WPS,"w",v=>v||"var(--bg)");

const openInfo=()=>{const o=cur.o,ia=$("#ia"),t=h("h2","",o.name);t.style.margin="8px 0 0";
 ia.replaceChildren(av(o),t,h("small","mu",cur.group?cur.members.length+" "+_("members"):(L.find(l=>l[0]===o.lang)?.[1]||"")));ia.style.textAlign="center";
 $("#mute").checked=!!cur.mm;$("#pin").checked=(PR.pins||[]).includes(cur.id);$("#gal").replaceChildren();
 $("#blk").hidden=cur.group||(!!cur.blocked&&cur.blocked!==uid);$("#blk").textContent=cur.blocked===uid?_("Unblock"):_("Block");
 renderGroup();$("#mnu").hidden=false};

$("#mn").onclick=openInfo;

["#cn","#cl","#cav"].forEach(x=>$(x).onclick=openInfo);

$("#mnu").onclick=e=>{if(e.target===$("#mnu"))$("#mnu").hidden=true};

$("#mute").onchange=()=>updateDoc(doc(db,"chats",cur.id),{["muted."+uid]:$("#mute").checked}).catch(()=>{});

$("#shp").onclick=async()=>{const g=$("#gal");g.replaceChildren(h("small","mu",_("Loading…")));
 try{const s=await getDocs(query(collection(db,"chats",cur.id,"photos"),orderBy("expireAt","desc"),limit(24)));g.replaceChildren();
  s.forEach(d=>{const p=d.data();if(p.expireAt.toMillis()<Date.now())return;const i=h("img");i.src=p.data;i.onclick=()=>{$("#vwi").src=i.src;$("#vw").hidden=false};g.append(i)});
  if(!g.children.length)g.append(h("small","mu",_("No photos yet")))}catch{g.replaceChildren()}};
