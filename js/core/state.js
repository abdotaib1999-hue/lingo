"use strict";
/* js/core/state.js - Shared app state (signed-in user, open chat, caches). */

let uid,me,editing=false,cur=null,unC,unM,photoData="";

const U={},P={},busy=new Set();

let unT,replyTo=null,paused=false,lastT=0;

let FR=[],unI;

let FC={},FLT="all";

let unP,editRef=null;
