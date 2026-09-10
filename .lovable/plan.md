# DRINK/GAMBLE Path-Level Research Audit

**Scope:** Current HEAD `908206e9aaeb`; research only. No production source, questions, scoring, weights, routing, or UI changed.

## Bottom line

The requested gates do not exist in the current routing model. Choices contain only an ID, label, Number evidence, optional `followUp`, and optional `avoids`; deeper probes are selected only by overlap with contested Numbers. The engine cannot explicitly represent “attempted control,” “actual displacement,” “incurred cost,” “interruption,” “recognition,” “chasing,” “moved limit,” or “time absorption.”

Current stopping is likewise Number-driven, not gate-driven: a path reaches its normal result after five or six questions, then offers a generic deeper probe only when the Number is Undetermined. None of those probes is DRINK- or GAMBLE-specific.

## DRINK audit

All root paths establish that an urge exists and clarify its immediate context or function. None establishes D1, D2, D3, or D4. Therefore none safely earns D5.

| Reachable path | Evidence actually established | Unresolved distinction | Earned next research probe | What would make it unnecessary | Current stop | Incorrect-trigger risk |
|---|---|---|---|---|---|---|
| `drink-1/well` or `/good` → `drink-well/a–h` | Difficulty sitting with positive experience, stillness, comfort, freedom, uncertainty, or an unexplained urge | No history of attempted control, actual life displacement, incurred cost, or brake | **D1** only | An explicit answer establishing whether change/control was attempted and what happened | `c3`, then result | Positive-state discomfort could be mistaken for impairment; it is not D2/D3 |
| `drink-1/stress` → `drink-stress/a–e` | Stated source of stress; `/d` also marks avoidance | Same four behavioral distinctions remain open | **D1** only | Explicit attempted-control evidence | Usually `c3`; `/d` inserts generic `u1` and follow-up | Work/money stress is a cause, not drinking-caused displacement or cost |
| `drink-1/bored` → `drink-bored/a–e` | Defaulting, social function, desired edge, planning friction, or uncertainty about substitutes | Whether drinking has displaced ordinary activities remains unknown | **D1** only; D2 is not yet earned as a conclusion | Explicit control-attempt answer; a direct present-tense displacement answer would later settle D2 | `c3`, then result | “Same slot,” “company,” or planning difficulty could be overread as D2; they describe function/substitution, not demonstrated displacement |
| `drink-1/routine` → `drink-habit-1/a–h` | What the routine provides: familiarity, anticipation, state change, transition, escape, perceived control, automaticity, or uncertainty | Attempted change/control is still unanswered | **D1** only | Direct report of an attempt and its outcome | Continues through `habit-2–4`, then `c3` | `habit-1/f` “A sense of control” can falsely look like D1; it does not report an attempt to control drinking |
| `drink-habit-2/a–j` | What the person imagines experiencing without the routine | Actual daily-life displacement and actual cost remain unknown | Does not independently advance beyond **D1** | Direct present-tense evidence that drinking displaced sleep, work, money, care, relationships, or obligations | Continues to `habit-3` | Responsibility/conversation options can be mistaken for D2; all answers are counterfactual |
| `drink-habit-3/a–l` | Hypothesized changes: money, body, energy, mornings, sleep, presence, time, trust, unfamiliarity, alternatives, or uncertainty | Whether any meaningful cost has already occurred | D2/D3 are **not established**; no later probe is safely earned from these answers alone | A factual answer about present displacement or incurred cost | Continues to `habit-4` | `/a–h` are the largest false-trigger set: “might” benefits are not actual D2 displacement or D3 cost |
| `drink-habit-4/a–e` | Relative salience of imagined loss/gain, ambivalence, dismissal, or refusal | Recognition of an actual pattern and readiness remain distinct and unresolved | **D5 not earned** | Prior explicit recognition grounded in actual D1–D4 evidence; then a readiness answer could resolve D5 | `c3`, then result | `/b` can look like readiness; `/c` recognizes tension, but neither proves behavioral recognition or readiness |
| `drink-1/change` → `drink-change/a–h` | Desired internal-state shift; `/g` marks avoidance | Behavioral history and consequences remain open | **D1** only | Explicit attempted-control evidence | Usually `c3`; `/g` inserts generic `u1` and follow-up | Wanting a different feeling is not wanting to change drinking and must not trigger D1 as established |
| `drink-1/happened` → `drink-happened/a–e` | A precipitating event or refusal to name it; root always marks avoidance | Behavioral history and consequences remain open | **D1** only | Explicit attempted-control evidence | Generic `u1` path, then usually `c1`, then result | Avoidance is orthogonal to D1–D4 and must not be treated as behavioral severity |
| `drink-1/plain` → `drink-plain/a–e` | Time, taste, people, ritual, or no named connection | Behavioral history and consequences remain open | **D1** only | Explicit attempted-control evidence | `c3`, then result | Time-of-day association is not daily-life displacement |
| `drink-1/unclear` → `drink-unclear/a–e` | Timing/antecedent or continued uncertainty; `/b` marks avoidance | Behavioral history and consequences remain open | **D1** only | Explicit attempted-control evidence | Usually `c3`; `/b` inserts generic `u1` and follow-up | “All day” is duration of urge, not displacement; a specific trigger is not cost |

### DRINK gate verdict

- **D1 attempted change/control:** not established anywhere. Every completed DRINK path leaves it unresolved. `drink-habit-1/f` is only a claimed function (“a sense of control”), not control-attempt history.
- **D2 basic daily-life displacement:** not established anywhere. `drink-habit-3` is hypothetical, not a report of current impairment.
- **D3 meaningful cost:** not established anywhere. Money, sleep, energy, presence, and time appear only as things that *might* improve.
- **D4 interruption/brake:** absent. No answer reports trying to stop/cut back, being interrupted, or what broke the sequence.
- **D5 readiness after recognition:** not safely reachable. `drink-habit-4` measures imagined gain/loss and ambivalence; `c3/a` and generic `deep-step/a` can sound action-ready but are not gated by prior recognition.
- **Safe stop:** under this specification, the current branch must stop after reporting what it actually learned. It cannot claim the D1–D5 sequence was resolved.

## GAMBLE audit

Every path is `gamble-1 → gamble-2`, followed by generic shared questions. Only two exact responses establish one of the requested gates.

| Reachable response/path | Evidence actually established | Unresolved distinction | Earned probe | What makes it unnecessary | Current stop | Incorrect-trigger risk |
|---|---|---|---|---|---|---|
| `gamble-1/a` “Good mood,” `/b` “run going right,” `/d` bored, `/e` fun, or `/f` unsure | Mood/streak/action-seeking/recreation/uncertainty | No evidence of chasing | **No G1** | Direct chasing evidence is absent | Continue to `gamble-2`, then shared close/result | A winning streak must not be treated as chasing a loss |
| `gamble-1/c` “I'm behind and want to catch up” | **Chasing is directly evidenced** | One-off versus repeated chase; what loss is being pursued | **G1 earned** | A direct answer resolving the chasing distinction | `avoids` currently sends this to generic `u1`, not G1 | Using `avoids` as a proxy for G1 is semantically unsafe, even though this one choice happens to evidence both |
| `gamble-2/a` set amount and sticks to it | A limit exists and is reportedly held | No moved-limit evidence | **No G2** | The answer itself negates moved-limit evidence for this run | Shared close/result | A limit existing must not be treated as proof of prior movement |
| `gamble-2/b` “I've moved it before” | **Moved limit is directly evidenced** | Frequency, direction, within-session versus between-session movement | **G2 earned** | A direct follow-up resolving how/when the limit moved | Shared close/result; no special route | Number 3/4 evidence does not encode G2, so a Number-tie probe can miss it entirely |
| `gamble-2/c` “No line” | Absence of a stated limit | Whether no limit reflects low-stakes play, overconfidence, or loss of control | **No G2 under the stated rule** | Direct evidence that a previously set limit moved | Shared close/result | “No line” may be concerning, but it is not evidence that a limit moved |
| `gamble-2/d` “Hadn't thought about it” | No prior limit consideration reported | Same | **No G2** | Direct moved-limit evidence | Shared close/result | Must not be promoted from uncertainty to moved-limit evidence |
| Any combination containing `gamble-1/c` + `gamble-2/b` | Both chasing and moved-limit evidence | G1 and G2 follow-up distinctions remain | **Both G1 and G2 earned**, in preserved response order | Each becomes unnecessary only after its own distinction is explicitly resolved | Generic universal/shared route, then result | Current selector can offer only a Number-tie probe and cannot preserve these two earned gates |
| Any GAMBLE path | No question asks about time absorption or displacement of sleep, work, money obligations, care, or relationships | G3 cannot be evaluated | **No G3** | Explicit time-absorption/displacement evidence | Shared close/result | Generic `c2` time horizon and `c3` next-hour language must not be mistaken for G3 |

### GAMBLE gate verdict

- **G1:** earned only by `gamble-1/c`.
- **G2:** earned only by `gamble-2/b`.
- **G3:** never earned; there is no evidentiary surface for it.
- The four Q1/Q2 combinations reduce safely to: `c+b` earns G1 and G2; `c+other` earns G1 only; `other+b` earns G2 only; all other combinations earn neither. No combination earns G3.
- The current `avoids` branch and all eight generic deeper probes are unrelated to these gates. A generic probe may be offered after any Undetermined Number result, including paths with no G1/G2/G3 evidence, because selection uses only contested Number overlap.

## Why current routing is not auditable enough

`Choice.evidence` records Number weights, not the proposition established by the answer. `followUp` can route from one immediate answer, and `avoids` can trigger one generic branch, but there is no explicit semantic fact ledger, no actual-versus-hypothetical marker, no prerequisite expression, no gate-resolution state, and no ordered queue when several probes are earned.

Consequently, safe routing cannot be inferred from weights or words:

- Number weights are many-to-many and are not evidence that D1–D5/G1–G3 occurred.
- String matching would falsely classify “sense of control,” “might have more money/time,” “what I'd gain,” “run going right,” and “no line.”
- `getDeeperProbe(contested, askedIds)` cannot inspect the selected answers and cannot know which gate was earned.
- The generic `avoids` flag describes experiential avoidance, not drinking/gambling progression.

## Smallest later architecture change

Add **additive, research-only semantic routing metadata** without touching existing Number evidence:

1. Each relevant choice may declare explicit facts it **establishes**, **negates**, or leaves **unknown**, including an `actual | hypothetical` status.
2. Each research probe declares its required facts, the distinction it resolves, and its stop condition.
3. A small deterministic selector receives the ordered answered path, derives gate state from exact selected choices, and returns zero or more earned probe IDs in encounter order.

The minimum conceptual shape is:

```text
choice.routingEvidence?: [{ fact, state: established | negated | unknown, basis: actual | hypothetical }]
probe.requires: fact-expression
probe.resolves: gate-id
probe.stopWhen: fact-expression
```

This should remain separate from `evidence` and `evaluatePattern()`. A single `tags: string[]` field is insufficient because safe routing must distinguish present fact from negation, uncertainty, and hypothetical language. No wording, scoring, weight, multi-select, or branch redesign is required to add this capability later.

## Source anchors

- Choice/Question/Doorway metadata: `src/lib/gabriel.ts:123–166`
- DRINK doorway and root routing: `src/lib/gabriel.ts:420–443`
- GAMBLE doorway and responses: `src/lib/gabriel.ts:445–474`
- Shared closing questions: `src/lib/gabriel.ts:262–298`
- DRINK follow-ups: `src/lib/gabriel.ts:1066–1215`
- Sequence, avoidance insertion, and generic padding: `src/lib/gabriel.ts:1249–1325`
- Generic deeper probes and selector: `src/lib/gabriel.ts:1336–1474`
- Result-only deeper-probe entry: `src/routes/index.tsx:137–160, 354–420`