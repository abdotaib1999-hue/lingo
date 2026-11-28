"use strict";
/* js/features/profile.js - Profile hub: name, language, appearance, notifications, lock, invite, privacy, about. */

L.forEach(([v,n])=>$("#lg").append(new Option(n,v)));

const setPv=d=>{$("#pv").style.background=d?`url(${d}) center/cover`:"";$("#pt").textContent=d?"":"+"};

function openSetup(edit,d){editing=edit;photoData=d.photo||"";$("#nm").value=d.name||"";$("#usr").value=d.username||"";$("#usr").disabled=edit;$("#lg").value=d.lang||"EN-US";setPv(photoData);$("#se").textContent="";
 $("#pb").hidden=!edit;$("#sv").hidden=edit;
 if(edit)profView("");else{$("#hub").hidden=true;document.querySelectorAll("#setup .sec").forEach(e=>e.hidden=!["name","lang"].includes(e.dataset.s));$("#sv1").hidden=$("#sv2").hidden=true;$("#st").textContent=_("Set up your profile")}
 show("setup");lockUI()};

$("#pf").onchange=async e=>{const f=e.target.files[0];if(f){photoData=await shrink(f,128,.8);setPv(photoData)}};

$("#lg").onchange=()=>{setUI($("#lg").value);fetchUI($("#lg").value);if(!editing)$("#st").textContent=_("Set up your profile")};

$("#mb").onclick=()=>openSetup(true,me);

$("#sv").onclick=async()=>{
 const name=$("#nm").value.trim(),un=$("#usr").value.trim().toLowerCase(),lang=$("#lg").value,e=$("#se");
 if(!name)return e.textContent=_("Enter your name.");
 if(!/^[a-z0-9_]{3,20}$/.test(un))return e.textContent="Username: 3–20 letters, numbers or _";
 try{const b=writeBatch(db);
  if(editing)b.update(doc(db,"users",uid),{name,lang,photo:photoData});
  else{b.set(doc(db,"usernames",un),{uid});b.set(doc(db,"users",uid),{name,username:un,lang,photo:photoData,tokens:[]})}
  await b.commit();me={tokens:[],...me,name,lang,photo:photoData,username:editing?me.username:un};delete U[uid];if(editing){setUI(lang);fetchUI(lang);profView("");toast(_("Saved"))}else home();
 }catch{e.textContent=editing?"Could not save. Try again.":_("That username is taken.")}
};

let psec="";

const TITLES={name:"Name and photo",lang:"Language",look:"Appearance",notif:"Notifications",lock:"App lock",invite:"Invite friends",about:"About",privacy:"Privacy"};

function profView(s){psec=s;$("#hub").hidden=!!s;document.querySelectorAll("#setup .sec").forEach(e=>e.hidden=e.dataset.s!==s);
 $("#st").textContent=_(s?TITLES[s]:"Profile");$("#se").textContent="";$("#sv1").hidden=$("#sv2").hidden=false;
 if(s==="notif")notifUI();if(s==="privacy")$("#shon").checked=me.showOnline!==false;if(s)lockUI()};

document.querySelectorAll("#hub .hb").forEach(b=>b.onclick=()=>profView(b.dataset.s));

$("#pb").onclick=()=>psec?profView(""):home();

$("#sv1").onclick=$("#sv").onclick;

$("#sv2").onclick=$("#sv").onclick;

{let ex=0,ey=0;const su=$("#setup");
 su.addEventListener("touchstart",e=>{ex=e.touches[0].clientX;ey=e.touches[0].clientY},{passive:true});
 su.addEventListener("touchend",e=>{const t=e.changedTouches[0];if(editing&&ex<40&&t.clientX-ex>80&&Math.abs(t.clientY-ey)<60)$("#pb").click()},{passive:true})};
