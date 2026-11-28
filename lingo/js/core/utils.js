"use strict";
/* js/core/utils.js - Small helpers: $, h (create element), show (screens), time and date formatting, toast. */

const $=s=>document.querySelector(s),base=l=>l.split("-")[0],key=l=>l.replace("-","_");

const h=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};

const show=id=>{document.querySelectorAll("section").forEach(s=>s.classList.toggle("on",s.id===id));document.body.classList.toggle("split",id==="home"||id==="chat")};

const emoOnly=t=>/^[\p{Extended_Pictographic}\s\u200d\ufe0f]*$/u.test(t);

const shrink=(f,max,q)=>new Promise(r=>{const i=new Image();i.onload=()=>{const s=Math.min(1,max/Math.max(i.width,i.height)),c=h("canvas");c.width=i.width*s;c.height=i.height*s;c.getContext("2d").drawImage(i,0,0,c.width,c.height);r(c.toDataURL("image/jpeg",q))};i.src=URL.createObjectURL(f)});

const dayLbl=ms=>{const d=new Date(ms),n=new Date(),same=(a,b)=>a.toDateString()===b.toDateString();return same(d,n)?_("Today"):same(d,new Date(Date.now()-864e5))?_("Yesterday"):d.toLocaleDateString(loc(),{day:"numeric",month:"short",year:d.getFullYear()===n.getFullYear()?undefined:"numeric"})};

const hm=ms=>new Date(ms).toLocaleTimeString(loc(),{hour:"2-digit",minute:"2-digit"});

const lt=ts=>{const ms=ts?.toMillis?.(),l=ms&&dayLbl(ms);return!ms?"":l===_("Today")?hm(ms):l};

let tt=0;

function toast(t){const e=$("#toast");e.textContent=t;e.hidden=false;clearTimeout(tt);tt=setTimeout(()=>e.hidden=true,1800)};
