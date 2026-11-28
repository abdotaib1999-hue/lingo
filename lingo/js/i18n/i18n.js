"use strict";
/* js/i18n/i18n.js - Interface language engine: _(), setUI(), fetchUI(). */

let UIL="EN";

const _=s=>DICT[UIL]?.[s]||s,EN=new Set(T.map(r=>r[0])),reg=[];

const loc=()=>me?bcp(me.lang):undefined;

const walk=n=>{for(const c of n.childNodes){if(c.nodeType===3){const s=c.nodeValue.trim();if(EN.has(s))reg.push({n:c,s})}
 else if(c.nodeType===1&&!["SCRIPT","STYLE"].includes(c.tagName)){for(const a of["placeholder","title"]){const v=c.getAttribute(a);if(EN.has(v))reg.push({n:c,a,s:v})}walk(c)}}};

const setUI=l=>{UIL=base(l||"en").toUpperCase();document.documentElement.lang=UIL.toLowerCase();document.documentElement.dir=UIL==="AR"?"rtl":"ltr";reg.forEach(r=>{const t=_(r.s);r.a?r.n.setAttribute(r.a,t):r.n.nodeValue=t})};

walk(document.body);

setUI(navigator.language);

let uiTok=0;

async function fetchUI(lang){
 if(!lang||!auth.currentUser)return;const u=base(lang).toUpperCase();if(u==="EN")return;const tok=++uiTok,ck="ui2_"+u;
 const D=DICT[u]||(DICT[u]={});try{Object.assign(D,JSON.parse(localStorage[ck]||"{}"))}catch{}
 const miss=[...EN].filter(k=>!D[k]);
 for(let i=0;i<miss.length;i+=30){const ch=miss.slice(i,i+30);
  try{const r=await fetch(CFG.worker+"/translate",{method:"POST",headers:await hd(),body:JSON.stringify({texts:ch.map(k=>k.trim()),target:lang,source:"EN"})});
   if(!r.ok)break;const j=await r.json();ch.forEach((k,n)=>{if(j.texts[n])D[k]=k.match(/^\s*/)[0]+j.texts[n]+k.match(/\s*$/)[0]})}catch{break}}
 try{localStorage[ck]=JSON.stringify(D)}catch{}
 if(tok===uiTok&&UIL===u)setUI(lang)};
