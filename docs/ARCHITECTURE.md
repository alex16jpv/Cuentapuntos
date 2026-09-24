# Architecture

## Stack

| Concern         | Choice                                   | Why                                                                 |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| UI              | React 19 + TypeScript (strict)           | The design was authored as React components.                        |
| Build           | Vite                                     | Fast dev loop, first-class PWA plugin.                              |
| Routing         | React Router (data router)               | Real URLs, so every screen can be deep-linked and restored offline. |
| Storage         | IndexedDB through Dexie                  | Transactions, indexes, versioned schema migrations, live queries.   |
| Reactivity      | `dexie-react-hooks` `useLiveQuery`       | The database is the single source of truth; no duplicated state.    |
| Offline/install | `vite-plugin-pwa` (Workbox `generateSW`) | Precaches the whole app; generates manifest icons from one SVG.     |
| Styling         | CSS Modules + CSS custom properties      | Scoped styles, zero runtime, tokens mirror the design.              |
| Fonts           | Fontsource variable Figtree and Fraunces | Self-hosted so they work offline; same files the design uses.       |
| Tests           | Vitest, Testing Library, fake-indexeddb  | Real repository code runs against an in-memory IndexedDB.           |

## Layers

```
features/*  →  data/*  →  domain/*
     ↘ ui/*       ↘ db.ts (Dexie)
```

- `domain/` is pure and framework-free. Progress rules, number formatting and the palette live
  here and are unit-tested directly.
- `data/` owns IndexedDB. Screens never touch Dexie tables; they call repository functions
  (`createProject`, `bumpThread`, …) to write and hooks (`useWorkspace`, `useProjectSummaries`, …)
  to read. Writes that touch several tables run in one transaction.
- `features/` holds screens. Shared visual pieces go to `ui/`.
- `app/paths.ts` is the only place that spells out URLs. Links that open a form pass
  `state.from`, so finishing the form returns with `navigate(-1)` instead of stacking duplicate
  history entries (Android's back button would otherwise seem to do nothing).

## Errors

- Fire-and-forget writes go through `runWrite()`, and form submissions catch errors with
  `reportWriteError()`. Both show a Spanish toast ("No se pudo guardar el cambio").
- The root route has a Spanish `errorElement` for failures during render, such as a live query
  throwing because IndexedDB is unavailable.

## Data model

- `projects`: `id`, `name`, `target` (optional total stitches), `activeThreadId`, timestamps.
- `threads`: a color used in a project — `name`, `hex`, `code` (DMC, optional), `target`
  (optional stitches for that color), `count`.
- `preferences`: a single `app` row with `currentProjectId` and `paused`.

IDs are UUIDs so a future backup/import or sync can merge data without collisions.

### Progress rules

- A project's target is its own `target` if set, otherwise the sum of its threads' targets.
- The counter shows the color's own target when it has one; otherwise it shows the project's
  progress, or no bar at all if nothing has a target.

### Current project and color

The "Contar" and "Hilos" tabs work on the _current project_ (`preferences.currentProjectId`,
falling back to the most recently updated project). Each project remembers its active color.
Opening a project or picking a color only changes these pointers.

## Offline and updates

- Every build asset (JS, CSS, fonts, icons, `index.html`) is precached; navigations fall back
  to the cached `index.html`, so deep links work offline.
- `registerType: 'prompt'`: when a new version is deployed, a banner offers "Actualizar" (or
  "Más tarde") instead of reloading under the user mid-count. An installed app can stay in
  memory for days, so it checks for a new version every hour and whenever it comes back to the
  foreground.
- After the first project is created, the app asks for persistent storage
  (`navigator.storage.persist()`) so the browser does not evict the database. It waits until then
  so it does not show a permission prompt out of context on the first visit. Installing the app is
  still the most reliable protection, especially on Safari.
- While counting, the screen wake lock keeps the display on (where supported).

## Design fidelity

The source design is in `docs/design/`. `Mi Bastidor.html` is the original bundle; `screens/`
has each screen as readable HTML. Colors, radii and fonts from the design are in
`src/styles/tokens.css` — use tokens, not literal colors, in new CSS.

Additions not in the design, agreed with the product owner:

- Optional per-color target in "Añadir un color".
- "Editar proyecto" (from the "Editar" link in Hilos) and "Editar color" (pencil in each color
  card), both with delete behind a confirmation sheet.
- Empty states for no projects and for a project without colors.
- A compact counter layout for short screens (≤ 740px tall).
- The thread-code field uses a full keyboard (the design had a number pad), because DMC codes
  include letters, such as `B5200` or `ECRU`.

## Extending

- **New screen:** add a folder or file under `features/`, register it in `src/app/routes.tsx`
  and add its path to `src/app/paths.ts`.
- **New stored field or table:** add a new `this.version(n + 1).stores(...)` in `data/db.ts`
  with an `.upgrade()` if existing rows need a default. Never edit a released version.
- **New write:** add a repository function in `data/`, wrap multi-table writes in
  `db.transaction`, and cover it in `data/repository.test.ts`.
- **Tests:** UI flows live in `src/app/flows.test.tsx` and render the real route table on a
  memory router against fake IndexedDB.
