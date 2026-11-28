"use strict";
/* js/features/intro.js - First-run intro slides. */

let si=0;

const slides=()=>[_("Write in your language. Your friend reads it in theirs."),_("Hold a message to reply, react or listen. Swipe right to reply."),_("Install Lingo: on iPhone tap Share, then Add to Home Screen. On Android tap Install.")];

const drawIntro=()=>{const s=slides();$("#it").textContent=s[si];$("#iw").replaceChildren(...s.map((x,i)=>h("span","dotp"+(i===si?" f":""))));$("#in").textContent=_(si<2?"Next":"Done")};

const showIntro=()=>{si=0;drawIntro();$("#intro").hidden=false};

$("#in").onclick=()=>{if(si<2){si++;drawIntro()}else{$("#intro").hidden=true;PR.intro=1;savePR()}};
