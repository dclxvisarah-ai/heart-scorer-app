# THE CHASE — major stress test (evaluation only, 2026-08-24)

No production code, scoring logic, wording, or UI was changed. Evaluation ran the
current source through the current scorer plus an offline evidence-first audit.

## 0. Exact current Chase flow (from source)

`src/lib/gabriel.ts`
- Doorway `bet` L530–551: label "I'm still betting and I don't want to stop",
  `stage2: "bet-story"`, `prefixPages: 3`, `totalPages: 6`, `universal: "ifAvoidance"`,
  not hidden. Visible menu position 2 (`VISIBLE_DOORWAY_ORDER` L1839).
- P1 `bet-1` L539–547: states `up` {2:3} → `bet-up`, `down` {3:2,5:1} → `bet-down`,
  `even` {7:3} → `bet-even`, `early` {8:3, avoids} → `bet-early`.
- P2 state probes L1695–1739 (`bet-up`/`-down`/`-even`/`-early`), each `next: "bet-guarantee"`.
- P3 `bet-guarantee` L1741–1751.
- P4 `bet-story` L1753–1766 → P5 `bet-history` L1768–1782 → P6 `bet-need` L1784–1793.
- Closing swap `buildSequence` L1915–1923: when the last page is `bet-need`, it is
  replaced by `bet-need-down` / `-even` / `-early` per `answers["bet-1"]`; state `up`
  keeps `bet-need`.
- Scorer `evaluatePattern` L2157–2240: `Raw_n` summed from chosen options;
  `Available_n` = per-question max reach summed over the questions asked;
  `W_n = Raw_n / sqrt(max(Available_n,1)) * 2`; primary requires
  `W_top >= 2.4` (`MIN_PRIMARY_WEIGHT`) and lead `>= 0.35` (`MIN_LEAD`);
  supporting `>= 1.8` (`MIN_SUPPORT_WEIGHT`); otherwise Undetermined.

Exhaustive enumeration of the current branch: **11,520 complete paths, every path
exactly 6 pages.**

## 1. Clean current-version run transcript

Fresh answer map, built page-by-page from the live `buildSequence` (no prior state).

| Page | Question id | Prompt | Chosen id | Chosen text | Evidence in code |
|---|---|---|---|---|---|
| 1 | `bet-1` | Where are you right now, money-wise? | `down` | "I'm down. I want that money back." | {3:2, 5:1} |
| 2 | `bet-down` | You're down. What's keeping you in the seat? | `b` | "One decent hit puts me back. I've already done the maths." | {3:3, 9:1} |
| 3 | `bet-guarantee` | Say the next bet is guaranteed to lose. Do you still want to put it on? | `b` | "Yeah, part of me does. I want the bet more than the money." | {7:3} |
| 4 | `bet-story` | What's the next bet supposed to do? | `b` | "Get the money back." | {4:3} |
| 5 | `bet-history` | If you keep going, where does it usually end? | `d` | "I chase it and lose more than I came with." | {5:3, 9:1} |
| 6 | `bet-need-down` | You're down right now. Why not walk out? | `e` | "I keep putting the next one on. That's all I can tell you." | {9:3} |

Path: `bet-1 > bet-down > bet-guarantee > bet-story > bet-history > bet-need-down`.

## 2. Production result (unmodified scorer)

- Raw: {3:5, 4:3, 5:4, 7:3, 9:5}. Available: {1:6, 2:10, 3:8, 4:9, 5:13, 6:4, 7:15, 8:9, 9:5}.
- W: 9 = 5/√5·2 = **4.47**; 3 = 5/√8·2 = 3.54; 5 = 4/√13·2 = 2.22; 4 = 3/√9·2 = 2.00;
  7 = 3/√15·2 = 1.55; 1, 2, 6, 8 = 0.
- **Primary = 9 (Embodiment / Completion)**, coherent = true, supporting = [3, 5].
- Reasoning string: "Your answers kept returning to embodiment — carrying this into one
  actual next step. That pattern points most strongly to 9."
- Re-evaluation of the same answers is byte-identical (deterministic).

## 3. Evidence-first audit of the same responses (expanded 1–9 bubble architecture)

Direct evidence = what the response states. Inference = what a reader adds.

| Response | Direct evidence | Defensible coordinate(s) | Production says | Verdict |
|---|---|---|---|---|
| `bet-1/down` | Current position (down) + stated goal (recover the money). Loss-recovery motive. | Weak 5 (distinction: money vs position) as inference only; state report is closer to Unknown-structure | 3:2, 5:1 | **Questionable** — 3 Pattern is inferred, not stated; no recurrence is named in this response |
| `bet-down/b` | A calculation was performed and a recovery plan exists ("done the maths") | 4 Structure (organized relationship) as direct; 3 Pattern only if recurrence stated (it is not) | 3:3, 9:1 | **Unsupported for 9**; 3 is an inference; 4 is the untaken direct read |
| `bet-guarantee/b` | Wanting the act with the outcome removed — urge persists independent of payoff | 7 Staying (persistence) direct; 2 Duality partial (two motives distinguished) | 7:3 | **Defensible** |
| `bet-story/b` | Purpose of next bet = restore prior state | 5 Discernment (a distinction is being asserted) or 4 Structure | 4:3 | **Defensible** (organizing function toward a stated end) |
| `bet-history/d` | Self-observed recurring outcome: chasing ends in a larger loss | **3 Pattern** direct (recognized relationship across occasions); 8 Listening partial (information received about self) | 5:3, 9:1 | **Unsupported for 9; questionable for 5** — the strongest 3 evidence in the run is not scored as 3 |
| `bet-need-down/e` | Continuation without a stated reason; inability to stop | **7 Staying** direct; 1 Beginning possible (what is identifiable is only the behaviour) | 9:3 | **Unsupported** — this is unresolved persistence, the opposite of 9 Completion ("what has become sufficiently resolved") |

Evidence-first primary: **3 Pattern**, with 7 Staying as a strong second and 4 Structure
supporting. 9 has **no** direct evidence anywhere in this transcript.

## 4. Discrepancies

1. **Systematic 9 mismapping at the closing page.** Every closing variant maps option `e`
   — the "I can't stop / I keep putting the next one on / I don't stop at even" answer —
   to `{9:3}` (`bet-need/e` L1791, `bet-need-down/e` L1802, `bet-need-even/e` L1813,
   `bet-need-early/e` L1824). Under the locked architecture, an unresolved compulsive
   continuation is 7 Staying (or Unknown), never Completion. Sweep result: **all 476 of
   the 476 paths that return 9 (out of 11,520) chose closing option `e`** — 9 in The
   Chase is, in practice, the "can't stop" answer relabelled as Completion.
2. **Availability inflation.** 9 has the lowest availability in this path (5 vs 15 for 7),
   so `Raw/√Available` gives concentrated scarce evidence an arithmetic advantage:
   raw 5 on 9 scores 4.47 while raw 5 on 3 scores 3.54. The formula rewards being rarely
   on the table, which is an artifact, not a structural finding.
3. **Pattern evidence under-credited.** The one response that actually demonstrates a
   recognized recurring relationship (`bet-history/d`) carries no 3 evidence at all,
   while two responses that state no recurrence do (`bet-1/down`, `bet-down/b`).
4. **Inference scored as direct evidence.** `bet-down/b` ("done the maths") is scored as
   Pattern; the direct content is organization/plan (4).
5. **Unknown handling.** Not triggered on this path, but `bet-early/d` {1:2,5:1},
   `bet-guarantee/d` {1:2,6:1}, `bet-story/e` {1:2}, `bet-history/f` {1:2} convert "no
   idea / never looked" into evidence for 1, which conflicts with "Unknown ≠ Absent" and
   with "do not convert Unknown into 1 automatically".
6. Branch-independent naming is otherwise intact: the numbers are not redefined per
   branch anywhere in `bet`; the defect is mapping, not definition.

## 5. Stale-data / version integrity

- Version identity confirmed: the run used the current `bet` definitions above, including
  the state-specific closing swap (L1915–1923), and page 6 correctly resolved to
  `bet-need-down` for state `down`.
- App-level pruning is sound. `src/routes/index.tsx` L133–143 deletes answers after the
  edited page and then drops every answer whose question is no longer on the rebuilt live
  path, so a changed Q1 state cannot leave a prior state's answers behind.
- Run isolation: `runToken` (L66–71) plus `setAnswers({})` / `setIndex(0)` /
  `setSavedId(undefined)` on branch pick (L254–259) and restart (L119–125).
- History cannot contaminate scoring: `src/lib/history.ts` stores only
  `{id, createdAt, doorwayId, doorwayLabel, primary, supporting, reasoning}` — no answers
  are persisted, so no prior run can feed the scorer.
- Direct out-of-band contamination probe: mutating `bet-1` to `up` inside a raw answer map
  (bypassing the UI) leaves five orphaned answers and yields a bogus primary of 2. This is
  reachable only by scripts, not by the app, because of the pruning above. Existing guard
  test `src/lib/gabriel.chase.test.ts` covers exactly this case — 5/5 tests pass.
- **Finding: no stale-run contamination in the product.** The production 9 is not a stale
  artifact; it is what the current mappings genuinely produce.

## 6. Verdict

**FAIL (instrument mapping) / PASS (version and data integrity).**

- Integrity, determinism, path length, pruning, run isolation: PASS.
- Construct validity of the Chase → 9 mapping: FAIL. On this transcript the production
  coordinate (9 Completion) is contradicted by the evidence, which points to 3 Pattern
  with 7 Staying. The failure is reproducible and systematic, not a one-path fluke
  (476/476 nines driven by one answer id).
- This is a construct-alignment finding from a rubric-based audit of one clean transcript
  plus an exhaustive mapping sweep. It is **not** an empirical accuracy, reliability, or
  outcome statistic; no criterion data exists.

## 7. What must happen before any scoring or architecture change

1. Freeze the finding: no edit to `evaluatePattern`, thresholds, or weights in this pass
   (locked rule stands).
2. Re-audit all four closing variants' option `e` against 7 vs 9 definitions and record
   the intended coordinate before touching any mapping.
3. Re-audit `bet-1/down`, `bet-down/b`, `bet-history/d` for direct-vs-inference, and write
   the intended coordinate per option in a mapping table reviewed by you.
4. Decide the Unknown policy explicitly (Unknown as its own evidence state vs current
   auto-1) — this affects every branch, so it is an architecture decision, not a Chase fix.
5. Quantify the availability-inflation artifact across branches (same sweep method) so the
   replacement normalization is designed against measured behaviour.
6. Only then derive candidate resolution mathematics, pressure-test 6↔9 and 7↔9, and add
   guard tests **before** changing production code.
7. Any Chase mapping correction ships with a re-run of this exact transcript plus the
   11,520-path sweep as the regression baseline.
