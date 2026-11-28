"use strict";
/* js/features/auth.js - Google sign-in, friendly sign-in errors, password reset, sign-out. */

const gp=new GoogleAuthProvider(),aerr=e=>{$("#ae").style.color="";$("#ae").textContent=authMsg(e)};

const authMsg=e=>{const c=(e&&e.code)||"";
 if(["auth/invalid-credential","auth/invalid-login-credentials","auth/wrong-password","auth/user-not-found","auth/invalid-email","auth/missing-password","auth/missing-email"].includes(c))return _("Email or password wrong.");
 if(c==="auth/too-many-requests")return _("Too many attempts. Try again later.");
 if(c==="auth/network-request-failed")return _("No connection. Check your internet.");
 if(c==="auth/weak-password")return _("Password must be at least 6 characters.");
 if(c==="auth/email-already-in-use")return _("Could not create the account. Check your details and try again.");
 if(c==="auth/popup-closed-by-user"||c==="auth/cancelled-popup-request")return "";
 return _("Something went wrong. Try again.")};

$("#g").onclick=()=>signInWithPopup(auth,gp).catch(aerr);

$("#si").onclick=()=>submitAuth();

$("#su").onclick=()=>setAuthMode(amode==="login"?"signup":"login");

$("#fp").onclick=()=>{const e=$("#em").value.trim(),m=$("#ae");m.style.color="";if(!e)return m.textContent="Type your email above first.";
 sendPasswordResetEmail(auth,e).then(()=>{m.style.color="var(--mu)";m.textContent="If an account exists for that email, a reset link is on its way. Check spam too."}).catch(er=>{$("#ae").style.color="";$("#ae").textContent=er.code==="auth/invalid-email"?_("Enter a valid email address."):authMsg(er)})};

$("#so").onclick=()=>signOut(auth);
