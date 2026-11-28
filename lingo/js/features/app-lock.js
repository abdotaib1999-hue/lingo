"use strict";
/* js/features/app-lock.js - App lock with PIN and fingerprint. */

const LS=k=>{try{return localStorage[k]}catch{return null}},SS=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage[k]=v}catch{}};

const hashPin=async(p,s)=>btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s+p)))));

const b64u=b=>btoa(String.fromCharCode(...new Uint8Array(b))),unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));

let lmode="unlock",lpin="",lfirst="",unlocked=false,lastHide=0;

const drawDots=()=>$("#ld").replaceChildren(...[0,1,2,3].map(i=>h("span","dotp"+(i<lpin.length?" f":""))));

function lock(title,err){$("#lock").hidden=false;if(title)$("#lt").textContent=title;$("#le").textContent=err||"";lpin="";drawDots();
 $("#lf").hidden=!(lmode==="unlock"&&LS("lcred"));$("#lo").hidden=lmode!=="unlock";$("#lc").hidden=lmode==="unlock"};

async function pinKey(k){
 if(k==="⌫")lpin=lpin.slice(0,-1);else if(lpin.length<4)lpin+=k;
 drawDots();if(lpin.length<4)return;
 const pin=lpin;lpin="";
 if(lmode==="set1"){lfirst=pin;lmode="set2";lock(_("Confirm your PIN"));return}
 if(lmode==="set2"){if(pin!==lfirst){lmode="set1";lock(_("Create a 4-digit PIN"),_("PINs don't match. Try again."));return}
  const s=Array.from(crypto.getRandomValues(new Uint8Array(8))).join("");SS("lsalt",s);SS("lhash",await hashPin(pin,s));PR.lock=1;savePR();unlocked=true;$("#lock").hidden=true;lockUI();return}
 if(Date.now()<+(LS("lt")||0)){lock(null,_("Too many tries. Try again later."));return}
 if(await hashPin(pin,LS("lsalt")||"")===LS("lhash")){SS("lf",null);
  if(lmode==="off"){["lhash","lsalt","lcred"].forEach(k=>SS(k,null));PR.lock=0;savePR();lockUI()}
  unlocked=true;$("#lock").hidden=true}
 else{const f=+(LS("lf")||0)+1;SS("lf",String(f));if(f>=5)SS("lt",String(Date.now()+30000*Math.pow(2,f-5)));lock(null,_("Wrong PIN"))}
};

const kp=$("#kp");

["1","2","3","4","5","6","7","8","9","","0","⌫"].forEach(k=>{const b=h("button","",k);if(!k)b.style.visibility="hidden";b.onclick=()=>pinKey(k);kp.append(b)});

function lockCheck(){if(PR.lock&&LS("lhash")&&!unlocked){lmode="unlock";lock(_("Enter PIN"));if(LS("lcred"))bio()}};

async function bio(){try{await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),allowCredentials:[{type:"public-key",id:unb64(LS("lcred"))}],userVerification:"required",timeout:60000}});unlocked=true;$("#lock").hidden=true}catch{}};

$("#lf").onclick=bio;

$("#lo").onclick=()=>{["lhash","lsalt","lcred"].forEach(k=>SS(k,null));PR.lock=0;savePR();$("#lock").hidden=true;unlocked=false;signOut(auth)};

$("#lc").onclick=()=>$("#lock").hidden=true;

document.addEventListener("visibilitychange",()=>{if(document.hidden)lastHide=Date.now();else if(PR.lock&&Date.now()-lastHide>30000){unlocked=false;lockCheck()}});

const bioOK=async()=>{try{return!!(window.PublicKeyCredential&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())}catch{return false}};

async function lockUI(){const on=!!(PR.lock&&LS("lhash"));$("#lk").hidden=!editing;$("#invw").hidden=!editing;$("#lk").textContent=_(on?"Turn off app lock":"Set up app lock");$("#fpl").hidden=!editing||!on||!(await bioOK());$("#fpid").checked=!!LS("lcred")};

$("#lk").onclick=()=>{if(PR.lock&&LS("lhash")){lmode="off";lock(_("Enter PIN"))}else{lmode="set1";lock(_("Create a 4-digit PIN"))}};

$("#fpid").onchange=async()=>{if(!$("#fpid").checked){SS("lcred",null);return}
 try{const c=await navigator.credentials.create({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rp:{name:"Lingo"},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:me.username||"lingo",displayName:me.name||"Lingo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required"},timeout:60000}});SS("lcred",b64u(c.rawId))}catch{$("#fpid").checked=false}};
