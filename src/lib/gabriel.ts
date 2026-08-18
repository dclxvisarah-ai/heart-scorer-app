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
    universal: true,
    questions: [
      {
        id: "lost-1",
        prompt: "What's underneath that, if you had to guess?",
        choices: [
          { id: "a", label: "There's something I'm avoiding", evidence: { 7: 2 } },
          { id: "b", label: "Too many things, none of them urgent", evidence: { 4: 2, 5: 1 } },
          { id: "c", label: "I'm tired in a way sleep doesn't fix", evidence: { 7: 2, 6: 1 } },
          { id: "d", label: "Something happened and I'm still in it", evidence: { 3: 2, 8: 1 } },
          { id: "e", label: "No idea. That's why I'm here", evidence: { 1: 2 } },
        ],
      },
      {
        id: "lost-2",
        prompt: "Is the day the problem, or is the day where the problem is showing up?",
        choices: [
          { id: "a", label: "The day itself — it's just shapeless", evidence: { 4: 3 } },
          { id: "b", label: "It's showing up here", evidence: { 3: 2, 5: 1 } },
          { id: "c", label: "Both, honestly", evidence: { 2: 2, 4: 1 } },
          { id: "d", label: "Can't tell", evidence: { 1: 1, 5: 1 } },
        ],
      },
    ],
  },
  {
    id: "chance",
    label: "Should I take a chance?",
    sub: "Something's on the table",
    universal: false,
    questions: [
      {
        id: "chance-1",
        prompt: "What are you actually weighing?",
        choices: [
          { id: "a", label: "Whether I can survive it going badly", evidence: { 5: 2, 4: 1 } },
          { id: "b", label: "Whether I'd regret not trying", evidence: { 9: 2, 7: 1 } },
          { id: "c", label: "What someone else would think", evidence: { 2: 2, 8: 1 } },
          { id: "d", label: "Whether the timing is right", evidence: { 8: 3 } },
          { id: "e", label: "I already know and I'm stalling", evidence: { 9: 3 } },
        ],
      },
      {
        id: "chance-2",
        prompt: "How much of your case for it is fact?",
        choices: [
          { id: "a", label: "Most of it — I've checked", evidence: { 5: 2, 9: 1 } },
          { id: "b", label: "Some fact, some hope", evidence: { 5: 3 } },
          { id: "c", label: "Mostly a feeling I trust", evidence: { 3: 2, 7: 1 } },
          { id: "d", label: "I haven't separated them", evidence: { 5: 2, 1: 1 } },
        ],
      },
      {
        id: "chance-3",
        prompt: "If it doesn't work, what would you still have?",
        choices: [
          { id: "a", label: "Something repeatable I learned", evidence: { 4: 2, 9: 1 } },
          { id: "b", label: "The same situation, minus some money or time", evidence: { 5: 2 } },
          { id: "c", label: "A harder version of the problem", evidence: { 7: 2, 6: 1 } },
          { id: "d", label: "Haven't thought that far", evidence: { 1: 2 } },
        ],
      },
    ],
  },
  {
    id: "gamble",
    label: "I'm feeling lucky — should I gamble?",
    sub: "Playful, but let's be honest about it",
    universal: true,
    questions: [
      {
        id: "gamble-1",
        prompt: "Where's the lucky feeling coming from?",
        note: "No judgment here. Sometimes it's just a good mood.",
        choices: [
          { id: "a", label: "Good mood, nothing more", evidence: { 7: 1, 2: 1 } },
          { id: "b", label: "A run of things going right", evidence: { 3: 2, 7: 1 } },
          { id: "c", label: "I'm behind and want to catch up", evidence: { 5: 2, 6: 1 } },
          { id: "d", label: "Restlessness, if I'm honest", evidence: { 7: 3 } },
          { id: "e", label: "Not sure", evidence: { 1: 1 } },
        ],
      },
      {
        id: "gamble-2",
        prompt: "Do you have a line you've already decided on?",
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
    universal: false,
    questions: [
      {
        id: "talk-1",
        prompt: "What do you want out of the conversation?",
        choices: [
          { id: "a", label: "To be understood", evidence: { 8: 2, 2: 1 } },
          { id: "b", label: "To understand them", evidence: { 8: 3 } },
          { id: "c", label: "For something to change", evidence: { 9: 2, 4: 1 } },
          { id: "d", label: "To stop carrying it alone", evidence: { 6: 2, 7: 1 } },
          { id: "e", label: "I don't know yet", evidence: { 1: 2 } },
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
          { id: "c", label: "Go quiet and think", evidence: { 7: 2, 3: 1 } },
          { id: "d", label: "Honestly, react", evidence: { 6: 2, 3: 1 } },
        ],
      },
    ],
  },
  {
    id: "drink",
    label: "I feel like I want a drink and I don't know why",
    sub: "Could be nothing. Could be worth a look",
    universal: true,
    questions: [
      {
        id: "drink-1",
        prompt: "What time of day does the pull usually show up?",
        choices: [
          { id: "a", label: "When the day stops moving", evidence: { 7: 2, 3: 1 } },
          { id: "b", label: "After something specific happens", evidence: { 3: 2, 5: 1 } },
          { id: "c", label: "Around other people", evidence: { 2: 2 } },
          { id: "d", label: "It's not a pattern — just today", evidence: { 1: 1, 7: 1 } },
        ],
      },
      {
        id: "drink-2",
        prompt: "What would the drink do, in one word?",
        choices: [
          { id: "a", label: "Soften", evidence: { 7: 2, 6: 1 } },
          { id: "b", label: "Quiet", evidence: { 3: 2, 7: 1 } },
          { id: "c", label: "Reward", evidence: { 9: 1, 6: 2 } },
          { id: "d", label: "Belong", evidence: { 2: 2 } },
          { id: "e", label: "Nothing — I'd just enjoy it", evidence: { 7: 1, 2: 1 } },
        ],
      },
    ],
  },
  {
    id: "well",
    label: "Everything's going really well and I'm not used to that",
    sub: "Calm can feel unfamiliar",
    universal: true,
    questions: [
      {
        id: "well-1",
        prompt: "What does the good stretch feel like from the inside?",
        choices: [
          { id: "a", label: "Like I'm waiting for the other shoe", evidence: { 7: 3 } },
          { id: "b", label: "Like I should be doing more with it", evidence: { 7: 2, 9: 1 } },
          { id: "c", label: "Undeserved", evidence: { 6: 3 } },
          { id: "d", label: "Good, and unfamiliar", evidence: { 7: 2, 2: 1 } },
          { id: "e", label: "Hard to describe", evidence: { 1: 2 } },
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
    universal: false,
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
    universal: false,
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
          { id: "c", label: "Decided to stop caring about it", evidence: { 7: 2, 6: 1 } },
          { id: "d", label: "Nothing yet", evidence: { 1: 1, 9: 1 } },
        ],
      },
    ],
  },
  {
    id: "surprise",
    label: "Take a chance — pick for me",
    sub: "You bring nothing; we'll start anyway",
    universal: true,
    questions: [
      {
        id: "surprise-1",
        prompt: "Fine. What's the first true thing about today?",
        choices: [
          { id: "a", label: "I'm carrying something and pretending I'm not", evidence: { 6: 2, 7: 1 } },
          { id: "b", label: "I'm fine and slightly bored", evidence: { 7: 2 } },
          { id: "c", label: "There's one thing I keep not doing", evidence: { 9: 3 } },
          { id: "d", label: "Someone is on my mind", evidence: { 8: 2, 2: 1 } },
          { id: "e", label: "I couldn't tell you", evidence: { 1: 2 } },
        ],
      },
      {
        id: "surprise-2",
        prompt: "And what would you rather I didn't ask about?",
        choices: [
          { id: "a", label: "There is something", evidence: { 7: 2, 5: 1 } },
          { id: "b", label: "Nothing comes to mind", evidence: { 2: 1, 7: 1 } },
          { id: "c", label: "Everything, a bit", evidence: { 6: 2, 7: 1 } },
          { id: "d", label: "Not answering that", evidence: { 1: 1, 7: 1 } },
        ],
      },
    ],
  },
];

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
export function buildSequence(
  doorway: Doorway,
  answers: AnswerMap,
  deeperIds: string[] = [],
): Question[] {
  const sequence: Question[] = [...doorway.questions];

  if (doorway.universal) {
    sequence.push(UNIVERSAL_QUESTION);
    const chosenId = answers[UNIVERSAL_QUESTION.id];
    const chosen = UNIVERSAL_QUESTION.choices.find((c) => c.id === chosenId);
    if (chosen?.followUp) {
      const followUp = UNIVERSAL_FOLLOW_UPS[chosen.followUp];
      if (followUp) sequence.push(followUp);
    }
  }

  // Keep the whole path short: enough core questions to reach 5–6 total.
  const remaining = Math.max(2, 6 - sequence.length);
  sequence.push(...CORE_QUESTIONS.slice(0, Math.min(CORE_QUESTIONS.length, remaining)));

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
