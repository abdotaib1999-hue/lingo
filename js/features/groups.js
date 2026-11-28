"use strict";
/* js/features/groups.js - Group chats: members, invitations, creating groups. */

function renderGroup(){const g=$("#gi");g.replaceChildren();if(!cur.group)return;const adm=cur.admin===uid;
 cur.members.forEach(id=>{const u=U[id]||{name:"…"},r=h("div","gm");r.append(av(u),h("span","",u.name+(id===cur.admin?" · "+_("Admin"):"")));
  if(adm&&id!==uid){const x=h("i","","✕");x.onclick=()=>updateDoc(doc(db,"chats",cur.id),{members:arrayRemove(id)}).then(()=>{cur.members=cur.members.filter(y=>y!==id);renderGroup()}).catch(()=>{});r.append(x)}g.append(r)});
 const btn=(t,f)=>{const b=h("button","btn alt",_(t));b.onclick=f;g.append(b)};
 if(adm){btn("Add members",()=>pick("add"));btn("Rename group",async()=>{const n=prompt(_("New group name"),cur.name);if(n&&n.trim())await updateDoc(doc(db,"chats",cur.id),{name:n.trim().slice(0,40)}).catch(()=>{})})}
 btn("Leave group",async()=>{const rest=cur.members.filter(x=>x!==uid),u={members:rest};if(cur.admin===uid&&rest.length)u.admin=rest[0];try{await updateDoc(doc(db,"chats",cur.id),u);$("#mnu").hidden=true;home()}catch{}})};

let pmode="new";

function pick(mode){pmode=mode;$("#gt").textContent=_(mode==="new"?"New group":"Add members");$("#gc").textContent=_(mode==="new"?"Create group":"Send invites");
 $("#gn").hidden=mode!=="new";$("#gn").value="";$("#ge").textContent="";const gl=$("#gl");gl.replaceChildren();
 const taken=new Set(mode==="add"?cur.members:[]),list=FR.filter(f=>!taken.has(f.id));
 if(!list.length)gl.append(h("p","mu",_("No friends to add yet.")));
 list.forEach(f=>{const l=h("label","tg"),c=h("input");c.type="checkbox";c.value=f.id;l.append(h("span","",f.name),c);gl.append(l)});
 $("#grp").hidden=false};

$("#ng").onclick=()=>pick("new");

$("#gx").onclick=()=>$("#grp").hidden=true;

$("#gc").onclick=async()=>{const sel=[...$("#gl").querySelectorAll("input:checked")].map(i=>i.value),e=$("#ge");e.textContent="";
 try{let gid,gname;
  if(pmode==="new"){gname=$("#gn").value.trim();if(!gname)return e.textContent=_("Enter a group name.");if(!sel.length)return e.textContent=_("Select friends to invite");
   gid=doc(collection(db,"chats")).id;await setDoc(doc(db,"chats",gid),{group:true,name:gname.slice(0,40),members:[uid],admin:uid,status:"active",from:uid,last:"",lastFrom:"",updated:serverTimestamp()})}
  else{gid=cur.id;gname=cur.name;if(!sel.length)return e.textContent=_("Select friends to invite")}
  await Promise.all(sel.map(id=>setDoc(doc(db,"invites",gid+"_"+id),{gid,gname,from:uid,fromName:me.name,to:id})));
  $("#grp").hidden=true;$("#mnu").hidden=true;
 }catch{e.textContent=_("Could not create the group.")}};

function watchInv(){unI?.();unI=onSnapshot(query(collection(db,"invites"),where("to","==",uid)),s=>{const box=$("#invs");box.replaceChildren();
 s.docs.forEach(d=>{const v=d.data(),r=h("div","row"),t=h("div");t.append(h("b","",v.gname),h("small","",_("Group invitation")+" · "+_("Invited by")+" "+v.fromName));
  const ok=h("span","pill",_("Accept")),no=h("span","pill",_("Decline"));no.style.background="var(--mu)";
  ok.onclick=async()=>{try{await updateDoc(doc(db,"chats",v.gid),{members:arrayUnion(uid)});await deleteDoc(d.ref)}catch{}};no.onclick=()=>deleteDoc(d.ref).catch(()=>{});
  r.append(t,ok,no);box.append(r)})},()=>{})};

async function createGroup(name,ids){const gid=doc(collection(db,"chats")).id;
 await setDoc(doc(db,"chats",gid),{group:true,name:name.slice(0,40),members:[uid],admin:uid,status:"active",from:uid,last:"",lastFrom:"",updated:serverTimestamp()});
 await Promise.all(ids.map(id=>setDoc(doc(db,"invites",gid+"_"+id),{gid,gname:name,from:uid,fromName:me.name,to:id})))};
