# Spiraling branch — convergence + final-output audit and LOCK (2026-08-19)

Scope: `spiral` doorway only. No other branch touched. Immutable core untouched:
`NUMBERS`, Tree mapping, `MIN_PRIMARY_WEIGHT = 2.4`, `MIN_LEAD = 0.35`,
`MIN_SUPPORT_WEIGHT = 1.8`, normalization `raw / sqrt(max(available,1)) * 2`,
Undetermined behavior. Verified programmatically after the edits (formula string
and all three constants asserted intact).

## 1. Instrument audit

15 questions, 84 responses, fixed six-page architecture (`prefixPages: 3`,
`stage2: spiral-known`, `totalPages: 6`). Every response was checked for
psychological mechanism → authentic information → fixed 1–9 mapping.

Findings:

- **Banned wording** (`land` / `landed` / `landing`): 2 occurrences.
  - `spiral-replay` prompt: "What does the replay keep landing on?"
  - `spiral-replay/e`: "It doesn't land anywhere, it just runs"
- **Same-question evidence collisions**: 2 initially (a third surfaced during the fix and was cleared; final audit: 0).
  - `spiral-1`: `predict` and `unsolvable` both carried `{5:1, 7:2}` — two
    distinct mechanisms (future simulation vs. premature closure on an
    unanswerable question) with an identical signature.
  - `spiral-stuck`: `c` ("Weeks or longer") and `d` ("comes back every few
    months") both `{3:3}` — continuous duration and cyclical recurrence
    scored identically.
- **Responses that tell the user the number**: none found. No spiraling
  response names a dimension, lesson, or mechanism label; all report
  behavior or content.
- **Weights**: no weight > 3, no per-choice sum > 3, no dangling
  `next`/`followUp`, no duplicate labels.
- **Per-page 1–9 availability** (observation, not a mandate to force options):
  `spiral-1` no 6/9; `spiral-replay` no 1/4/5/7; `spiral-predict` no 4/6/8/9;
  `spiral-meant` no 1/4/6/7/9; `spiral-reassure` no 1/2/4/5; `spiral-unsolvable`
  no 2/3/6; `spiral-jump` no 6/9; `spiral-stuck` no 2/4/6/8/9; `spiral-unknown`
  no 2/4/9; `spiral-subject` no 1/4; `spiral-stakes` no 1; `spiral-fuel` no
  2/5/6/8; `spiral-known` no 3/4/6/7/9; `spiral-stop` no 1/2/5; `spiral-need`
  no 2/3. These pages are psychologically natural as written; all nine numbers
  are reachable at branch level (see §3), so no options were added for
  mathematical symmetry.

## 2. Instrument fixes applied (wording/routing only)

1. `spiral-replay` prompt → "What does the replay keep circling back to?"
   (same psychological target: which object the replay fixes on).
2. `spiral-replay/e` → "Nothing in particular — it just runs on repeat".
   Mapping unchanged `{3:3}` — still pure recurrence with no content.
3. `spiral-1/predict` → `{7:2, 3:1}` (was `{5:1, 7:2}`). Predicting a thing
   that has not happened is running a familiar loop forward while unable to
   stay in the present; discernment is not what it reveals. Collision with
   `unsolvable` (`{7:2, 5:1}`, unchanged) resolved. Wording unchanged.
4. `spiral-stuck/c` → "Weeks or longer, without much of a break", `{3:2, 7:1}`.
   Continuous, unbroken duration is recurrence plus an inability to put it
   down; cyclical return stays the pure `{3:3}` pattern response (`d`).
5. `spiral-stuck/b` ("A few days") → `{7:3}` (was `{3:2, 7:1}`). A few days of
   one thought is not yet a recognized recurring pattern — it is an inability
   to set the thought down. This also cleared the new collision the fix in (4)
   introduced with `b`; re-audited to 0 collisions.

No prompts other than `spiral-replay` changed. No structural change: the fixed
six-page architecture was preserved (the audit exposed no problem requiring it).
No imagery added.

## 3. Exhaustive stress test (post-fix)

Full enumeration of the spiraling branch:

- **55,440 complete paths**, all exactly 6 pages — **0 page-length violations**.
- **All 84 reachable response options exercised** (0 uncovered).
- **All nine numbers reachable as primary**:
  1: 2,179 · 2: 4,832 · 3: 6,655 · 4: 2,119 · 5: 6,790 · 6: 2,460 ·
  7: 6,341 · 8: 5,282 · 9: 3,561.
- **Undetermined: 27.5%** of paths — inside the validated 25–30% band; never
  forced into a number.
- **Deterministic scoring**: re-evaluating every path gave byte-identical
  results.
- **Back-button / stale answers**: editing any of the 6 pages preserves the
  prefix and drops every later answer — 0 surviving stale answers.
- **Duplicate selection idempotency**: re-selecting the same answer changes
  nothing.
- **Bogus / missing answer ids**: no throw; empty state yields no primary.
- **Deeper probes**: 400 sampled undetermined paths → **400 resolved** (100%),
  no dead ends.
- **Framework guard**: constants and normalization formula asserted unchanged.
- **Problems reported: 0.**

## 4. Final-output audit (universal result standard)

Required sequence: initial question → Gabriel Number → core lesson → pattern
summary → humanized explanation → practical next question/advice.

Before this pass the result showed only doorway label → number → meaning →
core lesson → pattern reasoning. Missing: the reconnect to the initial question,
the humanized explanation, and practical next question/advice.

Presentation-only additions (non-scoring; no new scoring system, no new
meanings):

- Result now opens with **"You came in with"** — the doorway question plus the
  person's first answer, so the reading reconnects to why they entered.
- New `NEXT_STEPS` map in `src/lib/gabriel.ts`: per number, a humanized
  explanation, one carry-forward question, and one practical piece of advice.
  Rendered as an **"In plain language"** card after the pattern summary.
- `UNDETERMINED_NEXT`: honest wording for the undetermined outcome plus a
  practical next question — no number is invented for closure.

Verified end-to-end in the running app: doorway → 6 pages → result renders the
full sequence with no console/page errors.

## 5. Status

**SPIRALING: LOCKED** — audit complete, all fixes are instrument-level, and the
exhaustive 55,440-path stress test passes with 0 problems.

Carried forward (flagged, out of this pass): the `DEEPER_PROBES` weight-4
convention remains an explicit framework decision awaiting Sarah's approval.
