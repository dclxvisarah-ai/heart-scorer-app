# Gabriel's Lab — DRINK / GAMBLE addiction layer research report

Date: 2026-09-10 · Scope: **Lab / research only.**
Production behaviour, DOORWAYS, question content, the evaluator, thresholds,
evidence weights and the public UI were **not changed** in this pass.
**The production V5.3 addiction layer remains a failed prototype. Nothing about it
was corrected here.**

All runs below are **synthetic, researcher-authored scripts** (`synthetic: true`).
No human experiment was run and no person's answers are represented.

## What was added (Lab only)

| File | Purpose |
| --- | --- |
| `src/lib/lab/scripted.ts` | Doorway-selectable scripted run harness. Drives the real `buildSequence` and the real `evaluatePattern`, records per-step routing-fact snapshots, placement analysis, N-way matrix comparison, single-answer perturbation. |
| `src/lib/lab/addiction-cases.ts` | The eleven controlled synthetic cases. Non-addiction answers held identical inside each doorway. |
| `src/lib/lab/addiction-research.test.ts` | 18 assertions: run integrity, the V5.3 control condition, fact/Number separation, matrix distinctness, documented defects. |

Routing facts are derived read-only through the existing
`summarizeRoutingFacts`. They are never fed into Number scoring, and no
addiction Number and no diagnostic output exists anywhere in this work.

## 1. Control condition — the current V5.3 failure, reproduced

For **all eleven** cases:

- every research question (E1–E6 / G1–G3) sits **after** the generic closers;
- **every** research answer carries **empty Number evidence** (asserted);
- the branch investigation is still dominated by generic pages — the
  `gambling-moved-limits` run is 60% generic among its non-research questions.

Typical DRINK routine sequence actually produced:

```
drink-1 > drink-habit-1..4 > c3 > addiction-e1 > e2 > e3 > e4 > e5 [> e6]
```

The addiction investigation therefore begins *after* the app has already
finished asking, and contributes nothing the person can see in the result.

## 2. Do the eleven cases separate?

11 runs produced only **8 distinct routing-fact fingerprints**. Two collisions:

| Collision | Cases that became indistinguishable |
| --- | --- |
| A | `intact-functioning`, `external-stopping`, `deliberate-stopping` |
| B | `recognition-no-readiness`, `historical-impairment-improved` |

### Exact missing distinctions

1. **`STOP_MECHANISM` has no value, only existence.** E4 `run-out` (money/access
   gone) and E4 `decide` (own decision) both normalize to
   `ESTABLISHED / CURRENT`. External stopping and chosen stopping are the same
   cell. *Missing:* a locus dimension on the stop fact (self / external /
   responsibility / body), not a new question.
2. **Historical improvement is erased.** E2 `before` ("it used to, not now")
   normalizes to `NEGATED / CURRENT` — the same cell as "nothing has been
   displaced". *Missing:* a way to record `NEGATED now` **and**
   `ESTABLISHED historically` on one key at once.
3. **Recognition without readiness is not separable from history-plus-improvement**
   because both end at `RECOGNITION ESTABLISHED` + `READINESS NEGATED`; the only
   thing that would have separated them is (2).
4. **G3 stays unreachable in practice.** `TIME_ROLE_DISPLACEMENT` is only
   established by G3 itself, and G3 is gated on that same fact, so the
   `gamble-g3` script entry was never asked in either gambling case.
5. **Contradiction is real but silent.** `contradictory-correction` recorded
   `MEANINGFUL_COST ESTABLISHED` alongside `BASIC_LIFE_DISPLACEMENT NEGATED`
   without any user-facing acknowledgement, because there is no non-Number
   addiction output at all.

## 3. Why the final Number stays in the same family

Holding the DRINK routine path constant and varying one answer at a time
(`perturbAnswer`):

- Varying **`addiction-e2`** across all six choices: Number **3** every time,
  tallies byte-identical (`3:6.63 7:1.55 1:1.11`). Same for `addiction-e3`.
- Varying the closing generic **`c3`**: Number **3** every time; only the
  *supporting* number moves — 9, 8, 7, 4, 6, 1 across its six choices.
- Varying **`drink-habit-4`** or **`drink-habit-1`**: Number **3** every time;
  the second-place number moves between 7, 9, 2, 4, 6, 1.

The reason is arithmetic, not interpretive: `drink-1/routine` plus the four
`drink-habit-*` pages pile 3-weighted evidence onto a small `Available_3`, so
`Raw_3 / sqrt(Available_3) * 2` reaches 4.8–6.6 while nothing else clears 3.2.
The closing pages only decide **who comes second**, which is exactly the
observed 7 / 5 / 1 family drift. The addiction layer, carrying zero evidence,
cannot influence any of it.

The one Undetermined observed was a gambling run where 4 (2.68) and 5 (2.53)
were within the 0.35 lead threshold — a normal, intended outcome.

## 4. Corrected architecture (recommendation only, not implemented)

1. Addiction questions must be **inside** the branch investigation, before the
   generic closers, replacing generic top-up pages rather than following them.
2. Fact model needs a value dimension (`STOP_MECHANISM` locus) and simultaneous
   current + historical states on one key.
3. G3's gate must come from an upstream question, not from itself.
4. The addiction layer needs its own **non-Number** user-facing output:
   established / unknown / hypothetical / contradicted, in plain language, with
   no diagnosis and no addiction score.
5. Only after (1)–(4) pass in the Lab should any production change be proposed.

## 5. Limitations

- Synthetic scripts only; no human runs, no live clicking, no persistence.
- Eleven cases, not exhaustive path coverage.
- The Spiral fixture (`src/routes/lab.spiral-perturbation.tsx`) is untouched and
  remains Spiral-specific; this harness is code-level, not a UI route.
- `unusedScriptKeys` shows several scripted answers the graph never asked for
  (notably `gamble-g3`, `addiction-e6`, `c1`/`c2` on DRINK) — those are
  reachability facts, not harness errors.

## 6. Verification

Focused suite: 18/18 passed. Full suite and typecheck run clean (see chat).
No production file was modified.
