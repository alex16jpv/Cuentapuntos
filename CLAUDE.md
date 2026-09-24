# Mis Labores

Offline-first PWA (React + TypeScript + Vite + Dexie). Read `docs/ARCHITECTURE.md` before
changing structure or data.

- UI copy is Spanish (Spain: `es-ES`). Code, commits and docs are English.
- No code comments by default; if unavoidable, one line explaining a constraint.
- Screens never use Dexie directly: reads go through `src/data/queries.ts` hooks, writes through
  repository functions in `src/data/`.
- Schema changes add a new Dexie version; released versions are never edited.
- CSS uses tokens from `src/styles/tokens.css`; font sizes in `rem`, match `docs/design/v2/`.
- The audience is an older, non-technical person: large targets, plain words, no gestures.
- Technique-specific wording comes from `src/domain/techniques.ts`, never hard-coded.
- `npm run check` must pass before committing.
