# CSS Feud

A live, multi-device employee game show — Family Feud reimagined for an internal
competition. Two teams of five answer questions that the whole room fills in via
a live QR survey; the most popular answers become a hidden board, and teams race
the buzzer to clear it.

This is a **React + Vite** rebuild of the original single-file design prototype
(preserved in [`project/`](project/), with the design conversation in
[`chats/`](chats/)). The visual design follows the **UAE Government Design System
(AEGov DLS)** tokens, carried over verbatim from the prototype.

## Quick start

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
```

Open the root URL to get the **launcher**, which links to every screen. Out of
the box the app runs in **local demo mode**: the admin, game screen, survey and
buzzers all sync across tabs of the same browser through `localStorage` +
`BroadcastChannel` — perfect for rehearsal. Add Firebase (below) for real
multi-device play.

## Screens (URL modes)

All five screens are the same app, selected by the `mode` query string:

| URL | Screen |
| --- | --- |
| `/?mode=admin` | Admin / host / judge portal (password below) |
| `/?mode=game` | Main screen for the big display |
| `/?mode=survey` | Employee survey page (what the QR code opens) |
| `/?mode=buzzer&team=1` | Team 1 buzzer |
| `/?mode=buzzer&team=2` | Team 2 buzzer |
| `/?mode=guide` | How-to-play guide |

Keyboard shortcuts on the game/admin screens: **1** = Team 1 buzz, **2** = Team 2
buzz, **B** = reset buzzers.

## Configuration

All host-editable settings live in [`src/config.js`](src/config.js):

- **`ADMIN_PASSWORD`** — admin portal password (default `1234`). Change it before
  a live event; it is never shown on the public screens.
- **`FIREBASE_CONFIG`** — paste your Firebase web-app config here to switch from
  demo mode to live multi-device sync. Leave `apiKey` empty for demo mode.

### Firebase (real multi-device play)

1. [console.firebase.google.com](https://console.firebase.google.com) → add a project.
2. Build → **Realtime Database** → create database (test mode is fine for an internal event).
3. Build → **Authentication** → sign-in method → enable **Anonymous**.
4. Project settings → your apps → add a **web app** → copy the config object.
5. Paste the values into `FIREBASE_CONFIG` in `src/config.js`, then rebuild.

Phones must reach the same public URL the QR codes encode — deploy to a public
host, not localhost.

## Build & deploy

```bash
npm run build      # outputs static files to dist/
npm run preview    # preview the production build locally
```

`dist/` is a plain static bundle — deploy it anywhere:

- **Netlify:** drag the `dist` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages / Firebase Hosting:** publish the contents of `dist`.

The Vite `base` is relative (`./`), so the build works from any sub-path.

## How a round works

1. The host starts a question — the big screen shows it with a QR code.
2. Everyone scans and submits one anonymous answer. Only a live counter is shown.
3. The host closes the survey; matching answers are grouped and counted
   (normalisation + fuzzy match), and the host reviews/merges/edits before
   approving the board. Points default to the number of colleagues who gave each answer.
4. Buzzers open — first press wins the turn and locks both buzzers.
5. The team guesses board answers; correct keeps the turn, wrong switches teams.
   The judge can accept semantic matches and award bonus points.
6. The round ends when the board is cleared or the host ends it. After the last
   question, an animated final leaderboard with confetti.

## Architecture

The game engine is framework-agnostic; React is a thin view over it.

```
src/
  config.js              admin password + Firebase config
  main.jsx               React entry + engine boot
  App.jsx                mode router + global key/timer effects
  styles.css             AEGov DLS design tokens + all component CSS (from the prototype)
  lib/
    engine.js            shared game state, all host/judge actions, snapshot store
    backend.js           local (localStorage/BroadcastChannel) + Firebase backends
    state.js             default/demo state, answer-grouping logic
    sound.js             Web Audio game-show sounds
    confetti.js          canvas confetti
    utils.js             helpers (esc, levenshtein/fuzzy match, toast, download…)
    useStore.js          useSyncExternalStore hook over the engine snapshot
  components/
    common.jsx           Logo, QR (via `qrcode`), BackButton
    fields.jsx           controlled form inputs bound to engine state paths
  modes/
    Launcher, Login, Game, Survey, Buzzer, Guide
    admin/               Live, Teams, Questions, Setup, Log, Help tabs
```

The engine holds the single source of truth (`S`) and republishes an immutable
snapshot on every mutation via `emit()`; components subscribe with
`useSyncExternalStore`. Both sync backends implement the same interface, so the
UI is identical in demo and Firebase modes. All persistence is automatic —
screens survive refresh.

## Original design bundle

- [`project/`](project/) — the original single-file `index.html` prototype and assets.
- [`chats/`](chats/) — the design conversation that produced it.
