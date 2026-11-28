"use strict";
/* js/features/presence.js - Online status and last seen. */

const ONMS=100000;

const isOn=u=>!!u&&u.showOnline!==false&&!!u.lastActive?.toMillis&&Date.now()-u.lastActive.toMillis()<ONMS;

const presence=u=>{if(!u||u.showOnline===false||!u.lastActive?.toMillis)return"";if(isOn(u))return _("Online");const ms=u.lastActive.toMillis(),d=dayLbl(ms);return _("Last seen")+" "+(d===_("Today")?hm(ms):d+" "+hm(ms))};

function hdr(){if(!cur||cur.group)return;const o=cur.o,u=U[o.id]||o,ln=L.find(l=>l[0]===u.lang)?.[1]||"";$("#cl").textContent=[presence(u),ln].filter(Boolean).join(" · ");$("#cl").classList.toggle("online",isOn(u))};

const avw=(o,on)=>{const w=h("span","avw");w.append(av(o));if(on)w.append(h("span","pdot"));return w};

function paintPresence(){document.querySelectorAll("#list .row[data-o],#frs .fr[data-o]").forEach(r=>{const id=r.dataset.o,w=r.querySelector(".avw");if(!id||!w)return;const d=w.querySelector(".pdot"),on=isOn(U[id]);if(on&&!d)w.append(h("span","pdot"));if(!on&&d)d.remove()})};

async function refreshFriends(){const ids=[...new Set([...$("#list").querySelectorAll(".row[data-o]")].map(r=>r.dataset.o).filter(Boolean))].slice(0,30);
 await Promise.all(ids.map(async id=>{try{const s=await getDoc(doc(db,"users",id));if(s.exists())U[id]={...U[id],id,...s.data()}}catch{}}));paintPresence()};

const beat=force=>{if(!uid||!me||me.showOnline===false)return;if(document.hidden&&!force)return;updateDoc(doc(db,"users",uid),{lastActive:serverTimestamp()}).catch(()=>{})};

setInterval(()=>beat(),45000);

document.addEventListener("visibilitychange",()=>beat(true));

setInterval(()=>{hdr();paintPresence()},20000);

setInterval(()=>{if(auth.currentUser&&!document.hidden&&$("#home").classList.contains("on"))refreshFriends()},60000);

$("#shon").onchange=()=>{const v=$("#shon").checked;me.showOnline=v;updateDoc(doc(db,"users",uid),{showOnline:v,...(v?{lastActive:serverTimestamp()}:{})}).catch(()=>{})};
