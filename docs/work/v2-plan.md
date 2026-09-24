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
- [ ] T3 Data: Dexie v2 migration (threads → parts, technique, new preferences), repository + tests
- [ ] T4 Rename UI threads → parts (routes, features, copy), embroidery behaves as before
- [ ] T5 New project flow: technique picker, then add the first part (other: auto-created)
- [ ] T6 Add/edit part per technique (palette for embroidery; name presets, "¿Cuántas iguales?",
      row target for pieces)
- [ ] T7 Counter rows mode: row display, "Terminé la vuelta", undo across rows, finished piece
- [ ] T8 Parts list and project cards per technique; dynamic tab label
- [ ] T9 Text size setting (rem), settings screen, first-run welcome
- [ ] T10 Name, icon, manifest, copy review
- [ ] T11 Visual verification (phone, tablet, desktop, landscape), screenshots to docs/design/v2
- [ ] T12 Reviews in parallel: task review (unbiased), code quality review, UX review for the
      target audience; apply fixes
- [ ] T13 Final report: decisions list, how to test

## Decisions log

| #   | Decision                            | Options considered                                          | Chosen                                                                    | Why                                                                   |
| --- | ----------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Techniques offered                  | Many (macramé, telar, bolillos, punch…) · 4 common ones     | Embroidery/cross-stitch, crochet (incl. amigurumi), knitting, "Otra cosa" | Covers the crafts where counting matters; more choices would confuse  |
| 2   | One model for all                   | Separate apps/modes · parts with per-technique wording      | Parts with per-technique wording and counting mode                        | One UI to learn; embroidery keeps working as today                    |
| 3   | Rows counting                       | Tap counts rows · tap counts stitches + "Terminé la vuelta" | Tap counts stitches; a separate large button finishes the row             | Keeps the same big button everywhere; rows are the main progress unit |
| 4   | Undo                                | Separate "Deshacer" · "Quitar uno" steps back across rows   | "Quitar uno" also steps back to the previous row at 0                     | One familiar button, nothing to lose                                  |
| 5   | Per-row stitch targets              | Enter targets per row · none                                | None (only optional total rows per piece)                                 | Entering a pattern row by row is too complex for the audience         |
| 6   | First part after creating a project | Empty state · go straight to "add first part"               | Straight to "add first part"; "Otra cosa" auto-creates a counter          | Fewer taps, no dead end                                               |
| 7   | Repeated pieces                     | Copies counter inside a piece · separate pieces             | "¿Cuántas iguales?" creates "Brazo 1", "Brazo 2"                          | Each piece is counted on its own, nothing new to understand           |
