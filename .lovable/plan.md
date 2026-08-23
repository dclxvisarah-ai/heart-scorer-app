# Gabriel's Number — next-step measurement & validation roadmap

Prototype 1 = THE FIRE + RIGHT NOW: a rage companion plus an investigation template.
Not a validated instrument. No code changes proposed in this document; every step below
is planning/research first, with implementation clearly flagged and deferred.

Evidence base inspected: `src/lib/gabriel.ts` (Fire doorway `happened` L626–658; pages
`fury-crossed-trust/-line/-fair/-power/-hurt` L730–795; `fury-under` L796–810;
`fury-want` L811–828; `fury-power` L829–843; `fury-close` L844–862; `NUMBERS` L46–130;
`DEEPER_PROBES` L1995–2100; `evaluatePattern` + `MIN_PRIMARY_WEIGHT 2.4` /
`MIN_LEAD 0.35` / `MIN_SUPPORT_WEIGHT 1.8` L2153–2240), `src/components/RightNow.tsx`,
`src/components/UrgeTimer.tsx`, `src/routes/index.tsx` (state L57–79, save L104),
`src/lib/history.ts`, `src/lib/result-narrative.ts`,
`mem://features/architecture-handoff-2026-08-22`.

Fire instrument as coded: 10 authored questions, 6 pages per path, 71 answer options.
Total authored evidence weight by number: 5=33, 7=31, 4=26, 2=24, 6=23, 8=23, 1=18,
9=15, 3=12. Seven options are "I can't say / I don't know" and all seven carry evidence
for 1 (`happened-1/blank`, `fury-crossed-*/f`, `fury-under/h`, `fury-want/i`).

## 1. What can be extracted today, with no code change

Almost nothing is instrumented. There is no analytics layer, no event log, and no
server. The only persisted artifact is device-local: `history.ts` stores
`{id, createdAt, doorwayId, doorwayLabel, primary, supporting, reasoning}` (max 50).

Available now:
- Result distribution per doorway (primary number vs Undetermined) — from local history.
- Branch choice counts and repeat-use cadence — from `createdAt` + `doorwayId`.
- Session recency/frequency for one device only.

Available by offline simulation of the code (no user data, no credits): exhaustive path
enumeration for the Fire branch to produce the theoretical result distribution,
per-question reachability, per-number availability, and the Undetermined rate — the same
method already used in `.lovable/audit-2026-08-19-baseline.md`.

NOT available today, though the question implies it is: completion/drop-off per page,
skip rates, RIGHT NOW opens, rage-timer starts vs completions, cooldown skips, guided
session choice, reflection use, return-to-Fire behaviour, per-question answer
distributions. All of that lives in transient React state (`index.tsx` L57–79,
`RightNow.tsx` phase state) and is discarded. Chosen answers are not even saved with the
history entry.

## 2. What cannot responsibly be measured yet

- Any accuracy, sensitivity, or specificity claim: there is no criterion measure.
- Reliability: no test–retest data, no parallel forms, and internal consistency is not
  meaningful for a branching instrument where items are not all administered.
- Whether a number "is right": the coordinate has no external referent yet.
- De-escalation effect of RIGHT NOW: no pre/post state capture at all.
- Iatrogenic risk (does the investigation increase rumination or escalate action urge?):
  requires pre/post arousal and urge ratings plus a comparison condition.
- Anything longitudinal: trait anger, recurrence, pattern-vs-snapshot claims.
- Population inference: self-selected single-device usage, no denominator.

## 3. Minimum useful dataset

Target: can the Fire items produce meaningful psychological distinctions without
increasing rumination or action urge? Minimum design, research mode only, explicit
consent, no PII:

- N ≈ 60–100 completed sessions (≥30 participants, ≥2 sessions each) for distribution
  and stability signal; ~150+ before any factor-style claim.
- Per session: entry state ratings (anger intensity 0–10, action urge 0–10, arousal
  0–10) at three points — before RIGHT NOW / after RIGHT NOW / after page 6.
- Full response vector (question id → choice id, ordered, with page timings).
- The engine output (primary/Undetermined, tallies, contributions).
- Two short reference scales at the end of session 1 only: a state-anger measure and an
  anger-rumination measure (see §5 for candidates), plus one "did this feel accurate"
  and one "did this make it worse" item.
- One follow-up ping at 24h: did you act on it, urge now, anything you'd change.
- Safety rule: any escalation (urge rating rising ≥2 points from entry to page 6) is
  logged as a primary outcome, not noise, and triggers review of the implicated items.

That set supports: response distribution/spread per item, item discrimination, result
distribution, retest stability of the coordinate, convergent signal against two
reference scales, and an escalation check. It does not support outcome or clinical claims.

## 4. Proposed event/metric schema (research mode, separate from public analytics)

Two strictly separate channels:
- Public product analytics: aggregate, anonymous, no response content — screen views,
  branch chosen, completion, RIGHT NOW opened/completed. Never joined to research data.
- Research mode: opt-in only, off by default, gated behind an explicit consent screen and
  a research flag; participants get a random `participantKey`; no free-text reflection
  content is ever transmitted (only "reflection used: yes/no", length bucket at most).

Event shapes (design only, not implemented):

```text
session_started      { sessionId, participantKey, branchId, ts, researchMode }
state_rating         { sessionId, point: entry|post_rightnow|post_investigation,
                       anger, urge, arousal, ts }
rightnow_opened      { sessionId, from: entry|question, questionIndex, ts }
rightnow_module      { sessionId, module: rage|cooldown|reflect|kids|good,
                       startedMs, completedMs, skipped, ts }
question_shown       { sessionId, questionId, pageIndex, ts }
answer_selected      { sessionId, questionId, choiceId, latencyMs, changed, ts }
back_navigated       { sessionId, fromPageIndex, toPageIndex, ts }
session_abandoned    { sessionId, lastPageIndex, ts }
result_computed      { sessionId, primary|null, tallies, supporting, contested,
                       deeperProbesUsed, ts }
result_feedback      { sessionId, accurate_1to5, madeItWorse_1to5, freeTextOptIn:false }
followup_24h         { participantKey, sessionId, urge, acted: yes|no|partly, ts }
```

Derived metrics: per-page drop-off, page dwell, answer-change rate, option-usage
coverage, per-item response entropy, Undetermined rate, coordinate retest agreement
(Cohen's kappa across sessions), escalation rate, RIGHT NOW completion rate and reuse.

## 5. Validation matrix — Fire questions as coded

| Question (file/section) | Construct intended | Expected distinction | Likely confound | Escalation risk | Eventual reference measure |
|---|---|---|---|---|---|
| `happened-1` L642–656 "What kind of furious is this?" | Primary appraisal type (betrayal / disrespect / injustice / helplessness / recurrence / protective / hurt-masked / persistence / undifferentiated) | Nine mutually exclusive appraisal frames route to different page 2 probes | Wording appeal; "again" conflates recurrence with trait anger; self-label ≠ demonstrated appraisal | Low–moderate: naming the offence can re-activate | State anger scale; appraisal/blame attribution measures |
| `fury-crossed-trust/-line/-fair/-power/-hurt` L730–795 | Norm/boundary violation content; what the anger guards | Specific violated standard vs unnamed assumption | Socially desirable options; retrospective construction | Moderate: rehearsing the offence detail | Perceived-injustice and betrayal-appraisal measures |
| `fury-under` L796–810 "Say only what you actually saw or heard" | Fact/interpretation separation (5 vs 2 vs 6 vs 8) — the reappraisal-capacity item | Discriminates people who can partition evidence from those fused with meaning | Insight-vocabulary bias rewards articulate respondents; option `h` maps unknown to 1 | Low; this is the de-escalating item | Cognitive reappraisal subscale; anger rumination (understanding-of-causes facet) |
| `fury-want` L811–828 "What do you want to happen?" | Action tendency / revenge motive, expressed not enacted | Retaliation vs voice vs undoing vs agency | Demand characteristics ("say the real one" may license escalation) | HIGHEST in the branch: explicit desire articulation | Anger-out / revenge-motive measures; state urge rating |
| `fury-power` L829–843 "who ends up paying for it?" | Consequence anticipation / impulse control | Cost-aware restraint vs "don't care" disinhibition | Moralising pull toward the socially correct answer | Low; this is the braking item | Impulsivity (premeditation), anger-control-in measures |
| `fury-close` L844–862 "Where are you putting it?" | Regulation strategy selection / behavioural channelling | Voice, boundary, discharge, self-directed action, information-seeking, deferral | Intention ≠ behaviour; last-item fatigue | Low | 24h behavioural follow-up; regulation-strategy inventories |
| RIGHT NOW modules (`RightNow.tsx`) | Immediate arousal down-regulation; non-scoring | Completion vs skip; cooldown adherence | Novelty effect; self-selection by state severity | Rage phase may amplify before it settles | Pre/post arousal + urge ratings |

Cross-cutting flags: unknown is currently treated as evidence for 1 in seven options,
which conflicts with the "Unknown ≠ Absent" rule in the locked architecture; the branch
is single-event by design, so recurrence items can only ever proxy trait anger; the
authored weight distribution is heaviest on 5 and 7 and thinnest on 3 and 9, so those
coordinates are structurally harder to earn here.

## 6. How yesterday's research engine sits underneath Prototype 1

The current engine is a simplified implementation of the same architecture, not a
different one. Layering, without touching the coded baseline:

- State detection: the RIGHT NOW ratings and entry appraisal become a state layer that
  gates interpretation ("high arousal → treat self-labels as weaker evidence"); it must
  not feed the coordinate.
- Evidence weighting: keep `Raw_n / sqrt(Available_n) * 2` as baseline; add evidence
  metadata (state Present/Absent/Unknown/Conflicted, independence vs redundancy) as
  recorded-but-unscored fields first, so the new maths can be back-tested offline.
- Contradiction/uncertainty: self-report (`happened-1`) vs demonstrated evidence
  (`fury-under`, `fury-power`) becomes an explicit divergence check feeding a confidence
  field distinct from the coordinate.
- Adaptive follow-up: `DEEPER_PROBES` already exists but only fires on Undetermined;
  generalise to "probe the specific unresolved structural condition", keeping the
  6-page spine.
- Pattern vs snapshot: needs the research dataset; cross-session comparison is the only
  honest route to pattern claims, and Fire is snapshot-only today.
- Number resolution: unchanged until the resolution maths is derived, pressure-tested and
  approved (locked rule).

## 7. Ready now vs needs more research

Ready to design/implement next (no framework change):
1. Research-mode consent + event schema (§4), off by default.
2. Persisting the response vector with the local history entry.
3. Confidence/uncertainty as a separate reported field (not a new number).
4. Recording evidence states (Unknown vs Absent) without scoring them.
5. Pre/post state ratings around RIGHT NOW.
6. Offline exhaustive Fire path simulation for theoretical distributions.

Needs research first: any change to `evaluatePattern`, 6↔9 resolution, redundancy vs
independent corroboration maths, contradiction handling, adaptive probe selection logic,
trait/pattern inference, and any accuracy claim.

## 8. Prioritized next 10 steps (steps 1–5 cost nothing to build)

1. Run the offline Fire path simulation and publish the theoretical result distribution.
2. Write the research-mode consent text, data dictionary, and retention/deletion rules.
3. Finalise the event schema in §4 as a versioned spec document.
4. Select the two reference scales and record licensing/permission constraints.
5. Write the escalation-safety protocol (thresholds, stop rules, review trigger).
6. Implement local-only response-vector capture behind a research flag (small build).
7. Implement pre/post state ratings inside RIGHT NOW, non-scoring (small build).
8. Recruit 30 participants, 2 sessions each, run the minimum dataset (§3).
9. Analyse item spread, coordinate retest agreement, convergent signal, escalation rate.
10. Only then derive and pressure-test candidate resolution maths; revisit the formula.

## Terminology discipline

Construct coverage (does the item set cover the target constructs), architecture
alignment (does the code implement the locked Gabriel rules), reliability (stability of
output), validity (does the coordinate relate to an external criterion), and clinical or
outcome effectiveness (does it help, and does it avoid harm) are five separate questions.
The 64% construct-coverage and 56% architecture-alignment figures from the previous audit
are rubric scores over the code as written. They are not accuracy, not reliability, and
not evidence of benefit. No empirical statistic exists for this instrument yet, because
no response data has been collected.
