# Lingo - project context

Keep this file current when the architecture changes.

## Architecture decisions

- **No build step.** Static files on GitHub Pages. No npm, no bundler.
- **Classic scripts sharing one global scope.** `js/loader.js` (a module) imports the Firebase SDK and copies the functions it needs onto `window`, then adds each file in its list with a `<script>` tag, one at a time, in order. Top-level `const`/`let`/`function` in one file are visible to the files after it, exactly like the old single file. This is a stepping stone: moving to real ES modules later means adding `import`/`export` per file.
- **Load order matters** only for code that runs at load time (wiring `onclick`s, building DOM). Functions are only called later, so cross-file calls are safe.
- **Add a feature:** create `js/features/name.js`, then add its path to `FILES` in `js/loader.js` (before `main.js`).
- **Config lives in `js/config.js`.** Secrets never go in the repo.

## Load order (js/loader.js)

config, core/firebase, core/utils, core/api, core/icons, i18n/languages, i18n/strings, i18n/i18n, core/state, core/users, then features: appearance, auth, login-card, profile, chat-list, conversation, composer, message-sheet, chat-settings, intro, app-lock, groups, pin-ui, group-popup, add-friend, presence, notifications, emoji, and last main.js (starts the sign-in listener).

## Data model (Firestore)

- `users/{uid}`: name, username, lang, photo (small data URL), tokens (push), lastActive, showOnline
- `usernames/{name}`: { uid } (created once, keeps names unique)
- `chats/{id}`: members, status (pending|active), from, last, lastFrom, updated, seen.{uid}, unread.{uid}, typing.{uid}, muted.{uid}, hidden.{uid}, blocked; groups add group:true, name, admin
  - one-to-one id = the two uids sorted and joined with "_"
  - `messages/{id}`: from, text, lang, t, tr.{LANG}, src, rx.{uid}, re, img, loc, edited
  - `photos/{id}`: from, data (data URL), expireAt (deleted after 15 days)
- `invites/{gid_uid}`: group invitations (gid, gname, from, fromName, to)

Rules: `firebase/firestore.rules`.

## Translation

The reader's own device asks the Worker (`/translate`) to translate a message into the reader's language, then saves the result on the message (`tr.{LANG}`), so each language is translated once. Free limit: 500K characters a month (DeepL API Free).

## Worker (worker/worker.js)

`/translate` (batch, capped at 4000 characters), `/push` (Firebase Cloud Messaging). Every request needs a signed-in Firebase user and the site's origin. Secrets: DEEPL_KEY, FIREBASE_API_KEY, SERVICE_ACCOUNT, SITE_URL.

## Conventions and quirks

- Interface text goes through `_("English text")`; add new strings to `js/i18n/strings.js` (rows with only the English text are translated on demand).
- Element ids are global. Keep them unique (several files look elements up with `$("#id")`).
- `function open()` (open a chat) replaces `window.open`. Do not call `window.open` in this app.
- Free-plan limits: Firestore 50K reads and 20K writes a day, 1 GiB storage. Photos are small data URLs inside Firestore.
- Animations use the Motion library from a CDN (`index.html`); the app works without it, just without animation.
