# Architecture — Mis Labores

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
  (`createProject`, `countStitch`, `completeRow`, …) to write and hooks (`useWorkspace`, `useProjectSummaries`, …)
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

## Audience

The app is for an older person with little experience with technology. Every screen follows:

- Text never below 16px at the default size; primary text 18–20px; buttons at least 60px tall.
- One main action per screen, plain words, no gestures (no swipe, no long press).
- Everything can be undone ("Quitar uno" also reopens the previous row) and deletions ask first.
- A "Tamaño de la letra" setting (100%, 115%, 130%) scales every font size, since all font sizes
  are in `rem`. Layout sizes stay in `px` and grow with `min-height`.

## Techniques

`src/domain/techniques.ts` holds one entry per technique: its wording (what a part is called, the
verb, the row word), whether it uses the color palette, the name presets for pieces, and its
counting mode. Screens read labels from there instead of hard-coding them.

| Technique  | Parts are | Mode       | Notes                                                         |
| ---------- | --------- | ---------- | ------------------------------------------------------------- |
| embroidery | colors    | `stitches` | Palette + DMC code, optional stitches per color and project.  |
| crochet    | pieces    | `rows`     | "Vuelta"; presets such as Cabeza, Brazo; "¿Cuántas iguales?". |
| knitting   | pieces    | `rows`     | "Fila"; presets such as Delantero, Manga.                     |
| other      | counters  | `stitches` | A "Contador" is created with the project.                     |

To add a technique: add it to the `Technique` union in `src/domain/part.ts`, add its entry in
`TECHNIQUES` and `TECHNIQUE_ORDER`, give it an icon in `src/ui/TechniqueIcon.tsx`, and a name
example in `ProjectForm`. TypeScript points at anything else that needs a case.

## Data model

- `projects`: `id`, `name`, `technique` (fixed at creation), `target` (stitches, only for
  stitch-mode techniques), `activePartId`, timestamps.
- `parts`: a color, piece or counter — `name`, `hex` (colors only), `code` (DMC, colors only),
  `target` (stitches), `count`, `rowTarget` and `rowHistory` (rows mode).
- `preferences`: a single `app` row with `currentProjectId`, `paused` and `textScale`.

In rows mode, `count` is the stitches of the current row and `rowHistory` stores the stitches
of each finished row, so the current row number is `rowHistory.length + 1` and "Quitar uno" at
zero stitches can reopen the previous row exactly as it was. A piece is finished when
`rowHistory.length >= rowTarget`. The pure rules live in `src/domain/part.ts`.

IDs are UUIDs so a future backup/import or sync can merge data without collisions.

### Migrations

- v1: `projects`, `threads` (colors), `preferences`.
- v2: adds `parts` and copies every thread into it; projects become `embroidery`.
- v3: drops `threads`.

The IndexedDB database keeps its original name (`mi-bastidor`) so installs made before the
rename keep their data. `src/data/repository.test.ts` covers the v1 → v3 upgrade.

### Progress rules

- Stitch mode: a project's target is its own `target` if set, otherwise the sum of its parts'
  targets. The counter shows the part's own target when it has one, otherwise the project's.
- Rows mode: a project's percent counts finished rows against the sum of every piece's
  `rowTarget`; it is only shown when every piece has one. Cards show "N de M piezas terminadas".

### Current project and part

The "Contar" and third tabs work on the _current project_ (`preferences.currentProjectId`,
falling back to the most recently updated project). Each project remembers its active part.
The third tab's label follows the technique: Colores, Piezas or Contadores.

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

## Screen sizes

The design is for phones; larger screens reuse it instead of stretching or boxing it.
"Wide" means `(min-width: 768px), (orientation: landscape) and (min-width: 600px)`, so phones in
landscape get the wide layout too.

| Condition                      | Layout                                                                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Not wide                       | The design as-is: one column, bottom tab bar.                                                                                                                                                     |
| Wide                           | Side navigation rail; content centered in a readable column (`--content-narrow` for forms, `--content-wide` for grids); cards in grids; sheets become centered dialogs; form actions align right. |
| ≥ 1024px, or landscape ≥ 600px | Counter in two columns: project, part and count on the left; the tap area and controls on the right.                                                                                              |
| Short screens (≤ 740px tall)   | Compact counter so the controls stay visible; landscape ≤ 600px tall compacts the rail and headers further.                                                                                       |

- CSS media queries repeat these conditions; `WIDE_SCREEN` in `src/ui/useMediaQuery.ts` is the copy
  JavaScript uses and must match.
- The tab content sits in `<main>` before the navigation in the DOM, so keyboard and screen-reader
  order is content first; CSS moves the rail to the left on wide screens.
- Left and right safe-area insets are applied (rail and shell) for landscape phones with a notch.
- The manifest does not lock the orientation.

## Design fidelity

The source design is in `docs/design/`. `Mi Bastidor.html` is the original bundle; `screens/`
has each screen as readable HTML. Colors, radii and fonts from the design are in
`src/styles/tokens.css` — use tokens, not literal colors, in new CSS.

v1 followed that design. v2 (multi-technique) was designed in-house following the same visual
language; the reference screenshots are in `docs/design/v2/`, and each decision is logged in
`docs/work/v2-plan.md`.

## Extending

- **New screen:** add a folder or file under `features/`, register it in `src/app/routes.tsx`
  and add its path to `src/app/paths.ts`.
- **New stored field or table:** add a new `this.version(n + 1).stores(...)` in `data/db.ts`
  with an `.upgrade()` if existing rows need a default. Never edit a released version.
- **New write:** add a repository function in `data/`, wrap multi-table writes in
  `db.transaction`, and cover it in `data/repository.test.ts`.
- **Tests:** UI flows live in `src/app/flows.test.tsx` and render the real route table on a
  memory router against fake IndexedDB.
