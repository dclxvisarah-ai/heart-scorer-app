# Drinking Branch — Full Response-Level Audit

Generated from `src/lib/gabriel.ts` as built. **Documentation only — no application code, scoring constant, number meaning, Tree mapping or framework rule was changed.**

Standard applied per response: question → psychological mechanism → authentic response → fixed 1–9 mapping → duplicate/collision test → mathematical stress test → whole-branch convergence test → audit → lock.

Immutable references used, not reinterpreted: `MIN_PRIMARY_WEIGHT = 2.4`, `MIN_LEAD = 0.35`, `MIN_SUPPORT_WEIGHT = 1.8`, `W_n = Raw_n / sqrt(max(Available_n,1)) * 2`, and the fixed 1–9 meanings below.

## Fixed 1–9 meanings (quoted from `NUMBERS`)

| n | name | tree | meaning |
|---|---|---|---|
| 1 | Beginning | Keter | Initiation. The first honest question, and the willingness to look at something you have not looked at yet. |
| 2 | Duality | Chokmah | Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. |
| 3 | Pattern | Binah | Recognizing what recurs, and noticing how your emotional state changes what you perceive. |
| 4 | Structure | Chesed | Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. |
| 5 | Discernment | Gevurah | Tension and boundaries. Separating what you know from what you feel and what you assume. |
| 6 | Integration | Tiferet | Accountability without prosecution. Holding complexity without abandoning yourself in it. |
| 7 | Staying | Netzach | Observation and tolerating stillness. Remaining present rather than escaping into the next problem. |
| 8 | Listening | Hod | Timing and disciplined communication. Receiving before interpreting or responding. |
| 9 | Embodiment / Completion | Yesod → Malkuth | Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. |

## Branch structure

Doorway `drink` — `prefixPages: 3`, `stage2: "drink-lost"`, `totalPages: 6`, `universal: "ifAvoidance"`. 28 reachable questions, 241 answer options, every `followUp`/`next` resolves.

```text
Q1 drink-1
Q2 one of 14 threads (drink-reward | drink-better | drink-confidence | drink-calm |
   drink-nothink | drink-without | drink-routine(+ -2) | drink-forward |
   drink-myself(+ -2) | drink-bored | drink-escape | drink-good-life |
   drink-plain-hour | drink-unclear)
Q3 drink-layer2
Q4 drink-lost
Q5 drink-power | drink-gone | drink-changes  (then drink-missing | drink-boredom)
Q6 drink-fear | drink-want | drink-inertia | drink-consequence
```

## Response-level audit — all 241 options

Columns: response ID / exact label · intended psychological mechanism · fixed evidence mapping · meaning of each mapped number · underlying question the response answers · collision status · flag.

### `drink-1` — Q1

**Prompt:** When the urge hits, what sounds so damn appealing about saying “fuck it” and having one?

**Underlying question:** Which psychological faculty is the urge standing in for?

*Note shown to the person:* You already know it's bad for you. You already know the consequences. You already know what tomorrow might feel like. So that's not the question.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `good` | I know it'll feel good, and I know I'll regret it. Both are true. | primary: holds two true things at once without disowning either; opens `drink-reward` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | shares signature {2:3} with `well` | **PASS** — Signature {2:3} shared with drink-1/well, but the follow-ups differ (drink-reward vs. drink-good-life), so the information survives. |
| `better` | I feel bad and I want to feel better. Ask me why I feel bad and I've got nothing. | primary: asks the first honest question / admits a genuine unknown; secondary: separates what is known from what is felt or assumed; opens `drink-better` | {1:2, 5:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `confidence` | I want to be around people without running a case against myself the whole time. | primary: takes accountability without prosecuting himself; opens `drink-confidence` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | shares signature {6:3} with `escape` | **PASS** — Signature {6:3} shared with drink-1/escape; distinguished by follow-up. |
| `calm` | Nothing today had edges. I want something that closes the day out. | primary: wants or holds a container, rule or marker; opens `drink-calm` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `nothink` | I've been chewing the same thought since this morning and it hasn't moved. | primary: recognises what recurs (same hour, same loop, same reach); routes into the avoidance question (`avoids: true`); opens `drink-nothink` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | shares signature {3:3} with `routine` | **PASS** — Signature {3:3} shared with drink-1/routine; distinguished by follow-up. |
| `scared` | I'm scared to go without it. I'd rather say that than pretend I'm not. | primary: asks the first honest question / admits a genuine unknown; secondary: takes accountability without prosecuting himself; opens `drink-without` | {1:2, 6:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `shit` | My body doesn't feel right without it. I want to hear that straight before I decide anything. | primary: receives — body, person, or self — before interpreting or answering; opens `drink-without` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `routine` | Same hour, same reach, every day. I can see the shape of it. | primary: recognises what recurs (same hour, same loop, same reach); opens `drink-routine` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | shares signature {3:3} with `nothink` | **PASS** — Signature shared with drink-1/nothink; distinguished by follow-up. |
| `forward` | I want something to look forward to and I couldn't tell you what else would count. | primary: asks the first honest question / admits a genuine unknown; secondary: wants or holds a container, rule or marker; opens `drink-forward` | {1:2, 4:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `myself` | I don't feel like me — and I'm not sure the drinking version is me either. | primary: holds two true things at once without disowning either; secondary: asks the first honest question / admits a genuine unknown; opens `drink-myself` | {2:2, 1:1} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `bored` | Nothing's happening. Part of me knows I could just let the hour be empty. | primary: tolerates stillness / stays in the feeling instead of moving; opens `drink-bored` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `escape` | I want out of how I feel. I'm doing that on purpose and I'm not going to call myself weak for it. | primary: takes accountability without prosecuting himself; routes into the avoidance question (`avoids: true`); opens `drink-escape` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | shares signature {6:3} with `confidence` | **PASS** — Signature shared with drink-1/confidence; distinguished by follow-up. |
| `well` | My life is genuinely good right now and I still want one. Both are true. | primary: holds two true things at once without disowning either; opens `drink-good-life` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | shares signature {2:3} with `good` | **PASS** — Signature shared with drink-1/good; distinguished by follow-up. |
| `plain` | I just fucking want one. I'm not going to build a story on top of it. | primary: separates what is known from what is felt or assumed; opens `drink-plain-hour` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `unclear` | I don't know. That's literally why I'm here. | primary: asks the first honest question / admits a genuine unknown; opens `drink-unclear` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-reward` — Q2 thread

**Prompt:** How reliable is that good feeling, really?

**Underlying question:** Do you observe the reward, or assume it?

*Note shown to the person:* Not a trick question. Sometimes it delivers.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Very. Same result every time — I could set my watch by it. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | The first one lands. After that I'm chasing it, and I know the difference. | primary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | It works for an hour, then I feel worse — and I still pick it. That's mine. | primary: takes accountability without prosecuting himself; secondary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {6:2, 5:1} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Lately it doesn't work at all, and I've quit pretending it does. | primary: separates what is known from what is felt or assumed; secondary: holds two true things at once without disowning either; continues to `drink-layer2` | {5:2, 2:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | I stopped checking a long time ago. It's automatic now. | primary: recognises what recurs (same hour, same loop, same reach); secondary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {3:2, 1:1} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I've never actually watched whether it delivers. I'd have to pay attention. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I don't know. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-better` — Q2 thread

**Prompt:** Better than what, though? What's the current setting?

**Underlying question:** Can you name the current state, or only the wish to leave it?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Wired — and I know everything looks worse than it is when I'm like this. | primary: recognises what recurs (same hour, same loop, same reach); secondary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {3:2, 5:1} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Flat. Nothing much at all, and I've never asked why that is. | primary: asks the first honest question / admits a genuine unknown; secondary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {1:2, 8:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | Sad. I could sit in it tonight if I decided to. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-layer2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Angry — at something I haven't actually let the other person finish saying. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Lonely. I want company and I want to be left alone. Both. | primary: holds two true things at once without disowning either; continues to `drink-layer2` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | Fine, honestly. Better would just be better — that's the whole of it. | primary: separates what is known from what is felt or assumed; secondary: holds two true things at once without disowning either; continues to `drink-layer2` | {5:2, 2:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I can't name it. That's the honest answer. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-confidence` — Q2 thread

**Prompt:** Confidence to do what?

**Underlying question:** What capacity are you borrowing from the drink?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Be in the room without narrating everything I'm doing wrong. | primary: takes accountability without prosecuting himself; continues to `drink-layer2` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Get through the day. I need something with edges to get me there. | primary: wants or holds a container, rule or marker; continues to `drink-layer2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | Say what I think — after I've actually heard what they said. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Stop running the same loop about how it's going to go. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Hold that I'm decent and that I screwed up, at the same time. | primary: holds two true things at once without disowning either; continues to `drink-layer2` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | Do the one thing I've been putting off. The actual next step. | primary: carries it into one actual next step; routes into the avoidance question (`avoids: true`); continues to `drink-layer2` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I don't know. I just notice I feel different when I drink. | primary: asks the first honest question / admits a genuine unknown; secondary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {1:2, 3:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-calm` — Q2 thread

**Prompt:** What's got you wound up?

**Underlying question:** Where is the activation coming from, and is it inside or outside you?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Work, money, logistics. None of it has a container. | primary: wants or holds a container, rule or marker; continues to `drink-layer2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Something a person said — and I answered before I'd heard the end of it. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | Too many small things stacked up. Same stack as last week. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | My own head — and I know my head lies to me when I'm this tight. | primary: separates what is known from what is felt or assumed; secondary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {5:2, 3:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Something unresolved. There's one step in it I'm not taking. | primary: carries it into one actual next step; routes into the avoidance question (`avoids: true`); continues to `drink-layer2` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | Nothing external. My body's switched on, and I can stay in it. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-layer2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | No idea, and I'd rather say that than invent a reason. | primary: separates what is known from what is felt or assumed; secondary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {5:2, 1:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-nothink` — Q2 thread

**Prompt:** What's the thought that keeps coming back?

**Underlying question:** What is the recurring content, and what faculty would meet it?

*Note shown to the person:* You don't have to be specific. Just point at it.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Something I did. I own it, and I don't need to keep sentencing myself for it. | primary: takes accountability without prosecuting himself; continues to `drink-layer2` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Something someone else did — I've been arguing with my version of them, not the real one. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | A decision I keep reopening because I never set a rule for it. | primary: wants or holds a container, rule or marker; continues to `drink-layer2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Money, or how it all works out. I can't tell what I know from what I'm assuming. | primary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Same thought, same time of day, every day. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | All of it at once — and I can let it be loud without acting on it. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-layer2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I'd rather not name it yet. That's where I actually am. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-without` — Q2 thread

**Prompt:** When you picture going without it, what shows up first?

**Underlying question:** What arrives first when the drink is subtracted — body, hours, feeling, or verdict?

*Note shown to the person:* No diagnosis here, and nothing you say gets turned into advice.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | My body. And I'd want to listen to it instead of overruling it. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | I could get sick without it. That's a real line, not a feeling. | primary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | The hours. I'd need to put something in them on purpose. | primary: wants or holds a container, rule or marker; continues to `drink-layer2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Everything I've not been feeling arrives at once — and I could sit in that for a night. | primary: tolerates stillness / stays in the feeling instead of moving; routes into the avoidance question (`avoids: true`); continues to `drink-layer2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | I'd probably cave — and I'd rather look at that than call myself weak. | primary: takes accountability without prosecuting himself; continues to `drink-layer2` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | It would tell me something true I've never asked about. | primary: asks the first honest question / admits a genuine unknown; secondary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {1:2, 8:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | One night without it. That's the only step I'd commit to. | primary: carries it into one actual next step; continues to `drink-layer2` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | I honestly don't know. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-routine` — Q2 thread

**Prompt:** If you woke up tomorrow and the routine simply wasn't there, what would feel weirdest?

**Underlying question:** Is the pull located in the hour, the container, or you?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Nothing would mark the end of the day. | primary: wants or holds a container, rule or marker; continues to `drink-routine-2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | My hand would still reach at the same hour. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-routine-2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | I'd have to decide what goes there, and I've never decided that. | primary: asks the first honest question / admits a genuine unknown; secondary: wants or holds a container, rule or marker; continues to `drink-routine-2` | {1:2, 4:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Something would feel missing — and I could let it feel missing. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-routine-2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | I'd see how much of my day was built around it. A relief and a loss at once. | primary: holds two true things at once without disowning either; continues to `drink-routine-2` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I'd cave later — and that's information, not a verdict on me. | primary: takes accountability without prosecuting himself; continues to `drink-routine-2` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I'd be fine. I can tell the difference between weird and hard. | primary: separates what is known from what is felt or assumed; continues to `drink-routine-2` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | Honestly, I don't know. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-routine-2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-routine-2` — Q2 thread

**Prompt:** How much of it is the hour, and how much of it is you?

**Underlying question:** Have you ever separated the trigger from yourself?

*Note shown to the person:* Both directions count. This isn't a nudge to stop.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Mostly the hour. Same time, every time. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Mostly the day I've had — though I've never checked whether that's actually true. | primary: receives — body, person, or self — before interpreting or answering; secondary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {8:2, 5:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | Mostly who I'm with. It's two things at once: them and me. | primary: holds two true things at once without disowning either; continues to `drink-layer2` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | It's the marker. It ends the day. | primary: wants or holds a container, rule or marker; continues to `drink-layer2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | It's me. And I can say that without building a case against myself. | primary: takes accountability without prosecuting himself; continues to `drink-layer2` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I've never separated them. That's the first honest thing here. | primary: asks the first honest question / admits a genuine unknown; secondary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {1:2, 5:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-forward` — Q2 thread

**Prompt:** What else is on the list of things to look forward to right now?

**Underlying question:** Does anticipation exist anywhere else, and does it have a shape?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Plenty — and I default to this one every single time anyway. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | A couple of things, further out. I could put one on the calendar tonight. | primary: carries it into one actual next step; continues to `drink-layer2` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | People, mostly. I'd have to reach out and actually listen. | primary: receives — body, person, or self — before interpreting or answering; secondary: holds two true things at once without disowning either; continues to `drink-layer2` | {8:2, 2:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Nothing I've planned. Nothing has a shape yet. | primary: wants or holds a container, rule or marker; secondary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {4:2, 1:1} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Nothing — and I can say that plainly without deciding what it means about me. | primary: separates what is known from what is felt or assumed; secondary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {5:2, 1:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I haven't thought about it. That's the honest start. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-myself` — Q2 thread

**Prompt:** When you say “more like myself,” which version of you are you missing?

**Underlying question:** Which self is missing, and what did that self do that this one doesn't?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | The one who wasn't running a case against himself all day. | primary: takes accountability without prosecuting himself; continues to `drink-myself-2` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | The social one — actually with people, not just near them. | primary: holds two true things at once without disowning either; secondary: receives — body, person, or self — before interpreting or answering; continues to `drink-myself-2` | {2:2, 8:1} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it.<br>**8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | The one who could sit still and be fine. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-myself-2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | The one who didn't run the same loop for hours. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-myself-2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | The one who said the true thing out loud, after hearing the room. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-myself-2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | The one who kept a couple of promises to himself. | primary: wants or holds a container, rule or marker; secondary: carries it into one actual next step; continues to `drink-myself-2` | {4:2, 9:1} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once.<br>**9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | The one who did the next thing instead of planning it. | primary: carries it into one actual next step; continues to `drink-myself-2` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | I don't know which version. I just know I miss it. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-myself-2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-myself-2` — Q2 thread

**Prompt:** When was that version last around, without a drink involved?

**Underlying question:** When did that self last exist unaided, and can you locate the line?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Recently. It comes and goes on a rhythm I can almost see. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | A while ago, and I know roughly what changed. I can name the line. | primary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | Years. I'd be starting from nothing here. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:3} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Only when the things around me had some structure to them. | primary: wants or holds a container, rule or marker; continues to `drink-layer2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Only around certain people — I hear myself differently with them. | primary: receives — body, person, or self — before interpreting or answering; secondary: holds two true things at once without disowning either; continues to `drink-layer2` | {8:2, 2:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | Both versions might be me. I've stopped ranking them. | primary: holds two true things at once without disowning either; continues to `drink-layer2` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I can't remember, and I'm not going to invent an answer. | primary: separates what is known from what is felt or assumed; secondary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {5:2, 1:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-bored` — Q2 thread

**Prompt:** What would fill the same slot tonight, if the drink were off the table?

**Underlying question:** Can the empty slot stay empty, or must it be filled?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Plenty of things — I just default here, same as always. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Company. It's people I want, and I'd have to actually ask someone. | primary: holds two true things at once without disowning either; secondary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {2:2, 8:1} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it.<br>**8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | I could let the slot stay empty. Boring isn't an emergency. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-layer2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Something I'd have to plan, which is exactly the problem. | primary: wants or holds a container, rule or marker; continues to `drink-layer2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | One small thing I'd actually do tonight. | primary: carries it into one actual next step; continues to `drink-layer2` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | Screens. Same slot, same reach, different object — I can see that. | primary: recognises what recurs (same hour, same loop, same reach); secondary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {3:2, 5:1} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I don't know. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-escape` — Q2 thread

**Prompt:** What's the feeling you'd be getting away from?

**Underlying question:** What is the feeling being escaped, named plainly?

*Note shown to the person:* Naming it here doesn't obligate you to do anything about it.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Anxiety — and I can't yet tell real risk from forecast. | primary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Sadness. I could stay in it tonight if I chose to. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-layer2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | Shame. I did the thing; I don't have to keep sentencing myself for it. | primary: takes accountability without prosecuting himself; continues to `drink-layer2` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Anger — at someone I haven't let finish a sentence. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Loneliness. I want people and I want nobody. Both. | primary: holds two true things at once without disowning either; continues to `drink-layer2` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | Dread about something coming. There's one step that would shrink it. | primary: carries it into one actual next step; continues to `drink-layer2` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | Emptiness. Same hour, most nights. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | I feel it and I can't name it. That's where I'm starting. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-good-life` — Q2 thread

**Prompt:** Okay, then let's not invent a problem. What feels strangest about wanting it when nothing seems wrong?

**Underlying question:** With nothing wrong, what is the urge actually reporting?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Things are good and I still want one. Two true things at once. | primary: holds two true things at once without disowning either; continues to `drink-layer2` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | I'm restless inside a good life — and I could just be restless without fixing it. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-layer2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | I keep forecasting what'll go wrong, and I know it's a forecast, not a fact. | primary: separates what is known from what is felt or assumed; continues to `drink-layer2` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | With nothing to fix, I don't know what to do with myself. First time I've noticed that. | primary: asks the first honest question / admits a genuine unknown; secondary: wants or holds a container, rule or marker; continues to `drink-layer2` | {1:2, 4:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Same hour, same reach — good day or bad day, it doesn't matter. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I want one, nothing needs it, and there's something else I'd rather actually do. | primary: carries it into one actual next step; continues to `drink-layer2` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | Nothing feels strange. I want one, and I'll say that plainly. | primary: separates what is known from what is felt or assumed; secondary: holds two true things at once without disowning either; continues to `drink-layer2` | {5:2, 2:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | I honestly don't know. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-plain-hour` — Q2 thread

**Prompt:** Okay. Fair enough. If you got exactly what you want from that drink, what would you want the next hour to feel like?

**Underlying question:** What state are you buying, once the story is stripped out?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Easier — with something in it that has edges. | primary: wants or holds a container, rule or marker; continues to `drink-layer2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Actually enjoyed, and carried into tomorrow instead of paid for. | primary: carries it into one actual next step; continues to `drink-layer2` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | Quieter than the loop that's been running all day. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Me in the room without the running commentary about myself. | primary: takes accountability without prosecuting himself; secondary: holds two true things at once without disowning either; opens `drink-confidence` | {6:2, 2:1} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Not boring — though I could sit through boring if it came to it. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-layer2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | Less loaded. I know that's what I'm asking the drink to do. | primary: separates what is known from what is felt or assumed; secondary: takes accountability without prosecuting himself; routes into the avoidance question (`avoids: true`); continues to `drink-layer2` | {5:2, 6:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | With people, and me listening instead of performing. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | Normal — holding what's off and what's fine at the same time. | primary: holds two true things at once without disowning either; continues to `drink-layer2` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `i` | I don't care how I feel. I want the drink and I'm not dressing it up. | primary: separates what is known from what is felt or assumed; secondary: holds two true things at once without disowning either; continues to `drink-layer2` | {5:2, 2:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `j` | I have no idea. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-unclear` — Q2 thread

**Prompt:** Then let's start smaller. When did you first notice the pull today?

**Underlying question:** When did the pull start, and can you place it without inventing a cause?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | When the day stopped moving. Same as most days. | primary: recognises what recurs (same hour, same loop, same reach); continues to `drink-layer2` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Right after something specific happened — and there's a piece of it I haven't dealt with. | primary: carries it into one actual next step; secondary: separates what is known from what is felt or assumed; routes into the avoidance question (`avoids: true`); continues to `drink-layer2` | {9:2, 5:1} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | Around other people, before I'd really heard anything anyone said. | primary: receives — body, person, or self — before interpreting or answering; continues to `drink-layer2` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Low all day. I noticed it and left it alone. | primary: tolerates stillness / stays in the feeling instead of moving; continues to `drink-layer2` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | The second the day had nothing scheduled in it. | primary: wants or holds a container, rule or marker; continues to `drink-layer2` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I can't place it, and I'm not going to guess. | primary: separates what is known from what is felt or assumed; secondary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {5:2, 1:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | No idea. That's the honest first answer. | primary: asks the first honest question / admits a genuine unknown; continues to `drink-layer2` | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-layer2` — Q3

**Prompt:** Be honest: is it the drink you want, or the feeling on the other side of it?

**Underlying question:** Can you separate the object from the state it stands in for?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | The feeling. The drink is just how I get there — I can tell those two apart. | primary: separates what is known from what is felt or assumed | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | The drink itself. I like it, and I also know where it tends to go. | primary: holds two true things at once without disowning either | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | The moment around it. Same pause, same hour, every day. | primary: recognises what recurs (same hour, same loop, same reach) | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | The off switch. Not the taste, the off switch — and I'll own that that's what I'm buying. | primary: takes accountability without prosecuting himself; secondary: separates what is known from what is felt or assumed; routes into the avoidance question (`avoids: true`) | {6:2, 5:1} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Both, and I've never actually pulled them apart. | primary: asks the first honest question / admits a genuine unknown; secondary: recognises what recurs (same hour, same loop, same reach) | {1:2, 3:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I'd have to stop and hear what I actually want before I answer that. | primary: receives — body, person, or self — before interpreting or answering | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I don't know. | primary: asks the first honest question / admits a genuine unknown | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-lost` — Q4

**Prompt:** Forget whether drinking is 'good' or 'bad' for a second. If it disappeared from your life tomorrow, what would you actually be losing?

**Underlying question:** What function would go missing — not what is good or bad about it?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | The physical feeling — and I'd want to know what my body was actually asking for. | primary: receives — body, person, or self — before interpreting or answering; opens `drink-gone` | {8:3} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | The ritual. Same hour, same shape, every night. | primary: recognises what recurs (same hour, same loop, same reach); opens `drink-gone` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | The excuse to check out. I'd have to be here instead. | primary: tolerates stillness / stays in the feeling instead of moving; routes into the avoidance question (`avoids: true`); opens `drink-changes` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Being in a room without running a case against myself. | primary: takes accountability without prosecuting himself; opens `drink-power` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | The people and the places. Both matter, and only one is about the drink. | primary: holds two true things at once without disowning either; opens `drink-gone` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | The version of me that shows up after two — while owning that this one is me too. | primary: holds two true things at once without disowning either; secondary: takes accountability without prosecuting himself; opens `drink-power` | {2:2, 6:1} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it.<br>**6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | The ability to stop thinking for a while. I know that's what I'm buying. | primary: separates what is known from what is felt or assumed; routes into the avoidance question (`avoids: true`); opens `drink-changes` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | The one part of the day with a rule I never break. | primary: wants or holds a container, rule or marker; opens `drink-gone` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `i` | Something I genuinely enjoy — and I want to carry that into a life I actually like. | primary: carries it into one actual next step; opens `drink-power` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `j` | Nothing important. Which tells me the reason is somewhere I haven't looked. | primary: asks the first honest question / admits a genuine unknown; secondary: separates what is known from what is felt or assumed; opens `drink-power` | {1:2, 5:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `k` | My fear of what happens when I stop. I can name it and still sit here with it. | primary: tolerates stillness / stays in the feeling instead of moving; secondary: takes accountability without prosecuting himself; opens `drink-power` | {7:2, 6:1} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem.<br>**6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `l` | More than I want to admit — and admitting it isn't a confession of guilt. | primary: takes accountability without prosecuting himself; secondary: separates what is known from what is felt or assumed; opens `drink-power` | {6:2, 5:1} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-power` — Q5

**Prompt:** Be honest. Which one has more power over you right now?

**Underlying question:** Which competing life currently has authority?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | The life I'm actually building — and I know what the next step in it is. | primary: carries it into one actual next step; opens `drink-want` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | The life I get when I drink. Both are mine; that's the problem. | primary: holds two true things at once without disowning either; opens `drink-fear` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | The fear of what happens if I stop — and I can sit with that fear tonight. | primary: tolerates stillness / stays in the feeling instead of moving; opens `drink-fear` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Not having to decide. No rule, no decision, nothing to hold. | primary: wants or holds a container, rule or marker; secondary: recognises what recurs (same hour, same loop, same reach); opens `drink-inertia` | {4:2, 3:1} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once.<br>**3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | It changes depending on the fucking day — and I can see which days are which. | primary: recognises what recurs (same hour, same loop, same reach); opens `drink-consequence` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-gone` — Q5

**Prompt:** You wake up tomorrow and the urge is completely gone. Your life otherwise stays exactly the same. What feels weirdest?

**Underlying question:** If the urge vanished, which function would you feel the absence of?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | I'd have no idea what to do with that time. That's the first real question. | primary: asks the first honest question / admits a genuine unknown; secondary: wants or holds a container, rule or marker; opens `drink-missing` | {1:2, 4:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Relieved and thrown, both at once. | primary: holds two true things at once without disowning either; opens `drink-want` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | shares signature {2:3} with `e` | **PASS** — Signature {2:3} shared with drink-gone/e, which is flagged REMOVE. |
| `c` | I'd go find another way to feel different. Same reach, new object. | primary: recognises what recurs (same hour, same loop, same reach); routes into the avoidance question (`avoids: true`); opens `drink-want` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | shares signature {3:3} with `l` | **REWORD** — Collides with drink-gone/l {3:3}; c is substitution (carries avoids), l is automaticity — wording must make the difference visible. |
| `d` | Scared, because I know what my body does when I stop — I'd want that heard by someone who knows. | primary: receives — body, person, or self — before interpreting or answering; secondary: separates what is known from what is felt or assumed; opens `drink-fear` | {8:2, 5:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | The clerk who knows exactly what I get. It's a relationship, small as it is. | primary: holds two true things at once without disowning either; opens `drink-missing` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | shares signature {2:3} with `b` | **REMOVE** — Duplicate evidence signature with drink-gone/b {2:3} on the same page-6 route; the small-relationship mechanism it names is not distinguishable in the reading. |
| `f` | The one thing in the day that was mine, and mine on purpose. | primary: wants or holds a container, rule or marker; opens `drink-missing` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | Pissed — and honest about being pissed instead of performing gratitude. | primary: takes accountability without prosecuting himself; opens `drink-consequence` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | I'd find out the ritual mattered more than the drink ever did. | primary: recognises what recurs (same hour, same loop, same reach); secondary: separates what is known from what is felt or assumed; opens `drink-missing` | {3:2, 5:1} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `i` | I'd miss the version of me that comes out after — and I'd have to be the other one sober. | primary: takes accountability without prosecuting himself; secondary: holds two true things at once without disowning either; opens `drink-fear` | {6:2, 2:1} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `j` | More money, more time, a better day — and I'd still fucking miss it. Both true. | primary: holds two true things at once without disowning either; secondary: separates what is known from what is felt or assumed; opens `drink-consequence` | {2:2, 5:1} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `k` | I'm more afraid of my life without it than of what it's doing to me — and I can say that and stay in it. | primary: tolerates stillness / stays in the feeling instead of moving; opens `drink-fear` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `l` | I wouldn't miss the drink. I'd miss having something automatic to reach for. | primary: recognises what recurs (same hour, same loop, same reach); opens `drink-missing` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | shares signature {3:3} with `c` | **REWORD** — Collides with drink-gone/c {3:3}. |
| `m` | I'd do everything the same, just without it. That's the actual next step. | primary: carries it into one actual next step; opens `drink-changes` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-changes` — Q5

**Prompt:** Then what does the drink change about the thing you're already doing?

**Underlying question:** What does the drink alter about an activity you already do?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | It makes boring shit tolerable — though I could tolerate it. | primary: tolerates stillness / stays in the feeling instead of moving; opens `drink-boredom` | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Things land better, and I'd rather carry that into how I actually spend the night. | primary: carries it into one actual next step; opens `drink-want` | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | It makes me stop caring that I'm bored. That's the trade, plainly. | primary: separates what is known from what is felt or assumed; routes into the avoidance question (`avoids: true`); opens `drink-boredom` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | shares signature {5:3} with `j` | **REWORD** — Collides with drink-changes/j {5:3}: trade-off naming vs. seeing the activity is not the point. |
| `d` | It gives a shapeless day something to point at. | primary: wants or holds a container, rule or marker; opens `drink-inertia` | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | TV, music, food, sex, gaming — all of it hits differently. Two good things at once. | primary: holds two true things at once without disowning either; opens `drink-want` | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | It shuts my head up while I'm doing it. Same as every night. | primary: recognises what recurs (same hour, same loop, same reach); routes into the avoidance question (`avoids: true`); opens `drink-boredom` | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | Being alone feels less alone — and I haven't called anyone. | primary: receives — body, person, or self — before interpreting or answering; secondary: holds two true things at once without disowning either; opens `drink-fear` | {8:2, 2:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | It changes nothing. I want the drink, and I'll own that. | primary: takes accountability without prosecuting himself; opens `drink-consequence` | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `i` | It feels wrong to do the thing without it now — which is news to me. | primary: asks the first honest question / admits a genuine unknown; secondary: recognises what recurs (same hour, same loop, same reach); opens `drink-missing` | {1:2, 3:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `j` | The activity isn't the point. The drinking is — I can see that clearly now. | primary: separates what is known from what is felt or assumed; opens `drink-fear` | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | shares signature {5:3} with `c` | **REWORD** — Collides with drink-changes/c {5:3}. |

### `drink-missing` — Q5b

**Prompt:** Wait — what would actually be missing?

**Underlying question:** Which part of the experience is actually being edited out?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Not the time. I'd be doing the same things — I can tell those apart. | primary: separates what is known from what is felt or assumed | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Something to look forward to. I'd have to make one thing worth it. | primary: carries it into one actual next step | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | The little ritual that says the day started or ended. | primary: wants or holds a container, rule or marker; secondary: recognises what recurs (same hour, same loop, same reach) | {4:2, 3:1} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once.<br>**3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | The excuse to stop being productive — though I could just stop without one. | primary: tolerates stillness / stays in the feeling instead of moving | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | The feeling of being off duty. Same time every night. | primary: recognises what recurs (same hour, same loop, same reach) | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | Something that's just mine — and I can want that without shame about it. | primary: takes accountability without prosecuting himself | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | The comfort of not thinking. I know that's the trade I'm making. | primary: separates what is known from what is felt or assumed; secondary: recognises what recurs (same hour, same loop, same reach) | {5:2, 3:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | It's my security blanket. I want it and I don't need it. Both. | primary: holds two true things at once without disowning either | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `i` | Nothing. I just automatically put drinking in that space. | primary: recognises what recurs (same hour, same loop, same reach); secondary: asks the first honest question / admits a genuine unknown | {3:2, 1:1} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `j` | I don't know — I'd want to sit and hear the answer instead of filling it in. | primary: receives — body, person, or self — before interpreting or answering; secondary: asks the first honest question / admits a genuine unknown | {8:2, 1:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-boredom` — Q5b

**Prompt:** If the drink could make one part of that experience disappear, what would you choose?

**Underlying question:** Which single element would you delete, and why that one?

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | The boredom — even though I could sit through it. | primary: tolerates stillness / stays in the feeling instead of moving | {7:3} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | The forecasting about how tomorrow goes. | primary: separates what is known from what is felt or assumed | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | The same loop running in my head. | primary: recognises what recurs (same hour, same loop, same reach) | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | The feeling I'm wasting my life — there's one thing I'd do about that. | primary: carries it into one actual next step | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | The sense I should be elsewhere, with nothing actually scheduled. | primary: wants or holds a container, rule or marker | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | The loneliness. I want people around and I want no demands. Both. | primary: holds two true things at once without disowning either | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | The pressure to enjoy myself — without making that a failing of mine. | primary: takes accountability without prosecuting himself | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | Nothing. I like being buzzed, and I'm not building a story on it. | primary: separates what is known from what is felt or assumed; secondary: holds two true things at once without disowning either | {5:2, 2:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `i` | I'd want to hear myself out before picking something to delete. | primary: receives — body, person, or self — before interpreting or answering; secondary: asks the first honest question / admits a genuine unknown | {8:2, 1:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-fear` — Q6

**Prompt:** Here's the part nobody asks: if drinking disappeared tomorrow, which possibility would scare you the most?

**Underlying question:** Which consequence of stopping is the frightening one?

*Note shown to the person:* Last one.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | I might actually get healthy — and then the next move would be mine to make. | primary: carries it into one actual next step | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | shares signature {9:3} with `k` | **REWORD** — Collides with drink-fear/k {9:3} on the terminal page; two distinct fears score identically. |
| `b` | I might succeed, and I don't know how to be that person. That's genuinely new ground. | primary: asks the first honest question / admits a genuine unknown | {1:3} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | I'd have to be fully myself with nothing over the top of it — and own that as it is. | primary: takes accountability without prosecuting himself | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | I'd be alone without it. It's my company and it costs me. Both. | primary: holds two true things at once without disowning either | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Being seen in a room like that, before I'd said a single word. | primary: receives — body, person, or self — before interpreting or answering; secondary: takes accountability without prosecuting himself | {8:2, 6:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I'd fail and relapse — and that would be data, not a sentence. | primary: takes accountability without prosecuting himself; secondary: separates what is known from what is felt or assumed | {6:2, 5:1} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I couldn't keep it to two. There's no line I've ever actually held. | primary: wants or holds a container, rule or marker | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | I'm scared to even start. That's exactly where I am. | primary: asks the first honest question / admits a genuine unknown; secondary: tolerates stillness / stays in the feeling instead of moving | {1:2, 7:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | shares signature {1:2, 7:1} with `l` | **PASS** — Signature {1:2,7:1} shared with drink-fear/l, which is flagged REMOVE. |
| `i` | I'd love being sober and have to face the years — and I can stay with that. | primary: tolerates stillness / stays in the feeling instead of moving; secondary: carries it into one actual next step | {7:2, 9:1} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem.<br>**9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `j` | Nothing would change and I'd have to find the real problem — I'd want the two separated. | primary: separates what is known from what is felt or assumed | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `k` | I'm not afraid of any of that. I want my life back, and I know the first move. | primary: carries it into one actual next step | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | shares signature {9:3} with `a` | **REWORD** — Collides with drink-fear/a {9:3}. |
| `l` | I don't know which scares me more, and I'll leave it there tonight. | primary: asks the first honest question / admits a genuine unknown; secondary: tolerates stillness / stays in the feeling instead of moving | {1:2, 7:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | shares signature {1:2, 7:1} with `h` | **REMOVE** — Near-duplicate of drink-fear/h {1:2,7:1} on a terminal page. |

### `drink-want` — Q6

**Prompt:** Now flip it. If you could keep the parts of your life you actually want, what are you secretly hoping you get back?

**Underlying question:** What are you hoping to get back, and does it have a step?

*Note shown to the person:* Last one.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | My health — starting with one thing I'd actually do this week. | primary: carries it into one actual next step | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | Being in my own corner instead of building a case against myself. | primary: takes accountability without prosecuting himself | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | My money — I'd draw a line and know what holding it costs. | primary: wants or holds a container, rule or marker; secondary: separates what is known from what is felt or assumed | {4:2, 5:1} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | My mornings, with an actual shape to them. | primary: wants or holds a container, rule or marker; secondary: carries it into one actual next step | {4:2, 9:1} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once.<br>**9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | My people — and actually hearing them when they talk. | primary: receives — body, person, or self — before interpreting or answering; secondary: holds two true things at once without disowning either | {8:2, 2:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | Remembering my own life, so I can tell what happened from what I assume happened. | primary: separates what is known from what is felt or assumed | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | Quiet from thinking about this constantly. Same thought, every day. | primary: recognises what recurs (same hour, same loop, same reach) | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | The version of me still in there, alongside this one. Both are me. | primary: holds two true things at once without disowning either | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `i` | Drinking that doesn't run my life — a limit I'd actually hold to. | primary: wants or holds a container, rule or marker | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `j` | All of it. And I'd start with one piece. | primary: carries it into one actual next step; secondary: separates what is known from what is felt or assumed | {9:2, 5:1} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution.<br>**5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `k` | I don't want to quit. I want the consequences gone — and I know that's not on offer. | primary: separates what is known from what is felt or assumed; secondary: holds two true things at once without disowning either | {5:2, 2:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `l` | I don't know yet, and I'd rather hear the answer than pick one. | primary: receives — body, person, or self — before interpreting or answering; secondary: asks the first honest question / admits a genuine unknown | {8:2, 1:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-inertia` — Q6

**Prompt:** Be honest. Is part of this simply that drinking is easier than doing the thing you know you should do?

**Underlying question:** Is this avoidance of a known action, or something else entirely?

*Note shown to the person:* Last one.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Yeah. I take the easier option, and that's mine to own without the beating. | primary: takes accountability without prosecuting himself | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | It's not laziness — I'm exhausted, and I can tell those two apart. | primary: separates what is known from what is felt or assumed | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | I want to move and can't get started. One small thing is the whole ask. | primary: carries it into one actual next step | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | It makes me feel like I'm doing something. Same feeling, every night. | primary: recognises what recurs (same hour, same loop, same reach) | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | I use it as the excuse not to start. First time I've said that out loud. | primary: asks the first honest question / admits a genuine unknown; secondary: takes accountability without prosecuting himself | {1:2, 6:1} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet.<br>**6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I know exactly what I should be doing and I don't want to. Both true. | primary: holds two true things at once without disowning either | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | No — I get plenty done while I drink, and I won't pretend otherwise. | primary: separates what is known from what is felt or assumed; secondary: holds two true things at once without disowning either | {5:2, 2:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | That's not what's happening. My day has no structure — that's the real issue. | primary: wants or holds a container, rule or marker | {4:3} | **4 Structure** (Chesed) — Creating a container. Stability. Turning an insight into something repeatable rather than something you had once. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `i` | Maybe. I'd rather sit with that question than answer it fast. | primary: tolerates stillness / stays in the feeling instead of moving; secondary: receives — body, person, or self — before interpreting or answering | {7:2, 8:1} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem.<br>**8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

### `drink-consequence` — Q6

**Prompt:** If someone told you this habit could eventually take years from your life, which thought hits harder?

**Underlying question:** How do knowledge of the cost and the reach coexist in you?

*Note shown to the person:* Last one. Reflection, not a verdict.

| id | label | mechanism | mapping | mapped meanings | collision | flag |
|---|---|---|---|---|---|---|
| `a` | Then I want my life — and there's a first move I already know. | primary: carries it into one actual next step | {9:3} | **9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `b` | I know, and in the moment I don't care. Same moment, every time. | primary: recognises what recurs (same hour, same loop, same reach) | {3:3} | **3 Pattern** (Binah) — Recognizing what recurs, and noticing how your emotional state changes what you perceive. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `c` | I care, and the drink still wins sometimes. Both are true of me. | primary: holds two true things at once without disowning either | {2:3} | **2 Duality** (Chokmah) — Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `d` | Losing my life scares me more than losing the drink — and I can hold that without spiraling out. | primary: tolerates stillness / stays in the feeling instead of moving; secondary: carries it into one actual next step | {7:2, 9:1} | **7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem.<br>**9 Embodiment / Completion** (Yesod → Malkuth) — Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `e` | Losing the drink scares me more, and I'm not going to hate myself for saying it. | primary: takes accountability without prosecuting himself | {6:3} | **6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `f` | I understand the risk and it doesn't feel real. I can name the gap between those. | primary: separates what is known from what is felt or assumed | {5:3} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `g` | I know what I'm risking and still reach for it. That's the line I keep crossing. | primary: separates what is known from what is felt or assumed; secondary: takes accountability without prosecuting himself | {5:2, 6:1} | **5 Discernment** (Gevurah) — Tension and boundaries. Separating what you know from what you feel and what you assume.<br>**6 Integration** (Tiferet) — Accountability without prosecution. Holding complexity without abandoning yourself in it. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `h` | I'd want to sit with that before I answer it. | primary: receives — body, person, or self — before interpreting or answering; secondary: tolerates stillness / stays in the feeling instead of moving | {8:2, 7:1} | **8 Listening** (Hod) — Timing and disciplined communication. Receiving before interpreting or responding.<br>**7 Staying** (Netzach) — Observation and tolerating stillness. Remaining present rather than escaping into the next problem. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |
| `i` | I don't know yet. | primary: asks the first honest question / admits a genuine unknown | {1:2} | **1 Beginning** (Keter) — Initiation. The first honest question, and the willingness to look at something you have not looked at yet. | unique signature in this question | **PASS** — Wording carries the act of its assigned number; no forced mapping. |

Total options audited: **241**.


## Duplicate / collision test — summary

Identical evidence signatures inside the same question:

| question | ids | signature | severity | reason |
|---|---|---|---|---|
| `drink-1` | `good` / `well` | {2:3} | low | different follow-ups (`drink-reward` / `drink-good-life`) preserve the distinction |
| `drink-1` | `confidence` / `escape` | {6:3} | low | different follow-ups |
| `drink-1` | `nothink` / `routine` | {3:3} | low | different follow-ups |
| `drink-gone` | `b` / `e` | {2:3} | high | same route, distinct mechanisms, indistinguishable in scoring |
| `drink-gone` | `c` / `l` | {3:3} | high | substitution vs. automaticity; `c` also carries `avoids` |
| `drink-changes` | `c` / `j` | {5:3} | high | trade-off naming vs. seeing the activity is not the point |
| `drink-fear` | `a` / `k` | {9:3} | high | terminal page; two distinct fears score identically |
| `drink-fear` | `h` / `l` | {1:2,7:1} | medium | "scared to start" vs. "leave it there" |

No cross-question semantic duplicate was found that maps to a *different* criterion — recurring wording (same hour / same reach / I don't know) consistently maps to the same number and weight, so nothing is double-counted against the framework.

## Exhaustive mathematical stress test

Run against the actual exported `buildSequence` and `evaluatePattern` (no mock engine), drink doorway only.

**Exhaustive sweep — 847,206 complete paths.**

| check | result |
|---|---|
| path length | every path exactly 6 pages — 0 violations |
| weights | no evidence weight > 3 |
| per-choice sums | all within 2–3 |
| references | no unmapped answer, no dangling `followUp`/`next` |
| option coverage | 241 / 241 options exercised |
| numbers reachable as primary | all nine |
| Undetermined | 239,560 paths = 28.3% (within the validated 25–30% band) |
| deeper-probe resolution | 398 / 400 sampled undetermined readings resolved; no dead ends |

**Primary distribution across all paths**

| number | paths | share |
|---|---|---|
| 2 Duality | 107,535 | 12.7% |
| 3 Pattern | 96,399 | 11.4% |
| 5 Discernment | 79,406 | 9.4% |
| 1 Beginning | 73,738 | 8.7% |
| 6 Integration | 63,001 | 7.4% |
| 8 Listening | 55,132 | 6.5% |
| 7 Staying | 46,466 | 5.5% |
| 4 Structure | 45,551 | 5.4% |
| 9 Embodiment / Completion | 40,418 | 4.8% |
| Undetermined | 239,560 | 28.3% |

**Sensitivity sweep — 3,000 random complete paths, every alternative answer re-scored at every page**

| metric | result |
|---|---|
| single-answer share of the primary number's raw evidence | median 0.50, p90 0.60 |
| readings where one answer supplies ≥50% of primary evidence | 59% |
| probability that changing one answer changes the primary — page 1 | 0.83 |
| pages 2, 3 | 0.48, 0.46 |
| pages 4, 5, 6 | 0.62, 0.60, 0.47 |

### Instrument problems the mathematics exposes

1. **Availability discount favours thinly-offered numbers.** Because `W = raw / sqrt(available) * 2`, a number offered at low reach converts raw evidence more cheaply. 1 is capped at reach 2 in nearly every drink question (reach 3 only in `drink-myself-2/c` and `drink-fear/b`), so the honest non-knowing tails accumulate into 1 as a *primary* on 8.7% of paths — a person answering "I don't know" repeatedly can be handed Beginning instead of Undetermined. This is an instrument-side artefact of where weight-2 tails were placed, not a fault in the formula.
2. **Answer-level dominance.** With a median 0.50 single-answer share and a 0.83 page-1 flip rate, the six-page instrument behaves like a 2–3 answer instrument. Page 1 legitimately selects the thread, but it also carries a full-weight-3 mapping in most options, so it both routes and scores.
3. **Uneven page width.** `drink-power` scores only 5 of 9 numbers (no availability for 1, 5, 6, 8) and `drink-layer2` scores 6, so which page-5 variant a person lands on changes which numbers are even eligible.
4. **9 is structurally under-sampled.** No 9 availability at all in `drink-1`, `drink-better`, `drink-myself-2`, `drink-routine`, `drink-routine-2`, `drink-layer2` or `drink-power`; 9 has the lowest primary rate in the branch.

### Availability map (max reach per number, per reachable question)

| question | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| `drink-1` | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | — |
| `drink-reward` | 2 | 1 | 3 | — | 3 | 2 | — | 3 | — |
| `drink-better` | 2 | 3 | 2 | — | 2 | — | 3 | 3 | — |
| `drink-confidence` | 2 | 3 | 3 | 3 | — | 3 | — | 3 | 3 |
| `drink-calm` | 1 | — | 3 | 3 | 2 | — | 3 | 3 | 3 |
| `drink-nothink` | 2 | — | 3 | 3 | 3 | 3 | 3 | 3 | — |
| `drink-without` | 2 | — | — | 3 | 3 | 3 | 3 | 3 | 3 |
| `drink-routine` | 2 | 3 | 3 | 3 | 3 | 3 | 3 | — | — |
| `drink-routine-2` | 2 | 3 | 3 | 3 | 1 | 3 | — | 2 | — |
| `drink-forward` | 2 | 1 | 3 | 2 | 2 | — | — | 2 | 3 |
| `drink-myself` | 2 | 2 | 3 | 2 | — | 3 | 3 | 3 | 3 |
| `drink-myself-2` | 3 | 3 | 3 | 3 | 3 | — | — | 2 | — |
| `drink-bored` | 2 | 2 | 3 | 3 | 1 | — | 3 | 1 | 3 |
| `drink-escape` | 2 | 3 | 3 | — | 3 | 3 | 3 | 3 | 3 |
| `drink-good-life` | 2 | 3 | 3 | 1 | 3 | — | 3 | — | 3 |
| `drink-plain-hour` | 2 | 3 | 3 | 3 | 2 | 2 | 3 | 3 | 3 |
| `drink-unclear` | 2 | — | 3 | 3 | 2 | — | 3 | 3 | 2 |
| `drink-layer2` | 2 | 3 | 3 | — | 3 | 2 | — | 3 | — |
| `drink-lost` | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| `drink-power` | — | 3 | 3 | 2 | — | — | 3 | — | 3 |
| `drink-gone` | 2 | 3 | 3 | 3 | 1 | 3 | 3 | 2 | 3 |
| `drink-changes` | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 3 |
| `drink-missing` | 1 | 3 | 3 | 2 | 3 | 3 | 3 | 2 | 3 |
| `drink-boredom` | 1 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 3 |
| `drink-fear` | 3 | 3 | — | 3 | 3 | 3 | 2 | 2 | 3 |
| `drink-want` | 1 | 3 | 3 | 3 | 3 | 3 | — | 2 | 3 |
| `drink-inertia` | 2 | 3 | 3 | 3 | 3 | 3 | 2 | 1 | 3 |
| `drink-consequence` | 2 | 3 | 3 | — | 3 | 3 | 2 | 2 | 3 |

## Flag roll-up — instrument-only recommendations (nothing applied)

**REMOVE (2)**
- `drink-gone/e` — duplicate of `drink-gone/b`.
- `drink-fear/l` — near-duplicate of `drink-fear/h` on a terminal page.

**REWORD (6, mapping unchanged)**
- `drink-gone/c` and `drink-gone/l`
- `drink-changes/c` and `drink-changes/j`
- `drink-fear/a` and `drink-fear/k`

**RE-MAP (0)** — no response in the branch was found expressing a mechanism other than its assigned number. Nothing needed rescuing by reinterpretation.

**Coverage / balance, for Sarah's decision (framework untouched either way)**
- add a 9 (real next step) option to `drink-1` and to `drink-power`;
- give 1 one genuine reach-3 "first honest question" slot per page rather than only weight-2 tails, or accept that repeated non-knowing can read as Beginning;
- widen `drink-power` beyond 5 numbers so page 5 does not pre-select the eligible set.

**Standing framework item, not an instrument fix:** `DEEPER_PROBES` still carry weight-4 evidence against the 1–3 house convention. Unchanged, and awaiting an explicit framework decision.

## Lock status

Structure, integrity, option coverage, path length, reachability, Undetermined rate and probe resolution are all clean, so the branch is mechanically sound. **Not recommended for lock yet:** the four high-severity collisions and the 9/1 availability skew would be locked in with it. With the REMOVE/REWORD items applied and the sweep re-run, the branch can be locked in a single pass.
