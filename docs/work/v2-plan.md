# v2: multi-technique, designed for an older user

Working file for the v2 effort. Any session can resume from here: find the first unchecked
task, read its notes, check `git log` on `feature/multi-technique`, and continue.
Each task ends with a commit whose message starts with `v2(Tn):`.

## Goal (agreed with the owner, 2026-09-24)

The app is a gift for an older person with little tech experience; the technique is unknown.
Support the most common counting crafts in one simple app. Large text, large targets, one main
action per screen, forgiving (undo, confirmations). The agent is the designer and decides
autonomously; every decision is logged below for the owner to review afterwards.
Out of scope: backup (next recommended feature).

## Model

- Project has a `technique`: `embroidery` | `crochet` | `knitting` | `other`.
- Project has `parts` (replaces `threads`). Wording and counting depend on the technique:
  - embroidery: parts are colors (palette + DMC code), mode `stitches`.
  - crochet: parts are pieces, mode `rows` ("vuelta").
  - knitting: parts are pieces, mode `rows` ("fila").
  - other: parts are counters, mode `stitches`, first part created automatically.
- Mode `stitches`: `count` is the total stitches, optional `target`.
- Mode `rows`: `row` is the current row (1-based), `count` is the stitches in the current row,
  `rowHistory` holds the stitches of completed rows, optional `rowTarget`, `done` when the
  last row is finished. "Quitar uno" at 0 stitches steps back to the previous row.

## Tasks

- [x] T1 Branch, this plan, memory pointer
- [x] T2 Domain: techniques config, part types, row logic, progress + unit tests
- [x] T3 Data: Dexie v2 migration (threads → parts, technique, new preferences), repository + tests
- [x] T4 Rename UI threads → parts (routes, features, copy), embroidery behaves as before
- [x] T5 New project flow: technique picker, then add the first part (other: auto-created)
- [x] T6 Add/edit part per technique (palette for embroidery; name presets, "¿Cuántas iguales?",
      row target for pieces)
- [x] T7 Counter rows mode: row display, "Terminé la vuelta", undo across rows, finished piece
- [x] T8 Parts list and project cards per technique; dynamic tab label
- [x] T9 Text size setting (rem), settings screen, first-run welcome
- [ ] T10 Name, icon, manifest, copy review
- [ ] T11 Visual verification (phone, tablet, desktop, landscape), screenshots to docs/design/v2,
      update README and ARCHITECTURE
- [ ] T12 Reviews in parallel: task review (unbiased), code quality review, UX review for the
      target audience; apply fixes
- [ ] T13 Final report: decisions list, how to test

Notes: T3–T8 landed together in one commit (`v2(T3-T8)`) because the data switch breaks the
old UI; the Settings link on Proyectos points to `/settings`, which T9 creates.

## Decisions log

| #   | Decision                                    | Options considered                                          | Chosen                                                                                                                             | Why                                                                                                                    |
| --- | ------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | Techniques offered                          | Many (macramé, telar, bolillos, punch…) · 4 common ones     | Embroidery/cross-stitch, crochet (incl. amigurumi), knitting, "Otra cosa"                                                          | Covers the crafts where counting matters; more choices would confuse                                                   |
| 2   | One model for all                           | Separate apps/modes · parts with per-technique wording      | Parts with per-technique wording and counting mode                                                                                 | One UI to learn; embroidery keeps working as today                                                                     |
| 3   | Rows counting                               | Tap counts rows · tap counts stitches + "Terminé la vuelta" | Tap counts stitches; a separate large button finishes the row                                                                      | Keeps the same big button everywhere; rows are the main progress unit                                                  |
| 4   | Undo                                        | Separate "Deshacer" · "Quitar uno" steps back across rows   | "Quitar uno" also steps back to the previous row at 0                                                                              | One familiar button, nothing to lose                                                                                   |
| 5   | Per-row stitch targets                      | Enter targets per row · none                                | None (only optional total rows per piece)                                                                                          | Entering a pattern row by row is too complex for the audience                                                          |
| 6   | First part after creating a project         | Empty state · go straight to "add first part"               | Straight to "add first part"; "Otra cosa" auto-creates a counter                                                                   | Fewer taps, no dead end                                                                                                |
| 7   | Repeated pieces                             | Copies counter inside a piece · separate pieces             | "¿Cuántas iguales?" creates "Brazo 1", "Brazo 2"                                                                                   | Each piece is counted on its own, nothing new to understand                                                            |
| 8   | Technique of an existing project            | Editable · fixed at creation                                | Fixed at creation                                                                                                                  | Changing it would change what parts mean; delete and recreate instead                                                  |
| 9   | Stitch target for crochet/knitting projects | Ask · don't ask                                             | Don't ask (only rows per piece)                                                                                                    | Patterns give rows, not total stitches                                                                                 |
| 10  | "Todo es una pieza" preset                  | Force naming pieces · one-tap single piece                  | Preset named after the project                                                                                                     | Scarves and blankets are a single piece                                                                                |
| 11  | Finished piece                              | Keep counting · celebration panel                           | Panel with "Seguir con …" and "Me falta otra vuelta"                                                                               | Clear moment of success; mistakes in the target are one tap away                                                       |
| 12  | Existing data                               | Reset · migrate                                             | Migrated as embroidery projects (Dexie v2/v3)                                                                                      | No data loss for current installs                                                                                      |
| 13  | Welcome                                     | Separate onboarding · welcome in the empty projects screen  | Welcome card when there are no projects                                                                                            | Zero extra steps; disappears on its own                                                                                |
| 14  | App name                                    | Mi Bastidor · Mis Labores · Cuentapuntos · Punto a Punto    | Mis Labores                                                                                                                        | "Labores" is the everyday Spanish word for needlework of any kind, warm and familiar for an older person               |
| 15  | Parts tab label                             | Fixed "Partes" · per technique                              | Per technique: Colores / Piezas / Contadores                                                                                       | Uses the word the person already thinks in                                                                             |
| 16  | Creation history                            | Keep picker in history · replace                            | Picker, form and first-part screens replace each other                                                                             | Back from Contar returns to Proyectos, not to a finished form                                                          |
| 17  | Bigger text                                 | Follow the phone setting only · in-app setting              | In-app "Tamaño de la letra" (Normal 100%, Grande 115%, Muy grande 130%) plus rem units so the browser's own text size also applies | The phone setting does not reach web apps reliably (iOS ignores it); a visible setting can be changed by a helper once |
| 18  | Where settings live                         | Extra tab · link on Proyectos                               | "Ajustes" link in the Proyectos header                                                                                             | Keeps three tabs; settings are rarely needed                                                                           |
