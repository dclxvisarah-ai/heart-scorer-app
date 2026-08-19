# Drinking-branch audit — instrument report (no code changed)

Standard applied: question → psychological mechanism → authentic response → fixed 1–9 mapping → duplicate/collision test → mathematical stress test → whole-branch convergence → audit → lock. Number meanings, Tree mapping, thresholds (2.4 / 0.35 / 1.8) and `raw / sqrt(available) * 2` were treated as immutable and were not reinterpreted anywhere below.

## 1. Structure as built

Doorway `drink`: `prefixPages: 3`, `stage2: "drink-lost"`, `totalPages: 6`, `universal: "ifAvoidance"`.

28 reachable questions, 241 answer options, every `followUp`/`next` resolves:
`drink-1` → 14 layer-2 threads (`drink-reward`, `drink-better`, `drink-confidence`, `drink-calm`, `drink-nothink`, `drink-without`, `drink-routine`(+`-2`), `drink-forward`, `drink-myself`(+`-2`), `drink-bored`, `drink-escape`, `drink-good-life`, `drink-plain-hour`, `drink-unclear`) → `drink-layer2` → page 4 `drink-lost` → page 5 (`drink-power` / `drink-gone` / `drink-changes` / `drink-missing` / `drink-boredom`) → page 6 (`drink-fear` / `drink-want` / `drink-inertia` / `drink-consequence`).

## 2. Per-question audit

Format: mechanism | mapping check | hidden question | flags.

**Q1 `drink-1` — what is appealing about "fuck it"** (mechanism: motive attribution before self-justification). Hidden question: *which faculty is the urge standing in for?*
- `good` {2:3} duality — cost and reward held together. PASS.
- `better` {1:2,5:1} beginning + discernment — feeling known, cause unknown. PASS.
- `confidence` {6:3} integration — presence without self-prosecution. PASS.
- `calm` {4:3} structure — wants a container that closes the day. PASS.
- `nothink` {3:3} pattern — recognised recurrence of one thought. PASS.
- `scared` {1:2,6:1} beginning + owning the fear without verdict. PASS.
- `shit` {8:3} listening — receiving the body's report before deciding. PASS.
- `routine` {3:3} pattern — sees the shape. PASS but collides with `nothink` (see §3).
- `forward` {1:2,4:1} genuine unknown + missing shape. PASS.
- `myself` {2:2,1:1} two selves, neither disowned. PASS.
- `bored` {7:3} staying — can let the hour be empty. PASS.
- `escape` {6:3} owning the move without a verdict. PASS but collides with `confidence`.
- `well` {2:3} good life + urge, both true. PASS but collides with `good`.
- `plain` {5:3} discernment — want separated from story. PASS.
- `unclear` {1:2} the first honest question. PASS.
- **Instrument gap:** Q1 has zero availability for 9 (Embodiment). The doorway cannot seed a next-step reading; 9 can only enter from page 3 onward. Flagged, not patched.

**Q2 (thread questions, one per Q1 answer).** Each thread's nine-way spread was checked answer by answer; every option's wording carries the *act* of its number (recognised recurrence for 3, held rule for 4, known-vs-assumed separation for 5, accountability without prosecution for 6, tolerated stillness for 7, receiving before answering for 8, a real next step for 9, two truths for 2, honest first question for 1). PASS across `drink-reward`, `drink-better`, `drink-confidence`, `drink-calm`, `drink-nothink`, `drink-without`, `drink-routine`, `drink-forward`, `drink-myself`, `drink-bored`, `drink-escape`, `drink-good-life`, `drink-plain-hour`, `drink-unclear`. Two coverage notes: `drink-better` and `drink-myself-2` carry no 9 at all; `drink-calm/g` and `drink-forward/e` route honest non-knowing through 5 rather than 1, which is defensible (naming the gap is discernment) and consistent.

**Q3 `drink-layer2` — substance vs. state.** Hidden question: *can you separate the object from the state it stands in for?* All seven map cleanly (5 / 2 / 3 / 6+5 / 1+3 / 8 / 1). PASS. Choice ids are out of order (`…e, g, f`) — cosmetic only.

**Q4 `drink-lost` — what would actually be lost.** 12 options, full 1–9 availability, no collisions, three `avoids` routes into the universal avoidance question. PASS.

**Q5 variants.** `drink-power` (5 options) PASS; `drink-gone` (13) PASS with two collisions; `drink-changes` (10) PASS with one collision; `drink-missing`, `drink-boredom` PASS. `drink-power` has no availability for 1, 5, 6, 8 — the narrowest scoring page in the branch, so the paths through it lean structurally toward 9/2/7/3/4.

**Q6 variants.** `drink-fear`, `drink-want`, `drink-inertia`, `drink-consequence` — every option's wording expresses its number's act; no forced 9s, no self-report of the result. PASS with two collisions in `drink-fear`.

## 3. Duplicate / collision test (identical evidence signatures inside one question)

| question | ids | signature | severity |
|---|---|---|---|
| `drink-1` | `good` / `well` | {2:3} | low — different follow-ups, so information survives |
| `drink-1` | `confidence` / `escape` | {6:3} | low — different follow-ups |
| `drink-1` | `nothink` / `routine` | {3:3} | low — different follow-ups |
| `drink-gone` | `b` / `e` | {2:3} | **high** — same page-6 route, mechanism differs (ambivalence vs. small relationship) yet nothing distinguishes them |
| `drink-gone` | `c` / `l` | {3:3} | **high** — `c` is substitution, `l` is automaticity; `c` also carries `avoids`, `l` does not |
| `drink-changes` | `c` / `j` | {5:3} | **high** — trade-off naming vs. seeing the activity is not the point |
| `drink-fear` | `a` / `k` | {9:3} | **high** — terminal page, two distinct fears score identically |
| `drink-fear` | `h` / `l` | {1:2,7:1} | medium — "scared to start" vs. "leave it there" |

## 4. Mathematical stress test (actual `buildSequence` / `evaluatePattern`)

Exhaustive sweep of the drink doorway: **847,206 complete paths.**

- Length: every path exactly 6 pages. 0 violations.
- Integrity: no evidence weight > 3, no per-choice sum outside 2–3, no unmapped answer, no dangling reference.
- Coverage: 241/241 options exercised.
- Primary distribution: 2 → 12.7%, 3 → 11.4%, 5 → 9.4%, 1 → 8.7%, 6 → 7.4%, 8 → 6.5%, 7 → 5.5%, 4 → 5.4%, 9 → 4.8%. All nine reachable.
- Undetermined: 28.3% (239,560 paths) — in the validated 25–30% band.
- Deeper probes resolved 398/400 sampled undetermined readings; no dead ends.

### Instrument problems the maths exposes

1. **Availability discount favours thinly-offered numbers.** `W = raw / sqrt(available) * 2`, so a number offered at low reach converts raw evidence more cheaply. 1 is capped at reach 2 in almost every question (reach 3 only in `drink-myself-2/c` and `drink-fear/b`), which is exactly why the honest-non-knowing tails add up to 1 as a *primary* on 8.7% of paths — a person who says "I don't know" three times can be told the pattern is 1 rather than getting Undetermined. Symmetrically, 2 is offered at 3 in nearly every question and still tops the distribution, so it is not availability-starved but repetition-rich.
2. **Answer-level dominance.** Median share of the primary number's raw evidence coming from a single answer is 0.50, p90 0.60; 59% of determined readings draw at least half their primary evidence from one answer. Flipping one answer changes the primary on 83% of trials at page 1, 46–62% at pages 2–6. The reading is effectively a 2–3 answer instrument, not a 6-answer one.
3. **Uneven page width.** `drink-power` scores only 5 numbers and `drink-layer2` only 6, so which page-5 variant you land on shifts which numbers are even eligible.
4. **9 is structurally last.** No 9 availability at Q1, none in `drink-better`/`drink-myself-2`, and it has the lowest primary rate — the branch under-samples Embodiment relative to every other number.

## 5. Flags — recommended instrument fixes (require your approval; nothing applied)

Remove / collapse:
- `drink-gone/e` (clerk) — duplicate of `b`; either cut or re-map to the mechanism it actually names.
- `drink-fear/l` — near-duplicate of `h` on a terminal page.

Reword so the mechanism is visible and the collision dissolves (mapping unchanged):
- `drink-gone/c` vs `l`, `drink-changes/c` vs `j`, `drink-fear/a` vs `k`.

Re-map (mechanism does not match its current number):
- none found. Every mapping in the branch is an authentic expression of its assigned meaning.

Coverage / balance, for your decision:
- add a 9 (real next step) option to `drink-1` and to `drink-power`;
- give 1 one genuine reach-3 "first question" slot per page instead of only weight-2 tails, or accept that repeated non-knowing can read as 1;
- widen `drink-power` to at least 7 numbers so page 5 does not pre-select the eligible set.

Not fixable inside the instrument, listed for the record: the `DEEPER_PROBES` weight-4 discrepancy still stands and still awaits your explicit framework decision.

## 6. Lock status

Structure, integrity, coverage, path length, reachability, Undetermined rate and probe resolution are clean, so the branch is mechanically sound. **Not recommended for lock yet** — the four high-severity collisions and the 9/1 availability skew are instrument defects that would be locked in with it. Approve the §5 edits and the branch can be re-swept and locked in one pass.
