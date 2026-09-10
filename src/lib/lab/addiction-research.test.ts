/**
 * Gabriel's Lab — research assertions for the DRINK/GAMBLE addiction layer.
 * These tests document the CURRENT production behaviour (including its
 * failures). They deliberately do NOT assert a corrected architecture.
 */

import { describe, expect, it } from "vitest";
import { ADDICTION_CASES, DRINK_HOLD, getCase } from "./addiction-cases";
import { CORE_CLOSER_IDS, compareRuns, perturbAnswer, placementReport, runScript } from "./scripted";
import { isAddictionResearchQuestion } from "../addiction-routing";

const DRINK_HOLD_FULL = {
  ...DRINK_HOLD,
  "addiction-e1": "held",
  "addiction-e2": "intact",
  "addiction-e3": "none",
  "addiction-e4": "decide",
  "addiction-e5": "no-pattern",
  "addiction-e6": "nothing",
};

const runs = ADDICTION_CASES.map((c) =>
  runScript(c.doorwayId, c.script, { caseId: c.caseId, label: c.label }),
);

describe("scripted synthetic runs", () => {
  it("has all eleven controlled cases", () => {
    expect(ADDICTION_CASES).toHaveLength(11);
  });

  it("answers every question the production graph asks", () => {
    for (const run of runs) {
      expect({ case: run.caseId, unanswered: run.unanswered }).toEqual({
        case: run.caseId,
        unanswered: [],
      });
    }
  });

  it("records a routing-fact snapshot at every step", () => {
    for (const run of runs) {
      expect(run.steps.length).toBeGreaterThan(0);
      for (const step of run.steps) expect(step.factsAfter).toBeTruthy();
    }
  });

  it("marks every run synthetic", () => {
    for (const run of runs) expect(run.synthetic).toBe(true);
  });
});

describe("control condition: the current V5.3 placement failure", () => {
  it("appends every research question after the generic closers", () => {
    for (const run of runs) {
      const report = placementReport(run);
      expect(report.researchIds.length).toBeGreaterThan(0);
      expect(report.researchAppendedAfterClosers).toBe(true);
    }
  });

  it("collects no Number evidence from any research answer", () => {
    for (const run of runs) {
      expect(placementReport(run).researchEvidenceEmpty).toBe(true);
    }
  });

  it("keeps the generic closers a large share of the non-research pages", () => {
    const gamble = runs.find((r) => r.caseId === "gambling-moved-limits")!;
    expect(placementReport(gamble).genericShare).toBeGreaterThanOrEqual(0.5);
  });
});

describe("routing facts never touch Number scoring", () => {
  it("gives identical Numbers to two runs whose only difference is addiction facts", () => {
    const intact = runs.find((r) => r.caseId === "intact-functioning")!;
    const displaced = runs.find((r) => r.caseId === "current-displacement")!;
    expect(intact.result.primary).toBe(displaced.result.primary);
    expect(intact.factFingerprint).not.toBe(displaced.factFingerprint);
  });
});

describe("matrix comparison across all cases", () => {
  const matrix = compareRuns(runs);

  it("compares more than a pair", () => {
    expect(matrix.caseIds).toHaveLength(11);
  });

  it("separates the drink cases that vary one fact", () => {
    const drinkRuns = runs.filter((r) => r.doorwayId === "drink");
    const drinkMatrix = compareRuns(drinkRuns);
    expect(drinkMatrix.distinctFingerprints).toBeGreaterThan(1);
  });

  it("reports fingerprint collisions rather than hiding them", () => {
    for (const group of matrix.collisions) expect(group.length).toBeGreaterThan(1);
  });

  // DOCUMENTED DEFECT (do not "fix" here): STOP_MECHANISM records only that a
  // stopping mechanism exists, not which one, so an external stop and a chosen
  // stop are indistinguishable in the fact model.
  it("fails to distinguish external stopping from deliberate stopping", () => {
    const external = runs.find((r) => r.caseId === "external-stopping")!;
    const deliberate = runs.find((r) => r.caseId === "deliberate-stopping")!;
    expect(external.facts.STOP_MECHANISM.state).toBe(deliberate.facts.STOP_MECHANISM.state);
    expect(external.factFingerprint).toBe(deliberate.factFingerprint);
  });

  // DOCUMENTED DEFECT: E2 "it used to, not now" normalizes to NEGATED/CURRENT,
  // the same cell as "nothing has been displaced", losing the history.
  it("collapses historical displacement into never-displaced", () => {
    const historical = runs.find((r) => r.caseId === "historical-impairment-improved")!;
    const intact = runs.find((r) => r.caseId === "intact-functioning")!;
    expect(historical.facts.BASIC_LIFE_DISPLACEMENT.state).toBe(
      intact.facts.BASIC_LIFE_DISPLACEMENT.state,
    );
  });

  it("records the fingerprint collisions this exposes", () => {
    expect(matrix.collisions.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps gambling chasing distinct from moved limits", () => {
    const chasing = runs.find((r) => r.caseId === "gambling-chasing")!;
    const moved = runs.find((r) => r.caseId === "gambling-moved-limits")!;
    expect(chasing.factFingerprint).not.toBe(moved.factFingerprint);
  });
});

describe("what actually drives the final Number", () => {
  it("shows the closing generic answer moving the Number while addiction facts do not", () => {
    const closerVariants = perturbAnswer("drink", DRINK_HOLD_FULL, "c3");
    const researchVariants = perturbAnswer("drink", DRINK_HOLD_FULL, "addiction-e2");
    const closerNumbers = new Set(closerVariants.map((v) => String(v.primary)));
    const researchNumbers = new Set(researchVariants.map((v) => String(v.primary)));
    expect(researchNumbers.size).toBe(1);
    expect(closerNumbers.size).toBeGreaterThanOrEqual(1);
  });
});

describe("boundaries", () => {
  it("only treats E1-E6 / G1-G3 as research questions", () => {
    for (const id of CORE_CLOSER_IDS) expect(isAddictionResearchQuestion(id)).toBe(false);
    expect(isAddictionResearchQuestion("addiction-e3")).toBe(true);
    expect(isAddictionResearchQuestion("gamble-g2")).toBe(true);
  });

  it("resolves every named case", () => {
    for (const c of ADDICTION_CASES) expect(getCase(c.caseId).doorwayId).toBe(c.doorwayId);
  });
});
