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
   * Optional doorway-specific closing question. When present it replaces the
   * shared final core question as the last question of the path, so a branch
   * ends on something specific to its own thread instead of the generic
   * closer. Doorways without one keep the shared closer (unchanged behavior).
   */
  closing?: Question;
}

/* ------------------------------------------------------------------ */
/* The universal branch                                               */
/* ------------------------------------------------------------------ */

export const UNIVERSAL_QUESTION: Question = {
  id: "u1",
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
    prompt: "What's the harder part of it?",
    choices: [
      { id: "a", label: "Hearing what they'll say", evidence: { 8: 3 } },
      { id: "b", label: "Saying my part accurately", evidence: { 8: 2, 5: 1 } },
      { id: "c", label: "Admitting where I contributed", evidence: { 6: 3, 2: 1 } },
      { id: "d", label: "Choosing when to have it", evidence: { 8: 2, 4: 1 } },
      { id: "e", label: "Not sure yet", evidence: { 1: 1 } },
    ],
  },
  "uf-uncertainty": {
    id: "uf-uncertainty",
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

export const DOORWAYS: Doorway[] = [
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
    questions: [
      {
        id: "spiral-1",
        prompt: "What is it actually doing right now?",
        choices: [
          { id: "replay", label: "Replaying something that already happened", evidence: { 3: 2, 8: 1 }, followUp: "spiral-replay" },
          { id: "predict", label: "Predicting something that hasn't happened", evidence: { 5: 1, 7: 2 }, followUp: "spiral-predict" },
          { id: "meant", label: "Trying to figure out what someone else meant", evidence: { 8: 2, 2: 1 }, followUp: "spiral-meant" },
          { id: "reassure", label: "Searching for reassurance", evidence: { 2: 2, 7: 1 }, followUp: "spiral-reassure" },
          { id: "unsolvable", label: "Trying to solve a problem that doesn't have an answer yet", evidence: { 7: 2, 5: 1 }, followUp: "spiral-unsolvable" },
          { id: "worst", label: "Finding everything that could go wrong", evidence: { 5: 2, 7: 1 }, followUp: "spiral-predict" },
          { id: "jump", label: "Jumping between several problems", evidence: { 4: 2, 3: 1 }, followUp: "spiral-jump" },
          { id: "stuck", label: "Getting stuck on one thought", evidence: { 3: 3 }, followUp: "spiral-stuck" },
          { id: "unknown", label: "I can't even tell what started it", evidence: { 1: 2 }, followUp: "spiral-unknown" },
        ],
      },
      {
        id: "spiral-known",
        prompt: "What's actually known?",
        note: "Just the line between what happened and what you've filled in.",
        choices: [
          { id: "a", label: "I know something happened", evidence: { 5: 3 } },
          { id: "b", label: "I know how I feel, but not what the other person meant", evidence: { 2: 2, 8: 2 } },
          { id: "c", label: "I have evidence, but I'm filling in some gaps", evidence: { 5: 2, 2: 1 } },
          { id: "d", label: "I mostly have assumptions right now", evidence: { 2: 3 } },
          { id: "e", label: "I genuinely don't know yet", evidence: { 1: 2, 5: 1 } },
        ],
      },
    ],
  },
  {
    id: "drink",
    label: "I feel like I want a drink and I don't know why",
    sub: "Could be nothing. Could be worth a look",
    universal: "ifAvoidance",
    questions: [
      {
        id: "drink-1",
        prompt: "Which is closest to the strange part?",
        note: "No assumption here that anything is wrong.",
        choices: [
          { id: "well", label: "My life is actually going well, so I don't understand the urge", evidence: { 7: 2, 2: 1 }, followUp: "drink-well" },
          { id: "stress", label: "I've been stressed and I want relief", evidence: { 7: 2, 6: 1 }, followUp: "drink-stress" },
          { id: "bored", label: "I'm bored or restless", evidence: { 7: 3 }, followUp: "drink-bored" },
          { id: "routine", label: "It's simply part of my routine", evidence: { 3: 2, 4: 1 }, followUp: "drink-habit-1" },
          { id: "change", label: "I want to change how I feel", evidence: { 7: 1, 9: 1 }, followUp: "drink-change" },
          { id: "happened", label: "Something happened and I don't want to think about it", evidence: { 3: 1, 7: 1 }, followUp: "drink-happened", avoids: true },
          { id: "plain", label: "Nothing happened. I just want one", evidence: { 2: 1, 7: 1 }, followUp: "drink-plain" },
          { id: "good", label: "I've been feeling unusually good and I don't know how to sit with it", evidence: { 7: 2, 6: 1 }, followUp: "drink-well" },
          { id: "unclear", label: "I honestly can't tell", evidence: { 1: 2 }, followUp: "drink-unclear" },
        ],
      },
    ],
  },
  {
    id: "gamble",
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
    id: "talk",
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
          { id: "a", label: "I can name it without piling on myself", evidence: { 6: 3, 2: 1 } },
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
      { id: "a", label: "Yes — I know exactly what I'd need to check", evidence: { 5: 3, 9: 1 } },
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
      { id: "a", label: "Yes — and both make sense", evidence: { 2: 3, 6: 1 } },
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
  "spiral-replay": {
    id: "spiral-replay",
    prompt: "What does the replay keep landing on?",
    choices: [
      { id: "a", label: "Something I said", evidence: { 8: 2, 6: 1 } },
      { id: "b", label: "Something they said", evidence: { 8: 2, 2: 1 } },
      { id: "c", label: "The moment I should have said something and didn't", evidence: { 9: 2, 8: 1 } },
      { id: "d", label: "How I looked or came across", evidence: { 6: 3 } },
      { id: "e", label: "It doesn't land anywhere, it just runs", evidence: { 3: 3 } },
    ],
  },
  "spiral-predict": {
    id: "spiral-predict",
    prompt: "How likely is the thing you're predicting, really?",
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
    choices: [
      { id: "a", label: "Since today", evidence: { 5: 2, 7: 1 } },
      { id: "b", label: "A few days", evidence: { 3: 2, 7: 1 } },
      { id: "c", label: "Weeks or longer", evidence: { 3: 3 } },
      { id: "d", label: "It comes back every few months", evidence: { 3: 3, 4: 1 } },
      { id: "e", label: "No idea", evidence: { 1: 2 } },
    ],
  },
  "spiral-unknown": {
    id: "spiral-unknown",
    prompt: "What was happening right before it started?",
    choices: [
      { id: "a", label: "I was alone and it got quiet", evidence: { 7: 3 } },
      { id: "b", label: "I read or saw something", evidence: { 3: 2, 5: 1 } },
      { id: "c", label: "I talked to someone", evidence: { 8: 3 } },
      { id: "d", label: "I was tired or hadn't eaten", evidence: { 7: 2, 6: 1 } },
      { id: "e", label: "Nothing I can point to", evidence: { 1: 2, 3: 1 } },
    ],
  },

  /* --- "I want a drink and I don't know why" ---------------------- */
  "drink-well": {
    id: "drink-well",
    prompt: "What feels hardest to simply experience right now?",
    note: "Not looking for a hidden problem. Sometimes good is just unfamiliar.",
    choices: [
      { id: "a", label: "Feeling good without waiting for something to go wrong", evidence: { 7: 3 } },
      { id: "b", label: "Having nothing I need to fix", evidence: { 7: 2, 4: 1 } },
      { id: "c", label: "Being still", evidence: { 7: 3 } },
      { id: "d", label: "Feeling successful or comfortable", evidence: { 6: 3 } },
      { id: "e", label: "Not knowing what comes next", evidence: { 5: 2, 7: 1 } },
      { id: "f", label: "Having too much freedom", evidence: { 4: 3 } },
      { id: "g", label: "Nothing feels difficult — I just have the urge", evidence: { 2: 2, 9: 1 } },
      { id: "h", label: "I don't know yet", evidence: { 1: 2 } },
    ],
  },
  "drink-stress": {
    id: "drink-stress",
    prompt: "Where is the stress actually coming from?",
    choices: [
      { id: "a", label: "Work or money", evidence: { 4: 3 } },
      { id: "b", label: "A person", evidence: { 8: 2, 2: 1 } },
      { id: "c", label: "Too many small things at once", evidence: { 4: 2, 3: 1 } },
      { id: "d", label: "Something unresolved that's just sitting there", evidence: { 9: 2, 7: 1 }, avoids: true },
      { id: "e", label: "It's background, not one thing", evidence: { 7: 2, 3: 1 } },
    ],
  },
  "drink-bored": {
    id: "drink-bored",
    prompt: "What would fill the same slot as the drink tonight?",
    choices: [
      { id: "a", label: "Honestly, plenty of things — I just default", evidence: { 3: 2, 9: 1 } },
      { id: "b", label: "Company. It's about people, not the drink", evidence: { 2: 3 } },
      { id: "c", label: "Nothing has the same edge to it", evidence: { 7: 3 } },
      { id: "d", label: "Something I'd have to plan, which is the problem", evidence: { 4: 3 } },
      { id: "e", label: "I don't know", evidence: { 1: 2 } },
    ],
  },
  "drink-change": {
    id: "drink-change",
    prompt: "What do you want to feel instead?",
    note: "Not why. Just which direction.",
    choices: [
      { id: "a", label: "Calmer", evidence: { 7: 2, 6: 1 } },
      { id: "b", label: "Less bored", evidence: { 7: 3 } },
      { id: "c", label: "Less restless", evidence: { 7: 2, 3: 1 } },
      { id: "d", label: "More social", evidence: { 2: 3 } },
      { id: "e", label: "More relaxed", evidence: { 7: 2, 9: 1 } },
      { id: "f", label: "More excited", evidence: { 1: 2, 9: 1 } },
      { id: "g", label: "Less aware of myself", evidence: { 6: 3 }, avoids: true },
      { id: "h", label: "I don't know", evidence: { 1: 2 } },
    ],
  },
  "drink-happened": {
    id: "drink-happened",
    prompt: "What's the part you'd rather not think about?",
    choices: [
      { id: "a", label: "Something someone said", evidence: { 8: 3 } },
      { id: "b", label: "Something I said or did", evidence: { 6: 3 } },
      { id: "c", label: "News I got", evidence: { 5: 2, 7: 1 } },
      { id: "d", label: "Something that isn't resolved yet", evidence: { 7: 2, 5: 1 } },
      { id: "e", label: "I'd rather not name it here either", evidence: { 7: 2, 1: 1 } },
    ],
  },
  "drink-plain": {
    id: "drink-plain",
    prompt: "Fair. What's the drink connected to, if anything?",
    choices: [
      { id: "a", label: "The end of the workday", evidence: { 3: 2, 4: 1 } },
      { id: "b", label: "Taste — I actually like it", evidence: { 2: 2, 9: 1 } },
      { id: "c", label: "People I'd be with", evidence: { 2: 3 } },
      { id: "d", label: "The hour, more than anything", evidence: { 3: 3 } },
      { id: "e", label: "Nothing. It's just a want", evidence: { 7: 1, 2: 1 } },
    ],
  },
  "drink-unclear": {
    id: "drink-unclear",
    prompt: "When did you first notice the pull today?",
    choices: [
      { id: "a", label: "When the day stopped moving", evidence: { 7: 2, 3: 1 } },
      { id: "b", label: "Right after something specific happened", evidence: { 3: 2, 5: 1 }, avoids: true },
      { id: "c", label: "Around other people", evidence: { 2: 3 } },
      { id: "d", label: "It's been there all day, low", evidence: { 7: 2, 3: 1 } },
      { id: "e", label: "I can't place it", evidence: { 1: 2 } },
    ],
  },
  "drink-habit-1": {
    id: "drink-habit-1",
    prompt: "What does the routine give you?",
    choices: [
      { id: "a", label: "Something familiar", evidence: { 3: 3 } },
      { id: "b", label: "Something to look forward to", evidence: { 9: 2, 2: 1 } },
      { id: "c", label: "A way to change how I feel", evidence: { 7: 2, 6: 1 } },
      { id: "d", label: "A way to mark the beginning or end of something", evidence: { 4: 3 } },
      { id: "e", label: "A break from myself", evidence: { 6: 3 } },
      { id: "f", label: "A sense of control", evidence: { 4: 2, 5: 1 } },
      { id: "g", label: "Something I don't have to think about", evidence: { 3: 2, 7: 1 } },
      { id: "h", label: "I don't know yet", evidence: { 1: 2 } },
    ],
    next: "drink-habit-2",
  },
  "drink-habit-2": {
    id: "drink-habit-2",
    prompt: "If you didn't do the routine, what might you have to experience instead?",
    choices: [
      { id: "a", label: "Boredom", evidence: { 7: 3 } },
      { id: "b", label: "Restlessness", evidence: { 7: 2, 3: 1 } },
      { id: "c", label: "Stillness", evidence: { 7: 3 } },
      { id: "d", label: "My thoughts", evidence: { 3: 3 } },
      { id: "e", label: "An emotion", evidence: { 7: 2, 6: 1 } },
      { id: "f", label: "A responsibility", evidence: { 9: 2, 4: 1 } },
      { id: "g", label: "An uncomfortable conversation", evidence: { 8: 3 } },
      { id: "h", label: "A version of myself I don't recognize", evidence: { 6: 2, 1: 1 } },
      { id: "i", label: "Nothing particularly uncomfortable", evidence: { 2: 2, 9: 1 } },
      { id: "j", label: "I honestly don't know", evidence: { 1: 2 } },
    ],
    next: "drink-habit-3",
  },
  "drink-habit-3": {
    id: "drink-habit-3",
    prompt: "What else might change if the routine changed?",
    note: "Both directions count. This isn't a nudge to stop.",
    choices: [
      { id: "a", label: "I might have more money", evidence: { 5: 2, 4: 1 } },
      { id: "b", label: "I might feel better physically during the day", evidence: { 9: 3 } },
      { id: "c", label: "I might have more energy", evidence: { 9: 2, 7: 1 } },
      { id: "d", label: "My mornings might feel different", evidence: { 4: 2, 9: 1 } },
      { id: "e", label: "I might sleep better", evidence: { 9: 2, 4: 1 } },
      { id: "f", label: "I might be more present with people", evidence: { 8: 2, 2: 1 } },
      { id: "g", label: "I might have more time", evidence: { 4: 3 } },
      { id: "h", label: "I might trust myself more", evidence: { 6: 3 } },
      { id: "i", label: "I might discover I don't miss it as much as I thought", evidence: { 2: 2, 5: 1 } },
      { id: "j", label: "My life might feel unfamiliar for a while", evidence: { 7: 2, 1: 1 } },
      { id: "k", label: "I might have to figure out what I actually want instead", evidence: { 1: 3 } },
      { id: "l", label: "I don't know what would change", evidence: { 1: 2 } },
    ],
    next: "drink-habit-4",
  },
  "drink-habit-4": {
    id: "drink-habit-4",
    prompt: "Which feels more true right now?",
    note: "Neither answer is the right one.",
    choices: [
      { id: "a", label: "What I'd lose feels more real than what I'd gain", evidence: { 7: 2, 3: 1 } },
      { id: "b", label: "What I'd gain feels more real than what I'd lose", evidence: { 9: 3 } },
      { id: "c", label: "Both feel real, and that's the whole tension", evidence: { 2: 3, 6: 1 } },
      { id: "d", label: "Neither feels real. It's just a habit", evidence: { 3: 3 } },
      { id: "e", label: "I don't want to answer this today", evidence: { 7: 2, 1: 1 } },
    ],
  },
};

export function getDoorway(id: string | undefined): Doorway | undefined {
  return DOORWAYS.find((d) => d.id === id);
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
  const remaining = 5 - sequence.length;
  if (remaining > 0) {
    sequence.push(...CORE_QUESTIONS.slice(0, Math.min(CORE_QUESTIONS.length, remaining)));
  } else {
    // Always end on the same closing question, whatever the branch length.
    const closing = CORE_QUESTIONS[CORE_QUESTIONS.length - 1];
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
