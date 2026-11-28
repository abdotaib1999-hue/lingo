"use strict";
/* js/features/notifications.js - Push notification on/off switch. */

const notifUI=()=>{const on=typeof Notification!=="undefined"&&Notification.permission==="granted"&&!PR.pushOff;$("#nt").textContent=_(on?"Notifications are on.":"Notifications are off on this device.");$("#nsw").checked=on};

async function disablePush(){try{const msg=getMessaging(app),reg=await navigator.serviceWorker.register("firebase-messaging-sw.js"),t=await getToken(msg,{vapidKey:CFG.vapid,serviceWorkerRegistration:reg});
 if(t)await updateDoc(doc(db,"users",uid),{tokens:arrayRemove(t)});await deleteToken(msg)}catch{}PR.pushOff=1;savePR();$("#bell").hidden=false};

$("#nsw").onchange=async()=>{if($("#nsw").checked){$("#bell").click();setTimeout(notifUI,2500)}else{await disablePush();notifUI()}};
