import { describe, expect, it } from "vitest";
import {
  CORE_QUESTIONS,
  DOORWAYS,
  buildSequence,
  evaluatePattern,
  getDeeperProbe,
  type AnswerMap,
  type Doorway,
  type Question,
} from "./gabriel";

/**
 * Pins the EXISTING evaluator contract at baseline b02fcfe. No formula, weight
 * or threshold is proposed or changed here — this file only records behaviour so
 * a later Relational State Layer cannot alter it unnoticed.
 */

const doorways = DOORWAYS as Doorway[];
const byId = (id: string): Doorway => {
  const d = doorways.find((x) => x.id === id);
  if (!d) throw new Error(`no doorway ${id}`);
  return d;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Independent re-implementation of the documented normalisation. */
function expectedWeights(sequence: Question[], answers: AnswerMap) {
  const raw = new Map<number, number>();
  const reach = new Map<number, number>();
  for (const q of sequence) {
    for (let n = 1; n <= 9; n++) {
      const r = Math.max(...q.choices.map((c) => c.evidence[n as 1] ?? 0));
      if (r > 0) reach.set(n, (reach.get(n) ?? 0) + r);
    }
    const chosen = q.choices.find((c) => c.id === answers[q.id]);
    if (!chosen) continue;
    for (const [k, v] of Object.entries(chosen.evidence)) {
      raw.set(Number(k), (raw.get(Number(k)) ?? 0) + (v ?? 0));
    }
  }
  const out = new Map<number, number>();
  for (let n = 1; n <= 9; n++) {
    const r = raw.get(n) ?? 0;
    out.set(n, r === 0 ? 0 : round2((r / Math.sqrt(Math.max(reach.get(n) ?? 0, 1))) * 2));
  }
  return { raw, reach, weights: out };
}

function playThrough(d: Doorway, pick: (q: Question) => string) {
  const answers: AnswerMap = {};
  for (let i = 0; i < 20; i++) {
    const seq = buildSequence(d, answers);
    const next = seq.find((q) => !answers[q.id]);
    if (!next) break;
    answers[next.id] = pick(next);
  }
  return { answers, sequence: buildSequence(d, answers) };
}

describe("normalisation: raw / sqrt(max(reach,1)) * 2, rounded to two decimals", () => {
  it("matches an independent recomputation on a completed Fire path", () => {
    const { answers, sequence } = playThrough(byId("fire"), (q) => q.choices[0]!.id);
    const result = evaluatePattern(sequence, answers);
    const want = expectedWeights(sequence, answers);
    for (const t of result.tallies) {
      expect(t.weight, `n=${t.n}`).toBe(want.weights.get(t.n));
    }
  });

  it("matches an independent recomputation across every doorway, both extreme picks", () => {
    for (const d of doorways) {
      for (const pick of [
        (q: Question) => q.choices[0]!.id,
        (q: Question) => q.choices[q.choices.length - 1]!.id,
      ]) {
        const { answers, sequence } = playThrough(d, pick);
        const result = evaluatePattern(sequence, answers);
        const want = expectedWeights(sequence, answers);
        for (const t of result.tallies) {
          expect(t.weight, `${d.id} n=${t.n}`).toBe(want.weights.get(t.n));
        }
      }
    }
  });

  it("rounds every weight to at most two decimals", () => {
    for (const d of doorways) {
      const { answers, sequence } = playThrough(d, (q) => q.choices[0]!.id);
      for (const t of evaluatePattern(sequence, answers).tallies) {
        expect(t.weight).toBe(round2(t.weight));
      }
    }
  });

  it("gives a number with no raw evidence a weight of exactly 0", () => {
    const { answers, sequence } = playThrough(byId("spiral"), (q) => q.choices[0]!.id);
    const result = evaluatePattern(sequence, answers);
    const want = expectedWeights(sequence, answers);
    for (const t of result.tallies) {
      if ((want.raw.get(t.n) ?? 0) === 0) expect(t.weight).toBe(0);
    }
  });
});

describe("Available_n comes from the actual supplied sequence", () => {
  it("changes when the same answers are scored against a longer sequence", () => {
    const q1: Question = {
      id: "q1",
      prompt: "one",
      choices: [
        { id: "a", label: "A", evidence: { 5: 3 } },
        { id: "b", label: "B", evidence: { 2: 3 } },
      ],
    };
    const q2: Question = {
      id: "q2",
      prompt: "two",
      choices: [
        { id: "a", label: "A", evidence: { 5: 3 } },
        { id: "b", label: "B", evidence: { 2: 1 } },
      ],
    };
    const answers: AnswerMap = { q1: "a" };
    const alone = evaluatePattern([q1], answers).tallies.find((t) => t.n === 5)!.weight;
    const withSecond = evaluatePattern([q1, q2], answers).tallies.find((t) => t.n === 5)!.weight;
    // raw is unchanged (3); availability grew from 3 to 6, so the weight falls.
    expect(alone).toBe(round2((3 / Math.sqrt(3)) * 2));
    expect(withSecond).toBe(round2((3 / Math.sqrt(6)) * 2));
    expect(withSecond).toBeLessThan(alone);
  });

  it("counts availability for a question that is in the sequence but unanswered", () => {
    // Recorded boundary, NOT a proposed change: an unanswered trailing question
    // still contributes to Available_n. Harmless at the result screen (the whole
    // sequence is answered) but it deflates weights mid-flow.
    const answered: Question = {
      id: "a1",
      prompt: "answered",
      choices: [{ id: "a", label: "A", evidence: { 5: 3 } }],
    };
    const unanswered: Question = {
      id: "a2",
      prompt: "unanswered",
      choices: [{ id: "a", label: "A", evidence: { 5: 3 } }],
    };
    const answers: AnswerMap = { a1: "a" };
    const one = evaluatePattern([answered], answers).tallies.find((t) => t.n === 5)!.weight;
    const two = evaluatePattern([answered, unanswered], answers).tallies.find((t) => t.n === 5)!
      .weight;
    expect(two).toBeLessThan(one);
  });

  it("ignores answers for questions outside the supplied sequence", () => {
    const { answers, sequence } = playThrough(byId("spiral"), (q) => q.choices[0]!.id);
    const clean = evaluatePattern(sequence, answers);
    const dirty = evaluatePattern(sequence, { ...answers, "not-in-sequence": "a", "fire-1": "betray" });
    expect(dirty.tallies).toEqual(clean.tallies);
    expect(dirty.primary).toBe(clean.primary);
  });

  it("ignores an answer id that does not exist on its question", () => {
    const { answers, sequence } = playThrough(byId("spiral"), (q) => q.choices[0]!.id);
    const result = evaluatePattern(sequence, { ...answers, "spiral-known": "zzz" });
    expect(() => result).not.toThrow();
    const want = expectedWeights(sequence, { ...answers, "spiral-known": "zzz" });
    for (const t of result.tallies) expect(t.weight).toBe(want.weights.get(t.n));
  });
});

describe("thresholds: 2.4 primary, 0.35 lead, 1.8 support", () => {
  const q = (id: string, evidence: Record<number, number>): Question => ({
    id,
    prompt: id,
    choices: [{ id: "a", label: "A", evidence: evidence as Question["choices"][0]["evidence"] }],
  });

  it("awards no primary below 2.4 even with a clear lead", () => {
    // raw 2 with reach 2 -> 2/sqrt(2)*2 = 2.83 ; raw 1 reach 1 -> 2.0
    const low = evaluatePattern([q("x", { 5: 1 })], { x: "a" });
    expect(low.tallies[0]!.weight).toBe(2);
    expect(low.tallies[0]!.weight).toBeLessThan(2.4);
    expect(low.primary).toBeUndefined();
    expect(low.coherent).toBe(false);
  });

  it("awards a primary at or above 2.4 with a lead of at least 0.35", () => {
    const r = evaluatePattern([q("x", { 5: 2 })], { x: "a" });
    expect(r.tallies[0]!.weight).toBe(2.83);
    expect(r.primary).toBe(5);
    expect(r.coherent).toBe(true);
  });

  it("withholds a primary when the lead is smaller than 0.35", () => {
    // both numbers reach 2 and score 2.83 -> lead 0
    const r = evaluatePattern([q("x", { 5: 2, 2: 2 })], { x: "a" });
    expect(r.tallies[0]!.weight - r.tallies[1]!.weight).toBeLessThan(0.35);
    expect(r.primary).toBeUndefined();
    expect(r.contested.length).toBeGreaterThan(1);
  });

  it("lists only supporting numbers at or above 1.8", () => {
    for (const d of doorways) {
      for (const pick of [
        (x: Question) => x.choices[0]!.id,
        (x: Question) => x.choices[x.choices.length - 1]!.id,
      ]) {
        const { answers, sequence } = playThrough(d, pick);
        const r = evaluatePattern(sequence, answers);
        const map = new Map(r.tallies.map((t) => [t.n, t.weight]));
        for (const n of r.supporting) expect(map.get(n)!).toBeGreaterThanOrEqual(1.8);
        expect(r.supporting.length).toBeLessThanOrEqual(2);
        if (r.primary) expect(r.supporting).not.toContain(r.primary);
      }
    }
  });
});

describe("Undetermined is never forced", () => {
  it("returns no primary for an empty answer set", () => {
    const d = byId("spiral");
    const r = evaluatePattern(buildSequence(d, {}), {});
    expect(r.primary).toBeUndefined();
    expect(r.coherent).toBe(false);
    expect(r.contributions).toEqual([]);
  });

  it("reports contested numbers, capped at three, when undetermined", () => {
    const d = byId("spiral");
    const answers: AnswerMap = {
      "spiral-1": "replay",
      "spiral-replay": "e",
      "spiral-known": "c",
      c1: "c",
      c2: "d",
    };
    const r = evaluatePattern(buildSequence(d, answers), answers);
    expect(r.primary).toBeUndefined();
    expect(r.contested).toEqual([3, 5, 2]);
    expect(r.contested.length).toBeLessThanOrEqual(3);
  });

  it("still produces undetermined outcomes across a doorway — closure is not forced", () => {
    const d = byId("spiral");
    let undetermined = 0;
    let total = 0;
    const rec = (answers: AnswerMap) => {
      const seq = buildSequence(d, answers);
      const next = seq.find((q) => !answers[q.id]);
      if (!next) {
        total++;
        if (!evaluatePattern(seq, answers).primary) undetermined++;
        return;
      }
      for (const c of next.choices) rec({ ...answers, [next.id]: c.id });
    };
    rec({});
    expect(total).toBe(5500);
    expect(undetermined).toBe(1384);
  });
});

describe("determinism", () => {
  it("re-evaluating identical input yields an identical result", () => {
    for (const d of doorways) {
      const { answers, sequence } = playThrough(d, (q) => q.choices[0]!.id);
      const a = evaluatePattern(sequence, answers);
      const b = evaluatePattern(buildSequence(d, { ...answers }), { ...answers });
      expect(b).toEqual(a);
    }
  });

  it("is insensitive to answer-map key order", () => {
    const d = byId("drink");
    const { answers, sequence } = playThrough(d, (q) => q.choices[0]!.id);
    const reversed = Object.fromEntries(Object.entries(answers).reverse());
    expect(evaluatePattern(sequence, reversed)).toEqual(evaluatePattern(sequence, answers));
  });
});

describe("golden fixture — observed Spiraling transcript", () => {
  /**
   * A design/regression fixture only. It records what the current engine returns
   * for one real observed traversal. It is NOT psychological validation and makes
   * no claim about accuracy, reliability or construct validity.
   */
  const d = byId("spiral");
  const base: AnswerMap = {
    "spiral-1": "replay", // Replaying something that already happened
    "spiral-replay": "e", // It doesn't land anywhere, it just runs
    "spiral-known": "c", // I have evidence, but I'm filling in some gaps
    c1: "c", // What I'm assuming about someone else
    c2: "d", // I'd feel better and know less
  };

  it("runs the recorded five pages", () => {
    expect(buildSequence(d, base).map((q) => q.id)).toEqual([
      "spiral-1",
      "spiral-replay",
      "spiral-known",
      "c1",
      "c2",
    ]);
  });

  it("returns Undetermined with 3 / 5 / 2 contested before the deeper probe", () => {
    const r = evaluatePattern(buildSequence(d, base), base);
    expect(r.primary).toBeUndefined();
    expect(r.contested).toEqual([3, 5, 2]);
    expect(r.supporting).toEqual([3, 5]);
    expect(r.tallies.slice(0, 5)).toEqual([
      { n: 3, weight: 3.16 },
      { n: 5, weight: 2.83 },
      { n: 2, weight: 2.12 },
      { n: 7, weight: 1.63 },
      { n: 8, weight: 0.76 },
    ]);
  });

  it("offers deep-known as the probe for the 3/5/2 contest", () => {
    const r = evaluatePattern(buildSequence(d, base), base);
    expect(getDeeperProbe(r.contested, [])?.id).toBe("deep-known");
  });

  it("resolves to 2 after the deeper probe answer 'some facts, and a read on someone else'", () => {
    const answers: AnswerMap = { ...base, "deep-known": "b" };
    const sequence = buildSequence(d, answers, ["deep-known"]);
    expect(sequence.map((q) => q.id)).toEqual([
      "spiral-1",
      "spiral-replay",
      "spiral-known",
      "c1",
      "c2",
      "deep-known",
    ]);
    const r = evaluatePattern(sequence, answers);
    expect(r.primary).toBe(2);
    expect(r.coherent).toBe(true);
    expect(r.supporting).toEqual([3, 5]);
    expect(r.tallies.slice(0, 3)).toEqual([
      { n: 2, weight: 4.04 },
      { n: 3, weight: 2.67 },
      { n: 5, weight: 2.31 },
    ]);
  });

  it("attributes the primary to real answers the person gave", () => {
    const answers: AnswerMap = { ...base, "deep-known": "b" };
    const r = evaluatePattern(buildSequence(d, answers, ["deep-known"]), answers);
    expect(r.contributions.length).toBeGreaterThan(0);
    for (const c of r.contributions) {
      expect(c.questionPrompt).toBeTruthy();
      expect(c.choiceLabel).toBeTruthy();
    }
  });
});

describe("shared closing questions exist and are reachable", () => {
  it("keeps c1/c2/c3 as the three CORE_QUESTIONS", () => {
    expect(CORE_QUESTIONS.map((q) => q.id)).toEqual(["c1", "c2", "c3"]);
  });
});
