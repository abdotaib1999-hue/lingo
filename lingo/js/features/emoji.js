"use strict";
/* js/features/emoji.js - Animated emoji (Google Noto) helpers. */

const cpOf=ch=>[...ch].map(c=>c.codePointAt(0).toString(16)).join("_");

function aem(ch,size){const i=h("img","ae");i.alt=ch;i.width=i.height=size;i.src="https://fonts.gstatic.com/s/e/notoemoji/latest/"+cpOf(ch)+"/512.webp";i.onerror=()=>{const s=h("span","",ch);s.style.fontSize=Math.round(size*.8)+"px";i.replaceWith(s)};return i};

const bigEmoji=t=>{t=(t||"").trim();if(!t||!emoOnly(t))return null;const g=(typeof Intl.Segmenter==="function"?[...new Intl.Segmenter().segment(t)].map(x=>x.segment):[...t]).filter(x=>x.trim());return g.length&&g.length<=3?g:null};

function burst(em){const w=h("div","burst");w.append(aem(em,140));document.body.append(w);setTimeout(()=>w.remove(),1000)};
