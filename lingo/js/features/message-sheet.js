"use strict";
/* js/features/message-sheet.js - Message bottom sheet (react, reply, listen, copy, edit, delete). */

function openMsg({d,m,x,mine,rep,cid}){const sh=$("#ms"),mr=m.rx?.[uid];
 $("#mq").textContent=(x&&x.textContent)||m.text||_("📷 Photo");
 const re=$("#mr");re.replaceChildren();
 ["👍","❤️","😂","😮","😢","🙏"].forEach(em=>{const bt=h("button","em"+(mr===em?" on":""));bt.setAttribute("aria-label",em);bt.append(aem(em,36));bt.onclick=()=>{updateDoc(d.ref,{["rx."+uid]:mr===em?deleteField():em}).catch(()=>{});sh.hidden=true;if(mr!==em)burst(em)};re.append(bt)});
 const ls=$("#ml");ls.replaceChildren();
 const item=(label,icon,f,red)=>{const b=h("button","ac"+(red?" red":"")),s=h("span");s.innerHTML=svgi(icon);b.append(h("span","",_(label)),s);b.onclick=()=>{sh.hidden=true;f()};ls.append(b)};
 item("Reply","reply",rep);
 if(x&&!mine)item("Listen","vol",()=>speak(x.textContent));
 if(m.text)item("Copy","copy",()=>{try{navigator.clipboard.writeText(m.text)}catch{}});
 if(mine&&m.text)item("Edit","edit",()=>startEdit(d,m));
 if(mine)item("Delete","trash",()=>{deleteDoc(d.ref);if(m.img)deleteDoc(doc(db,"chats",cid,"photos",m.img))},true);
 sh.hidden=false};

$("#ms").onclick=e=>{if(e.target.id==="ms")$("#ms").hidden=true};

function startEdit(d,m){editRef=d.ref;$("#tx").value=m.text;setSd();$("#rpt").textContent=_("Editing message");$("#rp").hidden=false;$("#tx").focus()};
