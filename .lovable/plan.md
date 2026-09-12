# V2 Addiction Architecture — Reconciliation Report (planning only)

Read-only reconciliation of the approved V2 target architecture against current production
code. No implementation authorized by this document. Line references are as of this tree.

Governing principle held throughout: discover where someone actually is psychologically,
never manufacture a Number.

---

## A. Target pipeline stages

Target: situation → psychological purpose → required distinction → question → response →
evidence statement → structural location(s) → relationships/intersections →
cross-question pattern → outcome.

| Stage | Current code | What it does now | Match |
| --- | --- | --- | --- |
| situation | `src/lib/gabriel.ts:432-488` (`drink`, `gamble` doorways) | Doorway text + opening question only | PARTIAL |
| psychological purpose | none | Not represented in any type or field | MISSING |
| required distinction | implicit in `RoutingFactKey` (`addiction-routing.ts:25-35`) | A key name stands in for the distinction; no explicit field | PARTIAL |
| question | `addiction-routing.ts:220-356` (E1–E6, G1–G3) | Approved prompts exist as `Question` objects | FULL |
| response | `AnswerMap` in `gabriel.ts` | Single choice id per question | FULL |
| evidence statement | `ANSWER_ROUTING_FACTS` `addiction-routing.ts:89-211` | Machine facts only (key/state/scope); no plain-language statement | PARTIAL |
| structural location(s) | none | No addiction question, choice, or fact carries a structural coordinate | MISSING |
| relationships / intersections | `src/lib/relational-state.ts` | Built only from Number evidence; never imports addiction routing | MISSING (for addiction) |
| cross-question pattern | `normalizeRoutingFacts` `addiction-routing.ts:425-471` | Resolves to exactly one fact per key; no cross-key pattern read | PARTIAL |
| outcome | `src/routes/index.tsx:333-500` | Renders Number, deep reading, relational state; no addiction surface | MISSING |

**Architectural gap (pipeline):** the middle of the pipeline (purpose → evidence statement →
structural location → pattern → outcome) does not exist in production. Facts are derived and
then read by exactly one consumer — the eligibility gate — so the layer is write-only.

**Change required:** an explicit per-question metadata field for purpose + required
distinction; a plain-language evidence-statement projection; a cross-key pattern reader; and a
separate non-Number addiction output object rendered on the result screen.

---

## B. Target constructs, one by one

### 1. Control / attempted change
- **Code:** `addiction-routing.ts:220-233` (E1), facts `107-127`, gate `551-552`.
- **Now:** `CONTROL_ATTEMPT` plus `CONTROL_RESULT`. `not-tried` (attempt NEGATED, result
  NOT_APPLICABLE) is correctly separated from `no-wish` (attempt NEGATED + READINESS NEGATED).
- **Match:** PARTIAL.
- **Gap:** `held`, `returned`, `no-change` all resolve to `CONTROL_RESULT ESTABLISHED`
  (`157-162` pattern repeats here) — sustained change, relapse and failed attempt are
  indistinguishable after normalization.
- **Change required:** a result-value dimension on `CONTROL_RESULT` (held / returned /
  no change), carried through normalization.

### 2. Basic-life displacement
- **Code:** `addiction-routing.ts:235-252` (E2), facts `130-143`, gate `553-554`.
- **Now:** `BASIC_LIFE_DISPLACEMENT`; `hours` also sets `TIME_ROLE_DISPLACEMENT`; `slips` →
  PROVISIONAL.
- **Match:** PARTIAL.
- **Gap:** `addiction-e2/before` declares HISTORICAL ESTABLISHED + CURRENT NEGATED
  (`139-141`), but `normalizeRoutingFacts` returns a single fact per key and CURRENT wins, so
  "it used to, not now" loses its history.
- **Change required:** allow one key to hold current and historical states simultaneously.

### 3. Meaningful cost / consequence
- **Code:** `addiction-routing.ts:254-267` (E3), facts `146-152` and `101-104`,
  `establishedNow` `485-488`.
- **Now:** money/time/trust/health → ESTABLISHED/CURRENT; `none` → NEGATED; `later` →
  PROVISIONAL/HYPOTHETICAL; the four `drink-habit-3` hypotheticals stay HYPOTHETICAL.
- **Match:** PARTIAL (actual vs hypothetical separation is FULL and correct).
- **Gap:** which cost it was is not retained in any readable form.
- **Change required:** a cost-type dimension retained through normalization.

### 4. Stopping mechanism
- **Code:** `addiction-routing.ts:269-282` (E4), facts `157-163`, gates `557-562`.
- **Now:** all six answered options produce an identical `STOP_MECHANISM ESTABLISHED/CURRENT`
  fact, separable only by `sourceChoiceId`, which nothing reads.
- **Match:** MISSING in substance.
- **Gap:** no locus dimension. "I decide I'm done" and "someone else steps in" are the same
  fact.
- **Change required:** a locus value set — deliberate/self decision, responsibility, external
  access/supply, body/depletion, someone else intervening, pause with no true end — as a
  research value only, never a score.

### 5. Recognition / pattern awareness
- **Code:** `addiction-routing.ts:284-303` (E5), facts `166-170`, gate `568-569`.
- **Now:** earned when ≥2 of E1–E4 answered and RECOGNITION unresolved. "I don't see a
  pattern in it" → NEGATED (not denial); two options → PROVISIONAL.
- **Match:** PARTIAL — sound as a probe, absent as an inquiry/output.
- **Gap:** recognition state is never surfaced or interpreted.
- **Change required:** recognition as a plain-language field in the addiction read.

### 6. Readiness / desired change
- **Code:** `addiction-routing.ts:305-317` (E6), facts `173-178`, gate `570-579`.
- **Now:** requires E5 answered and RECOGNITION ESTABLISHED/PROVISIONAL, so readiness is never
  asked before recognition nor inferred from ambivalence. "Nothing right now" is preserved as
  `READINESS NEGATED`.
- **Match:** PARTIAL — gating correct, no output.
- **Gap:** readiness state is never surfaced.
- **Change required:** readiness as a plain-language field, with "nothing right now" preserved
  verbatim in meaning.

---

## C. Gambling research probes

| Probe | Code | Now | Match | Gap |
| --- | --- | --- | --- | --- |
| Stopping mechanism (G1) | `319-334`, gates `561-562` | Requires chase established now; can also set `CHASE_OR_CONTINUE` | PARTIAL | Same missing locus as E4 |
| Limit movement (G2) | `336-347`, facts `94-96, 185-199`, gate `563-564` | `LIMIT_MOVED` from `gamble-2/a` (NEGATED), `gamble-2/b` (ESTABLISHED/HISTORICAL), three G2 answers | PARTIAL | Boundary movement is binary; no degree or direction retained |
| Time-role displacement (G3) | `349-356`, facts `202-210`, gate `565-566` | Requires `TIME_ROLE_DISPLACEMENT` established now; correctly does not self-gate | PARTIAL | Only upstream source in production is `addiction-e2/hours`, so G3 is effectively unreachable unless E2 was asked and answered `hours` |

**Change required:** an upstream time-role source inside the gamble investigation itself, so
G3's prerequisite can be established without depending on one E2 option.

---

## D. Sequencing

- **Code:** `gabriel.ts:1305` (fixed-architecture branches return early), `1316-1329`
  (universal avoidance question then shared closers `c1/c2/c3`), `1331-1346` (addiction tail),
  `addiction-routing.ts:509-519, 590-611` (fixed priority E1,E2,E3,E4,G1,G2,G3,E5,E6).
- **Now:** addiction probes are appended after the generic closers. `drink` and `gamble` have
  no `stage2`, so the whole middle of those branches is generic content; `gamble` has only two
  branch questions (`gabriel.ts:457-488`).
- **Match:** CONFLICT with target.
- **Gap:** the investigation body is generic; research probes are a tail.
- **Change required:** place earned addiction questions inside the branch before any generic
  closer, and stop using generic closers to fill branch length. Whether any single generic
  closer is retained is a decision, not an assumption (see F).

---

## E. What must remain untouched

1. **Number-evidence isolation.** Every addiction choice has `evidence: {}`
   (`addiction-routing.ts:218`), so `evaluatePattern` (`gabriel.ts:1547-1607`) adds nothing to
   Raw or Available for them. `Raw / sqrt(max(Available,1)) * 2`, thresholds
   `2.4 / 0.35 / 1.8` (`1537-1539`), the 1–9 meanings, all evidence mappings and all
   non-addiction branch content stay exactly as they are.
2. **No Number inferred from any addiction fact**, in either direction.
3. **Drinking 4↔9** stays an evidence-derived research relationship; it is NOT added to
   CrossMap.
4. **Number 9** is under review only; its wording and bridge question are not rewritten.
5. Hypothetical never satisfies a current prerequisite (`establishedNow` 485-488).
6. "Nothing right now" stays a real answer, not evasion.
7. NEGATED / NOT_APPLICABLE / CONTRADICTED continue to stop probing.
8. Contested Numbers never trigger an addiction probe; addiction facts never feed
   `getDeeperProbe`.
9. Urge/craving, function/motive, ambivalence and self-efficacy are NOT added.
10. The nine other branches and their wording are untouched.

---

## F. Ambiguities requiring your explicit approval

1. **Generic closers in DRINK/GAMBLE.** Removing them from the addiction path changes which
   questions contribute Number evidence, so the Number those two branches produce can change
   even with the evaluator untouched. Approve one: (a) keep all closers and insert addiction
   probes before them; (b) keep exactly one closer; (c) remove them from these two branches
   and accept the Number-distribution shift.
2. **Structural location for addiction findings.** The target names structural location(s), but
   no coordinate assignment exists and assigning one risks reading a Number from addiction
   evidence. Approve either "no structural location yet — addiction read stands alone", or an
   explicitly non-scoring annotation with defined rules.
3. **GAMBLE thinness.** G3 reachability and a coherent gamble investigation likely need at
   least one new upstream gamble question. New wording requires your approval; none is proposed
   here.
4. **Dual current+historical state.** This changes `RoutingFactSummary` from one fact per key
   to a current/historical pair, which every existing consumer and the 23 contract tests read.
   Approve the shape change before it is built.
5. **New value dimensions** (control result, cost type, stop locus, limit-movement detail):
   approve them as research-only metadata with no scoring effect.
6. **Where the addiction read appears.** A separate panel on the result screen, its heading,
   and its "not enough established yet" state are product-language decisions.
7. **Recognition/readiness as inquiry vs output.** Whether V2 wants only a plain-language
   output of existing facts, or additional inquiry structure, is undecided.

---

No test readiness is claimed. No production change is authorized by this reconciliation.
