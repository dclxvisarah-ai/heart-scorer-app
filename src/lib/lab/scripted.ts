/**
 * Gabriel's Lab — scripted synthetic run harness. RESEARCH ONLY.
 *
 * Nothing in this module is imported by production routes, and it changes no
 * production behaviour. It drives the REAL production question graph
 * (`buildSequence`) and the REAL protected evaluator (`evaluatePattern`)
 * without touching either, so what it reports is what the live branch does.
 *
 * Two deliberate boundaries:
 *  - Routing facts are derived read-only through the existing addiction
 *    routing derivation. They are never fed into Number scoring.
 *  - Every run produced here is explicitly synthetic (`synthetic: true`).
 *    These are researcher-authored fixtures, never a person's answers.
 */

import {
  buildSequence,
  evaluatePattern,
  getDoorway,
  CORE_QUESTIONS,
  type AnswerMap,
  type Doorway,
  type GNumber,
  type PatternResult,
  type Question,
} from "../gabriel";
import {
  isAddictionResearchQuestion,
  summarizeRoutingFacts,
  ROUTING_FACT_KEYS,
  type RoutingFactSummary,
} from "../addiction-routing";

/** Ids of the shared generic closing questions, for placement analysis. */
export const CORE_CLOSER_IDS = CORE_QUESTIONS.map((q) => q.id);

/** A synthetic answer script: questionId -> choiceId. Order is irrelevant. */
export type RunScript = Record<string, string>;

export interface ScriptedStep {
  /** 1-based position in the sequence as the app would display it. */
  step: number;
  questionId: string;
  prompt: string;
  choiceId: string | null;
  choiceLabel: string | null;
  /** True for E1–E6 / G1–G3 (the research layer). */
  research: boolean;
  /** True for the shared generic closers c1/c2/c3. */
  coreCloser: boolean;
  /** Number evidence the chosen answer actually carried. */
  numberEvidence: Partial<Record<GNumber, number>>;
  /** Routing-fact state after this answer. Read-only, never scored. */
  factsAfter: RoutingFactSummary;
}

export interface ScriptedRun {
  synthetic: true;
  caseId: string;
  label: string;
  doorwayId: string;
  script: RunScript;
  steps: ScriptedStep[];
  /** The sequence ids in display order, as produced by production routing. */
  sequenceIds: string[];
  answers: AnswerMap;
  /** Script entries the graph never asked for. */
  unusedScriptKeys: string[];
  /** Questions the graph asked that the script had no answer for. */
  unanswered: string[];
  facts: RoutingFactSummary;
  /** Stable one-line signature of the routing-fact state. */
  factFingerprint: string;
  result: PatternResult;
}

function evidenceOf(question: Question, choiceId: string | undefined) {
  if (!choiceId) return {};
  const choice = question.choices.find((c) => c.id === choiceId);
  return choice ? { ...choice.evidence } : {};
}

export function factFingerprint(summary: RoutingFactSummary): string {
  return ROUTING_FACT_KEYS.map((key) => {
    const fact = summary[key];
    return `${key}=${fact.state}:${fact.temporalScope}`;
  }).join("|");
}

/**
 * Runs a synthetic script against a chosen doorway. Doorway-selectable by
 * design: DRINK, GAMBLE, or anything else in the production DOORWAYS list.
 *
 * The loop mirrors how the app actually advances: rebuild the sequence after
 * every answer, take the next unanswered question, and stop when the script
 * has nothing for it.
 */
export function runScript(
  doorwayId: string,
  script: RunScript,
  meta: { caseId: string; label: string } = { caseId: doorwayId, label: doorwayId },
): ScriptedRun {
  const doorway: Doorway | undefined = getDoorway(doorwayId);
  if (!doorway) throw new Error(`Lab: unknown doorway "${doorwayId}"`);

  const answers: AnswerMap = {};
  const steps: ScriptedStep[] = [];
  const unanswered: string[] = [];

  for (let guard = 0; guard < 60; guard += 1) {
    const sequence = buildSequence(doorway, answers);
    const index = sequence.findIndex((q) => !answers[q.id]);
    if (index === -1) break;
    const question = sequence[index]!;
    const choiceId = script[question.id];
    if (!choiceId) {
      unanswered.push(question.id);
      break;
    }
    if (!question.choices.some((c) => c.id === choiceId)) {
      throw new Error(`Lab: "${choiceId}" is not a choice on "${question.id}"`);
    }
    answers[question.id] = choiceId;

    const afterSequence = buildSequence(doorway, answers);
    steps.push({
      step: index + 1,
      questionId: question.id,
      prompt: question.prompt,
      choiceId,
      choiceLabel: question.choices.find((c) => c.id === choiceId)?.label ?? null,
      research: isAddictionResearchQuestion(question.id),
      coreCloser: CORE_CLOSER_IDS.includes(question.id),
      numberEvidence: evidenceOf(question, choiceId),
      factsAfter: summarizeRoutingFacts(
        afterSequence.map((q) => q.id),
        answers,
      ),
    });
  }

  const sequence = buildSequence(doorway, answers);
  const sequenceIds = sequence.map((q) => q.id);
  const facts = summarizeRoutingFacts(sequenceIds, answers);

  return {
    synthetic: true,
    caseId: meta.caseId,
    label: meta.label,
    doorwayId,
    script,
    steps,
    sequenceIds,
    answers,
    unusedScriptKeys: Object.keys(script).filter((id) => !sequenceIds.includes(id)),
    unanswered,
    facts,
    factFingerprint: factFingerprint(facts),
    result: evaluatePattern(sequence, answers),
  };
}

/* ------------------------------------------------------------------ */
/* Placement analysis — the V5.3 control condition                     */
/* ------------------------------------------------------------------ */

export interface PlacementReport {
  caseId: string;
  doorwayId: string;
  sequenceIds: string[];
  researchIds: string[];
  coreCloserIds: string[];
  /** True when every research question sits after every generic closer. */
  researchAppendedAfterClosers: boolean;
  /** True when no research answer contributed any Number evidence. */
  researchEvidenceEmpty: boolean;
  branchQuestionCount: number;
  genericShare: number;
}

export function placementReport(run: ScriptedRun): PlacementReport {
  const researchIds = run.sequenceIds.filter((id) => isAddictionResearchQuestion(id));
  const coreCloserIds = run.sequenceIds.filter((id) => CORE_CLOSER_IDS.includes(id));
  const lastCloser = Math.max(...coreCloserIds.map((id) => run.sequenceIds.indexOf(id)), -1);
  const firstResearch = researchIds.length
    ? Math.min(...researchIds.map((id) => run.sequenceIds.indexOf(id)))
    : Infinity;

  const researchEvidenceEmpty = run.steps
    .filter((s) => s.research)
    .every((s) => Object.keys(s.numberEvidence).length === 0);

  const nonResearch = run.sequenceIds.filter((id) => !isAddictionResearchQuestion(id));
  return {
    caseId: run.caseId,
    doorwayId: run.doorwayId,
    sequenceIds: run.sequenceIds,
    researchIds,
    coreCloserIds,
    researchAppendedAfterClosers: researchIds.length > 0 && firstResearch > lastCloser,
    researchEvidenceEmpty,
    branchQuestionCount: nonResearch.length - coreCloserIds.length,
    genericShare: nonResearch.length ? coreCloserIds.length / nonResearch.length : 0,
  };
}

/* ------------------------------------------------------------------ */
/* Matrix comparison — many runs, not just a pair                      */
/* ------------------------------------------------------------------ */

export interface MatrixRow {
  key: string;
  /** One cell per run, in the order the runs were supplied. */
  cells: string[];
  /** True when at least two runs differ on this key. */
  varies: boolean;
}

export interface RunMatrix {
  caseIds: string[];
  factRows: MatrixRow[];
  numberRow: MatrixRow;
  fingerprints: string[];
  distinctFingerprints: number;
  /** Groups of caseIds that share an identical routing-fact fingerprint. */
  collisions: string[][];
}

export function compareRuns(runs: ScriptedRun[]): RunMatrix {
  const caseIds = runs.map((r) => r.caseId);

  const factRows: MatrixRow[] = ROUTING_FACT_KEYS.map((key) => {
    const cells = runs.map((run) => {
      const fact = run.facts[key];
      return `${fact.state}/${fact.temporalScope}`;
    });
    return { key, cells, varies: new Set(cells).size > 1 };
  });

  const numberCells = runs.map((run) => {
    const primary = run.result.primary ? String(run.result.primary) : "Undetermined";
    const supporting = run.result.supporting.join(",") || "-";
    return `${primary} (+${supporting})`;
  });

  const fingerprints = runs.map((r) => r.factFingerprint);
  const groups = new Map<string, string[]>();
  fingerprints.forEach((fp, i) => {
    groups.set(fp, [...(groups.get(fp) ?? []), caseIds[i]!]);
  });

  return {
    caseIds,
    factRows,
    numberRow: {
      key: "GABRIEL_NUMBER",
      cells: numberCells,
      varies: new Set(numberCells).size > 1,
    },
    fingerprints,
    distinctFingerprints: new Set(fingerprints).size,
    collisions: [...groups.values()].filter((g) => g.length > 1),
  };
}

/* ------------------------------------------------------------------ */
/* Single-answer perturbation, scripted                                */
/* ------------------------------------------------------------------ */

export interface Perturbation {
  choiceId: string;
  primary: GNumber | "Undetermined";
  supporting: GNumber[];
  topThree: { n: GNumber; weight: number }[];
}

/**
 * Re-runs one script once per available choice on `questionId`, holding
 * everything else constant. Used to show which questions actually move the
 * Number and which do not.
 */
export function perturbAnswer(
  doorwayId: string,
  script: RunScript,
  questionId: string,
): Perturbation[] {
  const base = runScript(doorwayId, script, { caseId: "base", label: "base" });
  const question = buildSequence(getDoorway(doorwayId)!, base.answers).find(
    (q) => q.id === questionId,
  );
  if (!question) throw new Error(`Lab: "${questionId}" is not in this run's sequence`);

  return question.choices.map((choice) => {
    const run = runScript(
      doorwayId,
      { ...script, [questionId]: choice.id },
      { caseId: `${questionId}/${choice.id}`, label: choice.label },
    );
    return {
      choiceId: choice.id,
      primary: run.result.primary ?? "Undetermined",
      supporting: run.result.supporting,
      topThree: run.result.tallies.slice(0, 3),
    };
  });
}
