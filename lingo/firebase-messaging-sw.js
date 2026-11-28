// Must sit next to index.html. Use the same Firebase values as in index.html.
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyBsdUVcHyZVkilQjcfFs4j8w5f_NFwRMGA",
  projectId: "lingo-cfe8c",
  messagingSenderId: "973614721002",
  appId: "1:973614721002:web:4b82332c43c4cd18adb493",
});
// Firebase shows the "New message from ..." notification automatically
firebase.messaging();
