import { describe, expect, it } from "vitest";
import {
  CORE_QUESTIONS,
  DOORWAYS,
  UNIVERSAL_FOLLOW_UPS,
  UNIVERSAL_QUESTION,
  buildSequence,
  type AnswerMap,
  type Doorway,
  type Question,
} from "./gabriel";

/**
 * Documents — and does not change — where each branch's evidence actually comes
 * from: the doorway's own questions versus the shared generic closers c1/c2/c3
 * and the universal avoidance branch. This is the composition record the
 * Relational State Layer work has to design against.
 */

const doorways = DOORWAYS as Doorway[];
const SHARED = new Set<string>([
  ...CORE_QUESTIONS.map((q) => q.id),
  UNIVERSAL_QUESTION.id,
  ...Object.keys(UNIVERSAL_FOLLOW_UPS),
]);

function playThrough(d: Doorway, pick: (q: Question) => string) {
  const answers: AnswerMap = {};
  for (let i = 0; i < 20; i++) {
    const seq = buildSequence(d, answers);
    const next = seq.find((q) => !answers[q.id]);
    if (!next) break;
    answers[next.id] = pick(next);
  }
  return buildSequence(d, answers);
}

/** Across every complete path: min/max shared pages, and whether shared pages ever appear. */
function sharedProfile(d: Doorway) {
  let min = Infinity;
  let max = 0;
  let paths = 0;
  const rec = (answers: AnswerMap) => {
    const seq = buildSequence(d, answers);
    const next = seq.find((q) => !answers[q.id]);
    if (!next) {
      paths++;
      const shared = seq.filter((q) => SHARED.has(q.id)).length;
      min = Math.min(min, shared);
      max = Math.max(max, shared);
      return;
    }
    for (const c of next.choices) rec({ ...answers, [next.id]: c.id });
  };
  rec({});
  return { min, max, paths };
}

describe("shared vs doorway-specific composition (recorded, unchanged)", () => {
  const expected: Record<string, { min: number; max: number }> = {
    fire: { min: 0, max: 0 },
    chance: { min: 2, max: 3 },
    spiral: { min: 2, max: 2 },
    drink: { min: 1, max: 3 },
  };

  for (const [id, want] of Object.entries(expected)) {
    it(`${id}: shared pages per complete path stay within ${want.min}-${want.max}`, () => {
      const d = doorways.find((x) => x.id === id)!;
      const got = sharedProfile(d);
      expect({ min: got.min, max: got.max }).toEqual(want);
    });
  }

  it("THE FIRE is the only branch with no shared generic pages at all", () => {
    const none = doorways.filter((d) => sharedProfile(d).max === 0).map((d) => d.id);
    expect(none).toEqual(["fire"]);
  });

  it("records that thin branches are majority-generic on a first-choice traversal", () => {
    const shareOf = (id: string) => {
      const seq = playThrough(doorways.find((d) => d.id === id)!, (q) => q.choices[0]!.id);
      return `${seq.filter((q) => SHARED.has(q.id)).length}/${seq.length}`;
    };
    // e.g. drink's first-choice path is drink-1 > drink-well > c1 > c2 > c3.
    expect(shareOf("drink")).toBe("3/5");
    expect(shareOf("fire")).toBe("0/6");
  });
});

describe("cross-branch contamination", () => {
  it("never puts another doorway's own opening question in a branch", () => {
    const openers = new Set(doorways.map((d) => d.questions[0]!.id));
    for (const d of doorways) {
      const seq = playThrough(d, (q) => q.choices[0]!.id);
      const foreign = seq.filter((q) => openers.has(q.id) && q.id !== d.questions[0]!.id);
      expect(foreign.map((q) => q.id), d.id).toEqual([]);
    }
  });

  it("only ever injects shared questions from the documented shared set", () => {
    for (const d of doorways) {
      const ownIds = new Set<string>();
      const rec = (answers: AnswerMap) => {
        const seq = buildSequence(d, answers);
        const next = seq.find((q) => !answers[q.id]);
        if (!next) {
          for (const q of seq) if (SHARED.has(q.id)) ownIds.add(q.id);
          return;
        }
        for (const c of next.choices) rec({ ...answers, [next.id]: c.id });
      };
      rec({});
      for (const id of ownIds) expect(SHARED.has(id), `${d.id}/${id}`).toBe(true);
    }
  });
});

describe("known construct gaps (recorded, deliberately not fixed in this pass)", () => {
  it("documents that `happened` can never reach 8, because its only 8-heavy option lives on c3", () => {
    const d = doorways.find((x) => x.id === "happened")!;
    const own = [
      ...d.questions,
      // happened has no followUps; its three questions are all doorway-specific
    ];
    const maxEight = Math.max(
      ...own.flatMap((q) => q.choices.map((c) => c.evidence[8] ?? 0)),
    );
    expect(maxEight).toBeLessThanOrEqual(1);
    // and the branch is 5 pages long, so c3 (the 8:3 option) is never appended
    const seq = playThrough(d, (q) => q.choices[0]!.id);
    expect(seq.map((q) => q.id)).not.toContain("c3");
  });
});
