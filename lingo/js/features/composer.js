"use strict";
/* js/features/composer.js - Message bar: emoji panel, + attachment menu, mic/send button. */

const EMO="😀 😂 🤣 😊 😍 🥰 😎 🤔 😢 😭 😡 😮 😴 🥳 🤗 😉 👍 👎 🙏 👏 🙌 💪 👋 🤝 ❤️ 💙 🔥 ✨ 🎉 🎶 ☕ 🍕 ⚽ 🌍 🏠 🚀".split(" ");

EMO.forEach(e=>{const b=h("button","",e);b.onclick=()=>{$("#tx").value+=e;$("#tx").focus();setSd()};$("#emo").append(b)});

const setSd=()=>{const w=$("#tx").value.trim()||!SR?"send":"mic";if($("#sd").dataset.k!==w){$("#sd").dataset.k=w;$("#sd").innerHTML=svgi(w)}};

$("#tx").addEventListener("input",setSd);

setSd();

$("#pl").onclick=()=>$("#att").hidden=false;

$("#att").onclick=e=>{if(e.target.id==="att")$("#att").hidden=true};

$("#a1").onclick=()=>{$("#att").hidden=true;$("#cam").click()};

$("#a2").onclick=()=>{$("#att").hidden=true;$("#ph").click()};

$("#cam").onchange=async e=>{const f=e.target.files[0];e.target.value="";if(f)send(await shrink(f,1000,.7))};

$("#a3").onclick=()=>{$("#att").hidden=true;if(!navigator.geolocation||!confirm(_("Share your current location with this chat?")))return;
 navigator.geolocation.getCurrentPosition(p=>send(null,{loc:[+p.coords.latitude.toFixed(5),+p.coords.longitude.toFixed(5)]}),()=>{},{enableHighAccuracy:true,timeout:15000})};
