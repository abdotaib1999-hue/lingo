"use strict";
/* js/core/api.js - Calls to the Cloudflare Worker (translation). */

const hd=async()=>({"content-type":"application/json",authorization:"Bearer "+await auth.currentUser.getIdToken()});

const tr=async(text,target)=>{const r=await fetch(CFG.worker+"/translate",{method:"POST",headers:await hd(),body:JSON.stringify({texts:text.split("\n"),target})});if(r.status===429)throw"quota";if(!r.ok)throw 0;const j=await r.json();return{text:j.texts.join("\n"),src:j.src||""}};
