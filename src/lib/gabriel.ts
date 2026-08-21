/**
 * Gabriel's Number — Vol. 2
 *
 * Working psychological-symbolic framework: nine dimensions, each with a
 * Tree of Life mapping. Answers accumulate *evidence* toward dimensions.
 * Nothing is averaged. The result is the dimension with the strongest
 * coherent pattern across the answers — or "undetermined" when the answers
 * do not cohere yet.
 *
 * The Tree of Life and number mappings here are OUR working
 * psychological-symbolic mappings. They are not claims about what
 * traditional Kabbalah or Pythagorean numerology officially assigns.
 */

export type GNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const G_NUMBERS: GNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface NumberMeaning {
  n: GNumber;
  /** Short name of the dimension. */
  name: string;
  /** Tree of Life mapping (working map). */
  tree: string;
  /** The psychological-symbolic meaning. */
  meaning: string;
  /** The core lesson. */
  lesson: string;
  /** Used in the plain-language reasoning: "your answers kept returning to …" */
  signal: string;
}

export const NUMBERS: Record<GNumber, NumberMeaning> = {
  1: {
    n: 1,
    name: "Beginning",
    tree: "Keter",
    meaning:
      "Initiation. The first honest question, and the willingness to look at something you have not looked at yet.",
    lesson: "Start with the first honest question. You don't need the whole answer to begin.",
    signal: "beginning — the willingness to look before you know",
  },
  2: {
    n: 2,
    name: "Duality",
    tree: "Chokmah",
    meaning:
      "Holding two truths at once. Perspective. Seeing your own contribution without making yourself the villain of it.",
    lesson: "Hold two truths at once.",
    signal: "duality — holding two true things at the same time",
  },
  3: {
    n: 3,
    name: "Pattern",
    tree: "Binah",
    meaning:
      "Recognizing what recurs, and noticing how your emotional state changes what you perceive.",
    lesson: "Notice recurring patterns without immediately turning them into judgments.",
    signal: "pattern — what keeps returning, and what your state does to your view of it",
  },
  4: {
    n: 4,
    name: "Structure",
    tree: "Chesed",
    meaning:
      "Creating a container. Stability. Turning an insight into something repeatable rather than something you had once.",
    lesson: "Give insight a container.",
    signal: "structure — giving this a container instead of carrying it loose",
  },
  5: {
    n: 5,
    name: "Discernment",
    tree: "Gevurah",
    meaning:
      "Tension and boundaries. Separating what you know from what you feel and what you assume.",
    lesson: "Separate what you know, what you feel, and what you assume.",
    signal: "discernment — separating what you know from what you feel and assume",
  },
  6: {
    n: 6,
    name: "Integration",
    tree: "Tiferet",
    meaning:
      "Accountability without prosecution. Holding complexity without abandoning yourself in it.",
    lesson: "Bring opposing pieces together without self-punishment.",
    signal: "integration — accountability that doesn't turn into a case against you",
  },
  7: {
    n: 7,
    name: "Staying",
    tree: "Netzach",
    meaning:
      "Observation and tolerating stillness. Remaining present rather than escaping into the next problem.",
    lesson:
      "Remain present when uncomfortable — or even when things are going well — instead of escaping into the next problem.",
    signal: "staying — remaining present instead of moving into the next thing",
  },
  8: {
    n: 8,
    name: "Listening",
    tree: "Hod",
    meaning:
      "Timing and disciplined communication. Receiving before interpreting or responding.",
    lesson:
      "Receive before interpreting. Slow the urge to explain, interrupt, solve, or respond.",
    signal: "listening — receiving before interpreting or answering",
  },
  9: {
    n: 9,
    name: "Embodiment / Completion",
    tree: "Yesod → Malkuth",
    meaning:
      "Carrying the lesson forward. Release, embodiment, and the next right step rather than the whole solution.",
    lesson:
      "Carry insight into behavior. Release the need to solve everything and take the next right step.",
    signal: "embodiment — carrying this into one actual next step",
  },
};

/** Evidence a single choice contributes. Weights are small on purpose. */
export type Evidence = Partial<Record<GNumber, number>>;

export interface Choice {
  id: string;
  label: string;
  evidence: Evidence;
  /** If set, choosing this opens a follow-up question by id. */
  followUp?: string;
  /**
   * Marks an answer that actually suggests avoidance or discomfort. The
   * universal "what are you trying not to experience" question is only asked
   * when the person's own answers point that way — never by default.
   */
  avoids?: boolean;
}

export interface Question {
  id: string;
  prompt: string;
  note?: string;
  choices: Choice[];
  /** Asked next regardless of which answer was chosen (linear chains). */
  next?: string;
  /**
   * AUDIT FLAG — non-scoring metadata. Set when a question fails the
   * question-design standard (generic self-help wording, asks the person to
   * name a psychological mechanism, or repeats a dimension without adding
   * discrimination) and is queued for a creative rebuild. The string records
   * the 1–9 information target that MUST be preserved by the rebuild.
   * This field never affects evidence, weights, or convergence.
   */
  rebuild?: string;
}


export interface Doorway {
  id: string;
  label: string;
  sub: string;
  /** Doorway-specific questions, asked in order. */
  questions: Question[];
  /**
   * When the universal "trying not to experience" branch is asked:
   * "ifAvoidance" (default posture), "always", or "never".
   */
  universal: "always" | "ifAvoidance" | "never";
  /**
   * PRESERVED-BUT-HIDDEN. When true the doorway keeps all of its questions,
   * mappings and follow-ups intact but is not offered on the start screen.
   * Nothing is deleted, so the branch can be renamed or rebuilt later.
   * Never affects evidence, weights, thresholds or convergence.
   */
  hidden?: boolean;
  /**
   * Optional id of a doorway-specific closing question (resolved from
   * BRANCH_QUESTIONS at runtime). When present it replaces the shared final
   * core question as the last question of the path, so a branch ends on
   * something specific to its own thread instead of the generic closer.
   * Doorways without one keep the shared closer (unchanged behavior).
   */
  closing?: string;
  /**
   * Optional fixed-length architecture. `prefixPages` questions come from the
   * doorway's own opening chain, then the path continues into `stage2` and is
   * capped at `totalPages`, so the branch always has the same number of pages
   * however the person answers.
   */
  stage2?: string;
  prefixPages?: number;
  totalPages?: number;
}



/* ------------------------------------------------------------------ */
/* The universal branch                                               */
/* ------------------------------------------------------------------ */

export const UNIVERSAL_QUESTION: Question = {
  id: "u1",
    rebuild:
      "REQUIRES REBUILD — banned generic what-are-you-avoiding framing. Information target to preserve: which dimension the avoidance sits in (7 staying, 8 listening, 5 discernment, 4 structure, 9 embodiment).",
  prompt: "What are you trying not to experience right now?",
  note: "Not an accusation. Sometimes the honest answer is that you aren't avoiding anything.",
  choices: [
    { id: "u1-discomfort", label: "A feeling I don't want to sit in", evidence: { 7: 2, 9: 1 }, followUp: "uf-discomfort" },
    { id: "u1-conversation", label: "A conversation I keep putting off", evidence: { 8: 2, 2: 1 }, followUp: "uf-conversation" },
    { id: "u1-uncertainty", label: "Not knowing how this turns out", evidence: { 5: 2, 7: 1 }, followUp: "uf-uncertainty" },
    { id: "u1-decision", label: "Being the one who has to decide", evidence: { 4: 2, 6: 1 }, followUp: "uf-decision" },
    { id: "u1-boredom", label: "Boredom. The quiet. Nothing happening", evidence: { 7: 3 }, followUp: "uf-boredom" },
    { id: "u1-task", label: "One specific thing I said I'd do", evidence: { 9: 3 } },
    { id: "u1-relief", label: "Nothing in particular — I just want a break", evidence: { 9: 1, 7: 1 }, followUp: "uf-relief" },
    { id: "u1-enjoy", label: "Honestly nothing. I'm enjoying myself", evidence: { 7: 1, 2: 1 } },
    { id: "u1-unsure", label: "I don't know", evidence: { 1: 1 } },
  ],
};

export const UNIVERSAL_FOLLOW_UPS: Record<string, Question> = {
  "uf-discomfort": {
    id: "uf-discomfort",
    rebuild:
      "REQUIRES REBUILD — banned where-does-the-discomfort-sit framing. Target: body/unsaid/known-task/undifferentiated (7, 8, 9+4, 5+1).",
    prompt: "Where does the discomfort actually sit?",
    choices: [
      { id: "a", label: "In my body — restless, tight, wired", evidence: { 7: 2, 3: 1 } },
      { id: "b", label: "In something I haven't said", evidence: { 8: 2 } },
      { id: "c", label: "In something I already know I need to do", evidence: { 9: 2, 4: 1 } },
      { id: "d", label: "In not knowing which part is the problem", evidence: { 5: 2, 1: 1 } },
      { id: "e", label: "I can't locate it", evidence: { 1: 1 } },
    ],
  },
  "uf-conversation": {
    id: "uf-conversation",
    rebuild:
      "REQUIRES REBUILD — follow-up of the banned u1 family. Target: what makes the unsaid thing hard (8 listening, 5 discernment, 6 integration, 4 timing).",
    prompt: "What's the harder part of it?",
    choices: [
      { id: "a", label: "Hearing what they'll say", evidence: { 8: 3 } },
      { id: "b", label: "Saying my part accurately", evidence: { 8: 2, 5: 1 } },
      { id: "c", label: "Admitting where I contributed", evidence: { 6: 3 } },
      { id: "d", label: "Choosing when to have it", evidence: { 8: 2, 4: 1 } },
      { id: "e", label: "Not sure yet", evidence: { 1: 1 } },
    ],
  },
  "uf-uncertainty": {
    id: "uf-uncertainty",
    rebuild:
      "REQUIRES REBUILD — follow-up of the banned u1 family. Target: kind of not-knowing (5 gettable, 7 time-only, 2/8 another person, 1 unknown want).",
    prompt: "What kind of not-knowing is it?",
    choices: [
      { id: "a", label: "Information I could actually get", evidence: { 5: 3 } },
      { id: "b", label: "Something only time answers", evidence: { 7: 3 } },
      { id: "c", label: "What someone else is thinking", evidence: { 2: 2, 8: 1 } },
      { id: "d", label: "What I want", evidence: { 5: 1, 1: 2 } },
      { id: "e", label: "I don't know", evidence: { 1: 1 } },
    ],
  },
  "uf-decision": {
    id: "uf-decision",
    rebuild:
      "REQUIRES REBUILD — follow-up of the banned u1 family. Target: what makes deciding heavy (2 others, 5 real loss, 4 holding to it).",
    prompt: "What makes it heavy?",
    choices: [
      { id: "a", label: "It affects someone besides me", evidence: { 2: 2, 6: 1 } },
      { id: "b", label: "There's no version where nothing is lost", evidence: { 5: 2, 6: 1 } },
      { id: "c", label: "I'd have to hold to it afterwards", evidence: { 4: 3 } },
      { id: "d", label: "I'm not sure it's mine to make", evidence: { 2: 2, 5: 1 } },
      { id: "e", label: "Not sure", evidence: { 1: 1 } },
    ],
  },
  "uf-boredom": {
    id: "uf-boredom",
    rebuild:
      "REQUIRES REBUILD — follow-up of the banned u1 family. Target: what surfaces in the quiet (9 undone task, 3 loop, 7 skipped feeling).",
    prompt: "When the quiet comes, what usually turns up in it?",
    choices: [
      { id: "a", label: "Something I've been putting off", evidence: { 9: 2, 4: 1 } },
      { id: "b", label: "An old thought on a loop", evidence: { 3: 3 } },
      { id: "c", label: "A feeling I'd rather skip", evidence: { 7: 3 } },
      { id: "d", label: "Nothing — it's just flat", evidence: { 7: 2 } },
      { id: "e", label: "I don't stay long enough to find out", evidence: { 7: 2, 1: 1 } },
    ],
  },
  "uf-relief": {
    id: "uf-relief",
    rebuild:
      "REQUIRES REBUILD — follow-up of the banned u1 family. Target: relief from what (3 repetition, 4/6 responsibility, 7/8 waiting, 6 self).",
    prompt: "Relief from what, if you had to name it?",
    choices: [
      { id: "a", label: "Thinking about the same thing again", evidence: { 3: 3 } },
      { id: "b", label: "Being the responsible one", evidence: { 4: 2, 6: 1 } },
      { id: "c", label: "Waiting for something to resolve", evidence: { 7: 2, 8: 1 } },
      { id: "d", label: "Myself, a bit", evidence: { 6: 3 } },
      { id: "e", label: "Can't say", evidence: { 1: 1 } },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Shared closing questions                                            */
/* ------------------------------------------------------------------ */

export const CORE_QUESTIONS: Question[] = [
  {
    id: "c1",
    rebuild:
      "REQUIRES REBUILD — asks the person to label their own epistemics (known vs felt vs assumed) in quiz language. Target: fact-vs-interpretation split (5, 3, 2, 6/7, 1).",
    prompt: "Right now, which of these is doing most of the talking?",
    choices: [
      { id: "a", label: "What I actually know", evidence: { 5: 2, 9: 1 } },
      { id: "b", label: "What I feel", evidence: { 3: 2, 7: 1 } },
      { id: "c", label: "What I'm assuming about someone else", evidence: { 2: 2, 5: 1 } },
      { id: "d", label: "What I'm afraid of", evidence: { 7: 2, 6: 1 } },
      { id: "e", label: "I can't tell them apart yet", evidence: { 5: 2, 1: 1 } },
    ],
  },
  {
    id: "c2",
    prompt: "If you left this completely alone for a week, what happens?",
    choices: [
      { id: "a", label: "Nothing changes — it just keeps circling", evidence: { 3: 2, 9: 1 } },
      { id: "b", label: "It gets decided for me", evidence: { 4: 2, 8: 1 } },
      { id: "c", label: "It probably settles on its own", evidence: { 7: 2, 8: 1 } },
      { id: "d", label: "I'd feel better and know less", evidence: { 7: 2, 5: 1 } },
      { id: "e", label: "I genuinely don't know", evidence: { 1: 2 } },
    ],
  },
  {
    id: "c3",
    rebuild:
      "REQUIRES REBUILD — options restate the nine lessons back to the person, so it self-reports the result instead of gathering evidence. Target: one clean read of which dimension the person reaches for (9, 8, 7, 4, 6, 1).",
    prompt: "And what would help most in the next hour?",
    note: "Last one.",
    choices: [
      { id: "a", label: "One small thing I actually do", evidence: { 9: 3 } },
      { id: "b", label: "Hearing someone else out first", evidence: { 8: 3 } },
      { id: "c", label: "Sitting with it without fixing it", evidence: { 7: 3 } },
      { id: "d", label: "Writing down what I know so far", evidence: { 4: 3 } },
      { id: "e", label: "Being less hard on myself about it", evidence: { 6: 3 } },
      { id: "f", label: "Asking a better question than the one I started with", evidence: { 1: 3 } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Doorways                                                            */
/* ------------------------------------------------------------------ */

export const ALL_DOORWAYS: Doorway[] = [
  {
    id: "lost",
    label: "I don't know what the hell to do today",
    sub: "Unfocused, and it's getting louder",
    universal: "ifAvoidance",
    questions: [
      {
        id: "lost-1",
        prompt: "Which one is closest?",
        choices: [
          { id: "many", label: "I have too many things I could do and can't choose", evidence: { 4: 2, 5: 1 }, followUp: "lost-many" },
          { id: "should", label: "I know what I should do, but I don't want to do it", evidence: { 9: 2 }, followUp: "lost-should", avoids: true },
          { id: "restless", label: "Nothing is actually wrong. I'm just restless", evidence: { 7: 2 }, followUp: "lost-restless" },
          { id: "stim", label: "I feel like I need something stimulating", evidence: { 7: 2, 3: 1 }, followUp: "lost-stim" },
          { id: "avoid", label: "I'm avoiding something I know I need to deal with", evidence: { 9: 2, 7: 1 }, followUp: "lost-avoid", avoids: true },
          { id: "tell", label: "I want somebody else to tell me what to do", evidence: { 8: 2, 4: 1 }, followUp: "lost-tell" },
          { id: "spont", label: "I want to do something spontaneous", evidence: { 9: 1, 7: 1 }, followUp: "lost-spont" },
          { id: "okay", label: "I feel strangely uncomfortable because everything is going okay", evidence: { 7: 2, 6: 1 }, followUp: "lost-okay" },
          { id: "unknown", label: "I genuinely don't know what I need", evidence: { 1: 2 }, followUp: "lost-unknown" },
        ],
      },
    ],
  },
  {
    id: "chance",
    hidden: true,
    label: "Should I take a chance?",
    sub: "Something's on the table",
    universal: "ifAvoidance",
    questions: [
      {
        id: "chance-1",
        prompt: "What kind of chance is it?",
        choices: [
          { id: "money", label: "Something financial", evidence: { 5: 2, 4: 1 } },
          { id: "love", label: "Something romantic", evidence: { 2: 2, 8: 1 } },
          { id: "say", label: "Saying something I've been holding back", evidence: { 8: 2, 9: 1 } },
          { id: "work", label: "A career or work decision", evidence: { 4: 2, 5: 1 } },
          { id: "new", label: "Doing something I've never done", evidence: { 1: 2, 9: 1 } },
          { id: "bored", label: "Taking a risk because I'm bored", evidence: { 7: 2 } },
          { id: "gut", label: "Trusting my gut", evidence: { 3: 1, 9: 2 } },
          { id: "leave", label: "Walking away from something", evidence: { 9: 2, 6: 1 } },
          { id: "vague", label: "I don't even know what the chance is yet", evidence: { 1: 2 } },
        ],
        next: "chance-2",
      },
    ],
  },
  {
    id: "spiral",
    label: "My brain is spiraling",
    sub: "It's moving fast and not going anywhere",
    universal: "ifAvoidance",
    // Fixed six-page architecture, same shape as the drinking branch:
    // three adaptive pages (what it's doing → how it's doing it → what it's
    // actually about) then a fixed stage 2 (fact/built line → what stops it →
    // what would actually end it). No new scoring framework: every choice
    // maps into the existing 1–9 evidence weights.
    stage2: "spiral-known",
    prefixPages: 3,
    totalPages: 6,
    questions: [
      {
        id: "spiral-1",
        prompt: "What is it actually doing right now?",
        choices: [
          { id: "replay", label: "Replaying something that already happened", evidence: { 3: 2, 8: 1 }, followUp: "spiral-replay" },
          { id: "predict", label: "Predicting something that hasn't happened", evidence: { 7: 2, 3: 1 }, followUp: "spiral-predict" },
          { id: "meant", label: "Trying to figure out what someone else meant", evidence: { 8: 2, 2: 1 }, followUp: "spiral-meant" },
          { id: "reassure", label: "Searching for reassurance", evidence: { 2: 2, 7: 1 }, followUp: "spiral-reassure" },
          { id: "unsolvable", label: "Trying to solve a problem that doesn't have an answer yet", evidence: { 7: 2, 5: 1 }, followUp: "spiral-unsolvable" },
          { id: "worst", label: "Finding everything that could go wrong", evidence: { 5: 2, 7: 1 }, followUp: "spiral-predict" },
          { id: "jump", label: "Jumping between several problems", evidence: { 4: 2, 3: 1 }, followUp: "spiral-jump" },
          { id: "stuck", label: "Getting stuck on one thought", evidence: { 3: 3 }, followUp: "spiral-stuck" },
          { id: "unknown", label: "I can't even tell what started it", evidence: { 1: 2 }, followUp: "spiral-unknown" },
        ],
      },
    ],
  },

  {
    id: "drink",
    label: "Why the fuck do I want a drink right now?",
    sub: "No lecture. Just a look at what the urge is actually for",
    universal: "ifAvoidance",
    stage2: "drink-lost",
    prefixPages: 3,
    totalPages: 6,

    questions: [
      {
        id: "drink-1",
        prompt:
          "When the urge hits, what sounds so damn appealing about saying \u201cfuck it\u201d and having one?",
        note: "You already know it's bad for you. You already know the consequences. You already know what tomorrow might feel like. So that's not the question.",
        choices: [
          // 2 — holds the wanted outcome and the known cost at once; the cost is
          // named as known, not feared, which is why 5 rides along quietly
          { id: "good", label: "I know it'll feel good, and I know I'll regret it. Both are true.", evidence: { 2: 3, 5: 1 }, followUp: "drink-reward" },
          // 1 — knows the feeling, doesn't know the cause; honest first question
          { id: "better", label: "I feel bad and I want to feel better. Ask me why I feel bad and I've got nothing.", evidence: { 1: 2, 5: 1 }, followUp: "drink-better" },
          // 6 — being with people without prosecuting himself; the room is
          // something he wants to actually receive, hence the quiet 8
          { id: "confidence", label: "I want to be around people without running a case against myself the whole time.", evidence: { 6: 3, 8: 1 }, followUp: "drink-confidence" },
          // 4 — wants a container/marker on a shapeless day
          { id: "calm", label: "Nothing today had edges. I want something that closes the day out.", evidence: { 4: 3 }, followUp: "drink-calm" },
          // 8 — receiving what the body reports before overruling it
          { id: "shit", label: "My body doesn't feel right without it. I want to hear that straight before I decide anything.", evidence: { 8: 3 }, followUp: "drink-without" },
          // 3 — recognizes the recurring shape; the fixed hour is also a
          // container, which is the 4 riding underneath the pattern
          { id: "routine", label: "Same hour, same reach, every day. I can see the shape of it.", evidence: { 3: 3, 4: 1 }, followUp: "drink-routine" },
          // 2 — two selves held at once, neither disowned
          { id: "myself", label: "I don't feel like me — and I'm not sure the drinking version is me either.", evidence: { 2: 2, 1: 1 }, followUp: "drink-myself" },
          // 7 — can tolerate the empty hour, and knows it
          { id: "bored", label: "Nothing's happening. Part of me knows I could just let the hour be empty.", evidence: { 7: 3 }, followUp: "drink-bored" },
          // 6 — owns the move without turning it into a verdict
          { id: "escape", label: "I want out of how I feel. I'm doing that on purpose and I'm not going to call myself weak for it.", evidence: { 6: 3 }, followUp: "drink-escape", avoids: true },
          // 9 — names an actual undone step and where he goes instead of taking it
          { id: "instead", label: "There's one thing I said I'd do tonight. The drink is where I go instead of doing it.", evidence: { 9: 3 }, followUp: "drink-bored", avoids: true },
          // 5 — separates the want from the story he could build on it
          { id: "plain", label: "I just fucking want one. I'm not going to build a story on top of it.", evidence: { 5: 3 }, followUp: "drink-plain-hour" },
          // 1 — the first honest question
          { id: "unclear", label: "I don't know. That's literally why I'm here.", evidence: { 1: 2 }, followUp: "drink-unclear" },
        ],
      },
    ],
  },

  {
    id: "gamble",
    hidden: true,
    label: "I'm feeling lucky — should I gamble?",
    sub: "Playful, but let's be honest about it",
    universal: "ifAvoidance",
    questions: [
      {
        id: "gamble-1",
        prompt: "Where's the lucky feeling coming from?",
        note: "No judgment here. Sometimes it's just a good mood.",
        choices: [
          { id: "a", label: "Good mood, nothing more", evidence: { 7: 1, 2: 1 } },
          { id: "b", label: "A run of things going right", evidence: { 3: 2, 7: 1 } },
          { id: "c", label: "I'm behind and want to catch up", evidence: { 5: 2, 6: 1 }, avoids: true },
          { id: "d", label: "I'm bored and want something to happen", evidence: { 7: 3 } },
          { id: "e", label: "I want to have fun and this is fun", evidence: { 2: 1, 9: 1 } },
          { id: "f", label: "Not sure", evidence: { 1: 1 } },
        ],
      },
      {
        id: "gamble-2",
        prompt: "Do you have a number you've already decided on?",
        choices: [
          { id: "a", label: "Yes, a set amount, and I stick to it", evidence: { 4: 3 } },
          { id: "b", label: "Yes, but I've moved it before", evidence: { 4: 1, 3: 2 } },
          { id: "c", label: "No line", evidence: { 4: 2, 5: 1 } },
          { id: "d", label: "Hadn't thought about it", evidence: { 1: 2 } },
        ],
      },
    ],
  },

  {
    // THE CHASE — rebuilt instrument. Examines the continuation loop: what is
    // happening inside the person at the moment they are tempted to keep going.
    // Same six-page architecture and the same immutable 1–9 evidence weights as
    // the locked branches. No new meanings, thresholds or formula.
    id: "bet",
    label: "The Chase",
    sub: "You're in it and you don't want to stop. A look at what keeps it going",
    universal: "ifAvoidance",
    stage2: "bet-story",
    prefixPages: 3,
    totalPages: 6,
    questions: [
      {
        id: "bet-1",
        prompt: "Where are you in the cycle right now?",
        note: "No advice, no strategy. Just where you actually are.",
        choices: [
          { id: "up", label: "I'm up. I know I should leave, but I still want to keep going.", evidence: { 2: 3 }, followUp: "bet-up" },
          { id: "down", label: "I'm down. I want to get the money back.", evidence: { 3: 2, 5: 1 }, followUp: "bet-down" },
          { id: "even", label: "I'm about even, and I don't want to stop yet.", evidence: { 7: 3 }, followUp: "bet-even" },
          { id: "early", label: "I haven't lost or won much yet. I just feel pulled to keep going.", evidence: { 8: 3 }, followUp: "bet-early", avoids: true },
        ],
      },
    ],
  },

  {
    id: "talk",
    hidden: true,
    label: "I want to talk to someone but don't know if now is right",
    sub: "The what may be settled; the when isn't",
    universal: "ifAvoidance",
    questions: [
      {
        id: "talk-1",
        prompt: "What do you want out of the conversation?",
        choices: [
          { id: "a", label: "To be understood", evidence: { 8: 2, 2: 1 } },
          { id: "b", label: "To understand what they meant", evidence: { 8: 3 } },
          { id: "c", label: "For something to actually change", evidence: { 9: 2, 4: 1 } },
          { id: "d", label: "To stop carrying it alone", evidence: { 6: 2, 7: 1 } },
          { id: "e", label: "To get it over with", evidence: { 9: 2, 7: 1 }, avoids: true },
          { id: "f", label: "I don't know yet", evidence: { 1: 2 } },
        ],
      },
      {
        id: "talk-2",
        prompt: "Have you said the important part out loud to them, or only in your head?",
        choices: [
          { id: "a", label: "Only in my head", evidence: { 8: 2, 3: 1 } },
          { id: "b", label: "Part of it, sideways", evidence: { 8: 2, 5: 1 } },
          { id: "c", label: "Yes, and it didn't land", evidence: { 2: 2, 8: 1 } },
          { id: "d", label: "Yes, and I'm waiting on them", evidence: { 7: 2, 8: 1 } },
        ],
      },
      {
        id: "talk-3",
        prompt: "If they answered in a way you didn't expect, what would you do?",
        choices: [
          { id: "a", label: "Explain myself again", evidence: { 8: 2, 2: 1 } },
          { id: "b", label: "Ask what they meant", evidence: { 8: 3 } },
          { id: "c", label: "Go quiet and think about it for a week", evidence: { 7: 2, 3: 1 } },
          { id: "d", label: "Honestly, react", evidence: { 6: 2, 3: 1 } },
        ],
      },
    ],
  },
  {
    id: "well",
    label: "Everything's going really well and I'm not used to that",
    sub: "Calm can feel unfamiliar",
    universal: "ifAvoidance",
    questions: [
      {
        id: "well-1",
        prompt: "What does the good stretch feel like from the inside?",
        choices: [
          { id: "a", label: "Like I'm waiting for the other shoe", evidence: { 7: 3 } },
          { id: "b", label: "Like I should be doing more with it", evidence: { 7: 2, 9: 1 } },
          { id: "c", label: "Undeserved", evidence: { 6: 3 } },
          { id: "d", label: "Good, and unfamiliar", evidence: { 7: 2, 2: 1 } },
          { id: "e", label: "Quietly boring, if I'm honest", evidence: { 7: 2, 3: 1 } },
          { id: "f", label: "Hard to describe", evidence: { 1: 2 } },
        ],
      },
      {
        id: "well-2",
        prompt: "What do you usually do when things are calm?",
        choices: [
          { id: "a", label: "Find the next problem", evidence: { 7: 3 } },
          { id: "b", label: "Brace", evidence: { 7: 2, 3: 1 } },
          { id: "c", label: "Build something on it", evidence: { 4: 2, 9: 1 } },
          { id: "d", label: "Actually rest", evidence: { 7: 2, 9: 1 } },
          { id: "e", label: "It hasn't been calm long enough to know", evidence: { 1: 2 } },
        ],
      },
    ],
  },
  {
    id: "happened",
    label: "Something happened and I can't stop thinking about it",
    sub: "One event, still running",
    universal: "ifAvoidance",
    questions: [
      {
        id: "happened-1",
        prompt: "Can you say what happened without saying what it meant?",
        choices: [
          { id: "a", label: "Yes, easily", evidence: { 5: 3 } },
          { id: "b", label: "Yes, but the meaning comes right after", evidence: { 5: 2, 3: 1 } },
          { id: "c", label: "Not really — they're the same thing to me", evidence: { 5: 2, 2: 1 } },
          { id: "d", label: "I haven't tried", evidence: { 1: 2 } },
        ],
      },
      {
        id: "happened-2",
        prompt: "When it replays, does anything change?",
        choices: [
          { id: "a", label: "Yes — I notice something new each time", evidence: { 3: 1, 9: 2 } },
          { id: "b", label: "The wording changes, not the content", evidence: { 3: 3 } },
          { id: "c", label: "It's identical every time", evidence: { 3: 2, 7: 1 } },
          { id: "d", label: "It gets worse each pass", evidence: { 6: 2, 7: 1 } },
        ],
      },
      {
        id: "happened-3",
        prompt: "What's your part in it?",
        note: "Contribution, not verdict.",
        choices: [
          { id: "a", label: "I can name it without piling on myself", evidence: { 6: 3 } },
          { id: "b", label: "I can name it and then I don't stop", evidence: { 6: 2, 3: 1 } },
          { id: "c", label: "I don't think I have one", evidence: { 2: 2 } },
          { id: "d", label: "Still working that out", evidence: { 1: 1, 2: 1 } },
        ],
      },
    ],
  },
  {
    id: "loop",
    label: "The same thing keeps happening again",
    sub: "A shape you recognize",
    universal: "ifAvoidance",
    questions: [
      {
        id: "loop-1",
        prompt: "Can you describe it by what happens, rather than what it means about you?",
        choices: [
          { id: "a", label: "Yes — here's the sequence", evidence: { 3: 3 } },
          { id: "b", label: "Partly", evidence: { 3: 2, 5: 1 } },
          { id: "c", label: "It arrives as a conclusion about me", evidence: { 6: 3 } },
          { id: "d", label: "Haven't separated those", evidence: { 5: 2, 1: 1 } },
        ],
      },
      {
        id: "loop-2",
        prompt: "What's different about the times it doesn't happen?",
        choices: [
          { id: "a", label: "I can name it", evidence: { 3: 2, 4: 1 } },
          { id: "b", label: "Different people involved", evidence: { 2: 2, 3: 1 } },
          { id: "c", label: "I was rested, or had more room", evidence: { 4: 2, 7: 1 } },
          { id: "d", label: "It always happens", evidence: { 3: 1, 5: 2 } },
          { id: "e", label: "I've never looked at the exceptions", evidence: { 1: 2 } },
        ],
      },
      {
        id: "loop-3",
        prompt: "What have you tried, and what did it change?",
        choices: [
          { id: "a", label: "Something specific, and it helped a bit", evidence: { 4: 2, 9: 1 } },
          { id: "b", label: "Thought about it a lot", evidence: { 3: 2, 9: 1 } },
          { id: "c", label: "Decided to stop caring about it", evidence: { 7: 2, 6: 1 }, avoids: true },
          { id: "d", label: "Nothing yet", evidence: { 1: 1, 9: 1 } },
        ],
      },
    ],
  },
  {
    id: "surprise",
    label: "Take a chance — pick for me",
    sub: "You bring nothing; we'll start anyway",
    universal: "always",
    questions: [
      {
        id: "surprise-1",
        prompt: "Fine. What's the first true thing about today?",
        choices: [
          { id: "a", label: "I'm carrying something and pretending I'm not", evidence: { 6: 2, 7: 1 }, avoids: true },
          { id: "b", label: "I'm fine and slightly bored", evidence: { 7: 2 } },
          { id: "c", label: "There's one thing I keep not doing", evidence: { 9: 3 } },
          { id: "d", label: "Someone is on my mind", evidence: { 8: 2, 2: 1 } },
          { id: "e", label: "I want to have fun and nothing else", evidence: { 9: 1, 2: 1 } },
          { id: "f", label: "I couldn't tell you", evidence: { 1: 2 } },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Branch questions — reached only through a specific answer            */
/* ------------------------------------------------------------------ */

export const BRANCH_QUESTIONS: Record<string, Question> = {
  /* --- "I don't know what the hell to do today" ------------------- */
  "lost-many": {
    id: "lost-many",
    prompt: "What makes choosing hard?",
    choices: [
      { id: "a", label: "They all matter about the same", evidence: { 5: 3 } },
      { id: "b", label: "Whichever I pick, I'll think about the others", evidence: { 3: 2, 7: 1 } },
      { id: "c", label: "None of them is urgent, so none of them starts", evidence: { 4: 3 } },
      { id: "d", label: "One of them is the real one and I keep skipping it", evidence: { 9: 3 }, avoids: true },
      { id: "e", label: "I just want someone to pick", evidence: { 8: 2, 4: 1 } },
    ],
  },
  "lost-should": {
    id: "lost-should",
    prompt: "What's the honest reason you don't want to do it?",
    choices: [
      { id: "a", label: "It's boring", evidence: { 7: 2, 9: 1 } },
      { id: "b", label: "It'll take longer than I have energy for", evidence: { 4: 2, 9: 1 } },
      { id: "c", label: "It involves someone else", evidence: { 8: 3 } },
      { id: "d", label: "I might find out I did it wrong", evidence: { 6: 3 }, avoids: true },
      { id: "e", label: "I don't actually think it's mine to do", evidence: { 2: 2, 5: 1 } },
      { id: "f", label: "No reason. I just don't want to", evidence: { 7: 2 } },
    ],
  },
  "lost-restless": {
    id: "lost-restless",
    prompt: "What does the restlessness want?",
    choices: [
      { id: "a", label: "Movement — anything but sitting here", evidence: { 7: 3 } },
      { id: "b", label: "Something new to happen to me", evidence: { 1: 2, 7: 1 } },
      { id: "c", label: "People", evidence: { 2: 2, 8: 1 } },
      { id: "d", label: "To finish something I started", evidence: { 9: 3 } },
      { id: "e", label: "No idea, it just hums", evidence: { 1: 2 } },
    ],
  },
  "lost-stim": {
    id: "lost-stim",
    prompt: "Stimulating how?",
    choices: [
      { id: "a", label: "Loud, fast, other people", evidence: { 2: 2, 7: 1 } },
      { id: "b", label: "Something hard enough to hold my attention", evidence: { 4: 2, 9: 1 } },
      { id: "c", label: "Something new I've never tried", evidence: { 1: 3 } },
      { id: "d", label: "Anything that isn't my own head", evidence: { 3: 2, 7: 1 }, avoids: true },
      { id: "e", label: "I want to have fun. That's it", evidence: { 9: 1, 2: 1 } },
    ],
  },
  "lost-avoid": {
    id: "lost-avoid",
    prompt: "What kind of thing is it?",
    choices: [
      { id: "a", label: "A task — boring, not scary", evidence: { 9: 3 } },
      { id: "b", label: "A conversation", evidence: { 8: 3 } },
      { id: "c", label: "A decision", evidence: { 4: 2, 5: 1 } },
      { id: "d", label: "Something about money or admin", evidence: { 4: 3 } },
      { id: "e", label: "Something I'd have to feel", evidence: { 7: 3 } },
      { id: "f", label: "I know it's there and I won't name it yet", evidence: { 7: 2, 1: 1 } },
    ],
  },
  "lost-tell": {
    id: "lost-tell",
    prompt: "If someone told you what to do, what would that give you?",
    choices: [
      { id: "a", label: "Relief from choosing", evidence: { 4: 2, 7: 1 } },
      { id: "b", label: "Someone else to blame if it's wrong", evidence: { 6: 3 } },
      { id: "c", label: "Permission — I already know what I want", evidence: { 9: 3 } },
      { id: "d", label: "Company, mostly", evidence: { 2: 2, 8: 1 } },
      { id: "e", label: "A structure for the day", evidence: { 4: 3 } },
    ],
  },
  "lost-spont": {
    id: "lost-spont",
    prompt: "What's stopping the spontaneous thing?",
    choices: [
      { id: "a", label: "Nothing. I just haven't moved", evidence: { 9: 3 } },
      { id: "b", label: "It feels irresponsible", evidence: { 6: 2, 4: 1 } },
      { id: "c", label: "I don't have anyone to do it with", evidence: { 2: 2, 8: 1 } },
      { id: "d", label: "I can't think of anything good", evidence: { 1: 2, 7: 1 } },
      { id: "e", label: "Money or time", evidence: { 5: 2, 4: 1 } },
    ],
  },
  "lost-okay": {
    id: "lost-okay",
    prompt: "What's uncomfortable about okay?",
    choices: [
      { id: "a", label: "It feels like it's about to end", evidence: { 7: 3 } },
      { id: "b", label: "I don't know who I am without a problem", evidence: { 6: 2, 3: 1 } },
      { id: "c", label: "There's nothing to push against", evidence: { 7: 2, 4: 1 } },
      { id: "d", label: "I feel like I should be doing more with it", evidence: { 9: 2, 4: 1 } },
      { id: "e", label: "It's quiet and I'm not used to quiet", evidence: { 7: 3 } },
    ],
  },
  "lost-unknown": {
    id: "lost-unknown",
    prompt: "Then start smaller — what's true in the last hour?",
    choices: [
      { id: "a", label: "I've been on my phone the whole time", evidence: { 7: 2, 3: 1 } },
      { id: "b", label: "I've been tired", evidence: { 7: 2, 6: 1 } },
      { id: "c", label: "I've been irritable", evidence: { 3: 2, 6: 1 } },
      { id: "d", label: "I've been fine, just floating", evidence: { 7: 2, 2: 1 } },
      { id: "e", label: "Someone's been on my mind", evidence: { 8: 2, 2: 1 } },
      { id: "f", label: "Still nothing", evidence: { 1: 3 } },
    ],
  },

  /* --- "Should I take a chance?" ---------------------------------- */
  "chance-2": {
    id: "chance-2",
    prompt: "What makes you hesitate?",
    choices: [
      { id: "regret", label: "I might regret it", evidence: { 7: 2, 5: 1 }, followUp: "chance-regret" },
      { id: "info", label: "I don't have enough information", evidence: { 5: 3 }, followUp: "chance-info" },
      { id: "opinion", label: "I'm afraid of what someone will think", evidence: { 2: 2, 8: 1 }, followUp: "chance-opinion" },
      { id: "lose", label: "I'm afraid of losing something I already have", evidence: { 5: 2, 4: 1 }, followUp: "chance-lose" },
      { id: "permission", label: "I know the risk; I just want permission", evidence: { 9: 3 }, followUp: "chance-permission" },
      { id: "split", label: "Part of me wants it and part of me doesn't", evidence: { 2: 3 }, followUp: "chance-split" },
      { id: "timing", label: "I'm not actually afraid — I just don't know if the timing is right", evidence: { 8: 3 }, followUp: "chance-timing" },
      { id: "excuse-do", label: "I'm looking for an excuse to do it", evidence: { 9: 2, 2: 1 }, followUp: "chance-permission" },
      { id: "excuse-not", label: "I'm looking for an excuse not to do it", evidence: { 7: 2, 6: 1 }, followUp: "chance-split", avoids: true },
    ],
  },
  "chance-regret": {
    id: "chance-regret",
    prompt: "Which regret is bigger, if you're honest?",
    choices: [
      { id: "a", label: "Doing it and it going badly", evidence: { 5: 3 } },
      { id: "b", label: "Not doing it and always wondering", evidence: { 9: 3 } },
      { id: "c", label: "Both feel about equal", evidence: { 2: 3 } },
      { id: "d", label: "I can't picture either clearly", evidence: { 1: 2 } },
    ],
  },
  "chance-info": {
    id: "chance-info",
    prompt: "Is the missing information gettable?",
    choices: [
      { id: "a", label: "Yes — I know exactly what I'd need to check", evidence: { 5: 3 } },
      { id: "b", label: "Only by doing it", evidence: { 9: 2, 7: 1 } },
      { id: "c", label: "Only someone else can tell me", evidence: { 8: 3 } },
      { id: "d", label: "Only time tells", evidence: { 7: 3 } },
      { id: "e", label: "I've been saying I need more info for a while", evidence: { 3: 2, 9: 1 }, avoids: true },
    ],
  },
  "chance-opinion": {
    id: "chance-opinion",
    prompt: "Whose reaction are you actually picturing?",
    choices: [
      { id: "a", label: "One specific person", evidence: { 8: 3 } },
      { id: "b", label: "A general 'everybody'", evidence: { 2: 2, 3: 1 } },
      { id: "c", label: "Someone who isn't in my life anymore", evidence: { 3: 3 } },
      { id: "d", label: "Honestly, my own", evidence: { 6: 3 } },
    ],
  },
  "chance-lose": {
    id: "chance-lose",
    prompt: "What exactly would be at risk?",
    choices: [
      { id: "a", label: "Money I can name a number for", evidence: { 5: 3 } },
      { id: "b", label: "Stability I've worked to build", evidence: { 4: 3 } },
      { id: "c", label: "A relationship", evidence: { 2: 2, 8: 1 } },
      { id: "d", label: "How people see me", evidence: { 6: 2, 2: 1 } },
      { id: "e", label: "Nothing concrete — it just feels risky", evidence: { 7: 2, 5: 1 } },
    ],
  },
  "chance-permission": {
    id: "chance-permission",
    prompt: "If nobody would ever know either way, what would you do?",
    choices: [
      { id: "a", label: "Do it today", evidence: { 9: 3 } },
      { id: "b", label: "Do it, but smaller", evidence: { 4: 2, 9: 1 } },
      { id: "c", label: "Wait a week and see if I still want it", evidence: { 7: 2, 8: 1 } },
      { id: "d", label: "Not do it — which tells me something", evidence: { 5: 2, 6: 1 } },
    ],
  },
  "chance-split": {
    id: "chance-split",
    prompt: "Can you name both halves without picking a winner?",
    choices: [
      { id: "a", label: "Yes — and both make sense", evidence: { 2: 3 } },
      { id: "b", label: "Yes, but one half sounds like an excuse", evidence: { 6: 2, 5: 1 } },
      { id: "c", label: "One half is loud and I can't hear the other", evidence: { 3: 2, 7: 1 } },
      { id: "d", label: "They swap depending on the hour", evidence: { 3: 3 } },
      { id: "e", label: "No", evidence: { 1: 2 } },
    ],
  },
  "chance-timing": {
    id: "chance-timing",
    prompt: "What would make the timing right?",
    choices: [
      { id: "a", label: "A specific date or event I can name", evidence: { 4: 3 } },
      { id: "b", label: "Hearing from someone first", evidence: { 8: 3 } },
      { id: "c", label: "Feeling readier than I do", evidence: { 7: 2, 6: 1 } },
      { id: "d", label: "Honestly, nothing — 'timing' might be the excuse", evidence: { 9: 2, 6: 1 } },
    ],
  },

  /* --- "My brain is spiraling" ------------------------------------ */
  /**
   * Six fixed pages. Layer 2 (below) keeps the wording that passed the audit
   * and now chains into a layer-3 question chosen by which thread the person
   * is on, so what the spiral is *about* gets uncovered instead of assumed.
   * Every mapping below is the existing 1–9 evidence vocabulary; no new
   * framework, no weight above 3, no per-choice sum above 3, and answers that
   * say the same thing in different words carry identical evidence.
   */
  "spiral-replay": {
    id: "spiral-replay",
    prompt: "What does the replay keep circling back to?",
    next: "spiral-subject",
    choices: [
      { id: "a", label: "Something I said", evidence: { 8: 2, 6: 1 } },
      { id: "b", label: "Something they said", evidence: { 8: 2, 2: 1 } },
      { id: "c", label: "The moment I should have said something and didn't", evidence: { 9: 2, 8: 1 } },
      { id: "d", label: "How I looked or came across", evidence: { 6: 3 } },
      { id: "e", label: "Nothing in particular — it just runs on repeat", evidence: { 3: 3 } },
    ],
  },
  "spiral-predict": {
    id: "spiral-predict",
    prompt: "How likely is the thing you're predicting, really?",
    next: "spiral-stakes",
    choices: [
      { id: "a", label: "Likely — there's actual evidence", evidence: { 5: 3 } },
      { id: "b", label: "Possible, but I've stacked the worst case", evidence: { 5: 2, 2: 1 } },
      { id: "c", label: "Unlikely, and I know that and it doesn't help", evidence: { 3: 3 } },
      { id: "d", label: "It already happened once before", evidence: { 3: 2, 5: 1 } },
      { id: "e", label: "I can't judge it from in here", evidence: { 1: 2, 7: 1 } },
    ],
  },
  "spiral-meant": {
    id: "spiral-meant",
    prompt: "What are you working from?",
    next: "spiral-subject",
    choices: [
      { id: "a", label: "Their exact words", evidence: { 5: 2, 8: 1 } },
      { id: "b", label: "Their tone", evidence: { 2: 2, 8: 1 } },
      { id: "c", label: "How long they took to reply", evidence: { 2: 3 } },
      { id: "d", label: "What they didn't say", evidence: { 2: 2, 3: 1 } },
      { id: "e", label: "A pattern from before with someone else", evidence: { 3: 3 } },
    ],
  },
  "spiral-reassure": {
    id: "spiral-reassure",
    prompt: "What happens when you get the reassurance?",
    next: "spiral-subject",
    choices: [
      { id: "a", label: "It helps for a while, then it wears off", evidence: { 3: 3 } },
      { id: "b", label: "I doubt it immediately", evidence: { 3: 2, 6: 1 } },
      { id: "c", label: "It actually settles it", evidence: { 8: 2, 9: 1 } },
      { id: "d", label: "I haven't asked anyone", evidence: { 8: 2, 7: 1 } },
    ],
  },
  "spiral-unsolvable": {
    id: "spiral-unsolvable",
    prompt: "What would have to happen for it to be answerable?",
    next: "spiral-stakes",
    choices: [
      { id: "a", label: "Someone has to tell me something", evidence: { 8: 3 } },
      { id: "b", label: "Time has to pass", evidence: { 7: 3 } },
      { id: "c", label: "I have to make a decision first", evidence: { 9: 2, 4: 1 } },
      { id: "d", label: "It may never be answerable", evidence: { 7: 2, 5: 1 } },
      { id: "e", label: "I don't know", evidence: { 1: 2 } },
    ],
  },
  "spiral-jump": {
    id: "spiral-jump",
    prompt: "Do the problems have anything in common?",
    next: "spiral-fuel",
    choices: [
      { id: "a", label: "Yes — same person in most of them", evidence: { 2: 2, 8: 1 } },
      { id: "b", label: "Yes — they're all things I'm behind on", evidence: { 4: 3 } },
      { id: "c", label: "Yes — they all come down to money or time", evidence: { 4: 2, 5: 1 } },
      { id: "d", label: "No, they're unrelated", evidence: { 7: 2, 3: 1 } },
      { id: "e", label: "I've never lined them up to check", evidence: { 1: 2, 3: 1 } },
    ],
  },
  "spiral-stuck": {
    id: "spiral-stuck",
    prompt: "How long has that one thought been running?",
    next: "spiral-fuel",
    choices: [
      { id: "a", label: "Since today", evidence: { 5: 2, 7: 1 } },
      { id: "b", label: "A few days", evidence: { 7: 3 } },
      { id: "c", label: "Weeks or longer, without much of a break", evidence: { 3: 2, 7: 1 } },
      { id: "d", label: "It comes back every few months", evidence: { 3: 3 } },
      { id: "e", label: "No idea", evidence: { 1: 2 } },
    ],
  },
  "spiral-unknown": {
    id: "spiral-unknown",
    prompt: "What was happening right before it started?",
    next: "spiral-fuel",
    choices: [
      { id: "a", label: "I was alone and it got quiet", evidence: { 7: 3 } },
      { id: "b", label: "I read or saw something", evidence: { 3: 2, 5: 1 } },
      { id: "c", label: "I talked to someone", evidence: { 8: 3 } },
      { id: "d", label: "I was tired or hadn't eaten", evidence: { 7: 2, 6: 1 } },
      { id: "e", label: "Nothing I can point to", evidence: { 1: 2, 3: 1 } },
    ],
  },

  /* Layer 3 — what the spiral is actually about (page 3). */
  "spiral-subject": {
    id: "spiral-subject",
    prompt: "Strip the story off it. What are you afraid is actually true?",
    note: "Say the blunt version, not the reasonable one.",
    choices: [
      { id: "a", label: "That I screwed it up and they've quietly written me off", evidence: { 6: 2, 2: 1 } },
      { id: "b", label: "That they don't care about this as much as I do", evidence: { 2: 3 } },
      { id: "c", label: "That I've read the whole thing wrong", evidence: { 5: 2, 8: 1 } },
      { id: "d", label: "That something's ending and I can't stop it", evidence: { 7: 2, 5: 1 } },
      { id: "e", label: "That if I actually respond, I'll say it badly", evidence: { 8: 2, 9: 1 } },
      { id: "f", label: "Nothing's 'true'. I just can't put it down", evidence: { 3: 3 } },
    ],
  },
  "spiral-stakes": {
    id: "spiral-stakes",
    prompt: "Run it to the end. If the worst version happened, what's actually on the line?",
    choices: [
      { id: "a", label: "Money, work, something with a number on it", evidence: { 5: 2, 4: 1 } },
      { id: "b", label: "A person I'd have to live without", evidence: { 2: 2, 8: 1 } },
      { id: "c", label: "How I'd have to see myself afterwards", evidence: { 6: 3 } },
      { id: "d", label: "Nothing I can name. It just feels enormous", evidence: { 7: 2, 3: 1 } },
      { id: "e", label: "I'd survive it. That's the weird part", evidence: { 9: 2, 5: 1 } },
      { id: "f", label: "I won't let myself picture it that far", evidence: { 7: 3 }, avoids: true },
    ],
  },
  "spiral-fuel": {
    id: "spiral-fuel",
    prompt: "What does it do the second you try to put it down?",
    choices: [
      { id: "a", label: "Starts again from the top", evidence: { 3: 3 } },
      { id: "b", label: "Hands me a different thing to worry about", evidence: { 4: 2, 3: 1 } },
      { id: "c", label: "Gets louder the second it's quiet", evidence: { 7: 3 } },
      { id: "d", label: "Backs off only while my hands are busy", evidence: { 9: 2, 7: 1 } },
      { id: "e", label: "Waits until I lie down at night", evidence: { 7: 2, 3: 1 } },
      { id: "f", label: "No idea — I've never actually tried putting it down", evidence: { 1: 2, 3: 1 } },
    ],
  },

  /* Stage 2 — fixed pages 4, 5, 6 for the spiral branch. */
  "spiral-known": {
    id: "spiral-known",
    prompt: "Say only the part that actually happened. How much of this is that?",
    note: "Not what it means. What occurred.",
    next: "spiral-stop",
    choices: [
      { id: "a", label: "There's a real event. I'm not inventing this", evidence: { 5: 3 } },
      { id: "b", label: "I know what I felt. I don't know what they meant", evidence: { 2: 2, 8: 1 } },
      { id: "c", label: "Something real happened and I've built the rest", evidence: { 5: 2, 2: 1 } },
      { id: "d", label: "Almost all of it is me guessing", evidence: { 2: 3 } },
      { id: "e", label: "I couldn't separate the two right now", evidence: { 1: 2, 5: 1 } },
    ],
  },
  "spiral-stop": {
    id: "spiral-stop",
    prompt: "What has actually stopped it before — not what should, what has?",
    next: "spiral-need",
    choices: [
      { id: "a", label: "Somebody said the one thing I needed to hear", evidence: { 8: 3 } },
      { id: "b", label: "It wore itself out after a day or two", evidence: { 7: 3 } },
      { id: "c", label: "I did the thing I was dreading and it went quiet", evidence: { 9: 3 } },
      { id: "d", label: "Writing it down or saying it out loud", evidence: { 8: 2, 6: 1 } },
      { id: "e", label: "Nothing stops it — it goes underground and comes back", evidence: { 3: 3 } },
      { id: "f", label: "Cutting a decision loose so there was nothing left to weigh", evidence: { 4: 2, 9: 1 } },
    ],
  },
  "spiral-need": {
    id: "spiral-need",
    prompt: "So what do you actually need here? Not what would be nice.",
    choices: [
      { id: "a", label: "One piece of information I don't have yet", evidence: { 5: 3 } },
      { id: "b", label: "To hear it straight from the one person involved", evidence: { 8: 3 } },
      { id: "c", label: "To decide something and stop renegotiating it", evidence: { 4: 2, 9: 1 } },
      { id: "d", label: "To do one small thing today and let the rest sit", evidence: { 9: 3 } },
      { id: "e", label: "To be alright with not knowing for a while", evidence: { 7: 2, 5: 1 } },
      { id: "f", label: "To quit being this hard on myself about it", evidence: { 6: 3 } },
      { id: "g", label: "I still don't know", evidence: { 1: 2 } },
    ],
  },



  /* --- "Why the fuck do I want a drink right now?" ----------------- */

  /**
   * REBUILT (psychological-function standard). Every choice below is worded so
   * that it contains evidence of the psychological ACT of its assigned number,
   * not merely its subject matter. Subject alone (habit, pleasure, physical
   * discomfort, confidence, moderation) never earns a number: the wording has
   * to show recognition of recurrence (3), a held container/rule (4), actual
   * separation of known/felt/assumed (5), accountability without prosecution
   * (6), tolerated stillness (7), receiving before answering (8), a real next
   * step (9), two truths held at once (2), or a genuine first question (1).
   */

  /**
   * Second layer shared by most drinking answers. Keeps the thread on the
   * drink itself instead of drifting into generic clarity language, and
   * quietly separates the substance from the state it is standing in for.
   */
  "drink-layer2": {
    id: "drink-layer2",
    prompt: "Be honest: is it the drink you want, or the feeling on the other side of it?",
    choices: [
      { id: "a", label: "The feeling. The drink is just how I get there — I can tell those two apart.", evidence: { 5: 3 } },
      { id: "b", label: "The drink itself. I like it, and I also know where it tends to go.", evidence: { 2: 3 } },
      { id: "c", label: "The moment around it. Same pause, same hour, every day.", evidence: { 3: 3 } },
      { id: "d", label: "The off switch. Not the taste, the off switch — and I'll own that that's what I'm buying.", evidence: { 6: 2, 5: 1 }, avoids: true },
      { id: "e", label: "Both, and I've never actually pulled them apart.", evidence: { 1: 2, 3: 1 } },
      { id: "g", label: "I'd have to stop and hear what I actually want before I answer that.", evidence: { 8: 3 } },
      // 7 — the hour itself is tolerable; the drink isn't doing the work
      { id: "h", label: "Neither, really. It's the hour — and I could be in it without a drink. I just haven't been.", evidence: { 7: 3 } },
      // 9 — wants the night carried into tomorrow rather than paid for
      { id: "i", label: "What I actually want is to get to tomorrow without paying for tonight.", evidence: { 9: 3 } },
      { id: "f", label: "I don't know.", evidence: { 1: 2 } },
    ],
  },

  /* expected reward */
  "drink-reward": {
    id: "drink-reward",
    prompt: "How reliable is that good feeling, really?",
    note: "Not a trick question. Sometimes it delivers.",
    choices: [
      { id: "a", label: "Very. Same result every time — I could set my watch by it.", evidence: { 3: 3 } },
      { id: "b", label: "The first one does what I want. After that I'm chasing it, and I know the difference.", evidence: { 5: 3 } },
      { id: "c", label: "It works for an hour, then I feel worse — and I still pick it. That's mine.", evidence: { 6: 2, 5: 1 } },
      { id: "d", label: "Lately it doesn't work at all, and I've quit pretending it does.", evidence: { 5: 2, 2: 1 } },
      { id: "e", label: "I stopped checking a long time ago. It's automatic now.", evidence: { 3: 2, 1: 1 } },
      { id: "f", label: "I've never actually watched whether it delivers. I'd have to pay attention.", evidence: { 8: 3 } },
      { id: "g", label: "I don't know.", evidence: { 1: 2 } },
    ],
    next: "drink-layer2",
  },

  /* emotional regulation */
  "drink-better": {
    id: "drink-better",
    prompt: "Better than what, though? What's the current setting?",
    choices: [
      { id: "a", label: "Wired — and I know everything looks worse than it is when I'm like this.", evidence: { 3: 2, 5: 1 } },
      { id: "b", label: "Flat. Nothing much at all, and I've never asked why that is.", evidence: { 1: 2, 8: 1 } },
      { id: "c", label: "Sad. I could sit in it tonight if I decided to.", evidence: { 7: 3 } },
      { id: "d", label: "Angry — at something I haven't actually let the other person finish saying.", evidence: { 8: 3 } },
      { id: "e", label: "Lonely. I want company and I want to be left alone. Both.", evidence: { 2: 3 } },
      { id: "f", label: "Fine, honestly. Better would just be better — that's the whole of it.", evidence: { 5: 2, 2: 1 } },
      // 9 — the setting is a stalled step, and he names the step
      { id: "h", label: "Stalled. There's one thing I'd have to actually do tonight for this to shift.", evidence: { 9: 3 } },
      { id: "g", label: "I can't name it. That's the honest answer.", evidence: { 1: 2 } },
    ],
    next: "drink-layer2",
  },

  /* identity / state borrowing */
  "drink-confidence": {
    id: "drink-confidence",
    prompt: "Confidence to do what?",
    choices: [
      { id: "a", label: "Be in the room without narrating everything I'm doing wrong.", evidence: { 6: 3 } },
      { id: "b", label: "Get through the day. I need something with edges to get me there.", evidence: { 4: 3 } },
      { id: "c", label: "Say what I think — after I've actually heard what they said.", evidence: { 8: 3 } },
      { id: "d", label: "Stop running the same loop about how it's going to go.", evidence: { 3: 3 } },
      { id: "e", label: "Hold that I'm decent and that I screwed up, at the same time.", evidence: { 2: 3 } },
      { id: "f", label: "Do the one thing I've been putting off. The actual next step.", evidence: { 9: 3 }, avoids: true },
      { id: "g", label: "I don't know. I just notice I feel different when I drink.", evidence: { 1: 2, 3: 1 } },
    ],
    next: "drink-layer2",
  },

  /* arousal down-regulation */
  "drink-calm": {
    id: "drink-calm",
    prompt: "What's got you wound up?",
    choices: [
      { id: "a", label: "Work, money, logistics. None of it has a container.", evidence: { 4: 3 } },
      { id: "b", label: "Something a person said — and I answered before I'd heard the end of it.", evidence: { 8: 3 } },
      { id: "c", label: "Too many small things stacked up. Same stack as last week.", evidence: { 3: 3 } },
      { id: "d", label: "My own head — and I know my head lies to me when I'm this tight.", evidence: { 5: 2, 3: 1 } },
      { id: "e", label: "Something unresolved. There's one step in it I'm not taking.", evidence: { 9: 3 }, avoids: true },
      { id: "f", label: "Nothing external. My body's switched on, and I can stay in it.", evidence: { 7: 3 } },
      { id: "g", label: "No idea, and I'd rather say that than invent a reason.", evidence: { 5: 2, 1: 1 } },
    ],
    next: "drink-layer2",
  },

  /* anxiety / physical dependence concern — held without diagnosis */
  "drink-without": {
    id: "drink-without",
    prompt: "When you picture going without it, what shows up first?",
    note: "No diagnosis here, and nothing you say gets turned into advice.",
    choices: [
      { id: "a", label: "My body. And I'd want to listen to it instead of overruling it.", evidence: { 8: 3 } },
      { id: "b", label: "I could get sick without it. That's a real line, not a feeling.", evidence: { 5: 3 } },
      { id: "c", label: "The hours. I'd need to put something in them on purpose.", evidence: { 4: 3 } },
      { id: "d", label: "Everything I've not been feeling arrives at once — and I could sit in that for a night.", evidence: { 7: 3 }, avoids: true },
      { id: "e", label: "I'd probably cave — and I'd rather look at that than call myself weak.", evidence: { 6: 3 } },
      { id: "f", label: "It would tell me something true I've never asked about.", evidence: { 1: 2, 8: 1 } },
      { id: "g", label: "One night without it. That's the only step I'd commit to.", evidence: { 9: 3 } },
      { id: "h", label: "I honestly don't know.", evidence: { 1: 2 } },
    ],
    next: "drink-layer2",
  },

  /* automaticity / habit */
  "drink-routine": {
    id: "drink-routine",
    prompt: "If you woke up tomorrow and the routine simply wasn't there, what would feel weirdest?",
    choices: [
      { id: "a", label: "Nothing would mark the end of the day.", evidence: { 4: 3 } },
      { id: "b", label: "My hand would still reach at the same hour.", evidence: { 3: 3 } },
      { id: "c", label: "I'd have to decide what goes there, and I've never decided that.", evidence: { 1: 2, 4: 1 } },
      { id: "d", label: "Something would feel missing — and I could let it feel missing.", evidence: { 7: 3 } },
      { id: "e", label: "I'd see how much of my day was built around it. A relief and a loss at once.", evidence: { 2: 3 } },
      { id: "f", label: "I'd cave later — and that's information, not a verdict on me.", evidence: { 6: 3 } },
      { id: "g", label: "I'd be fine. I can tell the difference between weird and hard.", evidence: { 5: 3 } },
      { id: "h", label: "Honestly, I don't know.", evidence: { 1: 2 } },
    ],
    next: "drink-routine-2",
  },
  "drink-routine-2": {
    id: "drink-routine-2",
    prompt: "How much of it is the hour, and how much of it is you?",
    note: "Both directions count. This isn't a nudge to stop.",
    choices: [
      { id: "a", label: "Mostly the hour. Same time, every time.", evidence: { 3: 3 } },
      { id: "b", label: "Mostly the day I've had — though I've never checked whether that's actually true.", evidence: { 8: 2, 5: 1 } },
      { id: "c", label: "Mostly who I'm with. It's two things at once: them and me.", evidence: { 2: 3 } },
      { id: "d", label: "It's the marker. It ends the day.", evidence: { 4: 3 } },
      { id: "e", label: "It's me. And I can say that without building a case against myself.", evidence: { 6: 3 } },
      { id: "f", label: "I've never separated them. That's the first honest thing here.", evidence: { 1: 2, 5: 1 } },
    ],
    next: "drink-layer2",
  },

  /* identity */
  "drink-myself": {
    id: "drink-myself",
    prompt: "When you say \u201cmore like myself,\u201d which version of you are you missing?",
    choices: [
      { id: "a", label: "The one who wasn't running a case against himself all day.", evidence: { 6: 3 } },
      { id: "b", label: "The social one — actually with people, not just near them.", evidence: { 2: 2, 8: 1 } },
      { id: "c", label: "The one who could sit still and be fine.", evidence: { 7: 3 } },
      { id: "d", label: "The one who didn't run the same loop for hours.", evidence: { 3: 3 } },
      { id: "e", label: "The one who said the true thing out loud, after hearing the room.", evidence: { 8: 3 } },
      { id: "f", label: "The one who kept a couple of promises to himself.", evidence: { 4: 2, 9: 1 } },
      { id: "g", label: "The one who did the next thing instead of planning it.", evidence: { 9: 3 } },
      { id: "h", label: "I don't know which version. I just know I miss it.", evidence: { 1: 2 } },
    ],
    next: "drink-myself-2",
  },
  "drink-myself-2": {
    id: "drink-myself-2",
    prompt: "When was that version last around, without a drink involved?",
    choices: [
      { id: "a", label: "Recently. It comes and goes on a rhythm I can almost see.", evidence: { 3: 3 } },
      { id: "b", label: "A while ago, and I know roughly what changed. I can name the line.", evidence: { 5: 3 } },
      { id: "c", label: "Years. I'd be starting from nothing here.", evidence: { 1: 3 } },
      { id: "d", label: "Only when the things around me had some structure to them.", evidence: { 4: 3 } },
      { id: "e", label: "Only around certain people — I hear myself differently with them.", evidence: { 8: 2, 2: 1 } },
      { id: "f", label: "Both versions might be me. I've stopped ranking them.", evidence: { 2: 3 } },
      { id: "g", label: "I can't remember, and I'm not going to invent an answer.", evidence: { 5: 2, 1: 1 } },
    ],
    next: "drink-layer2",
  },

  /* boredom */
  "drink-bored": {
    id: "drink-bored",
    prompt: "What would fill the same slot tonight, if the drink were off the table?",
    choices: [
      { id: "a", label: "Plenty of things — I just default here, same as always.", evidence: { 3: 3 } },
      { id: "b", label: "Company. It's people I want, and I'd have to actually ask someone.", evidence: { 2: 2, 8: 1 } },
      { id: "c", label: "I could let the slot stay empty. Boring isn't an emergency.", evidence: { 7: 3 } },
      { id: "d", label: "Something I'd have to plan, which is exactly the problem.", evidence: { 4: 3 } },
      { id: "e", label: "One small thing I'd actually do tonight.", evidence: { 9: 3 } },
      { id: "f", label: "Screens. Same slot, same reach, different object — I can see that.", evidence: { 3: 2, 5: 1 } },
      { id: "g", label: "I don't know.", evidence: { 1: 2 } },
    ],
    next: "drink-layer2",
  },

  /* avoidance */
  "drink-escape": {
    id: "drink-escape",
    prompt: "What's the feeling you'd be getting away from?",
    note: "Naming it here doesn't obligate you to do anything about it.",
    choices: [
      { id: "a", label: "Anxiety — and I can't yet tell real risk from forecast.", evidence: { 5: 3 } },
      { id: "b", label: "Sadness. I could stay in it tonight if I chose to.", evidence: { 7: 3 } },
      { id: "c", label: "Shame. I did the thing; I don't have to keep sentencing myself for it.", evidence: { 6: 3 } },
      { id: "d", label: "Anger — at someone I haven't let finish a sentence.", evidence: { 8: 3 } },
      { id: "e", label: "Loneliness. I want people and I want nobody. Both.", evidence: { 2: 3 } },
      { id: "f", label: "Dread about something coming. There's one step that would shrink it.", evidence: { 9: 3 } },
      { id: "g", label: "Emptiness. Same hour, most nights.", evidence: { 3: 3 } },
      { id: "h", label: "I feel it and I can't name it. That's where I'm starting.", evidence: { 1: 2 } },
    ],
    next: "drink-layer2",
  },

  /* undifferentiated want */
  "drink-plain-hour": {
    id: "drink-plain-hour",
    prompt: "Okay. Fair enough. If you got exactly what you want from that drink, what would you want the next hour to feel like?",
    choices: [
      { id: "a", label: "Easier — with something in it that has edges.", evidence: { 4: 3 } },
      { id: "b", label: "Actually enjoyed, and carried into tomorrow instead of paid for.", evidence: { 9: 3 } },
      { id: "c", label: "Quieter than the loop that's been running all day.", evidence: { 3: 3 } },
      { id: "d", label: "Me in the room without the running commentary about myself.", evidence: { 6: 2, 2: 1 }, followUp: "drink-confidence" },
      { id: "e", label: "Not boring — though I could sit through boring if it came to it.", evidence: { 7: 3 } },
      { id: "f", label: "Less loaded. I know that's what I'm asking the drink to do.", evidence: { 5: 2, 6: 1 }, avoids: true },
      { id: "g", label: "With people, and me listening instead of performing.", evidence: { 8: 3 } },
      { id: "h", label: "Normal — holding what's off and what's fine at the same time.", evidence: { 2: 3 } },
      { id: "i", label: "I don't care how I feel. I want the drink and I'm not dressing it up.", evidence: { 5: 2, 2: 1 } },
      { id: "j", label: "I have no idea.", evidence: { 1: 2 } },
    ],
    next: "drink-layer2",
  },

  /* uncertainty */
  "drink-unclear": {
    id: "drink-unclear",
    prompt: "Then let's start smaller. When did you first notice the pull today?",
    choices: [
      { id: "a", label: "When the day stopped moving. Same as most days.", evidence: { 3: 3 } },
      { id: "b", label: "Right after something specific happened — and there's a piece of it I haven't dealt with.", evidence: { 9: 2, 5: 1 }, avoids: true },
      { id: "c", label: "Around other people, before I'd really heard anything anyone said.", evidence: { 8: 3 } },
      { id: "d", label: "Low all day. I noticed it and left it alone.", evidence: { 7: 3 } },
      { id: "e", label: "The second the day had nothing scheduled in it.", evidence: { 4: 3 } },
      { id: "f", label: "I can't place it, and I'm not going to guess.", evidence: { 5: 2, 1: 1 } },
      { id: "g", label: "No idea. That's the honest first answer.", evidence: { 1: 2 } },
    ],
    next: "drink-layer2",
  },

  /* ---------------- PAGE 4: what would actually be lost ------------ */

  "drink-lost": {
    id: "drink-lost",
    prompt:
      "Forget whether drinking is 'good' or 'bad' for a second. If it disappeared from your life tomorrow, what would you actually be losing?",
    choices: [
      { id: "a", label: "The physical feeling — and I'd want to know what my body was actually asking for.", evidence: { 8: 3 }, followUp: "drink-gone" },
      { id: "b", label: "The ritual. Same hour, same shape, every night.", evidence: { 3: 3 }, followUp: "drink-gone" },
      { id: "c", label: "The excuse to check out. I'd have to be here instead.", evidence: { 7: 3 }, followUp: "drink-changes", avoids: true },
      { id: "d", label: "Being in a room without running a case against myself.", evidence: { 6: 3 }, followUp: "drink-power" },
      { id: "e", label: "The people and the places. Both matter, and only one is about the drink.", evidence: { 2: 3 }, followUp: "drink-gone" },
      { id: "f", label: "The version of me that shows up after two — while owning that this one is me too.", evidence: { 2: 2, 6: 1 }, followUp: "drink-power" },
      { id: "g", label: "The ability to stop thinking for a while. I know that's what I'm buying.", evidence: { 5: 3 }, followUp: "drink-changes", avoids: true },
      { id: "h", label: "The one part of the day with a rule I never break.", evidence: { 4: 3 }, followUp: "drink-gone" },
      { id: "i", label: "Something I genuinely enjoy — and I want to carry that into a life I actually like.", evidence: { 9: 3 }, followUp: "drink-power" },
      { id: "j", label: "Nothing important. Which tells me the reason is somewhere I haven't looked.", evidence: { 1: 2, 5: 1 }, followUp: "drink-power" },
      { id: "k", label: "My fear of what happens when I stop. I can name it and still sit here with it.", evidence: { 7: 2, 6: 1 }, followUp: "drink-power" },
      { id: "l", label: "More than I want to admit — and admitting it isn't a confession of guilt.", evidence: { 6: 2, 5: 1 }, followUp: "drink-power" },
    ],
  },

  /* PAGE 5a: which one has more power */
  "drink-power": {
    id: "drink-power",
    prompt: "Be honest. Which one has more power over you right now?",
    choices: [
      { id: "a", label: "The life I'm actually building — and I know what the next step in it is.", evidence: { 9: 3 }, followUp: "drink-want" },
      { id: "b", label: "The life I get when I drink. Both are mine; that's the problem.", evidence: { 2: 3 }, followUp: "drink-fear" },
      { id: "c", label: "The fear of what happens if I stop — and I can sit with that fear tonight.", evidence: { 7: 3 }, followUp: "drink-fear" },
      { id: "d", label: "Not having to decide. No rule, no decision, nothing to hold.", evidence: { 4: 2, 3: 1 }, followUp: "drink-inertia" },
      { id: "e", label: "It changes depending on the fucking day — and I can see which days are which.", evidence: { 3: 3 }, followUp: "drink-consequence" },
      { id: "f", label: "Neither, until I know what I'm actually choosing between. I'm not calling it a want before then.", evidence: { 5: 3 }, followUp: "drink-consequence" },
      { id: "g", label: "The drink, and I know what that costs me — I can own it without making myself the villain.", evidence: { 6: 3 }, followUp: "drink-want" },
      { id: "h", label: "I can't answer that yet. I'd have to stop and hear what the other side of it is first.", evidence: { 8: 3 }, followUp: "drink-fear" },
      { id: "i", label: "I honestly don't know which one has more power. That's the thing I'm trying to find out.", evidence: { 1: 2, 5: 1 }, followUp: "drink-fear" },
    ],
  },

  /* ---------------- PAGE 5b: if the drink disappeared -------------- */

  /**
   * PAGE 5 (demonstrated power). Deliberately NOT another removal
   * counterfactual — page 4 (drink-lost) already asks what would be lost and
   * page 6 (drink-fear) asks what removal would threaten. This layer asks
   * only for what has already, observably changed. Choice ids, evidence maps
   * and followUps are unchanged: scoring is untouched.
   */
  "drink-gone": {
    id: "drink-gone",
    prompt:
      "Set the hypotheticals aside. What has it already changed that you could actually point to?",
    choices: [
      { id: "a", label: "I couldn't point to anything yet. That's the first honest thing here.", evidence: { 1: 2, 4: 1 }, followUp: "drink-missing" },
      { id: "b", label: "It's improved some nights and wrecked others, and I can name which were which.", evidence: { 2: 3 }, followUp: "drink-want" },
      { id: "c", label: "The same evenings keep going the same way. That's the part I can point to.", evidence: { 3: 3 }, followUp: "drink-want", avoids: true },
      { id: "d", label: "My body — sleep, mornings, how the next day actually feels. I'd want that heard by someone who knows.", evidence: { 8: 2, 5: 1 }, followUp: "drink-fear" },
      { id: "f", label: "It's the one part of the day I run deliberately, and I've kept it that way on purpose.", evidence: { 4: 3 }, followUp: "drink-missing" },
      { id: "g", label: "It's cost me things I said mattered — and I'll say that without performing guilt about it.", evidence: { 6: 3 }, followUp: "drink-consequence" },
      { id: "h", label: "Nothing about the drink itself. It's the hour around it that's changed shape.", evidence: { 3: 2, 5: 1 }, followUp: "drink-missing" },
      { id: "i", label: "Who I am after a few has become a person other people have to deal with.", evidence: { 6: 2, 2: 1 }, followUp: "drink-fear" },
      { id: "j", label: "Money, time and mornings — and I still don't want to give it up. Both real.", evidence: { 2: 2, 5: 1 }, followUp: "drink-consequence" },
      { id: "k", label: "It's changed what I'm willing to sit through sober, and I can look straight at that.", evidence: { 7: 3 }, followUp: "drink-fear" },
      { id: "l", label: "It's taken the deciding out of that hour. I haven't chosen what that hour is for in months.", evidence: { 4: 2, 1: 1 }, followUp: "drink-missing" },
      { id: "m", label: "It's already changed one thing I actually care about — and I know the step that addresses it.", evidence: { 9: 3 }, followUp: "drink-changes" },
    ],
  },

  /* the "free time hypothesis is wrong" branch */
  "drink-missing": {
    id: "drink-missing",
    prompt: "Then if that hour stopped being the drink's hour, what would actually be missing?",
    choices: [
      { id: "a", label: "Not the time. I'd be doing the same things — I can tell those apart.", evidence: { 5: 3 } },
      { id: "b", label: "Something to look forward to. I'd have to make one thing worth it.", evidence: { 9: 3 } },
      { id: "c", label: "The little ritual that says the day started or ended.", evidence: { 4: 2, 3: 1 } },
      { id: "d", label: "The excuse to stop being productive — though I could just stop without one.", evidence: { 7: 3 } },
      { id: "e", label: "The feeling of being off duty. Same time every night.", evidence: { 3: 3 } },
      { id: "f", label: "Something that's just mine — and I can want that without shame about it.", evidence: { 6: 3 } },
      { id: "g", label: "The comfort of not thinking. I know that's the trade I'm making.", evidence: { 5: 2, 3: 1 } },
      { id: "h", label: "It's my security blanket. I want it and I don't need it. Both.", evidence: { 2: 3 } },
      { id: "i", label: "Nothing. I just automatically put drinking in that space.", evidence: { 3: 2, 1: 1 } },
      { id: "j", label: "I don't know — I'd want to sit and hear the answer instead of filling it in.", evidence: { 8: 2, 1: 1 } },
    ],
  },

  /* the enhancer branch: the activity is already happening */
  "drink-changes": {
    id: "drink-changes",
    prompt: "Then what does the drink change about the thing you're already doing?",
    choices: [
      { id: "a", label: "It makes boring shit tolerable — though I could tolerate it.", evidence: { 7: 3 }, followUp: "drink-boredom" },
      { id: "b", label: "Everything hits better, and I'd rather carry that into how I actually spend the night.", evidence: { 9: 3 }, followUp: "drink-want" },
      { id: "c", label: "It makes the boredom easier to avoid. Without it I'd actually have to sit through the boring part — that's the trade.", evidence: { 7: 2, 5: 1 }, followUp: "drink-boredom", avoids: true },
      { id: "d", label: "It gives a shapeless day something to point at.", evidence: { 4: 3 }, followUp: "drink-inertia" },
      { id: "e", label: "TV, music, food, sex, gaming — all of it hits differently. Two good things at once.", evidence: { 2: 3 }, followUp: "drink-want" },
      { id: "f", label: "It shuts my head up while I'm doing it. Same as every night.", evidence: { 3: 3 }, followUp: "drink-boredom", avoids: true },
      { id: "g", label: "Being alone feels less alone — and I haven't called anyone.", evidence: { 8: 2, 2: 1 }, followUp: "drink-fear" },
      { id: "h", label: "It changes nothing. I want the drink, and I'll own that.", evidence: { 6: 3 }, followUp: "drink-consequence" },
      { id: "i", label: "It feels wrong to do the thing without it now — which is news to me.", evidence: { 1: 2, 3: 1 }, followUp: "drink-missing" },
      { id: "j", label: "The activity isn't really the point anymore. The drinking is — and I can tell the difference now.", evidence: { 5: 3 }, followUp: "drink-fear" },
    ],
  },

  "drink-boredom": {
    id: "drink-boredom",
    prompt: "If the drink could make one part of that experience disappear, what would you choose?",
    choices: [
      { id: "a", label: "The boredom — even though I could sit through it.", evidence: { 7: 3 } },
      { id: "b", label: "The forecasting about how tomorrow goes.", evidence: { 5: 3 } },
      { id: "c", label: "The same loop running in my head.", evidence: { 3: 3 } },
      { id: "d", label: "The feeling I'm wasting my life — there's one thing I'd do about that.", evidence: { 9: 3 } },
      { id: "e", label: "The sense I should be elsewhere, with nothing actually scheduled.", evidence: { 4: 3 } },
      { id: "f", label: "The loneliness. I want people around and I want no demands. Both.", evidence: { 2: 3 } },
      { id: "g", label: "The pressure to enjoy myself — without making that a failing of mine.", evidence: { 6: 3 } },
      { id: "h", label: "Nothing. I like being buzzed, and I'm not building a story on it.", evidence: { 5: 2, 2: 1 } },
      { id: "i", label: "I'd want to hear myself out before picking something to delete.", evidence: { 8: 2, 1: 1 } },
    ],
  },

  /* ---------------- PAGE 6 variants -------------------------------- */

  "drink-fear": {
    id: "drink-fear",
    prompt:
      "Here's the part nobody asks: if drinking disappeared tomorrow, which possibility would scare you the most?",
    note: "Last one.",
    choices: [
      { id: "a", label: "That I'd actually have to build the life I say I want, one real step at a time.", evidence: { 9: 3 } },
      { id: "b", label: "I might succeed, and I don't know how to be that person. That's genuinely new ground.", evidence: { 1: 3 } },
      { id: "c", label: "I'd have to be fully myself with nothing over the top of it — and own that as it is.", evidence: { 6: 3 } },
      { id: "d", label: "I'd be alone without it. It's my company and it costs me. Both.", evidence: { 2: 3 } },
      { id: "e", label: "Being seen in a room like that, before I'd said a single word.", evidence: { 8: 2, 6: 1 } },
      { id: "f", label: "I'd fail and relapse — and that would be data, not a sentence.", evidence: { 6: 2, 5: 1 } },
      { id: "g", label: "I couldn't keep it to two. There's no line I've ever actually held.", evidence: { 4: 3 } },
      { id: "h", label: "I'm scared to even start. That's exactly where I am.", evidence: { 1: 2, 7: 1 } },
      { id: "i", label: "I'd love being sober and have to face the years — and I can stay with that.", evidence: { 7: 2, 9: 1 } },
      { id: "j", label: "Nothing would change and I'd have to find the real problem — I'd want the two separated.", evidence: { 5: 3 } },
      { id: "k", label: "That I don't need a fear story anymore — I'd have to own my part in what comes next.", evidence: { 6: 2, 9: 1 } },
    ],
  },

  "drink-want": {
    id: "drink-want",
    prompt:
      "Now flip it. If you could keep the parts of your life you actually want, what are you secretly hoping you get back?",
    note: "Last one.",
    choices: [
      { id: "a", label: "My health — starting with one thing I'd actually do this week.", evidence: { 9: 3 } },
      { id: "b", label: "Being in my own corner instead of building a case against myself.", evidence: { 6: 3 } },
      { id: "c", label: "My money — I'd draw a line and know what holding it costs.", evidence: { 4: 2, 5: 1 } },
      { id: "d", label: "My mornings, with an actual shape to them.", evidence: { 4: 2, 9: 1 } },
      { id: "e", label: "My people — and actually hearing them when they talk.", evidence: { 8: 2, 2: 1 } },
      { id: "f", label: "Remembering my own life, so I can tell what happened from what I assume happened.", evidence: { 5: 3 } },
      { id: "g", label: "Quiet from thinking about this constantly. Same thought, every day.", evidence: { 3: 3 } },
      { id: "h", label: "The version of me still in there, alongside this one. Both are me.", evidence: { 2: 3 } },
      { id: "i", label: "Drinking that doesn't run my life — a limit I'd actually hold to.", evidence: { 4: 3 } },
      { id: "j", label: "All of it. And I'd start with one piece.", evidence: { 9: 2, 5: 1 } },
      { id: "k", label: "I don't want to quit. I want the consequences gone — and I know that's not on offer.", evidence: { 5: 2, 2: 1 } },
      { id: "l", label: "I don't know yet, and I'd rather hear the answer than pick one.", evidence: { 8: 2, 1: 1 } },
    ],
  },

  "drink-inertia": {
    id: "drink-inertia",
    prompt:
      "Be honest. Is part of this simply that drinking is easier than doing the thing you know you should do?",
    note: "Last one.",
    choices: [
      { id: "a", label: "Yeah. I take the easier option, and that's mine to own without the beating.", evidence: { 6: 3 } },
      { id: "b", label: "It's not laziness — I'm exhausted, and I can tell those two apart.", evidence: { 5: 3 } },
      { id: "c", label: "I want to move and can't get started. One small thing is the whole ask.", evidence: { 9: 3 } },
      { id: "d", label: "It makes me feel like I'm doing something. Same feeling, every night.", evidence: { 3: 3 } },
      { id: "e", label: "I use it as the excuse not to start. First time I've said that out loud.", evidence: { 1: 2, 6: 1 } },
      { id: "f", label: "I know exactly what I should be doing and I don't want to. Both true.", evidence: { 2: 3 } },
      { id: "g", label: "No — I get plenty done while I drink, and I won't pretend otherwise.", evidence: { 5: 2, 2: 1 } },
      { id: "h", label: "That's not what's happening. My day has no structure — that's the real issue.", evidence: { 4: 3 } },
      { id: "i", label: "Maybe. I'd rather sit with that question than answer it fast.", evidence: { 7: 2, 8: 1 } },
    ],
  },

  "drink-consequence": {
    id: "drink-consequence",
    prompt:
      "If someone told you this habit could eventually take years from your life, which thought hits harder?",
    note: "Last one. Reflection, not a verdict.",
    choices: [
      { id: "a", label: "Then I want my life — and there's a first move I already know.", evidence: { 9: 3 } },
      { id: "b", label: "I know, and in the moment I don't care. Same moment, every time.", evidence: { 3: 3 } },
      { id: "c", label: "I care, and the drink still wins sometimes. Both are true of me.", evidence: { 2: 3 } },
      { id: "d", label: "Losing my life scares me more than losing the drink — and I can hold that without spiraling out.", evidence: { 7: 2, 9: 1 } },
      { id: "e", label: "Losing the drink scares me more, and I'm not going to hate myself for saying it.", evidence: { 6: 3 } },
      { id: "f", label: "I understand the risk and it doesn't feel real. I can name the gap between those.", evidence: { 5: 3 } },
      { id: "g", label: "I know what I'm risking and still reach for it. That's the line I keep crossing.", evidence: { 5: 2, 6: 1 } },
      { id: "h", label: "I'd want to sit with that before I answer it.", evidence: { 8: 2, 7: 1 } },
      { id: "i", label: "I don't know yet.", evidence: { 1: 2 } },
    ],
  },

  /* --- THE CHASE — the continuation loop (rebuilt) ------------------ */

  /* PAGE 2: state-specific continuation probe */
  "bet-up": {
    id: "bet-up",
    prompt: "What makes leaving while you're ahead so hard?",
    choices: [
      { id: "a", label: "Taking the win means calling it enough, and enough feels like leaving something on the table.", evidence: { 4: 3, 6: 1 } },
      { id: "b", label: "If I stop now I never find out how far this could have gone.", evidence: { 2: 3 } },
      { id: "c", label: "Stopping ends how this feels, and I don't want that part to end.", evidence: { 8: 3 } },
      { id: "d", label: "I want to show the run wasn't luck — that I was reading it right.", evidence: { 5: 3 } },
    ],
    next: "bet-guarantee",
  },
  "bet-down": {
    id: "bet-down",
    prompt: "What makes stopping after a loss so hard?",
    choices: [
      { id: "a", label: "Stopping makes the number final, and I'm not ready for it to be final.", evidence: { 4: 3 } },
      { id: "b", label: "One decent win puts it all back. That's the sentence in my head.", evidence: { 3: 3, 9: 1 } },
      { id: "c", label: "I don't want the night to be over on this note.", evidence: { 7: 3 } },
      { id: "d", label: "I want out of how losing feels, and playing is the only thing that touches it.", evidence: { 8: 3 } },
    ],
    next: "bet-guarantee",
  },
  "bet-even": {
    id: "bet-even",
    prompt: "You're even. What's the pull to stay in it?",
    choices: [
      { id: "a", label: "Even is boring. I came for something sharper than this.", evidence: { 8: 3 } },
      { id: "b", label: "I don't want the moment to end while it's still going.", evidence: { 7: 3 } },
      { id: "c", label: "Breaking even isn't the point. I want a real number out of this.", evidence: { 4: 3 } },
      { id: "d", label: "Honestly, I just don't stop at this point. I never have.", evidence: { 3: 3 } },
    ],
    next: "bet-guarantee",
  },
  "bet-early": {
    id: "bet-early",
    prompt: "Nothing much has happened yet. So what's pulling?",
    choices: [
      { id: "a", label: "Something has to be about to happen or the hour feels dead.", evidence: { 7: 3 } },
      { id: "b", label: "My hand was already moving before I decided anything.", evidence: { 3: 3 } },
      { id: "c", label: "There's a feeling I haven't named and this is what I do with it.", evidence: { 8: 3 } },
      { id: "d", label: "I don't know. That's the part I'm here about.", evidence: { 1: 2, 5: 1 } },
    ],
    next: "bet-guarantee",
  },

  /* PAGE 3: separate the urge from the outcome */
  "bet-guarantee": {
    id: "bet-guarantee",
    prompt: "If I could guarantee you the next bet would lose, how much would you still want to make it?",
    choices: [
      { id: "a", label: "Not at all. I only want it if I can win.", evidence: { 5: 3 } },
      { id: "b", label: "Part of me still would. I want the moment more than the result.", evidence: { 7: 3 } },
      { id: "c", label: "I'd still want to, because I hate stopping here.", evidence: { 4: 3, 2: 1 } },
      { id: "d", label: "I don't know. That question changes something for me.", evidence: { 1: 2, 6: 1 } },
    ],
  },

  /* PAGE 4: the story the next bet is telling */
  "bet-story": {
    id: "bet-story",
    prompt: "What does the next bet promise you right now?",
    choices: [
      { id: "a", label: "That the money ends up where I want it to be.", evidence: { 4: 3 } },
      { id: "b", label: "That this stops feeling the way it currently feels.", evidence: { 8: 3 } },
      { id: "c", label: "That I was right about how this was going to go.", evidence: { 5: 3 } },
      { id: "d", label: "That the night keeps going somewhere instead of stopping here.", evidence: { 2: 3, 7: 1 } },
    ],
    next: "bet-history",
  },

  /* PAGE 5: reality check through history */
  "bet-history": {
    id: "bet-history",
    prompt: "Forget what you hope happens. What usually happens when you keep going?",
    choices: [
      { id: "a", label: "The same shape every time. I could describe it before it happens.", evidence: { 3: 3 } },
      { id: "b", label: "It gets bigger — the amounts, the time, what I'm willing to risk.", evidence: { 5: 3, 9: 1 } },
      { id: "c", label: "Sometimes it works, sometimes it doesn't, and I can tell the nights apart.", evidence: { 2: 3 } },
      { id: "d", label: "I stop noticing what I'm doing until it's already over.", evidence: { 8: 2, 1: 1 } },
    ],
    next: "bet-need",
  },

  /* PAGE 6: what is actually needed now */
  "bet-need": {
    id: "bet-need",
    prompt: "Last one. What would help you most in the next hour?",
    note: "Reflection, not a verdict — and not a plan for how to play.",
    choices: [
      { id: "a", label: "Enough distance from the decision to actually see it.", evidence: { 5: 3 } },
      { id: "b", label: "Accepting what's already on the table and calling it done.", evidence: { 6: 3 } },
      { id: "c", label: "Letting the urge be there without acting on it.", evidence: { 7: 3 } },
      { id: "d", label: "Telling someone what's happening right now, while it's happening.", evidence: { 9: 3 } },
    ],
  },

};

/**
 * Doorways offered on the start screen. Hidden branches stay in
 * `ALL_DOORWAYS` (and remain resolvable by id) so no work is lost.
 */
export const DOORWAYS: Doorway[] = ALL_DOORWAYS.filter((d) => !d.hidden);

export function getDoorway(id: string | undefined): Doorway | undefined {
  return ALL_DOORWAYS.find((d) => d.id === id);
}

/* ------------------------------------------------------------------ */
/* The sequence                                                        */
/* ------------------------------------------------------------------ */

export type AnswerMap = Record<string, string>;

/**
 * Builds the question sequence for a doorway. The universal branch's
 * follow-up appears only once the universal question has been answered,
 * so the path genuinely branches on what the person said.
 */
/** Every question that can be reached through a branch, by id. */
const ALL_BRANCHES: Record<string, Question> = {
  ...BRANCH_QUESTIONS,
  ...UNIVERSAL_FOLLOW_UPS,
};

function getQuestion(id: string): Question | undefined {
  return ALL_BRANCHES[id];
}

/**
 * Walks a question and everything the person's own answer opened after it:
 * `choice.followUp` for answer-specific branches, `question.next` for a
 * linear chain. Nothing beyond the last answered question is added, so the
 * path genuinely diverges instead of pre-loading a fixed sequence.
 */
function expand(question: Question, answers: AnswerMap, out: Question[], seen: Set<string>) {
  if (seen.has(question.id)) return;
  seen.add(question.id);
  out.push(question);

  const chosenId = answers[question.id];
  if (!chosenId) return;
  const chosen = question.choices.find((c) => c.id === chosenId);
  const nextId = chosen?.followUp ?? question.next;
  if (!nextId) return;
  const next = getQuestion(nextId);
  if (next) expand(next, answers, out, seen);
}

export function buildSequence(
  doorway: Doorway,
  answers: AnswerMap,
  deeperIds: string[] = [],
): Question[] {
  const sequence: Question[] = [];
  const seen = new Set<string>();
  for (const question of doorway.questions) expand(question, answers, sequence, seen);

  // Fixed-length architecture: the opening chain is trimmed to `prefixPages`,
  // then the path continues into the stage-2 chain and is capped, so the
  // branch always runs the same number of pages however it is answered.
  if (doorway.stage2) {
    const prefixCount = doorway.prefixPages ?? 3;
    const total = doorway.totalPages ?? 6;
    const prefix = sequence.slice(0, prefixCount);
    const out = [...prefix];
    const prefixSeen = new Set(prefix.map((q) => q.id));
    const last = prefix[prefix.length - 1];
    if (prefix.length === prefixCount && last && answers[last.id]) {
      const stage2 = getQuestion(doorway.stage2);
      if (stage2) expand(stage2, answers, out, prefixSeen);
    }
    const capped = out.slice(0, total);
    for (const id of deeperIds) {
      const probe = DEEPER_PROBES.find((p) => p.question.id === id);
      if (probe) capped.push(probe.question);
    }
    return capped;
  }



  // The universal "what are you trying not to experience" question is asked
  // only when the person's own answers point toward avoidance — or when the
  // doorway always asks it.
  const suggestsAvoidance = sequence.some((q) => {
    const chosenId = answers[q.id];
    return q.choices.some((c) => c.id === chosenId && c.avoids);
  });

  if (doorway.universal === "always" || (doorway.universal === "ifAvoidance" && suggestsAvoidance)) {
    expand(UNIVERSAL_QUESTION, answers, sequence, seen);
  }

  // Top up with the shared closing questions only if the branch was short,
  // so the whole path stays around five or six taps.
  const doorwayClosing = doorway.closing ? getQuestion(doorway.closing) : undefined;
  const sharedClosing = CORE_QUESTIONS[CORE_QUESTIONS.length - 1];
  const remaining = 5 - sequence.length;
  if (remaining > 0) {
    sequence.push(...CORE_QUESTIONS.slice(0, Math.min(CORE_QUESTIONS.length, remaining)));
    // A doorway with its own closer ends on that, not the shared final
    // question the top-up would otherwise land on.
    if (doorwayClosing) {
      const last = sequence[sequence.length - 1];
      if (last && sharedClosing && last.id === sharedClosing.id) sequence.pop();
      if (doorwayClosing && !seen.has(doorwayClosing.id)) sequence.push(doorwayClosing);
    }
  } else {
    // Always end on a closing question, whatever the branch length.
    const closing = doorwayClosing ?? sharedClosing;
    if (closing && !seen.has(closing.id)) sequence.push(closing);
  }

  // Deeper probes, asked only when the person chose to go deeper from an
  // undetermined result. They are appended in the order they were offered.
  for (const id of deeperIds) {
    const probe = DEEPER_PROBES.find((p) => p.question.id === id);
    if (probe) sequence.push(probe.question);
  }

  return sequence;
}

/* ------------------------------------------------------------------ */
/* Deeper probes (for the undetermined state)                          */
/* ------------------------------------------------------------------ */

/**
 * A probe re-asks an underlying psychological question in different words.
 * `separates` lists the numbers the probe can tell apart, so we can pick
 * the probe that speaks to whichever numbers are currently tied.
 */
export interface DeeperProbe {
  /** Which numbers this probe helps distinguish. */
  separates: GNumber[];
  question: Question;
}

export const DEEPER_PROBES: DeeperProbe[] = [
  {
    separates: [7, 9, 6],
    question: {
      id: "deep-feel",
      prompt: "If you had to name what you don't want to feel right now, which is closest?",
      note: "Same ground as before, asked another way.",
      choices: [
        { id: "a", label: "Restlessness — I want it to move already", evidence: { 7: 4 } },
        { id: "b", label: "The weight of something I already know I should do", evidence: { 9: 4 } },
        { id: "c", label: "Being at fault", evidence: { 6: 4 } },
        { id: "d", label: "Not knowing where I stand", evidence: { 5: 4 } },
        { id: "e", label: "Still can't name it", evidence: { 1: 2 } },
      ],
    },
  },
  {
    separates: [7, 3, 9],
    question: {
      id: "deep-distract",
      prompt: "What would become uncomfortable if you stopped distracting yourself for the next hour?",
      choices: [
        { id: "a", label: "The same thought would start circling", evidence: { 3: 4 } },
        { id: "b", label: "I'd have to just sit in it", evidence: { 7: 4 } },
        { id: "c", label: "I'd have to actually do the thing", evidence: { 9: 4 } },
        { id: "d", label: "I'd have to hear someone out", evidence: { 8: 4 } },
        { id: "e", label: "Nothing much would change", evidence: { 2: 2 } },
      ],
    },
  },
  {
    separates: [5, 2],
    question: {
      id: "deep-known",
      prompt: "Of what you've said so far, how much would hold up if someone asked you to show it?",
      note: "Not a test. Just where the line sits.",
      choices: [
        { id: "a", label: "Most of it — I could point to the facts", evidence: { 5: 4 } },
        { id: "b", label: "Some facts, and a read on someone else", evidence: { 2: 4 } },
        { id: "c", label: "Mostly what I've concluded from it", evidence: { 3: 4 } },
        { id: "d", label: "I'd want to check before answering", evidence: { 5: 2, 1: 1 } },
      ],
    },
  },
  {
    separates: [8, 2],
    question: {
      id: "deep-hear",
      prompt: "If the other person spoke first and you couldn't reply, what would that be like?",
      choices: [
        { id: "a", label: "Hard — I'd be building my answer the whole time", evidence: { 8: 4 } },
        { id: "b", label: "Useful — I'd probably learn something", evidence: { 8: 3, 2: 1 } },
        { id: "c", label: "Fine, but I'd still think they're wrong", evidence: { 2: 4 } },
        { id: "d", label: "There's no one else in this", evidence: { 6: 2, 7: 1 } },
      ],
    },
  },
  {
    separates: [4, 9],
    question: {
      id: "deep-container",
      prompt: "If this same thing showed up again next week, what would you already have in place?",
      choices: [
        { id: "a", label: "A rule or limit I'd actually keep", evidence: { 4: 4 } },
        { id: "b", label: "One small step I know how to take", evidence: { 9: 4 } },
        { id: "c", label: "The same scramble as this time", evidence: { 4: 2, 3: 1 } },
        { id: "d", label: "No idea yet", evidence: { 1: 2 } },
      ],
    },
  },
  {
    separates: [3, 1],
    question: {
      id: "deep-recurs",
      prompt: "Has this shape shown up before, in another setting?",
      choices: [
        { id: "a", label: "Yes — I can name where", evidence: { 3: 4 } },
        { id: "b", label: "Maybe, but it feels different this time", evidence: { 2: 3 } },
        { id: "c", label: "No — this is new ground", evidence: { 1: 4 } },
        { id: "d", label: "I haven't looked", evidence: { 1: 2, 7: 1 } },
      ],
    },
  },
  {
    separates: [6, 2],
    question: {
      id: "deep-part",
      prompt: "Say your part in one sentence — which version comes out?",
      note: "Contribution, not verdict.",
      choices: [
        { id: "a", label: "\"Here's what I did, and here's what they did\"", evidence: { 2: 4 } },
        { id: "b", label: "\"This is on me\"", evidence: { 6: 4 } },
        { id: "c", label: "\"I did one thing I'd do differently\"", evidence: { 6: 3, 9: 1 } },
        { id: "d", label: "I can't get it to one sentence", evidence: { 1: 2 } },
      ],
    },
  },
  {
    separates: [9, 7],
    question: {
      id: "deep-step",
      prompt: "What's the smallest thing you could do about this today?",
      choices: [
        { id: "a", label: "Something specific — I can picture it", evidence: { 9: 4 } },
        { id: "b", label: "Wait, on purpose", evidence: { 7: 4 } },
        { id: "c", label: "Say one true thing to someone", evidence: { 8: 4 } },
        { id: "d", label: "Nothing has a shape yet", evidence: { 1: 2 } },
      ],
    },
  },
];

/**
 * Picks the probe that best speaks to the numbers currently tied, skipping
 * any probe already asked. Returns undefined when we've run out — at which
 * point staying undetermined is the honest outcome.
 */
export function getDeeperProbe(
  contested: GNumber[],
  askedIds: string[] = [],
): Question | undefined {
  let best: DeeperProbe | undefined;
  let bestScore = -1;
  for (const probe of DEEPER_PROBES) {
    if (askedIds.includes(probe.question.id)) continue;
    const score = probe.separates.filter((n) => contested.includes(n)).length;
    if (score > bestScore) {
      bestScore = score;
      best = probe;
    }
  }
  return best?.question;
}

/* ------------------------------------------------------------------ */
/* The pattern engine                                                  */
/* ------------------------------------------------------------------ */

export interface Contribution {
  questionPrompt: string;
  choiceLabel: string;
}

export interface PatternResult {
  /** Undefined means undetermined. */
  primary?: GNumber;
  /** Up to two supporting numbers with real evidence behind them. */
  supporting: GNumber[];
  /** Raw evidence tallies, for the "how this read" panel. */
  tallies: { n: GNumber; weight: number }[];
  /** The answers that carried the primary pattern. */
  contributions: Contribution[];
  /** Plain-language reasoning shown to the person. */
  reasoning: string;
  /** How spread out the evidence was. */
  coherent: boolean;
  /** When undetermined: the numbers the answers are pointing at at once. */
  contested: GNumber[];
}

/** A pattern is primary when it is both present and clearly ahead. */
const MIN_PRIMARY_WEIGHT = 2.4;
const MIN_LEAD = 0.35;
const MIN_SUPPORT_WEIGHT = 1.8;

export function evaluatePattern(sequence: Question[], answers: AnswerMap): PatternResult {
  const totals = new Map<GNumber, number>();
  /** How much evidence each number *could* have collected from the questions asked. */
  const available = new Map<GNumber, number>();
  const byNumber = new Map<GNumber, Contribution[]>();

  for (const question of sequence) {
    for (const n of G_NUMBERS) {
      const reach = Math.max(...question.choices.map((c) => c.evidence[n] ?? 0));
      if (reach > 0) available.set(n, (available.get(n) ?? 0) + reach);
    }

    const choiceId = answers[question.id];
    if (!choiceId) continue;
    const choice = question.choices.find((c) => c.id === choiceId);
    if (!choice) continue;

    for (const key of Object.keys(choice.evidence) as unknown[] as string[]) {
      const n = Number(key) as GNumber;
      const weight = choice.evidence[n] ?? 0;
      if (!weight) continue;
      totals.set(n, (totals.get(n) ?? 0) + weight);
      const list = byNumber.get(n) ?? [];
      list.push({ questionPrompt: question.prompt, choiceLabel: choice.label });
      byNumber.set(n, list);
    }
  }

  // Normalise by how often a number was even on the table, so a number that
  // appears in many choices cannot win on sheer availability. This is not an
  // average of the answers — it measures how concentrated the pattern is.
  const tallies = G_NUMBERS.map((n) => {
    const raw = totals.get(n) ?? 0;
    const reach = available.get(n) ?? 0;
    const weight = raw === 0 ? 0 : raw / Math.sqrt(Math.max(reach, 1)) * 2;
    return { n, weight: Math.round(weight * 100) / 100 };
  }).sort((a, b) => b.weight - a.weight || a.n - b.n);

  const top = tallies[0];
  const second = tallies[1];

  const hasPrimary =
    top !== undefined &&
    top.weight >= MIN_PRIMARY_WEIGHT &&
    (second === undefined || top.weight - second.weight >= MIN_LEAD);


  if (!top || !hasPrimary) {
    return {
      supporting: tallies
        .filter((t) => t.weight >= MIN_SUPPORT_WEIGHT)
        .slice(0, 2)
        .map((t) => t.n),
      tallies,
      contributions: [],
      coherent: false,
      contested: tallies.filter((t) => t.weight > 0).slice(0, 3).map((t) => t.n),
      reasoning:
        "Your answers are pointing in more than one direction at once. That is not a wrong set of answers — there just isn't enough separation yet to tell one pattern from the others in this situation.",
    };
  }

  const primary = top.n;
  const contributions = (byNumber.get(primary) ?? []).slice(0, 3);
  const supporting = tallies
    .slice(1)
    .filter((t) => t.weight >= MIN_SUPPORT_WEIGHT)
    .slice(0, 2)
    .map((t) => t.n);

  const meaning = NUMBERS[primary];
  const reasoning = `Your answers kept returning to ${meaning.signal}. That pattern points most strongly to ${primary}.`;

  return {
    primary,
    supporting,
    tallies,
    contributions,
    coherent: true,
    contested: [],
    reasoning,
  };
}

export const FRAMING_LINES = [
  "There is no right answer and no wrong number.",
  "Every number is useful information about what your mind is doing right now.",
  "The number describes the pattern in this situation — not a permanent type.",
];

/* ------------------------------------------------------------------ */
/* Result output layer — presentation only, never scoring             */
/* ------------------------------------------------------------------ */

/**
 * Humanized explanation and one practical next question/advice per number.
 * NON-SCORING. This does not touch evidence, weights, thresholds or
 * convergence — it only satisfies the universal result standard:
 * initial question → number → core lesson → pattern summary →
 * humanized explanation → practical next question/advice.
 */
export interface NextStep {
  human: string;
  question: string;
  advice: string;
}

export const NEXT_STEPS: Record<GNumber, NextStep> = {
  1: {
    human: "You are at the very front of this. You don't have the shape of it yet, and your answers were honest about that instead of covering it with a story.",
    question: "What is the first honest question you'd ask if nobody was going to judge the answer?",
    advice: "Ask that one question — out loud or on paper — and stop there. You don't need the whole answer today to have started.",
  },
  2: {
    human: "You're holding two things that both feel true, and most of your answers were about someone else's side of it as much as your own.",
    question: "What's the most generous accurate reading of the other person, and what's yours?",
    advice: "Write both versions down without picking a winner. Let them sit next to each other for a day before you act on either.",
  },
  3: {
    human: "Your answers kept pointing at something that repeats. This isn't one event — it's a shape you've seen before, and part of the noise is recognition without a name.",
    question: "When did this exact feeling show up before, and what did it turn out to be about?",
    advice: "Name the pattern out loud once, plainly and without a verdict on yourself. Recognition is the work here, not fixing it tonight.",
  },
  4: {
    human: "The problem in your answers isn't insight — it's that nothing is holding it. Everything is loose, so it all has to be carried at once.",
    question: "What one limit, rule or decision would take this off your hands for the rest of the week?",
    advice: "Pick one container — a decision, a time, a boundary — and put it in place before you think about it any further.",
  },
  5: {
    human: "You're mixing what happened with what you've concluded from it. Some of this is fact and some of it is a read, and they've been running together.",
    question: "Which part of this could you show someone, and which part is your interpretation?",
    advice: "Split the list in two: what occurred, and what you've assumed. Then only act on the first column.",
  },
  6: {
    human: "Your part in this is on your mind, and the noise is coming from the trial rather than the truth. Accountability turned into a case against you.",
    question: "What's your actual share of this — no more, no less?",
    advice: "Own your share in one sentence and stop the sentence there. Ownership without prosecution is the whole move.",
  },
  7: {
    human: "The pressure in your answers is about staying still. This wants to be solved right now, and there's nothing to solve yet — only time to sit through.",
    question: "What would it cost you to leave this exactly as it is until tomorrow?",
    advice: "Don't chase resolution tonight. Choose one unhurried thing, do it, and let this stay unfinished on purpose.",
  },
  8: {
    human: "A lot of this is built out of what you think someone meant. You're working from tone, timing and gaps rather than from what was actually said.",
    question: "What do you actually know they said — and what would you find out by asking them directly?",
    advice: "Ask the one person involved a plain question and let them finish answering before you decide what it means.",
  },
  9: {
    human: "You already know something here. What's left isn't understanding — it's the small step you keep not taking, and the spiral is the gap where it should be.",
    question: "What's the smallest real thing you could do about this in the next hour?",
    advice: "Do that one thing today and let the rest stay unsolved. The step is the point, not the whole solution.",
  },
};

/** Presentation copy for the honest undetermined outcome. */
export const UNDETERMINED_NEXT: NextStep = {
  human: "The answers you gave are pulling in more than one direction at once. That is a real state and a common one — it isn't a failed reading, and no number is being invented to close it out.",
  question: "Which of the threads above would change the most if you got one piece of information?",
  advice: "Pick the thread with the missing information and go get that one piece. Come back to this when you have it.",
};

/**
 * PROJECT-WIDE HARD STANDARD — GABRIEL NUMBER 9 (PRESENTATION ONLY).
 *
 * 9 = Embodiment / Completion: the answers show the person has moved past
 * identifying the pattern and can see what is happening underneath it, and is
 * at the point of carrying that understanding forward. It does NOT mean a
 * behavior stopped, a "correct" choice was made, or abstinence/success.
 *
 * NON-SCORING. This adds no rule for earning 9, changes no evidence, weight,
 * threshold, formula, meaning or Tree mapping. It only shapes result copy.
 */
export const NINE_BRIDGE_QUESTION = "What are you going to do with this insight?";

/**
 * Per-doorway opening line for the 9 result. EVERY doorway gets its own line —
 * no branch may inherit another branch's language. When a new branch is added,
 * add its own entry here; the generic fallback is deliberately branch-neutral.
 */
const NINE_BRIDGE_OPENINGS: Record<string, string> = {
  drink:
    "The urge wasn't simply about wanting a drink. Your answers point to what was happening underneath the urge.",
  well:
    "The unease wasn't simply about things going well. Your answers point to what sits underneath the bracing when calm arrives.",
  bet: "The pull to keep going wasn't simply about the next bet. Your answers point to what continuing itself — the chase — is doing for you underneath.",
  gamble: "The urge wasn't simply about gambling. Your answers point to what the bet was standing in for underneath.",
  spiral: "The spiral wasn't simply about the thought. Your answers show what the looping was protecting you from underneath.",
  loop:
    "The repetition wasn't simply bad luck repeating. Your answers point to the condition underneath that keeps setting it up again.",
  lost:
    "The restlessness wasn't simply about not knowing what to do today. Your answers point to the thing underneath it.",
  chance:
    "The question wasn't simply whether to take the chance. Your answers point to what the risk actually represents underneath.",
  talk:
    "It wasn't simply about whether now is the right time to talk. Your answers point to what you already know needs saying underneath the timing.",
  happened:
    "It wasn't simply about what happened. Your answers point to what you already understand, underneath, about your part in it.",
  surprise:
    "It wasn't simply about being caught off guard. Your answers point to what you already recognised underneath the surprise.",
};

export function getNineBridge(doorwayId: string | undefined): {
  human: string;
  question: string;
} {
  const opening =
    (doorwayId && NINE_BRIDGE_OPENINGS[doorwayId]) ??
    "This wasn't simply about the situation you came in with. Your answers point to what is happening underneath it.";
  return {
    human: `Your answers show you have moved past simply identifying the pattern — you can see what is actually going on underneath it. ${opening}`,
    question: NINE_BRIDGE_QUESTION,
  };
}
