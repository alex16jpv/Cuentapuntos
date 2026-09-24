# Mis Labores

Offline-first Progressive Web App to count stitches, rows and colors for embroidery, crochet,
knitting or any other craft. Designed for an older person: large text, large buttons, one main
action per screen.
Everything is stored in the browser (IndexedDB); there is no backend and no account.

## Requirements

- Node.js 24 (see `.nvmrc`) and npm 11

## Scripts

| Command           | What it does                                                               |
| ----------------- | -------------------------------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload (service worker disabled).                      |
| `npm run build`   | Type-checks and builds to `dist/`, including the service worker and icons. |
| `npm run preview` | Serves `dist/` locally — use this to test install and offline.             |
| `npm test`        | Unit and UI tests (Vitest + Testing Library + fake IndexedDB).             |
| `npm run lint`    | ESLint, zero warnings allowed.                                             |
| `npm run format`  | Prettier.                                                                  |
| `npm run check`   | Everything CI should run: types, lint, format, tests, build.               |

## Trying it as an installed app

1. `npm run build && npm run preview`
2. Open the printed URL in Chrome or Edge and use "Install app" from the address bar.
   On a phone, the site must be served over HTTPS (any static host works; see Deploying).
3. To check offline mode: open the app once, stop the preview server, and reload.

## Deploying

`dist/` is a static site. Any static host works (Netlify, Vercel, Cloudflare Pages, GitHub Pages
with a custom domain at the root). The host must serve `index.html` for unknown paths
(SPA fallback) — after the first visit the service worker handles that on its own.
The app assumes it is served from the domain root (`/`).

## Project layout

```
src/
  app/        Shell, bottom navigation and route table
  data/       Dexie database, repository functions and live-query hooks
  domain/     Pure types and logic (progress, formatting, palette) — no React, no IndexedDB
  features/   One folder per area: projects, counter, parts, settings
  pwa/        Service worker update prompt
  styles/     Design tokens and global styles
  ui/         Reusable presentational components
  test/       Test setup and helpers
docs/
  ARCHITECTURE.md   Decisions and how to extend the app
  design/           v1 design file and screens; v2 reference screenshots in design/v2
  work/             Plans and decision logs for larger efforts
```

## Roadmap

- Backup: export and import all data as a file (data only lives in the browser today).
