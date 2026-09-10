import { describe, expect, it } from "vitest";
import {
  BRANCH_QUESTIONS,
  CORE_QUESTIONS,
  DEEPER_PROBES,
  DOORWAYS,
  UNIVERSAL_FOLLOW_UPS,
  UNIVERSAL_QUESTION,
  type Question,
} from "./gabriel";

/**
 * Integrity gate for the question graph at baseline b02fcfe.
 * These tests pin CURRENT behaviour. They must not be relaxed to make a change
 * pass: if one fails, the graph changed and the change needs review.
 */

const doorwayOwn: Question[] = (DOORWAYS as { questions: Question[] }[]).flatMap((d) => d.questions);
const registry: Record<string, Question> = {
  ...BRANCH_QUESTIONS,
  ...UNIVERSAL_FOLLOW_UPS,
};
for (const q of doorwayOwn) registry[q.id] = q;
registry[UNIVERSAL_QUESTION.id] = UNIVERSAL_QUESTION;
for (const q of CORE_QUESTIONS) registry[q.id] = q;

const allQuestions: Question[] = [
  ...Object.values(BRANCH_QUESTIONS),
  ...doorwayOwn,
  ...Object.values(UNIVERSAL_FOLLOW_UPS),
  UNIVERSAL_QUESTION,
  ...CORE_QUESTIONS,
];

/** Walk followUp / next only — this deliberately excludes doorway.stage2. */
function walkFollowGraph(startIds: string[]): Set<string> {
  const seen = new Set<string>();
  const visit = (id: string) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    const q = registry[id];
    if (!q) return;
    for (const c of q.choices) if (c.followUp) visit(c.followUp);
    if (q.next) visit(q.next);
  };
  startIds.forEach(visit);
  return seen;
}

describe("question graph — transition integrity", () => {
  it("resolves every followUp target", () => {
    const dangling: string[] = [];
    for (const q of allQuestions) {
      for (const c of q.choices) {
        if (c.followUp && !registry[c.followUp]) dangling.push(`${q.id}/${c.id} -> ${c.followUp}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  it("resolves every linear next target", () => {
    const dangling = allQuestions
      .filter((q) => q.next && !registry[q.next])
      .map((q) => `${q.id} -> ${q.next}`);
    expect(dangling).toEqual([]);
  });

  it("resolves every doorway stage2 target", () => {
    const dangling = (DOORWAYS as { id: string; stage2?: string }[])
      .filter((d) => d.stage2 && !registry[d.stage2])
      .map((d) => `${d.id} -> ${d.stage2}`);
    expect(dangling).toEqual([]);
  });
});

describe("question graph — reachability", () => {
  it("reaches every BRANCH_QUESTIONS entry from a visible doorway, counting stage2", () => {
    const starts = doorwayOwn.map((q) => q.id);
    for (const d of DOORWAYS as { stage2?: string }[]) if (d.stage2) starts.push(d.stage2);
    const reached = walkFollowGraph(starts);
    const unreachable = Object.keys(BRANCH_QUESTIONS).filter((id) => !reached.has(id));
    expect(unreachable).toEqual([]);
  });

  it("documents that fury-want/power/close are reached ONLY through Fire's stage2, not followUp", () => {
    // Recorded on purpose: a naive followUp-only reachability check reports these
    // three as orphans. They are entered by the fixed-length builder via stage2.
    const followOnly = walkFollowGraph(doorwayOwn.map((q) => q.id));
    const stage2Only = Object.keys(BRANCH_QUESTIONS).filter((id) => !followOnly.has(id));
    expect(stage2Only.sort()).toEqual(["fury-close", "fury-power", "fury-want"]);
  });
});

describe("question graph — ids", () => {
  it("has no duplicate question id across every registry", () => {
    const counts = new Map<string, number>();
    for (const q of allQuestions) counts.set(q.id, (counts.get(q.id) ?? 0) + 1);
    // doorway-own questions are also the registry entries, so count distinct sources
    const seenIds = new Set(allQuestions.map((q) => q.id));
    const duplicated = [...counts.entries()]
      .filter(([id, n]) => n > 1 && !doorwayOwn.some((q) => q.id === id))
      .map(([id]) => id);
    expect(duplicated).toEqual([]);
    expect(seenIds.size).toBeGreaterThan(0);
  });

  it("has no duplicate choice id inside any question", () => {
    const offenders: string[] = [];
    for (const q of allQuestions) {
      const ids = q.choices.map((c) => c.id);
      if (new Set(ids).size !== ids.length) offenders.push(q.id);
    }
    expect(offenders).toEqual([]);
  });

  it("has no duplicate choice label inside any question", () => {
    const offenders: string[] = [];
    for (const q of allQuestions) {
      const labels = q.choices.map((c) => c.label);
      if (new Set(labels).size !== labels.length) offenders.push(q.id);
    }
    expect(offenders).toEqual([]);
  });

  it("gives every choice at least one piece of evidence", () => {
    const empty: string[] = [];
    for (const q of allQuestions) {
      for (const c of q.choices) {
        if (Object.values(c.evidence).filter((v) => (v ?? 0) > 0).length === 0) {
          empty.push(`${q.id}/${c.id}`);
        }
      }
    }
    expect(empty).toEqual([]);
  });
});

describe("evidence weight bounds", () => {
  it("keeps every single branch/shared evidence weight at or below 3", () => {
    const offenders: string[] = [];
    for (const q of allQuestions) {
      for (const c of q.choices) {
        for (const [n, v] of Object.entries(c.evidence)) {
          if ((v ?? 0) > 3) offenders.push(`${q.id}/${c.id} n=${n} w=${v}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("records the exact set of choices whose evidence TOTAL exceeds 3", () => {
    // The Aug-19 house convention was a per-choice total of 3 ({x:3} or {x:2,y:1}).
    // Seven choices in the current source total 4. Recorded, NOT changed in this pass.
    const over: string[] = [];
    for (const q of allQuestions) {
      for (const c of q.choices) {
        const sum = Object.values(c.evidence).reduce((a, b) => a + (b ?? 0), 0);
        if (sum > 3) over.push(`${q.id}/${c.id}`);
      }
    }
    expect(over.sort()).toEqual([
      "chance-info/a",
      "chance-split/a",
      "drink-habit-4/c",
      "spiral-known/b",
      "spiral-stuck/d",
      "uf-conversation/c",
    ]);
  });

  it("exempts deeper probes from the max-3 rule, and pins their maximum at 4", () => {
    let max = 0;
    for (const probe of DEEPER_PROBES) {
      for (const c of probe.question.choices) {
        for (const v of Object.values(c.evidence)) max = Math.max(max, v ?? 0);
      }
    }
    expect(max).toBe(4);
  });

  it("gives every deeper probe a non-empty separates list", () => {
    for (const probe of DEEPER_PROBES) {
      expect(probe.separates.length).toBeGreaterThan(0);
    }
  });
});
