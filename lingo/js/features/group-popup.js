"use strict";
/* js/features/group-popup.js - Popup layer for Create New Group. */

let PM;

function openPop(){const lay=$("#pmpop"),inn=$("#pmin");inn.replaceChildren();lay.hidden=false;PM=PinAdd(inn,createGroup,{autoOpen:true,onClose:closePop});POP=PM};

function closePop(){PM=null;POP=null;$("#pmpop").hidden=true;$("#pmin").replaceChildren()};

$("#pmopen").onclick=openPop;

$("#pmpop").onclick=e=>{if(e.target.id==="pmpop"||e.target.id==="pmin")POP?.close()};

document.addEventListener("keydown",e=>{if(e.key==="Escape"&&POP)POP.close()});
