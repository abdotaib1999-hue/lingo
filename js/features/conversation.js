"use strict";
/* js/features/conversation.js - Conversation: open chat, bubbles, translation, sending, dictation, long-press menu. */

$("#tip").onclick=()=>{PR.tip=1;savePR();$("#tip").hidden=true};

$("#vw").onclick=()=>$("#vw").hidden=true;

const post=bx=>{const a=[...bx.children];a.forEach((e,i)=>{const f=e.dataset.f;e.classList.toggle("cont",!!f&&a[i-1]?.dataset.f===f);e.classList.toggle("nxt",!!f&&a[i+1]?.dataset.f===f);
 if(f===uid&&e.dataset.t){const tm=e.querySelector(".tm");if(tm)tm.textContent=hm(+e.dataset.t)+(e.dataset.ed?" · "+_("edited"):"")+" "+(cur?.seen>=+e.dataset.t?"✓✓":"✓")}})};

async function open(c,o){
 cur={id:c.id,o,blocked:"",group:!!c.group,members:c.members||[],admin:c.admin,name:c.name};if(c.group)await Promise.all(c.members.map(user));replyTo=null;$("#rp").hidden=true;$("#ty").hidden=true;$("#tip").hidden=!!PR.tip;show("chat");applyChat(c.id);$("#cn").textContent=o.name;hdr();unP?.();unP=c.group?null:onSnapshot(doc(db,"users",o.id),s=>{if(s.exists()){U[o.id]={...U[o.id],id:o.id,...s.data()};hdr()}},()=>{});$("#cav").replaceChildren(av(o));$("#msgs").replaceChildren();$("#emo").classList.remove("on");
 const cref=doc(db,"chats",c.id),seen=()=>updateDoc(cref,{["seen."+uid]:serverTimestamp(),["unread."+uid]:0}).catch(()=>{});
 getDocs(query(collection(db,"chats",c.id,"photos"),where("expireAt","<",Timestamp.now()))).then(s=>s.forEach(d=>d.data().from===uid&&deleteDoc(d.ref))).catch(()=>{});
 let first=true,n=50,keep=0,shown=0,tm;unT?.();
 unT=onSnapshot(cref,s=>{const d=s.data({serverTimestamps:"estimate"});if(!d)return;
  cur.blocked=d.blocked||"";cur.mm=!!d.muted?.[uid];cur.muted=!!d.muted?.[o.id];cur.mutedMap=d.muted||{};cur.group=!!d.group;cur.members=d.members||[];cur.admin=d.admin;cur.name=d.name||cur.name;{const ot=cur.members.filter(x=>x!==uid);cur.seen=ot.length?Math.min(...ot.map(x=>d.seen?.[x]?.toMillis?.()||0)):0}if(d.group){$("#cn").textContent=d.name;$("#cl").textContent=cur.members.length+" "+_("members")}{const bx=$("#msgs");bx.querySelectorAll(".sn").forEach(e=>e.remove());post(bx)}$("#bar").hidden=!!cur.blocked;$("#bk").hidden=!cur.blocked;
  $("#bk").textContent=cur.blocked===uid?_("You blocked this person. Unblock from the ⋯ menu."):_("You can't reply in this chat.");
  const ty=$("#ty"),who=Object.entries(d.typing||{}).filter(([k,v])=>k!==uid&&(v?.toMillis?.()||0)>Date.now()-5000).map(([k])=>U[k]?.name||o.name).filter(Boolean);clearTimeout(tm);
  if(who.length){ty.textContent=who.join(", ")+_(" is typing…");ty.hidden=false;tm=setTimeout(()=>ty.hidden=true,5000)}else ty.hidden=true});
 const sub=()=>{unM?.();unM=onSnapshot(query(collection(db,"chats",c.id,"messages"),orderBy("t","desc"),limit(n)),s=>{
  const bx=$("#msgs"),near=bx.scrollHeight-bx.scrollTop-bx.clientHeight<90,ds=s.docs.reverse(),els=ds.flatMap((d,i)=>{const g=x=>x.data({serverTimestamps:"estimate"}).t?.toMillis?.(),t=g(d),p=i&&g(ds[i-1]);return t&&(!p||new Date(t).toDateString()!==new Date(p).toDateString())?[h("div","dv",dayLbl(t)),bubble(d)]:[bubble(d)]});
  if(s.size>=n){const mb=h("button","more",_("Load earlier messages"));mb.onclick=()=>{keep=bx.scrollHeight-bx.scrollTop;n+=50;sub()};els.unshift(mb)}
  bx.replaceChildren(...els);post(bx);
  if(keep&&s.size>shown){bx.scrollTop=bx.scrollHeight-keep;keep=0}else if(!keep&&(first||near))bx.scrollTop=bx.scrollHeight;
  if(ds.length&&ds[ds.length-1].data().from!==uid)seen();
  first=false;shown=s.size})};
 sub();
};

function bubble(d){
 const m=d.data({serverTimestamps:"estimate"}),mine=m.from===uid,b=h("div","b"+(mine?" me":"")),cid=cur.id;let x=null;
 if(cur.group&&!mine){const sn=h("div","sn2",U[m.from]?.name||"…");if(!U[m.from])user(m.from).then(u=>sn.textContent=u.name);b.append(sn)}
 if(m.re)b.append(h("div","qt",m.re));
 if(m.loc){const a=h("a","",_("📍 Open location"));a.href="https://www.openstreetmap.org/?mlat="+m.loc[0]+"&mlon="+m.loc[1]+"#map=16/"+m.loc[0]+"/"+m.loc[1];a.target="_blank";a.rel="noopener";a.onclick=e=>e.stopPropagation();a.style.cssText="color:inherit;font-weight:600;text-decoration:underline";b.append(a)}
 if(m.img){const i=h("img");i.onclick=e=>{e.stopPropagation();$("#vwi").src=i.src;$("#vw").hidden=false};b.append(i);photo(m.img,i,b,cid)}
 if(m.text){x=h("span","",m.text);x.dir="auto";b.append(x);const big=bigEmoji(m.text);if(big){b.classList.add("big");x.textContent="";big.forEach(g=>x.append(aem(g,72)))}
  if(!mine&&m.lang&&base(m.lang)!==base(me.lang)&&!emoOnly(m.text)){
   const t=m.tr?.[key(me.lang)];
   if(t){if(!(m.src&&base(m.src)===base(me.lang))){
     const nm=(L.find(l=>base(l[0])===m.src)||[])[1]?_(" from ")+L.find(l=>base(l[0])===m.src)[1].replace(/ \(.*\)/,""):"",lbl=_("Translated")+nm+_(" · tap for original"),n=h("i","",lbl);
     x.textContent=t;if(PR.both){const o=h("div","orig",m.text);o.dir="auto";b.append(o)}b.append(n);
     n.onclick=e=>{e.stopPropagation();const o=n.dataset.o;n.dataset.o=o?"":"1";x.textContent=o?t:m.text;n.textContent=o?lbl:_("Original · tap for translation")}}}
   else if(!paused){x.textContent=_("Translating…");x.style.opacity=.6;translate(d.ref,m,x)}}}
 const rxs=Object.values(m.rx||{});if(rxs.length){b.classList.add("hasrx");const rc=h("div","rx",[...new Set(rxs)].slice(0,3).join("")+(rxs.length>1?" "+rxs.length:""));if(m.rx?.[uid]){rc.title=_("Tap to remove your reaction");rc.onclick=ev=>{ev.stopPropagation();updateDoc(d.ref,{["rx."+uid]:deleteField()}).catch(()=>{})}}b.append(rc)}
 const tmx=m.t?.toMillis?.();b.dataset.f=m.from;b.dataset.ed=m.edited?"1":"";if(tmx){b.dataset.t=tmx;b.append(h("small","tm",hm(tmx)+(m.edited?" · "+_("edited"):"")))}
 const rep=()=>{replyTo=(m.text||_("📷 Photo")).slice(0,100);$("#rpt").textContent=replyTo;$("#rp").hidden=false;$("#tx").focus()};
 const ctx={d,m,x,mine,rep,cid};let sx=0,sy=0,lp=0,fired=false;
 const stop=()=>clearTimeout(lp),go=()=>{fired=true;try{navigator.vibrate&&navigator.vibrate(12)}catch{}openMsg(ctx)};
 b.addEventListener("touchstart",e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;fired=false;stop();lp=setTimeout(go,450)},{passive:true});
 b.addEventListener("touchmove",e=>{const t=e.touches[0];if(Math.abs(t.clientX-sx)>10||Math.abs(t.clientY-sy)>10)stop()},{passive:true});
 b.addEventListener("touchend",e=>{stop();const t=e.changedTouches[0];if(!fired&&t.clientX-sx>90&&Math.abs(t.clientY-sy)<30)rep()},{passive:true});
 b.addEventListener("touchcancel",stop,{passive:true});
 b.addEventListener("contextmenu",e=>{e.preventDefault();stop();go()});
 b.onclick=e=>{if(fired){fired=false;return}const n=b.querySelector("i");if(n)n.click()};
 return b};

async function translate(ref,m,x){
 if(busy.has(ref.id))return;busy.add(ref.id);
 try{const r=await tr(m.text,me.lang);await updateDoc(ref,{["tr."+key(me.lang)]:r.text,src:r.src})}
 catch(e){x.textContent=m.text;x.style.opacity=1;if(e==="quota"){paused=true;$("#pz").hidden=false}}finally{busy.delete(ref.id)}};

async function photo(pid,img,b,cid){
 if(!(pid in P))try{P[pid]=(await getDoc(doc(db,"chats",cid,"photos",pid))).data()||null}catch{P[pid]=null}
 const p=P[pid];if(p&&p.expireAt.toMillis()>Date.now())img.src=p.data;else{img.remove();b.prepend(h("i","",_("Photo expired")))}};

async function send(img,extra){
 if(editRef){const t=$("#tx").value.trim();if(t){try{await updateDoc(editRef,{text:t,edited:true,lang:me.lang,tr:deleteField(),src:deleteField()})}catch{}}editRef=null;$("#tx").value="";setSd();$("#rp").hidden=true;return}
 const text=$("#tx").value.trim();if(!cur||(!text&&!img&&!extra))return;$("#tx").value="";setSd();$("#emo").classList.remove("on");
 const cid=cur.id,grp=cur.group,mm=cur.mutedMap||{},others=grp?cur.members.filter(x=>x!==uid):[cur.o.id],gname=cur.name;let pid=null;
 try{if(img){pid=doc(collection(db,"chats",cid,"photos")).id;
   await setDoc(doc(db,"chats",cid,"photos",pid),{from:uid,data:img,expireAt:Timestamp.fromMillis(Date.now()+15*864e5)})}
  await addDoc(collection(db,"chats",cid,"messages"),{from:uid,text,lang:me.lang,img:pid,t:serverTimestamp(),...(replyTo?{re:replyTo}:{}),...(extra||{})});
  await updateDoc(doc(db,"chats",cid),{last:(grp?me.name+": ":"")+(extra?.loc?"📍 ":pid?"📷 ":"")+text,updated:serverTimestamp(),lastFrom:uid,...Object.fromEntries(others.map(id=>["unread."+id,increment(1)]))});replyTo=null;$("#rp").hidden=true;
  const us=await Promise.all(others.filter(id=>!mm[id]).map(id=>getDoc(doc(db,"users",id)))),tk=us.flatMap(x=>x.data()?.tokens||[]).slice(0,10);
  if(tk.length)fetch(CFG.worker+"/push",{method:"POST",headers:await hd(),body:JSON.stringify({tokens:tk,name:grp?me.name+" · "+gname:me.name})}).catch(()=>{});
 }catch{$("#tx").value=text}};

$("#sd").onclick=()=>{if(!$("#tx").value.trim()&&SR)dictate();else send()};

$("#tx").onkeydown=e=>{if(e.key==="Enter")send()};

$("#ph").onchange=async e=>{const f=e.target.files[0];e.target.value="";if(f)send(await shrink(f,1000,.7))};

$("#eb").onclick=()=>$("#emo").classList.toggle("on");

$("#back").onclick=()=>home();

$("#tx").dir="auto";

const bcp=l=>({NB:"nb-NO",ZH:"zh-CN"}[l]||l).replace(/^[A-Z]+/,x=>x.toLowerCase());

const speak=t=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=bcp(me.lang);speechSynthesis.speak(u)};

const SR=window.SpeechRecognition||window.webkitSpeechRecognition;

const dictate=()=>{const r=new SR();r.lang=bcp(me.lang);r.onresult=e=>{$("#tx").value+=($("#tx").value?" ":"")+e.results[0][0].transcript;setSd()};r.onend=()=>$("#sd").style.opacity=1;$("#sd").style.opacity=.5;r.start()};

$("#tx").oninput=()=>{if(cur&&Date.now()-lastT>3000){lastT=Date.now();updateDoc(doc(db,"chats",cur.id),{["typing."+uid]:serverTimestamp()}).catch(()=>{})}};

$("#rp").onclick=()=>{replyTo=null;$("#rp").hidden=true;if(editRef){editRef=null;$("#tx").value="";setSd()}};

$("#mn").onclick=()=>{$("#blk").textContent=cur.blocked===uid?_("Unblock"):_("Block");$("#blk").hidden=!!cur.blocked&&cur.blocked!==uid;$("#mnu").hidden=false};

$("#mx").onclick=()=>$("#mnu").hidden=true;

$("#blk").onclick=async()=>{await updateDoc(doc(db,"chats",cur.id),{blocked:cur.blocked===uid?deleteField():uid}).catch(()=>{});$("#mnu").hidden=true};

$("#rm").onclick=async()=>{await updateDoc(doc(db,"chats",cur.id),{["hidden."+uid]:serverTimestamp()}).catch(()=>{});$("#mnu").hidden=true;home()};
