# Addiction question system — READ-ONLY CURRENT-CODE AUDIT

Date: 2026-09-12
Status: **audit only.** Not a test result. Not a readiness claim. Not a plan.
No implementation is authorized by this document.

## Method

Source reading only, against the current working tree. No live behavioral run,
no build, no deploy, no credit spend. Nothing here is inferred from prior
documentation (`.lovable/addiction-layer-v5.3.md`,
`.lovable/addiction-layer-lab-report.md`) or from earlier claims; every
statement was read out of code. Files read:

- `src/lib/gabriel.ts`
- `src/lib/addiction-routing.ts`
- `src/lib/relational-state.ts`
- `src/lib/deep-reading.ts`
- `src/routes/index.tsx`

Line references are as of this tree and will drift with future edits.

---

## 1. Addiction question sequencing

**CODE LOCATION** — `src/lib/gabriel.ts:1331-1346`; `src/lib/addiction-routing.ts:509-519, 590-611`.

**WHAT IT ACTUALLY DOES** — `buildSequence()` builds the branch chain, then
appends the universal avoidance question (1316-1318), then tops up / closes with
the shared closers `c1/c2/c3` (1320-1329), and **only then** appends earned
addiction questions. `getEarnedAddictionQuestions` returns already-answered
addiction questions plus currently earned ones, in the fixed
`ADDICTION_PROBE_PRIORITY` order (E1, E2, E3, E4, G1, G2, G3, E5, E6). Branches
with a fixed architecture (`stage2`, e.g. `fire`) return at 1305 and never reach
this block; `drink` and `gamble` have no `stage2`, so they do.

**MATCHES CURRENT V2 TRAJECTORY?** No.

**GAP** — Addiction probes are a tail appended after the generic closers rather
than the body of the investigation. The middle of DRINK/GAMBLE is generic
content.

---

## 2. Psychological purpose / distinction

**CODE LOCATION** — `src/lib/addiction-routing.ts:25-53, 89-211`.

**WHAT IT ACTUALLY DOES** — Each answer maps to one or more `FactSpec`
(`key` + `state` + `temporalScope`). Purpose is expressed only at the fact-key
level; there is no per-question structural intent field.

**MATCHES CURRENT V2 TRAJECTORY?** Partially — the model exists, the use does not.

**GAP** — The layer is write-only. `deriveRoutingFacts` /
`normalizeRoutingFacts` are called solely inside
`getEarnedAddictionQuestions` for gating. No other production module reads a
routing fact, so the distinctions are derived and then discarded.

---

## 3. Drinking doorway

**CODE LOCATION** — `src/lib/gabriel.ts:432-456` (doorway), `1081-1230`
(follow-ups `drink-well`, `drink-stress`, `drink-bored`, `drink-change`,
`drink-happened`, `drink-plain`, `drink-unclear`, and the chained
`drink-habit-1..4`).

**WHAT IT ACTUALLY DOES** — Single opening question `drink-1` with nine choices,
each carrying a `followUp`. No `stage2`/`prefixPages`/`totalPages`, so DRINK
takes the generic top-up path at 1320-1329.

**MATCHES CURRENT V2 TRAJECTORY?** No.

**GAP** — Path length is filled with `c1/c2/c3` rather than addiction content;
addiction probes can only arrive after those closers.

---

## 4. Gambling doorway

**CODE LOCATION** — `src/lib/gabriel.ts:457-488`.

**WHAT IT ACTUALLY DOES** — Two questions only, `gamble-1` and `gamble-2`, with
no `followUp` on any choice. Effective path: 2 branch questions + generic
closers (+ any earned addiction tail).

**MATCHES CURRENT V2 TRAJECTORY?** No.

**GAP** — Structurally the thinnest branch in the app; nearly its whole body is
generic.

---

## 5. Addiction research facts

**CODE LOCATION** — `src/lib/addiction-routing.ts:25-66` (model),
`394-478` (derivation and normalization).

**WHAT IT ACTUALLY DOES** — 10 keys (`CONTROL_ATTEMPT`, `CONTROL_RESULT`,
`BASIC_LIFE_DISPLACEMENT`, `MEANINGFUL_COST`, `TIME_ROLE_DISPLACEMENT`,
`CHASE_OR_CONTINUE`, `LIMIT_MOVED`, `STOP_MECHANISM`, `RECOGNITION`,
`READINESS`), 6 states, 4 temporal scopes. Derivation is pure and ordered.
`normalizeRoutingFacts` resolves to exactly **one** `RoutingFact` per key:
current-scope ESTABLISHED + NEGATED → `CONTRADICTED`; else CURRENT beats
HISTORICAL/HYPOTHETICAL; a HYPOTHETICAL ESTABLISHED is downgraded to
PROVISIONAL.

**MATCHES CURRENT V2 TRAJECTORY?** Partially.

**GAP** — (a) A key cannot hold current and historical states simultaneously:
`addiction-e2/before` declares HISTORICAL ESTABLISHED + CURRENT NEGATED
(138-141), and normalization returns only the CURRENT NEGATED, so the history is
lost. (b) `STOP_MECHANISM` has no value/locus dimension — all six answered E4
options produce an identical `ESTABLISHED/CURRENT` fact, distinguishable only by
`sourceChoiceId`, which nothing reads.

---

## 6. Response → evidence

**CODE LOCATION** — `src/lib/addiction-routing.ts:89-211`.

**WHAT IT ACTUALLY DOES** — Of the pre-existing production corpus, only
`gamble-1/c`, `gamble-2/a`, `gamble-2/b`, and four `drink-habit-3` hypotheticals
(101-104) carry routing facts. All remaining facts come from the addiction
questions themselves.

**MATCHES CURRENT V2 TRAJECTORY?** No.

**GAP** — The whole DRINK follow-up corpus (`drink-well` … `drink-habit-4`)
contributes zero addiction evidence, so nothing the person says in the DRINK
investigation itself can establish an addiction distinction.

---

## 7. Number evidence

**CODE LOCATION** — `src/lib/addiction-routing.ts:218` (`const none = {}`),
used by every addiction choice; `src/lib/gabriel.ts:1547-1567` (evaluator).

**WHAT IT ACTUALLY DOES** — Every addiction choice has `evidence: {}`. In
`evaluatePattern`, per-question reach is `max(...choices.evidence[n] ?? 0)`, so
these questions add nothing to Raw **and** nothing to Available. Thresholds
(`2.4 / 0.35 / 1.8`, lines 1537-1539) and the
`Raw / sqrt(max(Available,1)) * 2` formula are untouched.

**MATCHES CURRENT V2 TRAJECTORY?** Yes — intentional and correct isolation.

**GAP** — None here. This is the invariant to protect.

---

## 8. 1–9 structural location

**CODE LOCATION** — none exists.

**WHAT IT ACTUALLY DOES** — No addiction question, choice, or fact carries a
structural coordinate, and there is no separate non-Number addiction output
object in production.

**MATCHES CURRENT V2 TRAJECTORY?** No.

**GAP** — Addiction findings have no location in the framework and no alternate
home. They are collected and go nowhere.

---

## 9. Relationships / intersections

**CODE LOCATION** — `src/lib/relational-state.ts` (whole file);
`src/lib/deep-reading.ts` (whole file); `src/routes/index.tsx:333-500` (result
rendering).

**WHAT IT ACTUALLY DOES** — Territories, evidence snippets and relationships are
built purely from Number evidence, and a relationship requires a single answer
carrying both territories. An empty-evidence answer can never become a snippet.
Neither module imports `addiction-routing`. The result screen renders
`DeepReadingPanel`, `RelationalStatePanel`, contributions and supporting
numbers — no addiction surface.

**MATCHES CURRENT V2 TRAJECTORY?** No.

**GAP** — Zero addiction representation in either interpretation layer or in the
user-facing result.

---

## 10. Recognition

**CODE LOCATION** — `src/lib/addiction-routing.ts:284-303` (E5),
`166-170` (facts), `568-569` (gate).

**WHAT IT ACTUALLY DOES** — E5 is earned when at least two of E1–E4 were
answered and RECOGNITION is UNKNOWN/PROVISIONAL. "I don't see a pattern in it"
maps to NEGATED, not denial; two options map to PROVISIONAL.

**MATCHES CURRENT V2 TRAJECTORY?** Partially — sound as a probe, invisible as an
outcome.

**GAP** — Recognition state is never surfaced or interpreted.

---

## 11. Readiness

**CODE LOCATION** — `src/lib/addiction-routing.ts:305-317` (E6),
`173-178` (facts), `570-579` (gate).

**WHAT IT ACTUALLY DOES** — E6 requires E5 answered and RECOGNITION
ESTABLISHED/PROVISIONAL, so readiness is never asked before recognition and never
inferred from ambivalence. "Nothing right now" maps to `READINESS NEGATED` and is
preserved as a real answer.

**MATCHES CURRENT V2 TRAJECTORY?** Partially — correct gating, no output.

**GAP** — Readiness state is never surfaced or interpreted.

---

## 12. Control attempt / result

**CODE LOCATION** — `src/lib/addiction-routing.ts:220-233` (E1),
`107-127` (facts), `551-552` (gate).

**WHAT IT ACTUALLY DOES** — E1 sets `CONTROL_ATTEMPT` and, where applicable,
`CONTROL_RESULT`. `not-tried` (attempt NEGATED, result NOT_APPLICABLE) is
correctly separated from `no-wish` (attempt NEGATED + READINESS NEGATED).

**MATCHES CURRENT V2 TRAJECTORY?** Partially.

**GAP** — `held`, `returned` and `no-change` all resolve to
`CONTROL_RESULT ESTABLISHED`, so sustained change, relapse, and failed attempt
are indistinguishable after normalization.

---

## 13. Consequence / cost

**CODE LOCATION** — `src/lib/addiction-routing.ts:254-267` (E3),
`146-152` and `98-104` (facts), `485-488` (`establishedNow`), `555-556` (gate).

**WHAT IT ACTUALLY DOES** — `money/time/trust/health` → `MEANINGFUL_COST
ESTABLISHED/CURRENT`; `none` → NEGATED; `later` → PROVISIONAL/HYPOTHETICAL;
`drink-habit-3` future-benefit answers stay PROVISIONAL/HYPOTHETICAL. A
hypothetical can never satisfy a current prerequisite.

**MATCHES CURRENT V2 TRAJECTORY?** Yes for the actual/hypothetical separation.

**GAP** — Which cost it was (money vs trust vs health) is not retained in any
readable form.

---

## 14. Displacement

**CODE LOCATION** — `src/lib/addiction-routing.ts:235-252` (E2),
`130-143` (facts), `553-554` (gate); `202-210` (G3 facts).

**WHAT IT ACTUALLY DOES** — E2 establishes `BASIC_LIFE_DISPLACEMENT` and, via
`hours`, also `TIME_ROLE_DISPLACEMENT`. `slips` → PROVISIONAL. `gamble-g3/care`
sets both keys.

**MATCHES CURRENT V2 TRAJECTORY?** Partially.

**GAP** — The historical-impairment / current-improvement case is flattened (see
§5). E2 precedes G3 in fact priority but not in the lived sequence, since the
whole addiction block sits after the closers.

---

## 15. Persistence / chasing

**CODE LOCATION** — `src/lib/addiction-routing.ts:92-96, 185-199` (facts),
`319-356` (G1–G3), `561-566` (gates).

**WHAT IT ACTUALLY DOES** — `CHASE_OR_CONTINUE` from `gamble-1/c`,
`gamble-g1/win-back`, `gamble-g2/win-back`. `LIMIT_MOVED` from `gamble-2/a`
(NEGATED), `gamble-2/b` (ESTABLISHED/HISTORICAL) and three G2 answers. G1 needs
chase established now; G2 needs limit-moved ever; G3 needs `TIME_ROLE` established
now, so G3 does not gate itself.

**MATCHES CURRENT V2 TRAJECTORY?** Partially.

**GAP** — In production the only upstream source of `TIME_ROLE_DISPLACEMENT` is
`addiction-e2/hours`, so G3 is effectively unreachable unless E2 was both asked
and answered `hours`.

---

## 16. Stopping mechanism

**CODE LOCATION** — `src/lib/addiction-routing.ts:269-282` (E4),
`157-163` and `181-189` (facts), `557-558, 561-562` (gates).

**WHAT IT ACTUALLY DOES** — E4 is earned once E1 is answered and
`STOP_MECHANISM` is unresolved; G1 is the gamble-specific equivalent and can also
set `CHASE_OR_CONTINUE`.

**MATCHES CURRENT V2 TRAJECTORY?** No.

**GAP** — No locus dimension (deliberate decision / responsibility / access or
supply / body depletion / someone else intervening / mere pause). "I decide I'm
done" and "someone else steps in" produce the same fact.

---

## Confirmed correct — do not "fix" these later

1. **Number-evidence isolation.** Every addiction choice has `evidence: {}`, so
   Raw, Available, normalization and thresholds are mathematically identical with
   or without the layer.
2. **Hypothetical never satisfies a current prerequisite.** `establishedNow`
   requires `ESTABLISHED` + `CURRENT`; HYPOTHETICAL ESTABLISHED is downgraded to
   PROVISIONAL.
3. **"Nothing right now" is preserved** as `READINESS NEGATED`, not treated as
   evasion.
4. **G3 does not self-gate.** It requires `TIME_ROLE_DISPLACEMENT` established
   from upstream.
5. **`not-tried` and `no-wish` are distinct**, so absence of attempt is not read
   as absence of desire to change.
6. **NEGATED / NOT_APPLICABLE / CONTRADICTED stop probing** (`unresolved`), so a
   stated "no" is respected and a contradiction is not argued with.
7. **Contested Numbers never trigger an addiction probe**, and addiction facts
   never feed `getDeeperProbe`.

## Confirmed gaps, in section order

1. Addiction probes appended after generic closers, not inside the investigation.
2. Facts derived and discarded; nothing downstream reads them.
3. DRINK length filled by generic closers.
4. GAMBLE has only two branch questions.
5. No simultaneous current+historical state; `STOP_MECHANISM` has no locus.
6. DRINK follow-up corpus carries no addiction evidence.
7. (none — isolation is correct.)
8. No structural location and no separate addiction output object.
9. No addiction presence in relational state, deep reading, or the result screen.
10. Recognition never surfaced.
11. Readiness never surfaced.
12. `held` / `returned` / `no-change` collapse to one control result.
13. Cost type not retained.
14. Historical/current displacement flattened; E2→G3 ordering only notional.
15. G3 effectively unreachable in production.
16. Stopping mechanism has no locus values.

## Authorization

This document records current implementation only. It authorizes no correction
of sequencing, the fact model, stop-locus values, dual current/historical state,
or a separate addiction read. Each of those requires its own approved plan.
