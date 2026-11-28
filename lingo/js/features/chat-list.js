"use strict";
/* js/features/chat-list.js - Home screen: friends card, chips, chat list, tab bar, friend requests, invite link. */

function home(){
 setUI(me.lang);fetchUI(me.lang);lockCheck();watchInv();beat();if(!PR.intro&&$("#intro").hidden)showIntro();show("home");cur=null;unM?.();unC?.();unT?.();unP?.();
 $("#bell").hidden=typeof Notification!=="undefined"&&Notification.permission==="granted"&&!PR.pushOff;
 unC=onSnapshot(query(collection(db,"chats"),where("members","array-contains",uid)),async s=>{
  const cs=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.updated?.seconds||9e9)-(a.updated?.seconds||9e9)).filter(c=>{const hs=c.hidden?.[uid]?.seconds;return!(hs&&(c.updated?.seconds||0)<=hs)});
  FR=[];FC={};const rows=await Promise.all(cs.map(async c=>{const o=c.group?{id:c.id,name:c.name,group:true}:await user(c.members.find(x=>x!==uid));if(!c.group&&c.status==="active"){FR.push(o);FC[o.id]=c}return row(c,o)}));
  $("#list").replaceChildren(...rows);layout();drawFriends();refreshFriends();PM?.refresh();
 });
 const a=new URLSearchParams(location.search).get("add");if(a){history.replaceState(0,"",location.pathname);request(a).then(ok=>{if(ok)toast(_("Request sent"))})}
};

function row(c,o){
 const b=h("button","row"),t=h("div"),pend=c.status==="pending",incoming=pend&&c.from!==uid;
 t.append(h("b","",o.name),h("small","",pend?(incoming?_("Wants to chat with you"):_("Request sent")):c.last||_("Say hi 👋")));
 const r=h("div","rc");r.append(h("small","",lt(c.updated)));if(incoming)r.append(h("span","pill",_("Accept")));const un=c.unread?.[uid]||0;if(un)r.append(h("span","badge",un>99?"99+":String(un)));b.dataset.u=un?"1":"0";b.dataset.g=c.group?"1":"0";b.dataset.m=c.muted?.[uid]?"1":"0";b.dataset.id=c.id;b.dataset.o=c.group?"":(c.members.find(x=>x!==uid)||"");
 if(c.lastFrom===uid&&c.status!=="pending"){const k=h("span","tk"),oth=c.members.find(x=>x!==uid);k.innerHTML=svgi("check2");if(!c.group&&(c.seen?.[oth]?.seconds||0)>=(c.updated?.seconds||0))k.style.color="var(--ac)";r.append(k)}b.dataset.n=(o.name||"").toLowerCase();b.append(avw(o,!c.group&&isOn(o)),t,r);
 b.onclick=async()=>{if(pend){if(!incoming)return;await updateDoc(doc(db,"chats",c.id),{status:"active"})}open(c,o)};
 return b};

async function request(un,e){e=e||{};e.textContent="";un=un.trim().replace(/^@/,"").toLowerCase();if(!un)return false;
 try{const s=await getDoc(doc(db,"usernames",un));
  if(!s.exists()){e.textContent=_("No one has that username.");return false}
  const o=s.data().uid;if(o===uid){e.textContent="That's your own username.";return false}
  const id=[uid,o].sort().join("_");
  if((await getDoc(doc(db,"chats",id))).exists()){e.textContent="You already have a chat with them.";return false}
  await setDoc(doc(db,"chats",id),{members:[uid,o],status:"pending",from:uid,last:"",updated:serverTimestamp()});return true
 }catch{e.textContent="Could not send the request.";return false}};

const inviteUrl=()=>location.origin+location.pathname+"?add="+me.username;

$("#inv").onclick=async()=>{await navigator.clipboard.writeText(inviteUrl());$("#inv").textContent=_("Copied!");setTimeout(()=>$("#inv").textContent=_("Copy invite link"),1500)};

$("#qb").onclick=()=>{const q=qrcode(0,"M");q.addData(inviteUrl());q.make();$("#qrimg").innerHTML=q.createSvgTag({scalable:true});$("#qr").hidden=false};

$("#qr").onclick=()=>$("#qr").hidden=true;

$("#bell").onclick=async()=>{PR.pushOff=0;savePR();try{
 if(!(await isSupported()))return $("#he").textContent="On iPhone: tap Share, then Add to Home Screen, and open Lingo from there.";
 if(await Notification.requestPermission()!=="granted")return;
 const reg=await navigator.serviceWorker.register("firebase-messaging-sw.js");
 const t=await getToken(getMessaging(app),{vapidKey:CFG.vapid,serviceWorkerRegistration:reg});
 await updateDoc(doc(db,"users",uid),{tokens:arrayUnion(t)});$("#bell").hidden=true;
}catch{$("#he").textContent="Could not turn on notifications."}};

function setFilter(f){FLT=f;document.querySelectorAll("#chips .ch").forEach(c=>c.classList.toggle("on",c.dataset.f===f));$("#t1").classList.toggle("on",f!=="groups");$("#t2").classList.toggle("on",f==="groups");$("#gbar").hidden=f!=="groups";applyFilter()};

document.querySelectorAll("#chips .ch").forEach(c=>c.onclick=()=>setFilter(c.dataset.f));

$("#t1").onclick=()=>setFilter("all");

$("#t2").onclick=()=>setFilter("groups");

$("#t3").onclick=()=>openSetup(true,me);

function applyFilter(){const q=SQ;let head=null,vis=0;
 [...$("#list").children].forEach(e=>{if(e.classList.contains("sc")){head=e;e._n=0;return}if(!e.classList.contains("row"))return;
  const d=e.dataset,ok=(FLT==="all"||(FLT==="unread"&&d.u==="1")||(FLT==="groups"&&d.g==="1")||(FLT==="muted"&&d.m==="1"))&&(!q||(d.n||"").includes(q));
  e.hidden=!ok;if(ok){vis++;if(head)head._n++}});
 $("#list").querySelectorAll(".sc").forEach(e=>e.hidden=!e._n);$("#gempty").hidden=!(FLT==="groups"&&!vis)};

function layout(){const L2=$("#list"),rs=[...L2.querySelectorAll(".row")],pins=PR.pins||[],pr=rs.filter(r=>pins.includes(r.dataset.id)),ot=rs.filter(r=>!pins.includes(r.dataset.id)),mk=t=>h("div","sc",_(t)),kids=[];
 if(pr.length)kids.push(mk("Pinned"),...pr);kids.push(mk("All chats"),...ot);
 L2.replaceChildren(...(rs.length?kids:[Object.assign(h("p","mu",_("No chats yet. Add a friend by username or share your invite link.")),{style:"padding:20px"})]));
 $("#c1").textContent=rs.filter(r=>r.dataset.u==="1").length||"";$("#c2").textContent=rs.filter(r=>r.dataset.g==="1").length||"";applyFilter()};

function drawFriends(){const box=$("#frs"),ad=h("button","fr add"),ai=h("div","av");ai.innerHTML=svgi("plus");ad.append(ai,h("span","",_("Add")));ad.onclick=openAdd;
 box.replaceChildren(ad,...FR.slice(0,8).map(f=>{const b=h("button","fr"),l=(f.lang||"").split("-")[0];b.dataset.o=f.id;b.append(avw(f,isOn(f)),h("span","fn",(f.name||"").split(" ")[0]),h("small","fl",l));b.onclick=()=>open(FC[f.id],f);return b}))};

$("#pin").onchange=()=>{const a=new Set(PR.pins||[]);$("#pin").checked?a.add(cur.id):a.delete(cur.id);PR.pins=[...a];savePR();layout()};
