"use strict";
/* js/features/pin-ui.js - Pin UI "Add Member" card ported to plain JS (Create New Group). */

const PinAdd=(()=>{
const mo=window.Motion||{},animate=mo.animate||(()=>({then:r=>{setTimeout(r,0)}})),stagger=mo.stagger||(()=>0);
const EASE=[.22,1,.36,1],OUT={duration:.42,ease:EASE},QUICK={duration:.22,ease:EASE},SPRING={type:"spring",stiffness:320,damping:30,mass:.9},SNAP={type:"spring",stiffness:650,damping:24,mass:.6};
const settle=(a,ms)=>Promise.race([new Promise(r=>a.then(r)),new Promise(r=>setTimeout(r,ms))]);
const commit=(el,st)=>{if(el)Object.assign(el.style,st)};
const press=(el,down,up={scale:1})=>{el.addEventListener("pointerdown",e=>{if(e.button===0)animate(el,down,SNAP)});["pointerup","pointerleave","pointercancel"].forEach(t=>el.addEventListener(t,()=>animate(el,up,SNAP)))};
const SV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
return function PinAdd(host,onCreate,opts={}){
 const PER=window.innerHeight<720?3:4,gid="pmem-goo-"+Math.random().toString(36).slice(2,8);
 let query="",page=0,picked=[],isOpen=false,confirming=false,busy=false,barShown=false,paint=0;
 const mem=()=>FR.map(f=>{const u=U[f.id]||f;return{id:f.id,u,name:u.name||"?",role:L.find(l=>l[0]===u.lang)?.[1]||"",status:isOn(u)?"online":"offline"}});
 const hit=()=>{const n=query.trim().toLowerCase();return mem().filter(m=>!n||m.name.toLowerCase().includes(n)||m.role.toLowerCase().includes(n))};
 const pageCount=()=>Math.max(1,Math.ceil(hit().length/PER));
 const root=h("div","pmem");
 root.innerHTML=`<svg class="pmem__defs" aria-hidden="true" focusable="false"><defs><filter id="${gid}"><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11" result="goo"/><feBlend in="SourceGraphic" in2="goo"/></filter></defs></svg>
<div class="pmem__shell"><div class="pmem__card"><button class="pmem__head" type="button" aria-expanded="false"><span class="pmem__title"></span><span class="pmem__chevron">${SV}<path d="m18 15-6-6-6 6"/></svg></span></button>
<div class="pmem__body"><div class="pmem__search"><input class="pmem__searchInput pmem__nameIn" maxlength="40" autocomplete="off"></div>
<div class="pmem__search"><svg class="pmem__searchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input class="pmem__searchInput pmem__qIn" type="search" autocomplete="off" spellcheck="false"><button class="pmem__searchClear" type="button" hidden aria-label="Clear search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg></button></div>
<p class="pmem__msg"></p><ul class="pmem__list" aria-live="polite"></ul>
<div class="pmem__action"><div class="pmem__actionIn"><div class="pmem__stack"></div><span class="pmem__count"></span><button class="pmem__cta" type="button"><span class="pmem__ctaText"></span><span class="pmem__ctaCheck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span></button></div></div></div></div>
<div class="pmem__foot"><button class="pmem__all" type="button"></button><div class="pmem__nav"><button type="button" data-nav="-1" aria-label="Previous">${SV}<path d="m15 18-6-6 6-6"/></svg></button><button type="button" data-nav="1" aria-label="Next">${SV}<path d="m9 18 6-6-6-6"/></svg></button></div></div><div class="pmem__fly" aria-hidden="true"></div></div>`;
 host.replaceChildren(root);
 const Q=s=>root.querySelector(s),shell=Q(".pmem__shell"),head=Q(".pmem__head"),chev=Q(".pmem__chevron"),body=Q(".pmem__body"),list=Q(".pmem__list"),bar=Q(".pmem__action"),stack=Q(".pmem__stack"),count=Q(".pmem__count"),cta=Q(".pmem__cta"),ctaText=Q(".pmem__ctaText"),check=Q(".pmem__ctaCheck"),fly=Q(".pmem__fly"),nameIn=Q(".pmem__nameIn"),qIn=Q(".pmem__qIn"),clr=Q(".pmem__searchClear"),msg=Q(".pmem__msg"),all=Q(".pmem__all"),prev=Q('[data-nav="-1"]'),next=Q('[data-nav="1"]');
 Q(".pmem__title").textContent=_("Create New Group");nameIn.placeholder=_("Group name");qIn.placeholder=_("Search friends");all.textContent=_("View all friends");ctaText.textContent=_("Create group");
 /* ---- the gooey + / - toggle ---- */
 function setToggle(btn,on,animated=true){
  const fill=btn.querySelector(".pmem__fill"),sign=btn.querySelector(".pmem__sign"),barV=btn.querySelector(".pmem__barV"),ring=btn.querySelector(".pmem__ring"),blobs=btn.querySelectorAll(".pmem__blob");
  if(!fill||!sign||!barV||!ring)return;
  btn.classList.toggle("is-on",on);btn.setAttribute("aria-pressed",String(on));
  const t=animated?OUT:{duration:0};
  animate(fill,{scale:on?1:0,opacity:on?1:0},animated?SPRING:{duration:0});animate(ring,{opacity:on?0:1,scale:on?.82:1},t);animate(barV,{scaleY:on?0:1,opacity:on?0:1},t);animate(sign,{rotate:on?180:0},t);
  const token=String(Number(btn.dataset.pmemToken||0)+1);btn.dataset.pmemToken=token;
  const land=()=>{if(btn.dataset.pmemToken!==token)return;commit(fill,{transform:on?"scale(1)":"scale(0)",opacity:on?"1":"0"});commit(ring,{transform:on?"scale(0.82)":"scale(1)",opacity:on?"0":"1"});commit(barV,{transform:on?"scaleY(0)":"scaleY(1)",opacity:on?"0":"1"});commit(sign,{transform:on?"rotate(180deg)":"rotate(0deg)"});blobs.forEach(b=>commit(b,{opacity:"0"}))};
  if(!animated){land();return}
  setTimeout(land,800);
  if(on)blobs.forEach((b,i)=>{const dir=i===0?-1:1;animate(b,{opacity:[1,1,0],scale:[.2,.6,.1],x:[0,dir*15,0],y:[0,dir*-11,0]},{duration:.56,ease:"easeOut",delay:i*.04})});
 }
 /* ---- the selected bar ---- */
 const barH=()=>{const p=bar.style.height;bar.style.height="auto";const v=bar.scrollHeight;bar.style.height=p;return v};
 async function showBar(){if(barShown)return;barShown=true;const a=animate(bar,{height:[0,barH()],opacity:[0,1]},{...OUT,duration:.34});const done=()=>barShown&&commit(bar,{height:"auto",opacity:"1"});a.then(done);setTimeout(done,900);await settle(a,600)}
 async function hideBar(){if(!barShown)return;barShown=false;const a=animate(bar,{height:[bar.offsetHeight,0],opacity:[1,0]},{...OUT,duration:.3});const done=()=>!barShown&&commit(bar,{height:"0px",opacity:"0"});a.then(done);setTimeout(done,900);await settle(a,600)}
 function renderStack(){stack.replaceChildren();picked.slice(0,4).forEach(id=>{const m=mem().find(x=>x.id===id),c=h("span","pmem__chip");c.dataset.id=id;if(m)c.append(av(m.u));stack.append(c)});if(picked.length>4)stack.append(h("span","pmem__chip pmem__more","+"+(picked.length-4)));count.textContent=picked.length?picked.length+" "+_("selected"):""}
 /* ---- the face flies from its row into the stack ---- */
 function flyToStack(avatar,id){
  const target=stack.querySelector(`.pmem__chip[data-id="${id}"]`)||stack.querySelector(".pmem__more");if(!target)return;
  const base=shell.getBoundingClientRect(),from=avatar.getBoundingClientRect(),to=target.getBoundingClientRect();if(!to.width)return;
  target.style.opacity="0";
  const clone=h("span","pmem__ghost");clone.style.cssText=`left:${from.left-base.left}px;top:${from.top-base.top}px;width:${from.width}px;height:${from.width}px`;
  const face=avatar.querySelector(".av");if(face)clone.append(face.cloneNode(true));fly.append(clone);
  const dx=to.left+to.width/2-(from.left+from.width/2),dy=to.top+to.height/2-(from.top+from.height/2),sc=to.width/from.width;
  let landed=false;
  const land=()=>{if(landed)return;landed=true;clone.remove();target.style.opacity="";animate(target,{scale:[.2,1],opacity:[0,1]},SNAP);setTimeout(()=>commit(target,{transform:"",opacity:""}),700);animate(count,{opacity:[.4,1],y:[4,0]},QUICK)};
  const flight=animate(clone,{x:[0,dx*.55,dx],y:[0,dy*.45-22,dy],scale:[1,.8,sc],opacity:[1,1,.95]},{duration:.52,ease:EASE});
  settle(flight,900).then(land);
 }
 async function addToStack(id,avatar){if(picked.includes(id))return;picked.push(id);renderStack();await showBar();flyToStack(avatar,id)}
 function removeFromStack(id){const chip=stack.querySelector(`.pmem__chip[data-id="${id}"]`);
  const drop=()=>{picked=picked.filter(x=>x!==id);renderStack();if(!picked.length)hideBar();else{const cs=stack.querySelectorAll(".pmem__chip");if(cs.length)animate(cs,{scale:[.88,1],opacity:[.4,1]},QUICK)}};
  if(!chip){drop();return}
  settle(animate(chip,{scale:.2,opacity:0,y:8},QUICK),500).then(drop)}
 function onToggle(id,btn,avatar){if(confirming)return;const on=!picked.includes(id);setToggle(btn,on);if(on)addToStack(id,avatar);else removeFromStack(id)}
 /* ---- create the group ---- */
 const ctaReset=()=>{confirming=false;cta.disabled=false;cta.classList.remove("is-done");ctaText.textContent=_("Create group")};
 async function confirmAdd(){
  if(confirming||!picked.length)return;
  const name=nameIn.value.trim();if(!name){msg.textContent=_("Enter a group name.");nameIn.focus();return}
  msg.textContent="";confirming=true;cta.disabled=true;
  try{await onCreate(name,picked.slice())}catch{msg.textContent=_("Could not create the group.");ctaReset();return}
  cta.classList.add("is-done");ctaText.textContent=_("Group created");
  animate(cta,{scale:[1,.94,1.03,1]},{duration:.5,ease:EASE});animate(check,{scale:[0,1],rotate:[-25,0]},SNAP);
  const cs=stack.querySelectorAll(".pmem__chip");if(cs.length)animate(cs,{y:[0,-6,0]},{duration:.45,ease:EASE,delay:stagger(.05)});
  await new Promise(r=>setTimeout(r,1500));
  list.querySelectorAll(".pmem__toggle.is-on").forEach(b=>setToggle(b,false));await hideBar();picked=[];renderStack();nameIn.value="";ctaReset();opts.onClose?.();
 }
 /* ---- open / collapse ---- */
 const measure=()=>{const p=body.style.height;body.style.height="auto";const v=body.scrollHeight;body.style.height=p;return v};
 function enterRows(dir=1,delay=0){const rs=[...list.querySelectorAll(".pmem__row")];if(!rs.length)return;const tok=++paint;animate(rs,{opacity:[0,1],x:[dir*18,0],y:[12,0]},{...OUT,delay:stagger(.06,{startDelay:delay})});setTimeout(()=>{if(tok!==paint)return;rs.forEach(r=>commit(r,{opacity:"",transform:""}))},1000+delay*1000)}
 async function setOpen(nx){
  if(busy||nx===isOpen)return;isOpen=nx;head.setAttribute("aria-expanded",String(nx));animate(chev,{rotate:nx?0:180},OUT);
  busy=true;const full=measure();
  if(nx){animate(body,{opacity:1},QUICK);enterRows(1,.06);const a=animate(body,{height:[0,full]},SPRING);const done=()=>isOpen&&commit(body,{height:"auto",opacity:"1"});a.then(done);setTimeout(done,1400);await settle(a,800)}
  else{const rs=list.querySelectorAll(".pmem__row");if(rs.length)animate(rs,{opacity:0,y:-8},{duration:.18,ease:EASE});const a=animate(body,{height:[full,0],opacity:[1,0]},{...OUT,duration:.36});const done=()=>!isOpen&&commit(body,{height:"0px",opacity:"0"});a.then(done);setTimeout(done,900);await settle(a,600)}
  busy=false}
 /* ---- the list, search and pages ---- */
 const syncToggles=()=>list.querySelectorAll(".pmem__row").forEach(r=>{const b=r.querySelector(".pmem__toggle");if(b)setToggle(b,picked.includes(r.dataset.id),false)});
 function hl(text){const f=document.createDocumentFragment(),q=query.trim(),at=q?text.toLowerCase().indexOf(q.toLowerCase()):-1;if(at<0){f.append(text);return f}f.append(text.slice(0,at));f.append(Object.assign(h("mark","pmem__mark"),{textContent:text.slice(at,at+q.length)}));f.append(text.slice(at+q.length));return f}
 function renderList(){
  const ms=hit(),pc=pageCount();if(page>=pc)page=0;list.replaceChildren();
  if(!mem().length)list.append(h("li","pmem__empty",_("No friends to add yet.")));
  else if(!ms.length)list.append(h("li","pmem__empty",_("No friends match your search.")));
  ms.slice(page*PER,page*PER+PER).forEach(m=>{
   const li=h("li","pmem__row"),avt=h("span","pmem__avatar"),meta=h("span","pmem__meta"),nm=h("span","pmem__name"),rl=h("span","pmem__role"),btn=h("button","pmem__toggle");
   li.dataset.id=m.id;avt.append(av(m.u),Object.assign(h("span","pmem__dot is-"+m.status),{title:m.status==="online"?_("Online"):""}));
   nm.append(hl(m.name));rl.append(hl(m.role));meta.append(nm,rl);
   btn.type="button";btn.setAttribute("aria-label",m.name);
   btn.innerHTML=`<span class="pmem__goo" style="filter:url(#${gid})"><span class="pmem__fill"></span><span class="pmem__blob"></span><span class="pmem__blob"></span></span><span class="pmem__ring"></span><svg class="pmem__sign" viewBox="0 0 24 24" aria-hidden="true"><rect class="pmem__bar" x="6.5" y="11" width="11" height="2" rx="1"/><rect class="pmem__bar pmem__barV" x="11" y="6.5" width="2" height="11" rx="1"/></svg>`;
   press(btn,{scale:.9});btn.onclick=e=>{e.stopPropagation();onToggle(m.id,btn,avt)};li.onclick=()=>onToggle(m.id,btn,avt);
   li.append(avt,meta,btn);list.append(li)});
  const off=pc<2?"true":"false";prev.setAttribute("aria-disabled",off);next.setAttribute("aria-disabled",off);syncToggles()}
 function onQuery(v){const from=isOpen?body.offsetHeight:null;query=v;page=0;clr.hidden=!v;qIn.value=v;renderList();enterRows(1);if(from===null)return;const to=measure();if(Math.abs(to-from)<1)return;const a=animate(body,{height:[from,to]},SPRING);const done=()=>isOpen&&commit(body,{height:"auto"});a.then(done);setTimeout(done,1000)}
 async function turn(d){
  if(busy||confirming||pageCount()<2)return;if(!isOpen){setOpen(true);return}
  busy=true;const rs=list.querySelectorAll(".pmem__row");
  if(rs.length)await settle(animate(rs,{opacity:0,x:-d*18},{duration:.2,ease:EASE,delay:stagger(.03,{from:d>0?"first":"last"})}),500);
  const pc=pageCount();page=(page+d+pc)%pc;renderList();enterRows(d,0);busy=false}
 /* ---- wiring ---- */
 head.onclick=()=>isOpen?close():setOpen(true);
 head.addEventListener("pointerdown",()=>animate(chev,{scale:.88},SNAP));["pointerup","pointerleave"].forEach(t=>head.addEventListener(t,()=>animate(chev,{scale:1},SNAP)));
 qIn.oninput=()=>onQuery(qIn.value);
 qIn.onkeydown=e=>{if(e.key==="Escape"&&query){e.preventDefault();onQuery("")}if(e.key==="Enter")e.preventDefault()};
 clr.onclick=()=>{onQuery("");qIn.focus()};
 nameIn.oninput=()=>{msg.textContent=""};
 all.onclick=()=>{if(!isOpen)setOpen(true);else if(query)onQuery("");else turn(1)};
 prev.onclick=()=>turn(-1);next.onclick=()=>turn(1);press(prev,{scale:.84,x:-2},{scale:1,x:0});press(next,{scale:.84,x:2},{scale:1,x:0});
 cta.onclick=confirmAdd;press(cta,{scale:.96});
 /* ---- mount ---- */
 commit(bar,{height:"0px",opacity:"0"});commit(body,{height:"0px",opacity:"0"});chev.style.transform="rotate(180deg)";
 animate(shell,{opacity:[0,1],y:[24,0],scale:[.96,1]},{...OUT,duration:.5});setTimeout(()=>commit(shell,{opacity:"1",transform:""}),900);
 renderList();renderStack();if(opts.autoOpen)setTimeout(()=>setOpen(true),160);
 async function close(){if(confirming)return;if(isOpen)await setOpen(false);opts.onClose?.()}
 return{close,open:()=>setOpen(true),refresh(){picked=picked.filter(id=>FR.some(f=>f.id===id));renderStack();if(!picked.length&&barShown)hideBar();renderList()}};
};
})();
