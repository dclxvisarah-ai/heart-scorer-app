import { describe, expect, it } from "vitest";
import { DOORWAYS, buildSequence, type AnswerMap, type Doorway, type Question } from "./gabriel";

/**
 * Pins the CURRENT sequence contract at baseline b02fcfe. Enumerated live from
 * buildSequence, not from any prior audit document.
 */

const doorways = DOORWAYS as Doorway[];
const byId = (id: string): Doorway => {
  const d = doorways.find((x) => x.id === id);
  if (!d) throw new Error(`no doorway ${id}`);
  return d;
};

/** Answers a doorway to completion, always taking the choice at `pick`. */
function playThrough(d: Doorway, pick: (q: Question) => string): { answers: AnswerMap; sequence: Question[] } {
  const answers: AnswerMap = {};
  for (let i = 0; i < 20; i++) {
    const seq = buildSequence(d, answers);
    const next = seq.find((q) => !answers[q.id]);
    if (!next) break;
    answers[next.id] = pick(next);
  }
  return { answers, sequence: buildSequence(d, answers) };
}

/** Exhaustively enumerates every complete path of a doorway. */
function enumerate(d: Doorway) {
  const lengths = new Set<number>();
  const options = new Set<string>();
  let paths = 0;
  const rec = (answers: AnswerMap) => {
    const seq = buildSequence(d, answers);
    const next = seq.find((q) => !answers[q.id]);
    if (!next) {
      paths++;
      lengths.add(seq.length);
      return;
    }
    for (const c of next.choices) {
      options.add(`${next.id}/${c.id}`);
      rec({ ...answers, [next.id]: c.id });
    }
  };
  rec({});
  return { paths, lengths: [...lengths].sort((a, b) => a - b), options: options.size };
}

describe("visible doorways", () => {
  it("exposes exactly the eleven current doorways in order", () => {
    expect(doorways.map((d) => d.id)).toEqual([
      "fire",
      "lost",
      "chance",
      "spiral",
      "drink",
      "gamble",
      "talk",
      "well",
      "happened",
      "loop",
      "surprise",
    ]);
  });

  it("declares the fixed-length architecture on Fire only", () => {
    const fixed = doorways.filter((d) => d.stage2).map((d) => d.id);
    expect(fixed).toEqual(["fire"]);
    const fire = byId("fire");
    expect(fire.stage2).toBe("fury-want");
    expect(fire.prefixPages).toBe(3);
    expect(fire.totalPages).toBe(6);
  });
});

describe("THE FIRE — fixed six pages", () => {
  it("is exactly 6 pages on every complete path", () => {
    const { lengths, paths } = enumerate(byId("fire"));
    expect(lengths).toEqual([6]);
    expect(paths).toBe(217728);
  });

  it("reaches fury-want -> fury-power -> fury-close as pages 4-6", () => {
    const { sequence } = playThrough(byId("fire"), (q) => q.choices[0].id);
    expect(sequence.map((q) => q.id)).toEqual([
      "fire-1",
      "fury-crossed-trust",
      "fury-under",
      "fury-want",
      "fury-power",
      "fury-close",
    ]);
  });

  it("reaches the same stage-2 tail from every Q1 answer", () => {
    const fire = byId("fire");
    for (const choice of fire.questions[0].choices) {
      const { sequence } = playThrough(fire, (q) =>
        q.id === "fire-1" ? choice.id : q.choices[0].id,
      );
      expect(sequence).toHaveLength(6);
      expect(sequence.slice(3).map((q) => q.id)).toEqual(["fury-want", "fury-power", "fury-close"]);
    }
  });

  it("does not inject the shared CORE_QUESTIONS", () => {
    const { sequence } = playThrough(byId("fire"), (q) => q.choices[0].id);
    expect(sequence.map((q) => q.id).filter((id) => ["c1", "c2", "c3"].includes(id))).toEqual([]);
  });
});

describe("SPIRALING — five base pages", () => {
  it("is exactly 5 pages on every complete path", () => {
    const { lengths, paths } = enumerate(byId("spiral"));
    expect(lengths).toEqual([5]);
    expect(paths).toBe(5500);
  });

  it("asks spiral-known as page 3 on the replay path", () => {
    const { sequence } = playThrough(byId("spiral"), (q) =>
      q.id === "spiral-1" ? "replay" : q.choices[0].id,
    );
    expect(sequence.map((q) => q.id)).toEqual([
      "spiral-1",
      "spiral-replay",
      "spiral-known",
      "c1",
      "c2",
    ]);
    expect(sequence[2].prompt).toBe("What's actually known?");
  });

  it("asks spiral-known as page 3 from every Q1 answer", () => {
    const spiral = byId("spiral");
    for (const choice of spiral.questions[0].choices) {
      const { sequence } = playThrough(spiral, (q) =>
        q.id === "spiral-1" ? choice.id : q.choices[0].id,
      );
      expect(sequence[2].id).toBe("spiral-known");
    }
  });
});

describe("per-doorway page-length sets (live audit snapshot)", () => {
  const expected: Record<string, { lengths: number[]; paths: number; options: number }> = {
    fire: { lengths: [6], paths: 217728, options: 71 },
    lost: { lengths: [5], paths: 8250, options: 112 },
    chance: { lengths: [5, 6], paths: 18180, options: 104 },
    spiral: { lengths: [5], paths: 5500, options: 63 },
    drink: { lengths: [5, 6], paths: 36750, options: 140 },
    gamble: { lengths: [5], paths: 3900, options: 65 },
    talk: { lengths: [5, 6], paths: 5120, options: 69 },
    well: { lengths: [5], paths: 4500, options: 27 },
    happened: { lengths: [5], paths: 1600, options: 22 },
    loop: { lengths: [5, 6], paths: 5400, options: 68 },
    surprise: { lengths: [5], paths: 7200, options: 61 },
  };

  for (const [id, want] of Object.entries(expected)) {
    it(`${id} matches its recorded shape`, () => {
      const got = enumerate(byId(id));
      expect({ lengths: got.lengths, paths: got.paths, options: got.options }).toEqual(want);
    });
  }
});

describe("back navigation and stale answers", () => {
  /** Mirrors the invalidation performed by `choose` in src/routes/index.tsx. */
  function editAt(d: Doorway, answers: AnswerMap, index: number, choiceId: string) {
    const sequence = buildSequence(d, answers);
    const next: AnswerMap = { ...answers };
    for (const q of sequence.slice(index + 1)) delete next[q.id];
    next[sequence[index].id] = choiceId;
    return next;
  }

  it("leaves no answer outside the rebuilt sequence when Q1 is changed", () => {
    const fire = byId("fire");
    const { answers } = playThrough(fire, (q) => q.choices[0].id);
    const edited = editAt(fire, answers, 0, "hurt");
    expect(Object.keys(edited)).toEqual(["fire-1"]);
    const rebuilt = buildSequence(fire, edited).map((q) => q.id);
    expect(rebuilt).toEqual(["fire-1", "fury-crossed-hurt"]);
    for (const id of Object.keys(edited)) expect(rebuilt).toContain(id);
  });

  it("leaves no stale answer at any edit position, in every doorway", () => {
    for (const d of doorways) {
      const { answers, sequence } = playThrough(d, (q) => q.choices[0].id);
      for (let i = 0; i < sequence.length; i++) {
        const q = sequence[i];
        const alt = q.choices[q.choices.length - 1].id;
        const edited = editAt(d, answers, i, alt);
        const rebuilt = new Set(buildSequence(d, edited).map((x) => x.id));
        const stale = Object.keys(edited).filter((id) => !rebuilt.has(id));
        expect(stale, `${d.id} edit@${i}`).toEqual([]);
      }
    }
  });

  it("preserves the prefix before the edited page", () => {
    for (const d of doorways) {
      const { answers, sequence } = playThrough(d, (q) => q.choices[0].id);
      for (let i = 1; i < sequence.length; i++) {
        const q = sequence[i];
        const edited = editAt(d, answers, i, q.choices[q.choices.length - 1].id);
        const rebuilt = buildSequence(d, edited).map((x) => x.id);
        expect(rebuilt.slice(0, i), `${d.id} edit@${i}`).toEqual(
          sequence.slice(0, i).map((x) => x.id),
        );
      }
    }
  });

  it("tolerates bogus and missing answer ids without throwing", () => {
    const d = byId("spiral");
    expect(() => buildSequence(d, {})).not.toThrow();
    expect(() => buildSequence(d, { "spiral-1": "nope", "no-such-question": "x" })).not.toThrow();
    expect(buildSequence(d, {}).length).toBeGreaterThan(0);
  });
});

describe("deeper probes in the sequence", () => {
  it("appends probes in the order supplied, after the base sequence", () => {
    const d = byId("spiral");
    const { answers, sequence } = playThrough(d, (q) => q.choices[0].id);
    const withProbes = buildSequence(d, answers, ["deep-known", "deep-hear"]);
    expect(withProbes.map((q) => q.id)).toEqual([
      ...sequence.map((q) => q.id),
      "deep-known",
      "deep-hear",
    ]);
  });

  it("appends probes to the fixed-length Fire branch as well, past totalPages", () => {
    const d = byId("fire");
    const { answers } = playThrough(d, (q) => q.choices[0].id);
    const withProbe = buildSequence(d, answers, ["deep-step"]);
    expect(withProbe).toHaveLength(7);
    expect(withProbe[6].id).toBe("deep-step");
  });

  it("ignores unknown probe ids", () => {
    const d = byId("spiral");
    const { answers, sequence } = playThrough(d, (q) => q.choices[0].id);
    expect(buildSequence(d, answers, ["not-a-probe"])).toHaveLength(sequence.length);
  });
});
