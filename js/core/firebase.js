"use strict";
/* js/core/firebase.js - Creates the Firebase app, auth and database objects. */

const app=initializeApp(CFG.firebase),auth=getAuth(app),db=getFirestore(app);
