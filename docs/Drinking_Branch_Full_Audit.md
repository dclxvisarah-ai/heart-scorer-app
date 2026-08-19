# Drinking Branch — Full Instrument Audit (post-correction)

Doorway: **"Why the fuck do I want a drink right now?"** (`drink`)
Pass date: 2026-08-19 (instrument optimization pass, independently re-verified against current HEAD)
Scope: Drinking branch only (`src/lib/gabriel.ts`) + shared result presentation (`src/routes/index.tsx`, unchanged this pass).
Framework: **immutable and untouched.** 1–9 meanings, Tree mapping, evidence formula, normalization, weights, thresholds (`MIN_PRIMARY_WEIGHT = 2.4`, `MIN_LEAD = 0.35`, `MIN_SUPPORT_WEIGHT = 1.8`) and Undetermined behavior unchanged. Every fix in this pass is an instrument fix.

## 1. Architecture (six pages, fixed)

`prefixPages = 3` → `stage2 = drink-lost` → `totalPages = 6`.

- **P1** `drink-1` — the urge's stated appeal.
- **P2** one of 11 answer-specific follow-ups (`drink-reward`, `-better`, `-confidence`, `-calm`, `-without`, `-routine`, `-myself`, `-bored`, `-escape`, `-plain-hour`, `-unclear`).
- **P3** `drink-layer2` (or the second page of the two-page chains `drink-routine-2` / `drink-myself-2`).
- **P4** `drink-lost` — what would actually be lost.
- **P5** `drink-power` / `drink-gone` / `drink-changes` / `drink-missing` / `drink-boredom`.
- **P6** `drink-fear` / `drink-want` / `drink-inertia` / `drink-consequence`.

25 reachable questions, 222 reachable options, every path exactly 6 pages.

## 2. Q1–Q6 psychological mechanism audit

| Page | Mechanism | Authentic information elicited | Fixed 1–9 targets | Separation |
|---|---|---|---|---|
| Q1 `drink-1` | Names the *appeal* rather than the substance, with the consequence-lecture explicitly pre-empted in the note | What the urge is being asked to deliver | 2+5, 1+5, 6+8, 4, 8, 3+4, 2+1, 7, 6, 9, 5, 1 | 12 mutually exclusive appeals; no two share an evidence signature |
| Q2 (follow-ups) | Tests the *mechanism* behind that appeal — reliability, current affective setting, what the confidence is for, what the arousal is about, what going without surfaces, what the routine holds, which self is missed, what would fill the slot, what is being escaped, what the hour should feel like, when the pull started | Whether the appeal rests on real evidence, inference, recurrence, container-need, body signal, or unknown | 3, 5, 6, 4, 8, 7, 9, 2, 1 across the set | Each follow-up is specific to its Q1 answer; different Q1 answers produce genuinely different Q2 material |
| Q3 `drink-layer2` (or chain page 2) | Separates the substance from the state it stands in for | Whether the want is the drink, the feeling, the ritual, the off switch, the hour, or tomorrow | 5, 2, 3, 6, 7, 9, 8, 1 | Eight distinct objects of wanting, one primary function each |
| Q4 `drink-lost` | Reframes from "should I" to "what is actually at stake" — loss, not morality | What the drink is genuinely providing | 8, 3, 7, 6, 2, 5, 4, 9, 1 | 12 materially different losses |
| Q5 | Power / counterfactual / enhancement probes: which side has more force, what is weirdest if the urge vanished, what the drink changes about what is already happening | Demonstrated priority rather than intention | all nine | Three distinct probe families reached by Q4 answer |
| Q6 | Converts the pattern into a requirement: the feared possibility, the wanted return, the easier-option question, or the consequence question | What the person is actually asking for | all nine | Four distinct closers; every option has one primary function |

No stage repeats another's mechanism: appeal → mechanism → object of wanting → stake → demonstrated power → requirement.

## 3. Findings against current HEAD (pre-fix)

Independently re-derived, not taken from the previous document:

1. **Q1 signature collisions (high severity, confirmed):** `good`/`well` both `{2:3}`; `confidence`/`escape` both `{6:3}`; `nothink`/`routine` both `{3:3}`. Three pairs of psychologically distinct responses collapsed to identical evidence.
2. **Q1 option count (confirmed):** 15 options on the first page of an urge-state instrument — cognitively excessive at exactly the moment the person is least able to read a long list.
3. **Availability imbalance (confirmed):** option-slot availability 1:45 vs 9:26, 7:25, 4:29. Outcome distribution over 995,976 paths skewed accordingly (2:108,959 and 6:97,954 against 9:47,579 and 4:53,226). Q1 offered **no** 9 (Embodiment) option at all — a real psychological gap, not merely a coverage gap: the man who knows exactly which step he is avoiding had no honest way in.
4. **Banned wording (confirmed):** 2 occurrences — `drink-reward/b` ("The first one lands"), `drink-changes/b` ("Things land better").
5. Weight ceiling, evidence-less options, dangling IDs, path length, result-standard completeness: **already clean** (0 each).

## 4. Changes made (instrument only)

**Q1 collision fixes — by adding the secondary evidence the wording already contains:**
- `good` `{2:3}` → `{2:3, 5:1}` — "I know I'll regret it" is a *known* cost, i.e. discernment riding under duality.
- `confidence` `{6:3}` → `{6:3, 8:1}` — being in the room is something he wants to actually receive.
- `routine` `{3:3}` → `{3:3, 4:1}` — the fixed hour is a container as well as a recurrence.

**Q1 reduction 15 → 12,** each removal justified by absorption rather than trimming for its own sake:
- Removed `scared` ("I'm scared to go without it") — its follow-up `drink-without` is shared with `shit`, and its content is explicitly asked again at Q6 `drink-fear`. Fully absorbed.
- Removed `forward` ("something to look forward to") and its follow-up `drink-forward` — `bored` → `drink-bored` asks the same material ("what would fill the same slot tonight") with a cleaner mechanism.
- Removed `well` ("my life is genuinely good and I still want one") and its follow-up `drink-good-life` — duality-under-a-good-life is already carried by `good` and by `plain`, and the "nothing is wrong and I still want it" content survives in `drink-plain-hour`.
- Removed `nothink` ("chewing the same thought since this morning") and its follow-up `drink-nothink` — a thought loop is the *Spiraling* doorway's mechanism; inside Drinking, recurrence is carried by `routine` and by `drink-layer2/c`.

**Availability correction — by adding responses that were psychologically missing, never to fill a quota:**
- New Q1 option `instead`: "There's one thing I said I'd do tonight. The drink is where I go instead of doing it." `{9:3}`, flagged `avoids`, follow-up `drink-bored`. This is the plainest Embodiment presentation of the urge and it had no representation.
- New `drink-layer2/h` `{7:3}`: "Neither, really. It's the hour — and I could be in it without a drink." Tolerated stillness was absent from the shared page-3 question.
- New `drink-layer2/i` `{9:3}`: "What I actually want is to get to tomorrow without paying for tonight."
- New `drink-better/h` `{9:3}`: "Stalled. There's one thing I'd have to actually do tonight for this to shift."

**Banned wording removed:**
- `drink-reward/b` → "The first one does what I want. After that I'm chasing it, and I know the difference."
- `drink-changes/b` → "Everything hits better, and I'd rather carry that into how I actually spend the night."

No scoring code, threshold, formula, meaning, Tree mapping or Undetermined rule was touched. No other branch was touched.

## 5. Mathematical stress test (post-fix, on exported `buildSequence` / `evaluatePattern`)

- Reachable paths walked exhaustively: **999,792**. Page-length violations: **0** (every path exactly 6 pages).
- Reachable questions **25**; reachable options **222**; options exercised **222/222**; uncovered **0**.
- Dangling `followUp` / `next` IDs: **0**. Options exceeding weight 3: **0**. Options with no evidence: **0**.
- Duplicate evidence signatures within any reachable question: **0** (was 3 in Q1).
- Primary distribution: 1:62,915 · 2:89,977 · 3:73,271 · 4:60,546 · 5:97,428 · 6:99,996 · 7:71,157 · 8:67,981 · 9:69,926 — **all nine reachable**. Spread narrowed from 47.6k–109.0k to 60.5k–100.0k; 9 rose from 4.8% to 7.0% of paths.
- Availability by option slots: 1:37 · 2:35 · 3:34 · 4:26 · 5:48 · 6:31 · 7:24 · 8:29 · 9:27 — 1's over-availability reduced from 45 to 37 without inventing responses.
- Undetermined: **30.7%** — legitimate and never forced.
- Determinism: every one of the 999,792 outcomes re-evaluated identically — **0 mismatches**.
- Missing / bogus IDs: empty answer map, bogus choice ID and bogus question ID → no throw, valid result (**0 throws**).
- Back navigation / stale answers (3,000 randomized full paths, each of the 6 pages re-opened in turn): prefix changes **0**, answers surviving outside the active sequence **0**.
- Sensitivity: all 12 Q1 answers reach all nine numbers plus Undetermined depending on later answers — no single answer dictates an outcome, and no number is obtainable only through one answer.
- Whole-branch convergence: 856 Undetermined outcomes sampled from randomized paths, **850 resolved** within ≤3 deeper probes (99.3%); the residual 6 remain honestly Undetermined.
- Result-standard completeness across all 999,792 outcomes: reasoning, next-step (human + carry-forward question + advice) present for every outcome, and core lesson + non-empty pattern summary present for every earned number — **0 failures**.
- TypeScript: clean.

## 6. Banned-wording scan (post-fix)

Scanned every reachable Drinking prompt, note, label and detail plus the shared result copy (`NUMBERS`, `NEXT_STEPS`, `UNDETERMINED_NEXT`) for any form containing `land`: **0 occurrences**. (The two remaining hits in the file are outside Drinking: one label in the hidden `talk` branch and one source comment in shared sequence code.)

## 7. Result standard compliance

Delivered sequence, unchanged from the locked standard: initial doorway question ("You came in with…") → **Your Gabriel Number** → **The clarity you're missing** (core lesson, verbatim) → **Why the pattern led there** (reasoning + per-question contributions) → **What to look at next** (humanized explanation, carry-forward question, practical advice) → supporting threads. Undetermined outcomes state the honest non-result and offer a deeper probe or the option to stop.

## 8. Verdict

**DRINKING: LOCKED.** Post-fix audit passes on every check: 0 collisions, 0 banned wording, 0 dangling IDs, 0 overweight options, 0 length violations, all nine numbers reachable with a materially flatter distribution, Undetermined preserved at 30.7%, deterministic scoring, safe back navigation, and complete result output on every path. Spiraling and all other branches untouched. Imagery remains deferred.

## 9. Response-level mapping — every reachable Drinking option


### `drink-1` — When the urge hits, what sounds so damn appealing about saying “fuck it” and having one?

_Note shown: You already know it's bad for you. You already know the consequences. You already know what tomorrow might feel like. So that's not the question._

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `good` | I know it'll feel good, and I know I'll regret it. Both are true. | 2:3, 5:1 | 2 Duality | drink-reward |
| `better` | I feel bad and I want to feel better. Ask me why I feel bad and I've got nothing. | 1:2, 5:1 | 1 Beginning | drink-better |
| `confidence` | I want to be around people without running a case against myself the whole time. | 6:3, 8:1 | 6 Integration | drink-confidence |
| `calm` | Nothing today had edges. I want something that closes the day out. | 4:3 | 4 Structure | drink-calm |
| `shit` | My body doesn't feel right without it. I want to hear that straight before I decide anything. | 8:3 | 8 Listening | drink-without |
| `routine` | Same hour, same reach, every day. I can see the shape of it. | 3:3, 4:1 | 3 Pattern | drink-routine |
| `myself` | I don't feel like me — and I'm not sure the drinking version is me either. | 2:2, 1:1 | 2 Duality | drink-myself |
| `bored` | Nothing's happening. Part of me knows I could just let the hour be empty. | 7:3 | 7 Staying | drink-bored |
| `escape` | I want out of how I feel. I'm doing that on purpose and I'm not going to call myself weak for it. | 6:3 (avoids) | 6 Integration | drink-escape |
| `instead` | There's one thing I said I'd do tonight. The drink is where I go instead of doing it. | 9:3 (avoids) | 9 Embodiment | drink-bored |
| `plain` | I just fucking want one. I'm not going to build a story on top of it. | 5:3 | 5 Discernment | drink-plain-hour |
| `unclear` | I don't know. That's literally why I'm here. | 1:2 | 1 Beginning | drink-unclear |

### `drink-reward` — How reliable is that good feeling, really?

_Note shown: Not a trick question. Sometimes it delivers._

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Very. Same result every time — I could set my watch by it. | 3:3 | 3 Pattern | drink-layer2 |
| `b` | The first one does what I want. After that I'm chasing it, and I know the difference. | 5:3 | 5 Discernment | drink-layer2 |
| `c` | It works for an hour, then I feel worse — and I still pick it. That's mine. | 6:2, 5:1 | 6 Integration | drink-layer2 |
| `d` | Lately it doesn't work at all, and I've quit pretending it does. | 5:2, 2:1 | 5 Discernment | drink-layer2 |
| `e` | I stopped checking a long time ago. It's automatic now. | 3:2, 1:1 | 3 Pattern | drink-layer2 |
| `f` | I've never actually watched whether it delivers. I'd have to pay attention. | 8:3 | 8 Listening | drink-layer2 |
| `g` | I don't know. | 1:2 | 1 Beginning | drink-layer2 |

### `drink-layer2` — Be honest: is it the drink you want, or the feeling on the other side of it?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | The feeling. The drink is just how I get there — I can tell those two apart. | 5:3 | 5 Discernment | — (final page) |
| `b` | The drink itself. I like it, and I also know where it tends to go. | 2:3 | 2 Duality | — (final page) |
| `c` | The moment around it. Same pause, same hour, every day. | 3:3 | 3 Pattern | — (final page) |
| `d` | The off switch. Not the taste, the off switch — and I'll own that that's what I'm buying. | 6:2, 5:1 (avoids) | 6 Integration | — (final page) |
| `e` | Both, and I've never actually pulled them apart. | 1:2, 3:1 | 1 Beginning | — (final page) |
| `g` | I'd have to stop and hear what I actually want before I answer that. | 8:3 | 8 Listening | — (final page) |
| `h` | Neither, really. It's the hour — and I could be in it without a drink. I just haven't been. | 7:3 | 7 Staying | — (final page) |
| `i` | What I actually want is to get to tomorrow without paying for tonight. | 9:3 | 9 Embodiment | — (final page) |
| `f` | I don't know. | 1:2 | 1 Beginning | — (final page) |

### `drink-lost` — Forget whether drinking is 'good' or 'bad' for a second. If it disappeared from your life tomorrow, what would you actually be losing?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | The physical feeling — and I'd want to know what my body was actually asking for. | 8:3 | 8 Listening | drink-gone |
| `b` | The ritual. Same hour, same shape, every night. | 3:3 | 3 Pattern | drink-gone |
| `c` | The excuse to check out. I'd have to be here instead. | 7:3 (avoids) | 7 Staying | drink-changes |
| `d` | Being in a room without running a case against myself. | 6:3 | 6 Integration | drink-power |
| `e` | The people and the places. Both matter, and only one is about the drink. | 2:3 | 2 Duality | drink-gone |
| `f` | The version of me that shows up after two — while owning that this one is me too. | 2:2, 6:1 | 2 Duality | drink-power |
| `g` | The ability to stop thinking for a while. I know that's what I'm buying. | 5:3 (avoids) | 5 Discernment | drink-changes |
| `h` | The one part of the day with a rule I never break. | 4:3 | 4 Structure | drink-gone |
| `i` | Something I genuinely enjoy — and I want to carry that into a life I actually like. | 9:3 | 9 Embodiment | drink-power |
| `j` | Nothing important. Which tells me the reason is somewhere I haven't looked. | 1:2, 5:1 | 1 Beginning | drink-power |
| `k` | My fear of what happens when I stop. I can name it and still sit here with it. | 7:2, 6:1 | 7 Staying | drink-power |
| `l` | More than I want to admit — and admitting it isn't a confession of guilt. | 6:2, 5:1 | 6 Integration | drink-power |

### `drink-gone` — You wake up tomorrow and the urge is completely gone. Your life otherwise stays exactly the same. What feels weirdest?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | I'd have no idea what to do with that time. That's the first real question. | 1:2, 4:1 | 1 Beginning | drink-missing |
| `b` | Relieved and thrown, both at once. | 2:3 | 2 Duality | drink-want |
| `c` | I'd go looking for another way to feel different. Same reach, new object — I can see the pattern. | 3:3 (avoids) | 3 Pattern | drink-want |
| `d` | Scared, because I know what my body does when I stop — I'd want that heard by someone who knows. | 8:2, 5:1 | 8 Listening | drink-fear |
| `f` | The one thing in the day that was mine, and mine on purpose. | 4:3 | 4 Structure | drink-missing |
| `g` | Pissed — and honest about being pissed instead of performing gratitude. | 6:3 | 6 Integration | drink-consequence |
| `h` | I'd find out the ritual mattered more than the drink ever did. | 3:2, 5:1 | 3 Pattern | drink-missing |
| `i` | I'd miss the version of me that comes out after — and I'd have to be the other one sober. | 6:2, 2:1 | 6 Integration | drink-fear |
| `j` | More money, more time, a better day — and I'd still fucking miss it. Both true. | 2:2, 5:1 | 2 Duality | drink-consequence |
| `k` | I'm more afraid of my life without it than of what it's doing to me — and I can say that and stay in it. | 7:3 | 7 Staying | drink-fear |
| `l` | I'd miss having that hour already decided for me. Without it, I'd have to decide what that hour is for. | 4:2, 1:1 | 4 Structure | drink-missing |
| `m` | I'd do everything the same, just without it. That's the actual next step. | 9:3 | 9 Embodiment | drink-changes |

### `drink-missing` — Wait — what would actually be missing?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Not the time. I'd be doing the same things — I can tell those apart. | 5:3 | 5 Discernment | — (final page) |
| `b` | Something to look forward to. I'd have to make one thing worth it. | 9:3 | 9 Embodiment | — (final page) |
| `c` | The little ritual that says the day started or ended. | 4:2, 3:1 | 4 Structure | — (final page) |
| `d` | The excuse to stop being productive — though I could just stop without one. | 7:3 | 7 Staying | — (final page) |
| `e` | The feeling of being off duty. Same time every night. | 3:3 | 3 Pattern | — (final page) |
| `f` | Something that's just mine — and I can want that without shame about it. | 6:3 | 6 Integration | — (final page) |
| `g` | The comfort of not thinking. I know that's the trade I'm making. | 5:2, 3:1 | 5 Discernment | — (final page) |
| `h` | It's my security blanket. I want it and I don't need it. Both. | 2:3 | 2 Duality | — (final page) |
| `i` | Nothing. I just automatically put drinking in that space. | 3:2, 1:1 | 3 Pattern | — (final page) |
| `j` | I don't know — I'd want to sit and hear the answer instead of filling it in. | 8:2, 1:1 | 8 Listening | — (final page) |

### `drink-want` — Now flip it. If you could keep the parts of your life you actually want, what are you secretly hoping you get back?

_Note shown: Last one._

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | My health — starting with one thing I'd actually do this week. | 9:3 | 9 Embodiment | — (final page) |
| `b` | Being in my own corner instead of building a case against myself. | 6:3 | 6 Integration | — (final page) |
| `c` | My money — I'd draw a line and know what holding it costs. | 4:2, 5:1 | 4 Structure | — (final page) |
| `d` | My mornings, with an actual shape to them. | 4:2, 9:1 | 4 Structure | — (final page) |
| `e` | My people — and actually hearing them when they talk. | 8:2, 2:1 | 8 Listening | — (final page) |
| `f` | Remembering my own life, so I can tell what happened from what I assume happened. | 5:3 | 5 Discernment | — (final page) |
| `g` | Quiet from thinking about this constantly. Same thought, every day. | 3:3 | 3 Pattern | — (final page) |
| `h` | The version of me still in there, alongside this one. Both are me. | 2:3 | 2 Duality | — (final page) |
| `i` | Drinking that doesn't run my life — a limit I'd actually hold to. | 4:3 | 4 Structure | — (final page) |
| `j` | All of it. And I'd start with one piece. | 9:2, 5:1 | 9 Embodiment | — (final page) |
| `k` | I don't want to quit. I want the consequences gone — and I know that's not on offer. | 5:2, 2:1 | 5 Discernment | — (final page) |
| `l` | I don't know yet, and I'd rather hear the answer than pick one. | 8:2, 1:1 | 8 Listening | — (final page) |

### `drink-fear` — Here's the part nobody asks: if drinking disappeared tomorrow, which possibility would scare you the most?

_Note shown: Last one._

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | That I'd actually have to build the life I say I want, one real step at a time. | 9:3 | 9 Embodiment | — (final page) |
| `b` | I might succeed, and I don't know how to be that person. That's genuinely new ground. | 1:3 | 1 Beginning | — (final page) |
| `c` | I'd have to be fully myself with nothing over the top of it — and own that as it is. | 6:3 | 6 Integration | — (final page) |
| `d` | I'd be alone without it. It's my company and it costs me. Both. | 2:3 | 2 Duality | — (final page) |
| `e` | Being seen in a room like that, before I'd said a single word. | 8:2, 6:1 | 8 Listening | — (final page) |
| `f` | I'd fail and relapse — and that would be data, not a sentence. | 6:2, 5:1 | 6 Integration | — (final page) |
| `g` | I couldn't keep it to two. There's no line I've ever actually held. | 4:3 | 4 Structure | — (final page) |
| `h` | I'm scared to even start. That's exactly where I am. | 1:2, 7:1 | 1 Beginning | — (final page) |
| `i` | I'd love being sober and have to face the years — and I can stay with that. | 7:2, 9:1 | 7 Staying | — (final page) |
| `j` | Nothing would change and I'd have to find the real problem — I'd want the two separated. | 5:3 | 5 Discernment | — (final page) |
| `k` | That I don't need a fear story anymore — I'd have to own my part in what comes next. | 6:2, 9:1 | 6 Integration | — (final page) |

### `drink-consequence` — If someone told you this habit could eventually take years from your life, which thought hits harder?

_Note shown: Last one. Reflection, not a verdict._

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Then I want my life — and there's a first move I already know. | 9:3 | 9 Embodiment | — (final page) |
| `b` | I know, and in the moment I don't care. Same moment, every time. | 3:3 | 3 Pattern | — (final page) |
| `c` | I care, and the drink still wins sometimes. Both are true of me. | 2:3 | 2 Duality | — (final page) |
| `d` | Losing my life scares me more than losing the drink — and I can hold that without spiraling out. | 7:2, 9:1 | 7 Staying | — (final page) |
| `e` | Losing the drink scares me more, and I'm not going to hate myself for saying it. | 6:3 | 6 Integration | — (final page) |
| `f` | I understand the risk and it doesn't feel real. I can name the gap between those. | 5:3 | 5 Discernment | — (final page) |
| `g` | I know what I'm risking and still reach for it. That's the line I keep crossing. | 5:2, 6:1 | 5 Discernment | — (final page) |
| `h` | I'd want to sit with that before I answer it. | 8:2, 7:1 | 8 Listening | — (final page) |
| `i` | I don't know yet. | 1:2 | 1 Beginning | — (final page) |

### `drink-changes` — Then what does the drink change about the thing you're already doing?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | It makes boring shit tolerable — though I could tolerate it. | 7:3 | 7 Staying | drink-boredom |
| `b` | Everything hits better, and I'd rather carry that into how I actually spend the night. | 9:3 | 9 Embodiment | drink-want |
| `c` | It makes the boredom easier to avoid. Without it I'd actually have to sit through the boring part — that's the trade. | 7:2, 5:1 (avoids) | 7 Staying | drink-boredom |
| `d` | It gives a shapeless day something to point at. | 4:3 | 4 Structure | drink-inertia |
| `e` | TV, music, food, sex, gaming — all of it hits differently. Two good things at once. | 2:3 | 2 Duality | drink-want |
| `f` | It shuts my head up while I'm doing it. Same as every night. | 3:3 (avoids) | 3 Pattern | drink-boredom |
| `g` | Being alone feels less alone — and I haven't called anyone. | 8:2, 2:1 | 8 Listening | drink-fear |
| `h` | It changes nothing. I want the drink, and I'll own that. | 6:3 | 6 Integration | drink-consequence |
| `i` | It feels wrong to do the thing without it now — which is news to me. | 1:2, 3:1 | 1 Beginning | drink-missing |
| `j` | The activity isn't really the point anymore. The drinking is — and I can tell the difference now. | 5:3 | 5 Discernment | drink-fear |

### `drink-boredom` — If the drink could make one part of that experience disappear, what would you choose?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | The boredom — even though I could sit through it. | 7:3 | 7 Staying | — (final page) |
| `b` | The forecasting about how tomorrow goes. | 5:3 | 5 Discernment | — (final page) |
| `c` | The same loop running in my head. | 3:3 | 3 Pattern | — (final page) |
| `d` | The feeling I'm wasting my life — there's one thing I'd do about that. | 9:3 | 9 Embodiment | — (final page) |
| `e` | The sense I should be elsewhere, with nothing actually scheduled. | 4:3 | 4 Structure | — (final page) |
| `f` | The loneliness. I want people around and I want no demands. Both. | 2:3 | 2 Duality | — (final page) |
| `g` | The pressure to enjoy myself — without making that a failing of mine. | 6:3 | 6 Integration | — (final page) |
| `h` | Nothing. I like being buzzed, and I'm not building a story on it. | 5:2, 2:1 | 5 Discernment | — (final page) |
| `i` | I'd want to hear myself out before picking something to delete. | 8:2, 1:1 | 8 Listening | — (final page) |

### `drink-inertia` — Be honest. Is part of this simply that drinking is easier than doing the thing you know you should do?

_Note shown: Last one._

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Yeah. I take the easier option, and that's mine to own without the beating. | 6:3 | 6 Integration | — (final page) |
| `b` | It's not laziness — I'm exhausted, and I can tell those two apart. | 5:3 | 5 Discernment | — (final page) |
| `c` | I want to move and can't get started. One small thing is the whole ask. | 9:3 | 9 Embodiment | — (final page) |
| `d` | It makes me feel like I'm doing something. Same feeling, every night. | 3:3 | 3 Pattern | — (final page) |
| `e` | I use it as the excuse not to start. First time I've said that out loud. | 1:2, 6:1 | 1 Beginning | — (final page) |
| `f` | I know exactly what I should be doing and I don't want to. Both true. | 2:3 | 2 Duality | — (final page) |
| `g` | No — I get plenty done while I drink, and I won't pretend otherwise. | 5:2, 2:1 | 5 Discernment | — (final page) |
| `h` | That's not what's happening. My day has no structure — that's the real issue. | 4:3 | 4 Structure | — (final page) |
| `i` | Maybe. I'd rather sit with that question than answer it fast. | 7:2, 8:1 | 7 Staying | — (final page) |

### `drink-power` — Be honest. Which one has more power over you right now?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | The life I'm actually building — and I know what the next step in it is. | 9:3 | 9 Embodiment | drink-want |
| `b` | The life I get when I drink. Both are mine; that's the problem. | 2:3 | 2 Duality | drink-fear |
| `c` | The fear of what happens if I stop — and I can sit with that fear tonight. | 7:3 | 7 Staying | drink-fear |
| `d` | Not having to decide. No rule, no decision, nothing to hold. | 4:2, 3:1 | 4 Structure | drink-inertia |
| `e` | It changes depending on the fucking day — and I can see which days are which. | 3:3 | 3 Pattern | drink-consequence |
| `f` | Neither, until I know what I'm actually choosing between. I'm not calling it a want before then. | 5:3 | 5 Discernment | drink-consequence |
| `g` | The drink, and I know what that costs me — I can own it without making myself the villain. | 6:3 | 6 Integration | drink-want |
| `h` | I can't answer that yet. I'd have to stop and hear what the other side of it is first. | 8:3 | 8 Listening | drink-fear |
| `i` | I honestly don't know which one has more power. That's the thing I'm trying to find out. | 1:2, 5:1 | 1 Beginning | drink-fear |

### `drink-better` — Better than what, though? What's the current setting?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Wired — and I know everything looks worse than it is when I'm like this. | 3:2, 5:1 | 3 Pattern | drink-layer2 |
| `b` | Flat. Nothing much at all, and I've never asked why that is. | 1:2, 8:1 | 1 Beginning | drink-layer2 |
| `c` | Sad. I could sit in it tonight if I decided to. | 7:3 | 7 Staying | drink-layer2 |
| `d` | Angry — at something I haven't actually let the other person finish saying. | 8:3 | 8 Listening | drink-layer2 |
| `e` | Lonely. I want company and I want to be left alone. Both. | 2:3 | 2 Duality | drink-layer2 |
| `f` | Fine, honestly. Better would just be better — that's the whole of it. | 5:2, 2:1 | 5 Discernment | drink-layer2 |
| `h` | Stalled. There's one thing I'd have to actually do tonight for this to shift. | 9:3 | 9 Embodiment | drink-layer2 |
| `g` | I can't name it. That's the honest answer. | 1:2 | 1 Beginning | drink-layer2 |

### `drink-confidence` — Confidence to do what?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Be in the room without narrating everything I'm doing wrong. | 6:3 | 6 Integration | drink-layer2 |
| `b` | Get through the day. I need something with edges to get me there. | 4:3 | 4 Structure | drink-layer2 |
| `c` | Say what I think — after I've actually heard what they said. | 8:3 | 8 Listening | drink-layer2 |
| `d` | Stop running the same loop about how it's going to go. | 3:3 | 3 Pattern | drink-layer2 |
| `e` | Hold that I'm decent and that I screwed up, at the same time. | 2:3 | 2 Duality | drink-layer2 |
| `f` | Do the one thing I've been putting off. The actual next step. | 9:3 (avoids) | 9 Embodiment | drink-layer2 |
| `g` | I don't know. I just notice I feel different when I drink. | 1:2, 3:1 | 1 Beginning | drink-layer2 |

### `drink-calm` — What's got you wound up?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Work, money, logistics. None of it has a container. | 4:3 | 4 Structure | drink-layer2 |
| `b` | Something a person said — and I answered before I'd heard the end of it. | 8:3 | 8 Listening | drink-layer2 |
| `c` | Too many small things stacked up. Same stack as last week. | 3:3 | 3 Pattern | drink-layer2 |
| `d` | My own head — and I know my head lies to me when I'm this tight. | 5:2, 3:1 | 5 Discernment | drink-layer2 |
| `e` | Something unresolved. There's one step in it I'm not taking. | 9:3 (avoids) | 9 Embodiment | drink-layer2 |
| `f` | Nothing external. My body's switched on, and I can stay in it. | 7:3 | 7 Staying | drink-layer2 |
| `g` | No idea, and I'd rather say that than invent a reason. | 5:2, 1:1 | 5 Discernment | drink-layer2 |

### `drink-without` — When you picture going without it, what shows up first?

_Note shown: No diagnosis here, and nothing you say gets turned into advice._

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | My body. And I'd want to listen to it instead of overruling it. | 8:3 | 8 Listening | drink-layer2 |
| `b` | I could get sick without it. That's a real line, not a feeling. | 5:3 | 5 Discernment | drink-layer2 |
| `c` | The hours. I'd need to put something in them on purpose. | 4:3 | 4 Structure | drink-layer2 |
| `d` | Everything I've not been feeling arrives at once — and I could sit in that for a night. | 7:3 (avoids) | 7 Staying | drink-layer2 |
| `e` | I'd probably cave — and I'd rather look at that than call myself weak. | 6:3 | 6 Integration | drink-layer2 |
| `f` | It would tell me something true I've never asked about. | 1:2, 8:1 | 1 Beginning | drink-layer2 |
| `g` | One night without it. That's the only step I'd commit to. | 9:3 | 9 Embodiment | drink-layer2 |
| `h` | I honestly don't know. | 1:2 | 1 Beginning | drink-layer2 |

### `drink-routine` — If you woke up tomorrow and the routine simply wasn't there, what would feel weirdest?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Nothing would mark the end of the day. | 4:3 | 4 Structure | drink-routine-2 |
| `b` | My hand would still reach at the same hour. | 3:3 | 3 Pattern | drink-routine-2 |
| `c` | I'd have to decide what goes there, and I've never decided that. | 1:2, 4:1 | 1 Beginning | drink-routine-2 |
| `d` | Something would feel missing — and I could let it feel missing. | 7:3 | 7 Staying | drink-routine-2 |
| `e` | I'd see how much of my day was built around it. A relief and a loss at once. | 2:3 | 2 Duality | drink-routine-2 |
| `f` | I'd cave later — and that's information, not a verdict on me. | 6:3 | 6 Integration | drink-routine-2 |
| `g` | I'd be fine. I can tell the difference between weird and hard. | 5:3 | 5 Discernment | drink-routine-2 |
| `h` | Honestly, I don't know. | 1:2 | 1 Beginning | drink-routine-2 |

### `drink-routine-2` — How much of it is the hour, and how much of it is you?

_Note shown: Both directions count. This isn't a nudge to stop._

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Mostly the hour. Same time, every time. | 3:3 | 3 Pattern | drink-layer2 |
| `b` | Mostly the day I've had — though I've never checked whether that's actually true. | 8:2, 5:1 | 8 Listening | drink-layer2 |
| `c` | Mostly who I'm with. It's two things at once: them and me. | 2:3 | 2 Duality | drink-layer2 |
| `d` | It's the marker. It ends the day. | 4:3 | 4 Structure | drink-layer2 |
| `e` | It's me. And I can say that without building a case against myself. | 6:3 | 6 Integration | drink-layer2 |
| `f` | I've never separated them. That's the first honest thing here. | 1:2, 5:1 | 1 Beginning | drink-layer2 |

### `drink-myself` — When you say “more like myself,” which version of you are you missing?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | The one who wasn't running a case against himself all day. | 6:3 | 6 Integration | drink-myself-2 |
| `b` | The social one — actually with people, not just near them. | 2:2, 8:1 | 2 Duality | drink-myself-2 |
| `c` | The one who could sit still and be fine. | 7:3 | 7 Staying | drink-myself-2 |
| `d` | The one who didn't run the same loop for hours. | 3:3 | 3 Pattern | drink-myself-2 |
| `e` | The one who said the true thing out loud, after hearing the room. | 8:3 | 8 Listening | drink-myself-2 |
| `f` | The one who kept a couple of promises to himself. | 4:2, 9:1 | 4 Structure | drink-myself-2 |
| `g` | The one who did the next thing instead of planning it. | 9:3 | 9 Embodiment | drink-myself-2 |
| `h` | I don't know which version. I just know I miss it. | 1:2 | 1 Beginning | drink-myself-2 |

### `drink-myself-2` — When was that version last around, without a drink involved?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Recently. It comes and goes on a rhythm I can almost see. | 3:3 | 3 Pattern | drink-layer2 |
| `b` | A while ago, and I know roughly what changed. I can name the line. | 5:3 | 5 Discernment | drink-layer2 |
| `c` | Years. I'd be starting from nothing here. | 1:3 | 1 Beginning | drink-layer2 |
| `d` | Only when the things around me had some structure to them. | 4:3 | 4 Structure | drink-layer2 |
| `e` | Only around certain people — I hear myself differently with them. | 8:2, 2:1 | 8 Listening | drink-layer2 |
| `f` | Both versions might be me. I've stopped ranking them. | 2:3 | 2 Duality | drink-layer2 |
| `g` | I can't remember, and I'm not going to invent an answer. | 5:2, 1:1 | 5 Discernment | drink-layer2 |

### `drink-bored` — What would fill the same slot tonight, if the drink were off the table?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Plenty of things — I just default here, same as always. | 3:3 | 3 Pattern | drink-layer2 |
| `b` | Company. It's people I want, and I'd have to actually ask someone. | 2:2, 8:1 | 2 Duality | drink-layer2 |
| `c` | I could let the slot stay empty. Boring isn't an emergency. | 7:3 | 7 Staying | drink-layer2 |
| `d` | Something I'd have to plan, which is exactly the problem. | 4:3 | 4 Structure | drink-layer2 |
| `e` | One small thing I'd actually do tonight. | 9:3 | 9 Embodiment | drink-layer2 |
| `f` | Screens. Same slot, same reach, different object — I can see that. | 3:2, 5:1 | 3 Pattern | drink-layer2 |
| `g` | I don't know. | 1:2 | 1 Beginning | drink-layer2 |

### `drink-escape` — What's the feeling you'd be getting away from?

_Note shown: Naming it here doesn't obligate you to do anything about it._

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Anxiety — and I can't yet tell real risk from forecast. | 5:3 | 5 Discernment | drink-layer2 |
| `b` | Sadness. I could stay in it tonight if I chose to. | 7:3 | 7 Staying | drink-layer2 |
| `c` | Shame. I did the thing; I don't have to keep sentencing myself for it. | 6:3 | 6 Integration | drink-layer2 |
| `d` | Anger — at someone I haven't let finish a sentence. | 8:3 | 8 Listening | drink-layer2 |
| `e` | Loneliness. I want people and I want nobody. Both. | 2:3 | 2 Duality | drink-layer2 |
| `f` | Dread about something coming. There's one step that would shrink it. | 9:3 | 9 Embodiment | drink-layer2 |
| `g` | Emptiness. Same hour, most nights. | 3:3 | 3 Pattern | drink-layer2 |
| `h` | I feel it and I can't name it. That's where I'm starting. | 1:2 | 1 Beginning | drink-layer2 |

### `drink-plain-hour` — Okay. Fair enough. If you got exactly what you want from that drink, what would you want the next hour to feel like?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | Easier — with something in it that has edges. | 4:3 | 4 Structure | drink-layer2 |
| `b` | Actually enjoyed, and carried into tomorrow instead of paid for. | 9:3 | 9 Embodiment | drink-layer2 |
| `c` | Quieter than the loop that's been running all day. | 3:3 | 3 Pattern | drink-layer2 |
| `d` | Me in the room without the running commentary about myself. | 6:2, 2:1 | 6 Integration | drink-confidence |
| `e` | Not boring — though I could sit through boring if it came to it. | 7:3 | 7 Staying | drink-layer2 |
| `f` | Less loaded. I know that's what I'm asking the drink to do. | 5:2, 6:1 (avoids) | 5 Discernment | drink-layer2 |
| `g` | With people, and me listening instead of performing. | 8:3 | 8 Listening | drink-layer2 |
| `h` | Normal — holding what's off and what's fine at the same time. | 2:3 | 2 Duality | drink-layer2 |
| `i` | I don't care how I feel. I want the drink and I'm not dressing it up. | 5:2, 2:1 | 5 Discernment | drink-layer2 |
| `j` | I have no idea. | 1:2 | 1 Beginning | drink-layer2 |

### `drink-unclear` — Then let's start smaller. When did you first notice the pull today?

| Choice | Response (verbatim) | Evidence | Primary meaning | Next |
|---|---|---|---|---|
| `a` | When the day stopped moving. Same as most days. | 3:3 | 3 Pattern | drink-layer2 |
| `b` | Right after something specific happened — and there's a piece of it I haven't dealt with. | 9:2, 5:1 (avoids) | 9 Embodiment | drink-layer2 |
| `c` | Around other people, before I'd really heard anything anyone said. | 8:3 | 8 Listening | drink-layer2 |
| `d` | Low all day. I noticed it and left it alone. | 7:3 | 7 Staying | drink-layer2 |
| `e` | The second the day had nothing scheduled in it. | 4:3 | 4 Structure | drink-layer2 |
| `f` | I can't place it, and I'm not going to guess. | 5:2, 1:1 | 5 Discernment | drink-layer2 |
| `g` | No idea. That's the honest first answer. | 1:2 | 1 Beginning | drink-layer2 |
