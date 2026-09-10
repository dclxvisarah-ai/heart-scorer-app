# DRINK / GAMBLE addiction layer — research audit and corrected direction

Research pass only. No production file changes, no evaluator changes, no new number.
What follows is (a) what the current repository actually does, (b) what the Lab can and
cannot test today, (c) the corrected architecture to test before any build.

## 1. What the current branch actually collects

Confirmed from the current source:

DRINK, all non-routine openings (well / stress / bored / change / happened / plain /
good / unclear): the branch itself is only **two** questions — `drink-1` plus one
follow-up. The sequence builder then tops the path up to five with the generic closers
`c1`, `c2`, `c3`. So three of five pages are generic.

DRINK routine opening: `drink-1 → drink-habit-1 → 2 → 3 → 4` (five pages), then the
closer `c3` is always appended.

GAMBLE: only `gamble-1` and `gamble-2` exist, so `c1`, `c2`, `c3` fill the rest —
again three of five pages generic.

Addiction questions (E1–E6, G1–G3) are appended **after** the closing question, at the
very end of the path. That is exactly the "appended block" seen in the screenshots. It is
a placement defect, not a content defect.

## 2. Which addiction distinctions exist before the appended block

Established by existing questions: essentially none for DRINK. `gamble-1/c` establishes
chasing; `gamble-2/a` / `gamble-2/b` establish a limit held or a limit moved in the past.

Hypothetical only: the whole `drink-habit-3` page asks what *might* change. It cannot
support current cost.

Unknown before the appended questions: attempted change and its result, current
displacement, actual cost, what ends an episode, recognition, readiness, and (for
GAMBLE) time/role displacement. In other words the addiction investigation currently
begins after the branch has already ended.

## 3. Why the result stays in the 7/5/1 family

The numbers are driven by the openings, not by the closers. Every `drink-1` option
loads 1–3 points on 7 (or 1 on 3/1), and the generic `c1`/`c2` add mostly 5, 7, 3 and 1.
The final closer `c3` moves 3 points onto a single number. With 7 already carrying
several points and the score normalised over everything shown, three points on the last
page usually cannot overtake the lead or clear the lead margin. So changing the last
answer changes little: the closers are not where this branch's information is.

Addiction answers carry deliberately empty number evidence, so they also contribute
nothing to any panel that is derived from evidence. That is why the person sees no
addiction interpretation at all.

## 4. What the addiction layer should output

A separate, plainly worded research read — not a number, not a diagnosis:
what is currently displaced, what has actually cost something, whether change has been
attempted and what happened, what ends an episode, what is recognised, and what is
genuinely still unknown. Held next to the Gabriel Number, never merged into it, and
"not enough established yet" must be a valid output.

## 5. Corrected sequence shape (to be tested in the Lab first)

The addiction questions belong inside the branch, before the generic closers, and only
the ones whose prerequisite is already established:

```text
opening (why now)  ->  function / context follow-up
   -> E2 current displacement      (always asked in an addiction doorway)
   -> E1 attempted change + result
   -> E3 actual cost               (only after displacement or cost is live)
   -> E4 what ends an episode
   -> E5 recognition               -> E6 readiness (only after recognition)
GAMBLE: G3 displacement, G1 end-of-losing-session, G2 moved-limit approval
   -> at most ONE generic closer
```

## 6. Controlled Lab runs to execute

Eleven synthetic runs, each varying one addiction fact while every other answer is held
identical: intact functioning; current displacement; attempted change that did not hold;
recognition without readiness; shame without impairment; past impairment with current
improvement; gambling chasing; moved limits; stopped by outside circumstance; stopped by
own decision; contradictory self-correction. Pass condition: eleven distinct research
states, and an identical Gabriel Number wherever only addiction facts differ.

## 7. What the Lab cannot do today (must be built first, Lab-only)

- The fixture is hard-wired to the Spiral doorway; it cannot open DRINK or GAMBLE.
- There is no way to script a run — every answer must be clicked by hand, so eleven
  controlled runs are not practical.
- The recorder stores prompts and choices only. It records no routing-fact state, so a
  "distinct research states" test cannot be evaluated from a record.
- Comparison is pairwise only; there is no eleven-run matrix view.

Until those four gaps are closed, results for item 6 cannot be claimed as run.

## Recommended next step

One Lab-only pass, no production files touched: make the fixture doorway-selectable,
add a scripted-run helper, add a routing-fact snapshot per step to the Lab record, and
add a matrix comparison. Then execute the eleven runs and bring the evidence back before
any production change to DRINK or GAMBLE.

## Technical notes

- Files inspected: `src/lib/gabriel.ts` (openings, drink/gamble questions, `CORE_QUESTIONS`,
  `buildSequence`, deeper probes), `src/lib/addiction-routing.ts`, `src/lib/lab/contract.ts`,
  `src/lib/lab/recorder.ts`, `src/routes/lab.spiral-perturbation.tsx`.
- `evaluatePattern` and all weights, thresholds and meanings stay untouched throughout.
- The V5.3 routing-fact model itself (keys, states, temporal scope, negation and
  contradiction) is reusable; its placement and its missing user-facing output are the
  failures.
