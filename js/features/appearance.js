"use strict";
/* js/features/appearance.js - Accent color, text size, "show original" setting (saved on the device). */

const PR=(()=>{try{return JSON.parse(localStorage.lingo||"{}")}catch{return{}}})();

const applyPR=()=>{const r=document.documentElement.style,c=PR.ac;
 if(c){r.setProperty("--ac",c);r.setProperty("--me",c);r.setProperty("--ac2","color-mix(in srgb,"+c+" 14%,var(--sf))")}else["--ac","--me","--ac2"].forEach(k=>r.removeProperty(k));
 document.body.style.fontSize=(PR.ts||16)+"px"};

const savePR=()=>{try{localStorage.lingo=JSON.stringify(PR)}catch{}applyPR()};

applyPR();

$("#ts").value=PR.ts||16;

$("#both").checked=!!PR.both;

["","#7c3aed","#db2777","#e11d48","#ea580c","#059669","#0891b2"].forEach(c=>{const b=h("button");b.style.cssText="width:32px;height:32px;border-radius:50%;background:"+(c||"#2F78DB");b.title=c||"Default";b.onclick=()=>{PR.ac=c;savePR()};$("#sw").append(b)});

$("#ts").onchange=()=>{PR.ts=+$("#ts").value;savePR()};

$("#both").onchange=()=>{PR.both=$("#both").checked;savePR()};
