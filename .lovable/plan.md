# Restore the August 18, 2026 state as the build baseline

Baseline commit inspected: `d4658a9` — "Swapped to Gabriel's Number v2", Aug 18 2026 23:08 UTC
(merge of `7ac7640` + `b79706a`). It is the last commit of Aug 18. Everything after it
(173 commits, `d4658a9..HEAD`) is Aug 19+ work.

## What the August 18 state actually contains

Engine — `src/lib/gabriel.ts`, 1,399 lines:

- `GNumber` 1–9, `G_NUMBERS`, `NUMBERS` (the nine meanings + Tree of Life map).
- `UNIVERSAL_QUESTION` (`u1`) + `UNIVERSAL_FOLLOW_UPS` (`uf-discomfort`, `uf-conversation`,
  `uf-uncertainty`, `uf-decision`, `uf-boredom`, `uf-relief`).
- `CORE_QUESTIONS` `c1`, `c2`, `c3` as top-up closers.
- `DOORWAYS` — **all ten visible, none hidden**, in this order:
  `lost`, `chance`, `spiral`, `drink`, `gamble`, `talk`, `well`, `happened`, `loop`, `surprise`.
- `BRANCH_QUESTIONS` — the full follow-up pool for every doorway.
- `getDoorway`, `AnswerMap`, `buildSequence` (variable-length branching; no
  `prefixPages` / `stage2` / `totalPages` fixed-six-page architecture yet).
- `DeeperProbe` / `DEEPER_PROBES` / `getDeeperProbe` — the Undetermined resolution flow.
- `evaluatePattern` with `Raw_n / sqrt(Available_n) * 2`, `MIN_PRIMARY_WEIGHT 2.4`,
  `MIN_LEAD 0.35`, `MIN_SUPPORT_WEIGHT 1.8`, `coherent`, `contested`, `contributions`.
- `FRAMING_LINES`.

UI — `src/routes/index.tsx` (847-line rewrite landed in this commit):

- Title "What's Gabriel's Number? Vol. 2", stage machine `start → questions → result`.
- Back button flow: `goBack`, "Back to the start" / "Previous question", plus
  "Back to the last question" from the result.
- `choose` with stale-answer pruning, `restart`, `goDeeper` (`deeperIds`), `leftHere`
  ("Left here. Undetermined is a legitimate place to stop.").
- localStorage history via `src/lib/history.ts` (unchanged since), `readings.tsx`,
  `Footer.tsx`, `FramingNote.tsx`, `NumberPanel.tsx`, `styles.css` design system.
- The old 1–5 dial files (`ClarityDial.tsx`, `ScaleChoice.tsx`, `evaluator.ts`,
  `evaluations.ts`, `routes/history.tsx`, `routes/vol2.tsx`) were **deleted by this very
  commit** — they are correctly absent from the baseline.

## Carried forward (everything above, verbatim)

`src/lib/gabriel.ts`, `src/routes/index.tsx`, `src/routes/readings.tsx`, `src/styles.css`
restored to their `d4658a9` content, byte for byte. All ten doorways visible, all question
wording, all evidence weights, all thresholds, the deeper-probe flow, the back flow, the
history behaviour.

## Excluded (all Aug 19+ work, dropped)

- Fixed six-page architecture (`prefixPages` / `stage2` / `totalPages`) on `spiral`,
  `drink`, `bet`, `happened`.
- `Doorway.hidden` + `VISIBLE_DOORWAY_ORDER` and the four-item menu; the seven hidden
  doorways return to the menu.
- THE CHASE (`bet` doorway, `bet-*` questions) — the Aug 18 gambling branch is `gamble`.
- THE FIRE rebuild of `happened` (`fury-*` questions) — reverts to Aug 18 `happened-1..3`.
- Rebuilt `drink-*` and `spiral-*` layers, the Number-9 bridge standard,
  `src/lib/result-narrative.ts`, `BRANCH_LENS`.
- `src/components/RightNow.tsx`, `UrgeTimer.tsx`, `DevPreviewBanner.tsx` and the four
  `src/assets/right-now-*.jpg` photo assets.
- Tests written against post-Aug-18 branches: `gabriel.chase.test.ts`,
  `gabriel.nine-result.test.ts`, `result-standard.test.ts` (they reference `bet`, the
  9-bridge and `result-narrative`, none of which exist at the baseline).
- The 2026-08-19 weight normalisation of six double-weighted answers
  (`chance-info/a`, `chance-split/a`, `spiral-stuck/d`, `uf-conversation/c`,
  `happened-3/a`, `spiral-known/b`) — at Aug 18 these still carry total weight 4.

## Kept regardless (not part of the app's Aug 18 logic)

Docs and audit records stay as history: `docs/*.md`, `.lovable/audit-*.md`,
`.lovable/plan.md`, `AGENTS.md`, config files, `src/lib/history.ts`,
`src/lib/error-*.ts`, `src/components/ui/*`.

## Technical notes

- Restore by checking out the four files from `d4658a9`, then deleting the excluded
  components/assets/tests, then regenerating nothing (`routeTree.gen.ts` at baseline had
  only `/`, `/readings`, `/vol2`; current tree has `/`, `/readings` — `vol2.tsx` does not
  exist in either, so the current generated tree is already correct and stays).
- `src/styles.css` revert removes the RIGHT NOW animations (`rage-jolt`,
  `cooldown-drift`, `photo-breathe`, `guided-photo-wash`) along with them.
- Verification after restore: app builds, all ten doorways appear, one full path per
  doorway reaches a result, Back works at every page, Undetermined offers deeper probes,
  history saves and lists.

## Two decisions to confirm before I build

1. The Aug 18 baseline shows the four-item menu, THE FIRE, THE CHASE, RIGHT NOW and the
   urge timer all gone. Confirm that is intended, or name any of them to keep.
2. `src/components/Footer.tsx` (© 2026 Sarah DeFazio) exists at the baseline and is
   unchanged since, so it stays either way — no action needed.
