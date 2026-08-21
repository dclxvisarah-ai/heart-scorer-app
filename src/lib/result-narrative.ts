/**
 * PROJECT-WIDE RESULT-PRESENTATION STANDARD — GABRIEL NUMBERS 1–8.
 *
 * PRESENTATION ONLY. Nothing in this file participates in scoring: no
 * evidence, weights, thresholds, formula, convergence rule, number meaning or
 * Tree mapping is defined, read or altered here. The response pattern
 * determines the number (see evaluatePattern in gabriel.ts); this file only
 * explains, in branch-specific human language, why that pattern produced that
 * number and what to look at next.
 *
 * CONVENTION FOR EVERY FUTURE BRANCH: add a BRANCH_LENS entry keyed by the
 * doorway id, with a mechanism phrase and one clarity line + one next question
 * per number 1–8. Number 9 is handled separately and permanently by
 * getNineBridge (do not duplicate or override it here).
 */
import { NUMBERS, NEXT_STEPS, type Contribution, type GNumber } from "./gabriel";

export type ResultNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface BranchLens {
  /** What the branch is psychologically investigating. */
  mechanism: string;
  /** Why this response pattern produced this number, in branch terms. */
  clarity: Record<ResultNumber, string>;
  /** Branch-appropriate next question. */
  next: Record<ResultNumber, string>;
}

const GENERIC: BranchLens = {
  mechanism: "what is actually running underneath the situation you came in with",
  clarity: {
    1: "you are at the very front of this. Your answers didn't cover the not-knowing with a story, and that willingness to look is the whole signal here.",
    2: "your answers hold two things that both stay true at once, and neither one cancels the other out.",
    3: "your answers point at something that repeats rather than one isolated event — you are starting to see its shape.",
    4: "your answers show insight with nothing holding it. There is no container, so all of it has to be carried at once.",
    5: "your answers mix what you actually know with what you have concluded, and the two have been running together as one thing.",
    6: "your answers keep circling your own part in this, and the weight is coming from the trial rather than from the truth.",
    7: "your answers show pressure to resolve something that isn't resolvable yet. The difficulty is stillness, not the problem.",
    8: "much of this is built from what you think someone meant — tone, timing and gaps rather than what was actually said.",
  },
  next: {
    1: "What is the first honest question you would ask if nobody was going to judge the answer?",
    2: "Which two things are both true here, and what happens if you stop making one of them win?",
    3: "What tends to happen immediately before this feeling shows up?",
    4: "What one limit or decision would take this off your hands for the rest of the week?",
    5: "Which part of this could you show someone, and which part is your read on it?",
    6: "What is your actual share of this — no more, no less?",
    7: "What would it cost you to leave this exactly as it is until tomorrow?",
    8: "What do you actually know was said, and what would you find out by asking directly?",
  },
};

const BRANCH_LENS: Record<string, BranchLens> = {
  lost: {
    mechanism: "what the restlessness of not knowing what to do today is actually about",
    clarity: {
      1: "the honest read is that you don't yet know what you need, and your answers said so instead of inventing a task to feel productive.",
      2: "you're pulled between two versions of today that both make sense — the one you think you should live and the one you actually want.",
      3: "this particular restless day has a shape you've been in before, and part of the noise is recognizing it without naming it.",
      4: "the day has no structure, so every option stays equally live and nothing gets chosen. That's a container problem, not a motivation problem.",
      5: "some of what feels urgent today is fact and some is a conclusion you've drawn about yourself, and they've been running as one thing.",
      6: "you're grading yourself on the day while you're still inside it, and the self-verdict is doing more damage than the aimlessness.",
      7: "your answers point to discomfort with an unstimulating hour rather than a real problem to solve. The restlessness is asking you to move, not to decide.",
      8: "a good part of today is waiting on someone else's signal — permission, an answer, a tone you're reading into.",
    },
    next: {
      1: "What is the first honest thing you'd admit about today if you weren't performing productivity?",
      2: "What do you want today to be, and what do you think it's supposed to be?",
      3: "When was the last day that felt exactly like this, and what turned out to be underneath it?",
      4: "What one thing, at one time, could you decide now so the rest of the day stops competing?",
      5: "What is actually true about today, and what have you concluded about yourself from it?",
      6: "What would you say about this day if it were somebody else's day?",
      7: "Could you sit through one uneventful hour on purpose and see what surfaces?",
      8: "Whose answer are you waiting on, and what would you ask them plainly?",
    },
  },
  spiral: {
    mechanism: "what the looping thought is doing and what it's protecting you from",
    clarity: {
      1: "the spiral hasn't been named yet — your answers show the first honest look at it rather than a conclusion about it.",
      2: "the loop is running between two true things at once: your read and theirs, or what you want and what you fear. It spins because you keep making it pick.",
      3: "this isn't one thought. Your answers show a familiar circuit, and your state is changing what you perceive as evidence inside it.",
      4: "the thinking has no boundary around it, so it runs whenever there's space. It needs a container, not a better answer.",
      5: "the spiral is mostly built material. Your answers mix the few known facts with a much larger interpretation, and the loop lives in the assumed part.",
      6: "the loop is a case being argued against you. Your answers show accountability that turned into prosecution and won't return a verdict.",
      7: "there is nothing to solve yet, and the spiral is what's happening instead of stillness. The intolerable part is waiting, not the subject.",
      8: "the spiral is running on what you think someone meant. It's re-reading tone and gaps because the actual information is missing.",
    },
    next: {
      1: "What is the spiral actually asking, in one plain sentence?",
      2: "What are the two things you keep making the loop choose between?",
      3: "What was the last situation that produced this same circuit?",
      4: "What time boundary would you give this thinking so it isn't allowed to run all night?",
      5: "Which parts of the spiral could you prove, and which parts are constructed?",
      6: "What is the one sentence of your actual share here — and can you stop the sentence there?",
      7: "What happens if you leave this unfinished until tomorrow on purpose?",
      8: "What do you actually know they said, and what would asking them directly end?",
    },
  },
  drink: {
    mechanism: "what the urge to drink is actually providing right now",
    clarity: {
      1: "your answers don't yet name what the urge is for, and they didn't pretend to. Looking at it at all is where this starts.",
      2: "the urge holds two truths at once — it genuinely helps something, and it costs something — and your answers refused to collapse either one.",
      3: "this urge arrives on a familiar cue. Your answers show a repeating hour, mood or sequence rather than a random want.",
      4: "your answers point to an unstructured stretch of time that the drink reliably fills. The gap is structural, not moral.",
      5: "what you know about tonight and what you assume the drink will do are mixed together. The expectation is doing a lot of the pulling.",
      6: "your answers keep returning to a verdict on yourself for wanting it, and the self-prosecution is louder than the urge.",
      7: "the urge is aimed at a feeling you don't want to sit inside. Your answers show a wish to change state rather than a wish for alcohol.",
      8: "something unsaid or misread with another person is sitting under this. The urge is standing where a conversation should be.",
    },
    next: {
      1: "What is the most honest sentence about what you want the drink to do?",
      2: "What does the drink actually give you, and what does it take on the same night?",
      3: "What happens in the hour right before the urge shows up?",
      4: "What would fill this specific hour if the drink weren't the default in it?",
      5: "What do you know about how tonight goes with it — not what you're hoping?",
      6: "Can you describe wanting a drink tonight without putting yourself on trial for it?",
      7: "What feeling would still be here in an hour if you didn't change it?",
      8: "Who is involved in this that you haven't actually spoken to?",
    },
  },
  bet: {
    mechanism: "what keeps you going once you're already in it",
    clarity: {
      1: "your answers show the pull to continue is real and unexplained. You're at the first honest look at it, not at an answer for it.",
      2: "your answers hold both at once: you know where the sensible stop is and you still want the next one. Neither side cancelled the other out.",
      3: "continuing has a shape you already recognise — the same sequence, the same point where stopping stops being an option.",
      4: "your answers point to the question of enough. Continuing is about refusing a number to be final, whether that number is a win or a loss.",
      5: "what you know about how these sessions end and what you expect from the next bet are running together. The expectation is doing the pulling.",
      6: "your answers accept what's already on the table without turning it into a case against yourself. That acceptance is the part doing the work.",
      7: "the chase is aimed at a state, not a result — your answers point to not wanting the moment, the charge or the openness to end.",
      8: "your answers point to a feeling underneath the continuing: how being up, being down or being flat sits in you before any decision gets made.",
    },
    next: {
      1: "What is the most honest sentence about why you didn't stop the last time you could have?",
      2: "What would you have to accept for stopping while ahead to feel like a win rather than a loss?",
      3: "At what exact point in a session does stopping stop feeling like an option?",
      4: "What would 'enough' look like tonight, decided before the next bet rather than during it?",
      5: "What actually happens by the end of these sessions, as opposed to what you picture mid-session?",
      6: "What is already on the table that you could let stand as it is?",
      7: "What would you be feeling in the next hour if nothing else was placed?",
      8: "What was the feeling in you just before you wanted to keep going?",
    },
  },

  well: {
    mechanism: "why calm feels unfamiliar and what you're doing with it",
    clarity: {
      1: "you're at the beginning of something you don't have practice with — your answers admit that good is unfamiliar rather than explaining it away.",
      2: "two things are true at once: things really are okay, and you're braced. Your answers hold both without either being denial.",
      3: "your answers show a familiar reflex — calm arrives, and you start scanning. You've done this before and you're seeing the pattern.",
      4: "nothing is holding the good period in place, so it feels temporary by default. It needs a container to become repeatable.",
      5: "you're mixing what is actually happening with what you assume it means about what's coming. The prediction is not the fact.",
      6: "your answers point at discomfort with deserving this, and the self-case is spoiling something that isn't going wrong.",
      7: "the difficulty is stillness. Your answers show a pull toward the next problem because nothing needs solving right now.",
      8: "you're reading other people for signs of the thing that will end this, rather than receiving what's actually being said.",
    },
    next: {
      1: "What is the honest first thing you notice about being okay right now?",
      2: "What's true about how things are, and what are you braced for anyway?",
      3: "What did you do the last time things were going well?",
      4: "What would make this stretch repeatable instead of accidental?",
      5: "What do you actually know about what's coming, and what are you predicting?",
      6: "What would it mean to let this be fine without earning it further?",
      7: "Can you leave this alone for one day and see what happens?",
      8: "What are you scanning others for, and what are they actually telling you?",
    },
  },
  happened: {
    mechanism: "why this one event is still running in you",
    clarity: {
      1: "your answers show you haven't yet asked what this event is really about for you — and you were honest that you don't have it yet.",
      2: "your answers hold two accurate readings of what happened at once, and the thinking continues because you keep making them compete.",
      3: "this event fits a shape you recognize from before. Your answers point to a pattern being triggered, not only a single incident.",
      4: "there's nothing containing this, so it re-opens whenever there's quiet. The replaying is unbounded rather than unresolved.",
      5: "you're mixing what happened with what you've concluded it means about you or them, and the conclusion is doing the replaying.",
      6: "your answers keep returning to your part in it, but as a trial rather than as an account. That's what keeps it running.",
      7: "there's nothing more to do with this yet, and the replaying is what's happening instead of waiting.",
      8: "your answers point to what you think was meant rather than what was said. The event is being reconstructed each time.",
    },
    next: {
      1: "What is the first honest question you have about what happened?",
      2: "What are the two versions of this that are both partly right?",
      3: "When has something with this same shape happened before?",
      4: "When and where will you allow yourself to think about this, and when will you not?",
      5: "What can you state as fact about the event, and what is your conclusion about it?",
      6: "What is your share here, said once, without sentencing yourself?",
      7: "What would it cost to let this be unfinished for another day?",
      8: "What was actually said, and what would you find out by asking?",
    },
  },
  loop: {
    mechanism: "why the same thing keeps happening again",
    clarity: {
      1: "your answers show recognition without explanation yet — you can see it recurs, and you're at the first honest question about your part in it.",
      2: "your answers hold both your contribution and the other conditions as true. The repetition isn't only one of them.",
      3: "this is the pattern itself. Your answers point to a repeating sequence and to how your state changes what you notice inside it.",
      4: "nothing structural has changed between rounds, so the same conditions keep producing the same outcome.",
      5: "you're mixing the recurring facts with the story about why it happens to you. Those need separating before anything changes.",
      6: "your answers keep turning the repetition into evidence against you, which is exactly what makes the next round harder to see clearly.",
      7: "your answers show the impulse to break it immediately. This one is asking you to observe another round rather than act tonight.",
      8: "the same misreading with other people keeps recurring — the pattern lives in what gets assumed rather than asked.",
    },
    next: {
      1: "What is the first honest question about your part in the repeat?",
      2: "What is yours in this cycle, and what genuinely isn't?",
      3: "What is the exact sequence of steps each time this happens?",
      4: "What single condition could you change before the next round starts?",
      5: "What repeats as fact, and what is the story you tell about why?",
      6: "Can you describe the pattern without making it a character flaw?",
      7: "What would you notice if you watched one more round without intervening?",
      8: "Where in the sequence do you stop asking and start assuming?",
    },
  },
  surprise: {
    mechanism: "what surfaced once you started without bringing anything",
    clarity: {
      1: "you came in with nothing and your answers still produced an honest first question. That's the signal here.",
      2: "what surfaced holds two truths at once, and your answers didn't force one to win.",
      3: "even without a subject, your answers pointed to something that repeats in you.",
      4: "what surfaced is loose and uncontained — the material is there, the structure isn't.",
      5: "your answers separated fact from assumption unevenly, and that gap is the useful finding here.",
      6: "your answers moved toward your own part in something, and toward judging yourself for it.",
      7: "what surfaced is restlessness with stillness rather than a specific problem.",
      8: "what surfaced points to someone else — something unsaid, or something being read into.",
    },
    next: {
      1: "What surprised you about your own answers?",
      2: "Which two things did you notice were both true?",
      3: "What repeats in you that showed up without being invited?",
      4: "What would you put around this to keep it from staying loose?",
      5: "What did you state as fact that is actually a read?",
      6: "What did you notice yourself judging yourself for?",
      7: "Can you sit with the thing that surfaced rather than solve it?",
      8: "Who came up, and what haven't you asked them?",
    },
  },
};

/** Hidden/legacy doorways inherit a close relative rather than the generic lens. */
const LENS_ALIASES: Record<string, string> = {
  gamble: "bet",
  chance: "lost",
  talk: "happened",
};

export interface ResultNarrative {
  /** Branch- and response-specific explanation for "The clarity you're missing". */
  clarity: string;
  /** Branch-appropriate next question for "What to look at next". */
  question: string;
  /** Practical consideration. */
  advice: string;
  /** Short pattern summary drawn from the answers that carried the number. */
  patternSummary?: string | undefined;
}

/**
 * Builds the 1–8 result narrative for a branch from the actual response
 * pattern. Returns undefined for 9, which is owned by getNineBridge.
 */
export function getResultNarrative(
  doorwayId: string | undefined,
  primary: GNumber,
  contributions: Contribution[] = [],
): ResultNarrative | undefined {
  if (primary === 9) return undefined;
  const n = primary as ResultNumber;
  const key = doorwayId ? (LENS_ALIASES[doorwayId] ?? doorwayId) : undefined;
  const lens = (key && BRANCH_LENS[key]) || GENERIC;

  const quoted = contributions
    .map((c) => c.choiceLabel)
    .filter(Boolean)
    .slice(0, 2);
  const patternSummary =
    quoted.length > 0
      ? `The answers that carried this: ${quoted.map((q) => `“${q}”`).join(" and ")}.`
      : undefined;

  return {
    clarity: `Looking at ${lens.mechanism}: ${lens.clarity[n]}`,
    question: lens.next[n],
    advice: NEXT_STEPS[primary].advice,
    patternSummary,
  };
}

/** Canonical header line, e.g. "3 — Pattern". Presentation only. */
export function numberHeadline(n: GNumber): string {
  return `${n} — ${NUMBERS[n].name}`;
}
