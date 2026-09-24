# Mi Bastidor

Offline-first PWA (React + TypeScript + Vite + Dexie). Read `docs/ARCHITECTURE.md` before
changing structure or data.

- UI copy is Spanish (Spain: `es-ES`). Code, commits and docs are English.
- No code comments by default; if unavoidable, one line explaining a constraint.
- Screens never use Dexie directly: reads go through `src/data/queries.ts` hooks, writes through
  repository functions in `src/data/`.
- Schema changes add a new Dexie version; released versions are never edited.
- CSS uses tokens from `src/styles/tokens.css`; match the design in `docs/design/`.
- `npm run check` must pass before committing.
