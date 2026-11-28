# Lingo

A free chat web app where friends who speak different languages talk to each other. Every message is translated into the reader's language.

**Stack:** plain HTML, CSS and JavaScript (no build step) on GitHub Pages, Firebase (sign-in and database), a Cloudflare Worker (DeepL translation and push), DeepL API Free.

## Folder map

```
index.html                 Page markup only (screens, sheets, popups)
manifest.webmanifest       Home-screen install info
firebase-messaging-sw.js   Push notifications (must stay at the site root)
.nojekyll                  Tells GitHub Pages to serve files as they are
assets/icons/              App icons
css/                       Styles, loaded in this order (later files override earlier ones)
  base.css                 Tokens, reset, core components
  theme-glass.css          Frosted-glass layer
  theme-chatloop.css       Blue theme: home, chat list, bubbles, tab bar
  features.css             Switches, profile hub, reactions, presence
  pinui.css                Create New Group card and popup
  login.css                Login card and shiny button
js/
  loader.js                Loads Firebase, then every file below in order
  config.js                YOUR SETTINGS (Firebase config, push key, Worker address)
  core/                    firebase, utils, api, icons, state, users
  i18n/                    languages, strings, i18n engine
  features/                one file per feature (auth, chat list, conversation, groups ...)
  main.js                  Starts the app, loaded last
worker/worker.js           Cloudflare Worker (paste into Cloudflare)
firebase/firestore.rules   Database rules (paste into Firebase)
PROJECT_CONTEXT.md         Architecture notes for developers
```

## Set up

1. **Firebase:** create a project (free Spark plan). Turn on Authentication (Google, Email/Password) and Firestore. Paste `firebase/firestore.rules` into Firestore > Rules and publish.
2. **Settings:** put your Firebase web config, web push key and Worker address in `js/config.js`, and the Firebase values in `firebase-messaging-sw.js`.
3. **Cloudflare:** create a Worker, paste `worker/worker.js`, and add the secrets `DEEPL_KEY`, `FIREBASE_API_KEY`, `SERVICE_ACCOUNT`, `SITE_URL`.
4. **GitHub Pages:** upload everything in this folder to a repo and turn on Pages (Deploy from a branch, main, root).
5. In Firebase Authentication > Settings > Authorized domains, add `yourname.github.io`.

## Updating the site

Upload the changed files. When you change CSS or JS, also raise the version number (`VER` in `js/loader.js`, and `?v=` in the `<link>` tags in `index.html`) so phones fetch the new files instead of old cached ones.

## Secrets

Public by design (safe in the repo): the Firebase web config and the web push key.
Never commit: the DeepL key and the Firebase service account `.json`. They live only in Cloudflare secrets. `.gitignore` blocks common secret file names.
