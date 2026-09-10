# INTERNAL RESEARCH ARTIFACT — Question-Language Audit
**Date:** 2026-09-10 · **Scope:** research only · **Code changed:** none

Audit of the CURRENT active state (all 11 temporarily selectable branches, the universal
avoidance branch, the shared closing questions, the 8 deeper probes, and the Deep Reading
formulations 1–9). Nothing in this document was applied to production. No question, weight,
threshold, branch graph, or UI string was modified. Prepared for later comparison against
Sydell's qualitative feedback.

## Category key

- **G — Genuine Gabriel/Sarah language.** Helps the person recognise what they are actually
  experiencing. Names something they have not said to themselves rather than asking them to
  file themselves into a category.
- **F — Functional question.** Real evidence value, clean and honest, but interchangeable with
  a well-written generic reflective prompt. Not yet distinctly Gabriel.
- **C — Conventional / screening-like.** Risks reading as checklist, intake form, or
  self-classification.
- **D — Strong candidate for deeper-layer rewrite.** Reason given; **no rewrite performed.**

Information dimension abbreviations: BEH behavior · CON consequence · AWA awareness ·
INT interpretation · RES responsibility · CTR contradiction · AMB ambivalence · PAT pattern ·
FN function-of-behavior (what it organizes/displaces) · ORI origin/trigger · STK stake.

---

## 1. Cross-cutting findings (the headline)

**1.1 The single strongest asset in the whole instrument is the fact/story separation.** Four
questions carry it explicitly and well: `happened-1` ("Can you say what happened without saying
what it meant?"), `loop-1` ("by what happens, rather than what it means about you"),
`fury-under` ("Say only what you actually saw or heard. How much of the fury is that part?"),
and `spiral-known` (note: "Just the line between what happened and what you've filled in").
`fury-under` is the best-executed instance in the app: it asks for the fact, then asks for a
*proportion*, which is a genuinely different act from choosing a label.

**1.2 Awareness is tested without being punished — mostly by design, and it holds.** Every
question carries a real "I don't know / can't tell / haven't looked" option carrying weight to
1 Beginning. That is the correct architectural decision and it is applied consistently: 45+
questions, no exceptions found. `lost-unknown` ("Then start smaller — what's true in the last
hour?") is the strongest example of not-knowing being met with a smaller question instead of a
penalty. `spiral-unknown` and `drink-unclear` do the same. **No question treats non-awareness as
evasion.**

**1.3 Ambivalence and contradictory truth are supported at option level, thinly at prompt
level.** Options that hold two truths at once exist and are well-written: `fury-crossed-hurt/e`
("I'm hurt and I'm furious, and neither is fake"), `drink-habit-4/c` ("Both feel real, and
that's the whole tension"), `chance-regret/c`, `chance-split/a`. But only **two** prompts in the
entire app are *built* to hold contradiction rather than offer it as one option among five:
`chance-split` ("Can you name both halves without picking a winner?") and `drink-habit-4`
("Which feels more true right now?" + note "Neither answer is the right one"). Everywhere else,
ambivalence competes with single-truth options and usually loses to whichever is loudest.
**This is the largest structural gap between the framework's stated commitment to contradictory
truths and what the questions actually do.**

**1.4 Function-of-behavior (FN) is the DRINK branch's discovery and has not been generalised.**
`drink-habit-1` ("What does the routine give you?"), `drink-habit-2` ("If you didn't do the
routine, what might you have to experience instead?"), and `drink-bored` ("What would fill the
same slot as the drink tonight?") are the only questions in the app that ask what a behavior is
*organizing or displacing*. This is the most Gabriel-distinct question form in the instrument.
It appears in one branch, on one path (`routine`/`bored`), and nowhere else — not in GAMBLE, not
in LOOP, not in SURPRISE.

**1.5 Recognition of consequence vs recognition of pattern is under-separated.** The app is good
at consequences of a *decision* (`fury-power` "who ends up paying for it?", `chance-lose` "What
exactly would be at risk?", `drink-habit-3` "What else might change?"). It is weak at the
distinction between *"I can see what this costs"* and *"I can see the shape that keeps producing
the cost."* `loop-2` ("What's different about the times it doesn't happen?") is the one question
that reaches for the pattern layer proper, and it is in a thin branch. `spiral-stuck` and
`happened-2` measure duration and repetition, which is pattern-adjacent but not the same as
recognising a mechanism.

**1.6 Verdict-avoidance is deliberate and largely successful.** Explicit anti-verdict notes are
present: "Contribution, not verdict" (`happened-3`, `deep-part`), "No assumption here that
anything is wrong" (`drink-1`), "Not looking for a hidden problem" (`drink-well`), "No judgment
here. Sometimes it's just a good mood" (`gamble-1`), "Not an accusation" (`u1`), "Wanting it
isn't doing it" (`fury-want`), "This isn't a nudge to stop" (`drink-habit-3`), "Neither answer is
the right one" (`drink-habit-4`), "Not asking you to drop it. Asking where it goes"
(`fury-close`). This is the clearest signature of Sarah's voice in the codebase and it is doing
real protective work.

**1.7 The rule "a response does not automatically equal a Gabriel Number" is preserved in the
engine but weakly expressed in the language.** Structurally it holds: evidence is small-weight,
normalised by availability, gated by `MIN_PRIMARY_WEIGHT`/`MIN_LEAD`, and can return
Undetermined. However, several single choices are decisive in short branches — a 3-weight
option on a 5-question path with heavy shared-question overlap can effectively determine the
outcome. `well` (27 options), `happened` (22 options), `gamble`, `surprise` are the exposed
cases. **Language risk:** nothing in the question copy signals that one answer is not the
verdict; the safeguard lives only in the maths and the framing note.

**1.8 The shared closing questions dilute branch voice.** `c1` (G, strong), `c2` (F), `c3` (F/C).
Thin branches are majority-shared pages (`surprise` 4 of 5). A person who enters through
SURPRISE or WELL experiences mostly generic closing language, so the distinctly Gabriel voice
is concentrated in FIRE, DRINK, SPIRAL and CHANCE and near-absent in the restored branches.

---

## 2. Branch-by-branch audit

### 2.1 FIRE — "I'm fucking furious about what happened" (6 pages, fixed length)

The most Gabriel-consistent branch in the app.

| Question | Cat | Gathering | Notes |
|---|---|---|---|
| `fire-1` "What kind of furious is this?" (note: "Anger is information and force. We're finding what it's pointing at.") | **G** | STK, INT, PAT | Nine options that are all *recognitions*, not categories. `hurt` ("Underneath it I'm hurt, and the anger is easier to hold") and `blank` ("I'm this angry and I couldn't tell you which part did it") are the two best-written options in the app. |
| `fury-crossed-trust` "What did they actually cross?" | **G** | BEH→STK | "actually" carries the fact/story work. `e` ("what they didn't do when it counted") captures omission, which most instruments miss. |
| `fury-crossed-line` "Which line got crossed?" | **G** | RES, PAT | `b` ("A line I assumed was obvious and never said") is a self-implicating option offered without accusation — model behavior. `c` reaches PAT. |
| `fury-crossed-fair` "What is the anger standing guard over?" | **G** | STK, FN | Closest thing outside DRINK to asking what the state is *organizing*. |
| `fury-crossed-power` "What got taken off you in that moment?" | **G** | STK, AWA | `e` ("Nothing was taken. I gave it away by going quiet") is RES without prosecution. |
| `fury-crossed-hurt` "What is the anger standing in front of?" | **G** | FN, CTR | The app's clearest displacement question. `e` holds both truths. |
| `fury-under` "Say only what you actually saw or heard. How much of the fury is that part?" | **G** | BEH vs INT, proportional | Best fact/story instrument in the app. Asks for a ratio, not a label. |
| `fury-want` "What do you want to happen?" (note: "Wanting it isn't doing it.") | **G** | STK, AMB | Permits raw wanting without moralising. `f` ("I want it undone, and I know that isn't on the table") is CTR-holding. |
| `fury-power` "If you did the thing you most want to do right now, who ends up paying for it?" | **G** | CON | Consequence recognition, cleanly separated from the wanting. `g` ("Right now I don't care. That's the honest answer") is permitted — correct. |
| `fury-close` "The anger is yours and it's force. Where are you putting it?" | **G** | RES, next step | Note "Not asking you to drop it" is the single best de-escalation line in the app. `h` ("Nowhere yet… not deciding anything while it's this loud") is a legitimate non-answer. |

**D candidates in FIRE:** none urgent. The one gap: FIRE never asks whether this anger has a
*history* separate from this event (PAT). `fire-1/again` gestures at it, then the path moves to
what was crossed. A pattern-layer probe is missing.

### 2.2 DRINK — "I feel like I want a drink and I don't know why"

Second-strongest branch, and the site of the FN discovery.

| Question | Cat | Gathering | Notes |
|---|---|---|---|
| `drink-1` "Which is closest to the strange part?" (note: "No assumption here that anything is wrong.") | **G** | AWA, ORI | Frames the *urge's strangeness* rather than the drinking. `well`/`good` options ("life is going well, so I don't understand the urge") are distinctly Gabriel — most instruments never ask this. |
| `drink-well` "What feels hardest to simply experience right now?" | **G** | FN | Displacement of positive states. Rare and valuable. |
| `drink-stress` "Where is the stress actually coming from?" | **F** | ORI | Useful, generic. |
| `drink-bored` "What would fill the same slot as the drink tonight?" | **G** | FN | "Same slot" is functional-substitution language and it is excellent. |
| `drink-change` "What do you want to feel instead?" (note: "Not why. Just which direction.") | **G** | FN, STK | `g` ("Less aware of myself") is the most honest option in the branch. |
| `drink-happened` "What's the part you'd rather not think about?" | **G** | FN, AWA | `e` ("I'd rather not name it here either") permits refusal without penalty — correct. |
| `drink-plain` "Fair. What's the drink connected to, if anything?" | **G** | PAT, ORI | The word "Fair." doing real work: the person's "nothing happened" is accepted, then explored. |
| `drink-unclear` "When did you first notice the pull today?" | **F/G** | ORI | Good, slightly clinical framing ("the pull"). |
| `drink-habit-1` "What does the routine give you?" | **G** | FN | Core FN question. |
| `drink-habit-2` "If you didn't do the routine, what might you have to experience instead?" | **G** | FN, AWA | The deepest question in the app. |
| `drink-habit-3` "What else might change if the routine changed?" (note: "Both directions count. This isn't a nudge to stop.") | **G** | CON | Consequence recognition without prescription. 12 options, both-direction. |
| `drink-habit-4` "Which feels more true right now?" (note: "Neither answer is the right one.") | **G** | AMB, CTR | One of only two prompts *built* for ambivalence. |

**Useful for the addiction/compulsive-pattern research direction (already present):**
- Function/displacement (`drink-habit-1/2`, `drink-bored`, `drink-well`, `drink-change`).
- Routine/automaticity as a distinct entry (`routine` → habit chain).
- Positive-state discomfort as a trigger — unusual and valuable.
- Both-directions consequence inventory without a stop-nudge (`drink-habit-3`).
- Permission to refuse to name (`drink-happened/e`, `drink-habit-4/e`).
- Ambivalence held as tension rather than resolved (`drink-habit-4/c`).

**Missing for that direction (recorded, not built):**
- **Escalation / tolerance**: nothing asks whether the amount, frequency, or occasion has moved.
- **Control-attempt history**: nothing asks about prior attempts to limit and what happened —
  the CON→PAT bridge is absent.
- **Consequence already incurred**: `drink-habit-3` asks about *hypothetical* future change;
  nothing asks what has already cost something. This is the sharpest gap.
- **Post-behavior state**: nothing asks what happens *after* — relief, regret, blank, both.
- **Concealment / narrative management**: nothing about what is said to others about it.
- **Contradiction between stated reason and observed occasion**: the engine cannot currently
  notice that someone said "routine, nothing more" and also chose "less aware of myself".
- **Compassion floor**: DRINK has no equivalent of FIRE's `fury-close` — no closing question
  that returns agency to the person after the habit chain.

### 2.3 GAMBLE — "I'm feeling lucky — should I gamble?" (2 own questions)

| Question | Cat | Gathering | Notes |
|---|---|---|---|
| `gamble-1` "Where's the lucky feeling coming from?" (note: "No judgment here. Sometimes it's just a good mood.") | **F/G** | ORI, INT | Good non-judgment framing; option set is thin. `c` ("I'm behind and want to catch up") is the only compulsive-pattern signal in the branch and it carries a single `avoids` flag. |
| `gamble-2` "Do you have a number you've already decided on?" | **C / D** | BEH, RES | **Conventional/screening-like.** This is a responsible-gambling limit-setting item, near-identical to standard screening instruments. It gathers real behavioral evidence but it classifies rather than reveals. `b` ("Yes, but I've moved it before") is the one genuinely revealing option — and it is buried inside a checklist frame. |

**D candidate — `gamble-2`.** Why: the prompt's psychological subject is *the relationship
between a limit and the self who set it*, but the question form ("do you have a number?") turns
that into a yes/no compliance check. The interesting information — what happens *at* the line,
who moves it, and what the moving is for — is inaccessible from this frame. Also: the branch's
whole tone is "playful, but let's be honest about it" while `gamble-2` is administrative. Do not
rewrite yet.

**Useful for the addiction/compulsive research direction (already present):** chasing as a named
motive (`gamble-1/c`); boredom-driven action-seeking (`d`); the limit-movement admission
(`gamble-2/b`); the framing that a good mood may genuinely be just a good mood.

**Missing (recorded, not built):**
- Everything DRINK is missing, plus:
- **Chasing mechanics**: nothing distinguishes "I want to win" from "I want to be even" from
  "I want to be in the action". `c` collapses all three.
- **What the near-miss/loss does** — the single most researched mechanism in gambling and
  entirely absent.
- **What the money represents** (STK) — no `chance-lose` equivalent here, despite CHANCE having
  exactly that question.
- **Time/absorption as the payoff** rather than money (FN) — no `drink-habit-1` equivalent.
- **Contradiction detection between "good mood" and "behind and catching up"**.
- GAMBLE has **no fact/story question at all** and no closing agency question. Compared to FIRE
  and DRINK it is structurally a stub, and its two own questions leave the branch majority-shared
  (3 of 5 pages generic).

### 2.4 SPIRAL — "My brain is spiraling"

| Question | Cat | Gathering | Notes |
|---|---|---|---|
| `spiral-1` "What is it actually doing right now?" | **G** | BEH of cognition | Asks for the *operation* the mind is running, not for a diagnosis of it. Distinctly Gabriel. |
| `spiral-known` "What's actually known?" (note: "Just the line between what happened and what you've filled in.") | **G** | BEH vs INT | Core fact/story instrument. |
| `spiral-replay` "What does the replay keep landing on?" | **G** | PAT, INT | `e` ("It doesn't land anywhere, it just runs") is honest and useful. |
| `spiral-predict` "How likely is the thing you're predicting, really?" | **F/C** | INT | Probability estimation is a cognitive-therapy move; `c` ("Unlikely, and I know that and it doesn't help") rescues it by refusing the implication that knowing helps. |
| `spiral-meant` "What are you working from?" | **G** | BEH vs INT | Excellent — makes the evidence base visible (words / tone / reply latency / silence / someone else's pattern). |
| `spiral-reassure` "What happens when you get the reassurance?" | **G** | FN, PAT | Function of a behavior. Should be the model for GAMBLE. |
| `spiral-unsolvable` "What would have to happen for it to be answerable?" | **G** | AWA, STK | Locates the unresolved layer rather than calling the whole thing unclear. |
| `spiral-jump` "Do the problems have anything in common?" | **F/G** | PAT | `e` ("I've never lined them up to check") is good non-punitive AWA. |
| `spiral-stuck` "How long has that one thought been running?" | **C** | duration | **Duration-of-symptom item.** Reads like an intake question. Real evidence value, minimal recognition value. |
| `spiral-unknown` "What was happening right before it started?" | **F** | ORI | Antecedent-hunting; useful, conventional. |

**D candidate — `spiral-stuck`.** Why: the psychological subject is not elapsed time, it is
whether the thought has *become a resident* — whether the person has organised around it. Time
buckets ("Since today / A few days / Weeks or longer") measure the symptom, not the relationship
to it. Also the only question in SPIRAL with no not-knowing-met-with-a-smaller-question path.

### 2.5 CHANCE — "Should I take a chance?"

| Question | Cat | Gathering | Notes |
|---|---|---|---|
| `chance-1` "What kind of chance is it?" | **F** | domain classification | Genuinely a classifier — it sorts the chance into a life domain. Legitimate as a router, not a recognition. |
| `chance-2` "What makes you hesitate?" | **G** | AMB, AWA, RES | Very strong option set. `permission` ("I know the risk; I just want permission"), `excuse-do`, `excuse-not` are self-aware options offered without shame. |
| `chance-regret` "Which regret is bigger, if you're honest?" | **G** | AMB, CON | "if you're honest" earns the answer rather than demanding it. |
| `chance-info` "Is the missing information gettable?" | **G** | AWA, RES | `e` ("I've been saying I need more info for a while") is the app's cleanest self-caught avoidance option. |
| `chance-opinion` "Whose reaction are you actually picturing?" | **G** | INT, PAT | `c` ("Someone who isn't in my life anymore") is a genuine recognition. |
| `chance-lose` "What exactly would be at risk?" | **G** | STK, CON | "exactly" does fact/story work. |
| `chance-permission` "If nobody would ever know either way, what would you do?" | **G** | RES, STK | Removes audience to expose the actual want. `d` ("Not do it — which tells me something") lets the person draw their own conclusion. |
| `chance-split` "Can you name both halves without picking a winner?" | **G** | CTR, AMB | One of two prompts built for contradiction. Model for the rest of the app. |
| `chance-timing` "What would make the timing right?" | **G** | AWA, RES | `d` ("'timing' might be the excuse") — self-caught, not accused. |

**D candidates:** `chance-1` only, and low priority — it is doing router duty honestly.

### 2.6 Restored pilot branches — evaluated as-is, no repair

**LOST** — "I don't know what the hell to do today"
- `lost-1` "Which one is closest?" — **F/G**. Nine options, several genuinely recognising
  (`should`, `avoid`, `okay` "strangely uncomfortable because everything is going okay"). The
  prompt itself is a pure classifier.
- `lost-many` "What makes choosing hard?" — **G**. `d` ("One of them is the real one and I keep
  skipping it") is strong.
- `lost-should` "What's the honest reason you don't want to do it?" — **G**. `f` ("No reason. I
  just don't want to") legitimately permitted.
- `lost-restless` "What does the restlessness want?" — **G**. FN framing.
- `lost-stim` "Stimulating how?" — **F**. Thin.
- `lost-avoid` "What kind of thing is it?" — **F**. Taxonomic; `f` ("I know it's there and I
  won't name it yet") is the redeeming option.
- `lost-tell` "If someone told you what to do, what would that give you?" — **G**. FN. `b`
  ("Someone else to blame if it's wrong") is honest without accusation.
- `lost-spont` / `lost-okay` — **F/G**. `lost-okay/b` ("I don't know who I am without a problem")
  is a real recognition.
- `lost-unknown` "Then start smaller — what's true in the last hour?" — **G**. Best handling of
  not-knowing in the app.
- **D candidates:** `lost-stim`, `lost-avoid` — both taxonomies where a function question belongs.

**TALK** — "I want to talk to someone but don't know if now is right"
- `talk-1` "What do you want out of the conversation?" — **G**. `e` ("To get it over with") flagged
  `avoids` — appropriate.
- `talk-2` "Have you said the important part out loud to them, or only in your head?" — **G**.
  Sharp BEH/INT separation; `b` ("Part of it, sideways") is excellent.
- `talk-3` "If they answered in a way you didn't expect, what would you do?" — **G**. Hypothetical
  probe of listening capacity; `d` ("Honestly, react") permitted.
- **D candidates:** none. TALK's language quality is high; its weakness is length (3 own
  questions, 2–3 shared pages) not voice.

**WELL** — "Everything's going really well and I'm not used to that"
- `well-1` "What does the good stretch feel like from the inside?" — **G**. "from the inside" is
  Sarah's voice. `c` ("Undeserved") is a real recognition.
- `well-2` "What do you usually do when things are calm?" — **G**. PAT + FN.
- **Note:** best voice-per-question ratio of the thin branches, and only 27 options total. Its
  problem is coverage, not language.

**WHAT HAPPENED** — "Something happened and I can't stop thinking about it"
- `happened-1` "Can you say what happened without saying what it meant?" — **G**. Core instrument.
- `happened-2` "When it replays, does anything change?" — **G**. PAT; `b` ("The wording changes,
  not the content") is a genuine discrimination.
- `happened-3` "What's your part in it?" (note: "Contribution, not verdict.") — **G**. RES without
  prosecution; `b` ("I can name it and then I don't stop") is the app's best over-accountability
  option.
- **Recorded defect (pre-existing, not a language issue):** this branch can never produce 8 —
  its only 8-heavy option lives on `c3`, which the branch is too long to reach.

**LOOP** — "The same thing keeps happening again"
- `loop-1` "Can you describe it by what happens, rather than what it means about you?" — **G**.
  Fact/story at the identity layer, which is the hardest version.
- `loop-2` "What's different about the times it doesn't happen?" — **G**. The app's only true
  exception-hunting question and its strongest PAT instrument. `e` ("I've never looked at the
  exceptions") non-punitive.
- `loop-3` "What have you tried, and what did it change?" — **G**. The CON→PAT bridge that DRINK
  and GAMBLE lack. **This question form is what the addiction direction needs.**
- **Note:** LOOP is language-rich and structurally starved (3 own questions). The audit's clearest
  cross-branch recommendation for later: `loop-2` and `loop-3` are the missing DRINK/GAMBLE
  questions and already exist in Sarah's voice.

**SURPRISE** — "Take a chance — pick for me"
- `surprise-1` "Fine. What's the first true thing about today?" — **G**. "Fine." is voice. `a`
  ("I'm carrying something and pretending I'm not") is a strong recognition.
- **Note:** 1 own question, 4 of 5 pages shared. A person entering here mostly experiences
  generic closing language. Category for the branch *as experienced*: **F**, despite a G opener.

### 2.7 Universal avoidance branch

- `u1` "What are you trying not to experience right now?" (note: "Not an accusation. Sometimes the
  honest answer is that you aren't avoiding anything.") — **G**. The note is doing critical work:
  the question is only asked when the person's own answers pointed that way, and the copy still
  refuses to assume. `u1-enjoy` ("Honestly nothing. I'm enjoying myself") is a genuine exit.
- `uf-discomfort` "Where does the discomfort actually sit?" — **G**. Somatic/relational/task
  localisation; `e` ("I can't locate it") permitted.
- `uf-conversation` "What's the harder part of it?" — **G**. `c` ("Admitting where I contributed").
- `uf-uncertainty` "What kind of not-knowing is it?" — **G**. Types uncertainty rather than
  measuring it. Strong.
- `uf-decision` "What makes it heavy?" — **G**. `b` ("There's no version where nothing is lost").
- `uf-boredom` "When the quiet comes, what usually turns up in it?" — **G**. FN. `e` ("I don't stay
  long enough to find out").
- `uf-relief` "Relief from what, if you had to name it?" — **G**. `d` ("Myself, a bit").

The universal branch is, per-question, the highest-voice-density set in the app.

### 2.8 Shared closing questions

- `c1` "Right now, which of these is doing most of the talking?" — **G**. Excellent: externalises
  know/feel/assume/fear as voices rather than asking the person to self-classify. `e` ("I can't
  tell them apart yet") permitted.
- `c2` "If you left this completely alone for a week, what happens?" — **F**. Useful counterfactual;
  generic.
- `c3` "And what would help most in the next hour?" (note: "Last one.") — **F/C**. This is a
  coping-preference item. `f` ("Asking a better question than the one I started with") is the one
  Gabriel-distinct option. **D candidate**: it closes every branch and it is the least Gabriel
  page in the app, so it is the last thing many users read.

### 2.9 Deeper probes (adaptive layer, 8 probes)

Purpose is discriminative — separating tied numbers — and the language reflects that.

| Probe | Cat | Notes |
|---|---|---|
| `deep-feel` "If you had to name what you don't want to feel right now…" (note: "Same ground as before, asked another way.") | **G** | The note is honest about re-asking. `e` ("Still can't name it") permitted. |
| `deep-distract` "What would become uncomfortable if you stopped distracting yourself for the next hour?" | **G** | FN. Best probe. |
| `deep-known` "Of what you've said so far, how much would hold up if someone asked you to show it?" (note: "Not a test. Just where the line sits.") | **G** | Meta-level fact/story. The note is load-bearing — without it this reads as interrogation. |
| `deep-hear` "If the other person spoke first and you couldn't reply, what would that be like?" | **G** | Excellent listening probe; `a` ("I'd be building my answer the whole time"). |
| `deep-container` "If this same thing showed up again next week, what would you already have in place?" | **F/G** | `c` ("The same scramble as this time") is honest. |
| `deep-recurs` "Has this shape shown up before, in another setting?" | **F** | PAT; slightly abstract ("this shape"). |
| `deep-part` "Say your part in one sentence — which version comes out?" (note: "Contribution, not verdict.") | **G** | Very strong: measures the *form* of the self-account, not its content. `b` ("This is on me") vs `a` ("Here's what I did, and here's what they did") is a real discrimination between RES and CTR. |
| `deep-step` "What's the smallest thing you could do about this today?" | **F** | Action-planning; conventional but appropriate as a closer. |

**Structural note:** probe weights are 4, above the documented per-choice max of 3, so a single
probe answer can move an Undetermined result decisively. This is the sharpest live tension with
the "a response does not automatically equal a Gabriel Number" rule. **Recorded, not changed.**

### 2.10 Deep Reading formulations 1–9 (`src/lib/deep-reading.ts`)

| n | Lead assessment | Notes |
|---|---|---|
| 1 Beginning | **G** | "The beginning is not necessarily acting — it is honestly naming the first question." Approved, and it lands. Recognitions are questions, not instructions. |
| 2 Duality | **G** | "without collapsing one into the other or turning yourself into the villain of it." Strong. |
| 3 Pattern | **G** | "your state is part of what you are seeing" — the recognition/interpretation distinction, well handled. |
| 4 Structure | **G** | "Structure here is not control — it is giving an insight a shape it can survive in." Good. Its single recognition question ("held rather than managed") is the most abstract in the set — mildly at risk of sounding like coaching. |
| 5 Discernment | **G** | Approved formulation. Leads with the responsibility boundary; the older know/feel/assume line is correctly demoted to `support`. The three recognitions reach the 5 × 1 situation without prescribing. Best-executed formulation. |
| 6 Integration | **G** | "accountability without prosecution" is the framework's own phrase and it works. |
| 7 Staying | **G** | "Staying is not passivity — it is tolerating a moment that has no resolution in it yet." Recognition ("What becomes available if nothing is solved in the next hour?") is good but overlaps `c3`. |
| 8 Listening | **G** | Approved formulation, preserved verbatim, correctly distinguished from fear/hesitation. |
| 9 Embodiment / Completion | **G** | "Completion is not the whole solution; it is the part that can now be lived." Bridge question present as required. |

**Assessment of the layer as a whole:** every formulation is a recognition, none is an
instruction, and the closing lines ("the decision stays yours" / "leaves the deciding to you")
hold the no-verdict rule explicitly. **Weakest point:** numbers 4 and 7 carry only one
recognition question each, so a 4- or 7-primary reading is noticeably thinner than a 5- or
8-primary reading. The companion sentences are also formulaic in shape ("N Name sits with it:
…"), which reads slightly mechanical against the depth of the leads.

---

## 3. Answers to the seven specific questions asked

1. **Separate what happened from the story about it?** Yes, in four places, and one of them
   (`fury-under`) is excellent. Absent entirely from GAMBLE, WELL, SURPRISE, LOST and the
   closing questions.
2. **Test awareness without treating lack of awareness as dishonesty?** Yes — consistently, in
   every question, with weight to 1 Beginning and (in the best cases) a smaller follow-up
   question. This is the app's most reliable behavior.
3. **Allow contradictory truths / ambivalence?** At option level yes; at prompt level only twice
   (`chance-split`, `drink-habit-4`). Largest stated-vs-actual gap.
4. **Reveal what a behavior is organizing or displacing?** Only in DRINK (plus `lost-tell`,
   `lost-restless`, `spiral-reassure`, `uf-boredom`, `fury-crossed-hurt`, `deep-distract`).
   Not generalised; absent from GAMBLE.
5. **Distinguish recognition of consequences from recognition of the pattern?** Partially.
   Consequence work is good; pattern-mechanism work exists almost only in LOOP (`loop-2`,
   `loop-3`) and is missing where it matters most (DRINK, GAMBLE).
6. **Invite compassionate recognition rather than diagnosis?** Yes, and this is the clearest
   Sarah signature — carried mostly by the `note` fields. Exceptions: `gamble-2`, `spiral-stuck`,
   `c3`, `lost-avoid`, `lost-stim`.
7. **Preserve "a response ≠ a Gabriel Number"?** In the engine, yes (normalisation, thresholds,
   Undetermined). In the language, unstated. Two live pressures: 3-weight options in short
   majority-shared branches, and weight-4 deeper probes.

## 4. Consolidated D list (candidates for later deeper-layer rewrite — NOT rewritten)

Ordered by how much the rewrite would change the reviewer's experience.

1. `gamble-2` — limit-compliance frame where a relationship-to-the-limit question belongs.
2. `c3` — closes every branch and is the least Gabriel page in the app.
3. `spiral-stuck` — duration bucket where a residency/organisation question belongs.
4. `lost-stim`, `lost-avoid` — taxonomies where function questions belong.
5. `chance-1` — classifier; low priority, honest router duty.
6. `spiral-predict` — probability-estimation frame; partly rescued by option `c`.
7. Deep Reading 4 and 7 — one recognition question each; thinner than 5 and 8.
8. The companion-sentence template in Deep Reading — mechanical shape against strong leads.

## 5. What was NOT done

No code, question text, option text, note, weight, threshold, branch graph, doorway order,
Deep Reading formulation, or UI string was changed. No rewrite of any D candidate was performed.
No proprietary vocabulary or semantic-map lexicon is exposed anywhere in the public UI; this
document is internal and not linked from the app.
