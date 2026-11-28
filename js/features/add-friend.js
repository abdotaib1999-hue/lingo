"use strict";
/* js/features/add-friend.js - Add a friend popup. */

let POP=null,SQ="";

function openAdd(){
 const lay=$("#pmpop"),inn=$("#pmin");inn.replaceChildren();lay.hidden=false;
 const root=h("div","pmem");
 root.innerHTML=`<div class="pmem__shell" style="padding-bottom:10px"><div class="pmem__card"><div class="pmem__head"><span class="pmem__title"></span><button class="pmem__x" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg></button></div>
<div class="pmem__search"><svg class="pmem__searchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input class="pmem__searchInput" autocapitalize="none" autocomplete="off" spellcheck="false"></div>
<p class="pmem__msg"></p><div class="pmem__actionIn" style="border-top:0;margin-top:0;padding-top:4px;justify-content:flex-end"><button class="pmem__cta" type="button"></button></div></div></div>`;
 const q=s=>root.querySelector(s),shell=q(".pmem__shell"),inp=q("input"),msg=q(".pmem__msg"),cta=q(".pmem__cta");
 q(".pmem__title").textContent=_("Add a friend");inp.placeholder=_("Add a friend by @username");cta.textContent=_("Send request");
 const close=()=>{lay.hidden=true;inn.replaceChildren();if(POP&&POP.close===close)POP=null};POP={close};
 const go=async()=>{if(cta.disabled)return;const un=inp.value.trim();if(!un){inp.focus();return}
  cta.disabled=true;const ok=await request(un,msg);cta.disabled=false;
  if(ok){cta.classList.add("is-done");cta.disabled=true;cta.textContent=_("Request sent");setTimeout(close,1100)}};
 q(".pmem__x").onclick=close;cta.onclick=go;inp.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();go()}};inp.oninput=()=>{msg.textContent=""};
 inn.append(root);
 const A=window.Motion&&window.Motion.animate;if(A)A(shell,{opacity:[0,1],y:[24,0],scale:[.96,1]},{duration:.5,ease:[.22,1,.36,1]});
 setTimeout(()=>{shell.style.opacity="1";shell.style.transform=""},900);setTimeout(()=>inp.focus(),400)};
