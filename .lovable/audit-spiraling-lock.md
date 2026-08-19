# Spiraling Branch — Instrument & Result Audit (LOCKED)

Doorway: **"My brain is spiraling"** (`spiral`)
Date of pass: 2026-08-19
Scope: Spiraling branch only (`src/lib/gabriel.ts`) + shared result presentation (`src/routes/index.tsx`).
Framework: immutable. 1–9 meanings, Tree mapping, evidence formula, weights, thresholds and Undetermined behavior unchanged.

## 1. Q1–Q6 psychological purpose audit

Fixed six-page architecture: 3 adaptive opening pages (P1 → one of 8 P2 follow-ups → one of 3 P3 pages) then a fixed stage-2 chain (P4–P6). 15 reachable questions, 84 reachable options, every path exactly 6 pages.

| Page | Question(s) | Mechanism | Authentic information elicited | Fixed 1–9 targets | Answer separation |
|---|---|---|---|---|---|
| Q1 | `spiral-1` "What is it actually doing right now?" | Names the *form* of the loop instead of its content — forces observation over reaction | Whether the loop is retrospective, predictive, other-mind reading, reassurance-seeking, unsolvable, catastrophic, scattered, fixed, or unreadable | 3 Pattern, 8 Listening, 7 Staying, 2 Duality, 5 Discernment, 4 Structure, 1 Beginning | 9 mutually exclusive loop shapes; no two share an evidence signature |
| Q2 | `spiral-replay` / `-predict` / `-meant` / `-reassure` / `-unsolvable` / `-jump` / `-stuck` / `-unknown` | Tests the loop's *evidence base* — what the mind is actually working from | Whether the material is real information, inference, tone, timing, absence, or nothing at all | 5 (real evidence), 2 (inference/other), 8 (information from a person), 3 (repetition without content), 7 (time/duration), 4 (accumulation), 9 (action-dependent), 1 (unknown) | Each follow-up is specific to the Q1 shape — answering Q1 differently produces genuinely different Q2 material |
| Q3 | `spiral-subject` / `-stakes` / `-fuel` | Strips the story: names the feared truth, the real stake, or the loop's self-restart behavior | Emotional load and what the loop protects the person from facing | 2, 6, 5, 7, 8, 9, 3, 4, 1 | Three distinct probes; content-level (subject), consequence-level (stakes), mechanical-level (fuel) |
| Q4 | `spiral-known` | Fact vs interpretation split | How much of the spiral is event and how much is construction | 5 (fact), 2 (assumption), 8 (unheard from other), 1 (can't separate) | Ordered gradient from "real event" to "almost all guessing" |
| Q5 | `spiral-stop` | Historical evidence, not intention — "what has stopped it, not what should" | The person's demonstrated regulation route | 8 (being told), 7 (time), 9 (doing the dreaded thing), 6 (articulating), 3 (nothing — recurs), 4 (deciding) | Each option is a materially different intervention with one primary function |
| Q6 | `spiral-need` | Converts insight into a requirement — closes on need rather than feeling | What the person is actually asking for: information, contact, decision, action, tolerance of not knowing, self-relief, or nothing yet | 5, 8, 4, 9, 7, 6, 1 | Explicit "not what would be nice" framing; 7 options, no duplicate signatures |

No stage repeats another's mechanism: form → evidence → load → fact/interpretation → demonstrated history → requirement.

## 2. Findings

- Duplicate evidence signatures within a question: **0**.
- Options with no evidence: **0**. Options exceeding max weight 3: **0**.
- Banned wording (`land` / `landed` / `landing`) in Spiraling prompts, notes, labels or details: **0**.
- Result presentation did not label the three required standard sections explicitly (number, missing clarity, next step).

## 3. Changes made

Result presentation only (`src/routes/index.tsx`), no scoring or question changes:

- Added explicit **"Your Gabriel Number"** label above the numeral, and above the Undetermined heading.
- Undetermined heading reworded to "Undetermined — and that is an honest answer, not a failure."
- The core-lesson block is now explicitly labelled **"The clarity you're missing"** (lesson text unchanged).
- The closing card is now **"What to look at next"**, and now renders its humanized paragraph for Undetermined results as well as earned numbers (previously the paragraph was suppressed when undetermined).

Result sequence delivered: initial doorway question → Your Gabriel Number → The clarity you're missing → Why the pattern led there (reasoning + per-question contributions) → What to look at next (humanized explanation, carry-forward question, practical advice) → supporting threads.

## 4. Exhaustive stress test results

- Reachable paths walked: **55,440** — page-length violations: **0** (every path exactly 6 pages).
- Reachable options: **84**; exercised: **84**; uncovered: **0**. Reachable questions: **15**.
- Primary distribution: 1:2179, 2:4832, 3:6655, 4:2119, 5:6790, 6:2460, 7:6341, 8:5282, 9:3561 — **all nine numbers reachable**.
- Undetermined: **27.5%** — preserved, never forced.
- Determinism: re-evaluating every one of the 55,440 outcomes produced identical results — 0 mismatches. Idempotency check passed.
- Back navigation / stale answers: editing each of the 6 pages in turn preserved the prefix (0 prefix changes) and left no answer outside the active sequence (0 stale survivals).
- Missing/bogus IDs: empty answer map → Undetermined, no throw; bogus choice ID and bogus question ID → no throw, valid result.
- Deeper probes: 400 sampled Undetermined outcomes, **400 resolved** within ≤3 probes.
- Result-standard completeness across all 55,440 outcomes: every outcome has reasoning, a next-step (human + question + advice) and, when a number is earned, a core lesson and a non-empty pattern summary — 0 failures.
- Immutable constants verified present and unchanged: `MIN_PRIMARY_WEIGHT = 2.4`, `MIN_LEAD = 0.35`, `MIN_SUPPORT_WEIGHT = 1.8`; normalization `raw / Math.sqrt(Math.max(reach, 1)) * 2` intact.

## 5. Imagery

Deferred by design. No imagery added in this pass; imagery remains a later UX layer with no effect on scoring.

## 6. Verdict

**SPIRALING: LOCKED.** Drinking and all other branches untouched in this pass.
