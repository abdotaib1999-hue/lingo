/* js/loader.js - loads the Firebase SDK, then the app files in order (no build step needed). */
const V = "https://www.gstatic.com/firebasejs/10.14.1/";
const SDK = {
  "firebase-app.js": [
    "initializeApp"
  ],
  "firebase-auth.js": [
    "getAuth",
    "onAuthStateChanged",
    "signInWithPopup",
    "GoogleAuthProvider",
    "signInWithEmailAndPassword",
    "createUserWithEmailAndPassword",
    "signOut",
    "sendPasswordResetEmail"
  ],
  "firebase-firestore.js": [
    "getFirestore",
    "doc",
    "getDoc",
    "getDocs",
    "setDoc",
    "updateDoc",
    "addDoc",
    "deleteDoc",
    "collection",
    "query",
    "where",
    "orderBy",
    "limit",
    "onSnapshot",
    "serverTimestamp",
    "arrayUnion",
    "writeBatch",
    "Timestamp",
    "deleteField",
    "increment",
    "arrayRemove"
  ],
  "firebase-messaging.js": [
    "getMessaging",
    "getToken",
    "isSupported",
    "deleteToken"
  ]
};
const FILES = [
  "config.js",
  "core/firebase.js",
  "core/utils.js",
  "core/api.js",
  "core/icons.js",
  "i18n/languages.js",
  "i18n/strings.js",
  "i18n/i18n.js",
  "core/state.js",
  "core/users.js",
  "features/appearance.js",
  "features/auth.js",
  "features/login-card.js",
  "features/profile.js",
  "features/chat-list.js",
  "features/conversation.js",
  "features/composer.js",
  "features/message-sheet.js",
  "features/chat-settings.js",
  "features/intro.js",
  "features/app-lock.js",
  "features/groups.js",
  "features/pin-ui.js",
  "features/group-popup.js",
  "features/add-friend.js",
  "features/presence.js",
  "features/notifications.js",
  "features/emoji.js",
  "main.js"
];
const VER = "1"; // change this number when you update files, so browsers fetch the new versions

try {
  const mods = await Promise.all(Object.keys(SDK).map((f) => import(V + f)));
  Object.keys(SDK).forEach((f, i) => SDK[f].forEach((n) => { window[n] = mods[i][n]; }));
  for (const f of FILES) {
    await new Promise((ok, fail) => {
      const s = document.createElement("script");
      s.src = "js/" + f + "?v=" + VER;
      s.onload = ok;
      s.onerror = () => fail(new Error("Could not load " + f));
      document.body.append(s);
    });
  }
} catch (e) {
  console.error(e);
  const el = document.getElementById("ae");
  if (el) el.textContent = "Could not start the app. Check your internet and refresh.";
}
