/**
 * Gabriel's Lab — CANDIDATE run harness (V5.4). RESEARCH ONLY.
 *
 * Drives the candidate sequence with synthetic scripts, records the candidate
 * fact state and addiction read at every step, and reads the PROTECTED
 * production evaluator without modifying it. Facts never enter scoring.
 */

import { evaluatePattern, type AnswerMap, type PatternResult, type Question } from "../gabriel";
import { isAddictionResearchQuestion } from "../addiction-routing";
import {
  buildCandidateSequence,
  CANDIDATE_CLOSER_ID,
  type CandidateSequence,
} from "./candidate-sequence";
import {
  candidateFingerprint,
  deriveCandidateFacts,
  type CandidateFactSummary,
} from "./candidate-facts";
import { buildAddictionRead, renderAddictionRead, type AddictionRead } from "./addiction-read";

export interface CandidateStep {
  step: number;
  questionId: string;
  choiceId: string;
  research: boolean;
  closer: boolean;
  numberEvidence: Record<string, number>;
  factsAfter: CandidateFactSummary;
  readAfter: AddictionRead;
}

export interface CandidateRun {
  synthetic: true;
  caseId: string;
  label: string;
  doorwayId: string;
  sequenceIds: string[];
  branchIds: string[];
  addictionIds: string[];
  closerIds: string[];
  answers: AnswerMap;
  unanswered: string[];
  unusedScriptKeys: string[];
  facts: CandidateFactSummary;
  fingerprint: string;
  read: AddictionRead;
  rendered: string;
  result: PatternResult;
}

function evidenceOf(question: Question, choiceId: string): Record<string, number> {
  const choice = question.choices.find((c) => c.id === choiceId);
  return choice ? ({ ...choice.evidence } as Record<string, number>) : {};
}

export function runCandidate(
  doorwayId: string,
  script: Record<string, string>,
  meta: { caseId: string; label: string } = { caseId: doorwayId, label: doorwayId },
): CandidateRun {
  const answers: AnswerMap = {};
  const steps: CandidateStep[] = [];
  const unanswered: string[] = [];
  let sequence: CandidateSequence = buildCandidateSequence(doorwayId, answers);

  for (let guard = 0; guard < 60; guard += 1) {
    sequence = buildCandidateSequence(doorwayId, answers);
    const index = sequence.questions.findIndex((q) => !answers[q.id]);
    if (index === -1) break;
    const question = sequence.questions[index]!;
    const choiceId = script[question.id];
    if (!choiceId) {
      unanswered.push(question.id);
      break;
    }
    if (!question.choices.some((c) => c.id === choiceId)) {
      throw new Error(`Lab: "${choiceId}" is not a choice on "${question.id}"`);
    }
    answers[question.id] = choiceId;

    const after = buildCandidateSequence(doorwayId, answers);
    const facts = deriveCandidateFacts(after.questions.map((q) => q.id), answers);
    steps.push({
      step: index + 1,
      questionId: question.id,
      choiceId,
      research: isAddictionResearchQuestion(question.id),
      closer: question.id === CANDIDATE_CLOSER_ID,
      numberEvidence: evidenceOf(question, choiceId),
      factsAfter: facts,
      readAfter: buildAddictionRead(facts, answers),
    });
  }

  sequence = buildCandidateSequence(doorwayId, answers);
  const sequenceIds = sequence.questions.map((q) => q.id);
  const facts = deriveCandidateFacts(sequenceIds, answers);
  const read = buildAddictionRead(facts, answers);

  return {
    synthetic: true,
    caseId: meta.caseId,
    label: meta.label,
    doorwayId,
    sequenceIds,
    branchIds: sequence.branchIds,
    addictionIds: sequence.addictionIds,
    closerIds: sequence.closerIds,
    answers,
    unanswered,
    unusedScriptKeys: Object.keys(script).filter((id) => !sequenceIds.includes(id)),
    facts,
    fingerprint: candidateFingerprint(facts),
    read,
    rendered: renderAddictionRead(read),
    result: evaluatePattern(sequence.questions, answers),
  };
}

export interface CandidateMatrix {
  caseIds: string[];
  /** One cell per run. */
  readStates: string[];
  numbers: string[];
  distinctReadStates: number;
  /** Groups of caseIds whose addiction read is identical. */
  readCollisions: string[][];
}

export function compareCandidateRuns(runs: CandidateRun[]): CandidateMatrix {
  const caseIds = runs.map((r) => r.caseId);
  const readStates = runs.map((r) => r.read.stateKey);
  const groups = new Map<string, string[]>();
  readStates.forEach((key, i) => groups.set(key, [...(groups.get(key) ?? []), caseIds[i]!]));

  return {
    caseIds,
    readStates,
    numbers: runs.map((r) => (r.result.primary ? String(r.result.primary) : "Undetermined")),
    distinctReadStates: new Set(readStates).size,
    readCollisions: [...groups.values()].filter((g) => g.length > 1),
  };
}

/** Re-runs one script once per choice on `questionId`, holding all else constant. */
export function perturbCandidate(
  doorwayId: string,
  script: Record<string, string>,
  questionId: string,
): { choiceId: string; readState: string; number: string; rendered: string }[] {
  const base = runCandidate(doorwayId, script);
  const question = buildCandidateSequence(doorwayId, base.answers).questions.find(
    (q) => q.id === questionId,
  );
  if (!question) throw new Error(`Lab: "${questionId}" is not in this candidate sequence`);

  return question.choices.map((choice) => {
    const run = runCandidate(doorwayId, { ...script, [questionId]: choice.id });
    return {
      choiceId: choice.id,
      readState: run.read.stateKey,
      number: run.result.primary ? String(run.result.primary) : "Undetermined",
      rendered: run.rendered,
    };
  });
}
