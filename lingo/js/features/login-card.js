"use strict";
/* js/features/login-card.js - Login / Sign Up card and the shiny button. */

let amode="login";

function setAuthMode(md){amode=md;const lg=md==="login";
 $("#at").textContent=_(lg?"Login to your account":"Create your account");
 $("#ad").textContent=_(lg?"Enter your email below to login to your account":"Enter your details below to get started");
 $("#su").textContent=_(lg?"Sign Up":"Log in");$("#sit").textContent=_(lg?"Login":"Create account");
 $("#g").textContent=_(lg?"Login with Google":"Continue with Google");
 $("#fp").hidden=!lg;$("#phint").hidden=lg;$("#pw").autocomplete=lg?"current-password":"new-password";$("#ae").textContent="";$("#ae").style.color=""};

function submitAuth(){const e=$("#em").value.trim(),p=$("#pw").value;$("#ae").style.color="";
 if(!e||!p){$("#ae").textContent=_("Enter your email and password.");return}
 (amode==="login"?signInWithEmailAndPassword(auth,e,p):createUserWithEmailAndPassword(auth,e,p)).catch(aerr)};

;

[$("#em"),$("#pw")].forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();submitAuth()}}));

function initShiny(btn){const A=window.Motion&&window.Motion.animate;
 if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches){btn.style.animation="none";btn.style.setProperty("--x","200%");return}
 if(!A)return;btn.style.animation="none";btn.style.setProperty("--x","100%");
 A(btn,{"--x":["100%","-100%"]},{duration:3.2,ease:[.4,0,.2,1],repeat:Infinity,repeatDelay:1.2})};

setAuthMode("login");

initShiny($("#si"));
