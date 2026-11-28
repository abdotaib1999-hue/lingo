"use strict";
/* js/core/users.js - User cache, avatar colors and avatar element. */

const user=async id=>U[id]||(U[id]={id,...(await getDoc(doc(db,"users",id))).data()});

const PAL=["#B5446E","#1F7A8C","#5B4FCF","#2F7D5B","#2D608B","#C2410C"];

const av=u=>{if(u.photo){const i=h("img","av");i.src=u.photo;return i}const d=h("div","av",(u.name||"?")[0].toUpperCase());d.style.cssText="background:"+PAL[[...(u.name||"?")].reduce((a,c)=>a+c.charCodeAt(0),0)%PAL.length]+";color:#fff";return d};
