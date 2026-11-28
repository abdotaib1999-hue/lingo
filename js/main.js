"use strict";
/* js/main.js - Starts the app: listens for sign-in. Loaded last. */

onAuthStateChanged(auth,async u=>{
 if(!u){uid=null;unC?.();unM?.();$("#pw").value="";show("auth");return}
 uid=u.uid;const s=await getDoc(doc(db,"users",uid));
 if(s.exists()){me=s.data();home()}else openSetup(false,{name:u.displayName||""});
});
