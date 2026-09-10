/**
 * Gabriel's Lab — CANDIDATE DRINK/GAMBLE sequence (V5.4 research candidate).
 * RESEARCH ONLY.
 *
 * Reads production question TEXT only (`getDoorway`, `BRANCH_QUESTIONS`,
 * `CORE_QUESTIONS`, `ADDICTION_QUESTIONS`). It does NOT call `buildSequence`
 * and does not import any production routing decision.
 *
 * Correction over V5.3: the addiction investigation happens INSIDE the branch,
 * before any generic closer, and generic pages are never used to pad it.
 */

import {
  BRANCH_QUESTIONS,
  CORE_QUESTIONS,
  getDoorway,
  type AnswerMap,
  type Question,
} from "../gabriel";
import { ADDICTION_QUESTIONS } from "../addiction-routing";
import {
  deriveCandidateFacts,
  establishedHistorically,
  establishedNow,
  unresolved,
  type CandidateFactSummary,
} from "./candidate-facts";

export const CANDIDATE_DOORWAY_IDS = ["drink", "gamble"] as const;

/**
 * At most ONE generic closer, kept only because the test suite shows it still
 * contributes independent Gabriel evidence (it is the only page in the branch
 * that asks what the person would do next). It is never used to fill the
 * addiction investigation, and it carries no routing facts.
 */
export const CANDIDATE_CLOSER_ID = "c3";

const CLOSER = CORE_QUESTIONS.find((q) => q.id === CANDIDATE_CLOSER_ID)!;

/** Documented, deterministic order. No information-gain optimisation. */
export const CANDIDATE_ADDICTION_ORDER = [
  "addiction-e2", // upstream: current displacement
  "addiction-e1", // attempted change vs no wish to change
  "addiction-e3", // actual cost vs hypothetical cost
  "addiction-e4", // stopping mechanism (locus)
  "gamble-g1",
  "gamble-g2",
  "gamble-g3",
  "addiction-e5", // recognition
  "addiction-e6", // readiness, downstream of recognition only
];

function expandBranch(doorwayId: string, answers: AnswerMap): Question[] {
  const doorway = getDoorway(doorwayId);
  if (!doorway) throw new Error(`Lab: unknown doorway "${doorwayId}"`);
  const out: Question[] = [];
  const seen = new Set<string>();

  const push = (question: Question | undefined) => {
    if (!question || seen.has(question.id)) return;
    seen.add(question.id);
    out.push(question);
    const choiceId = answers[question.id];
    if (!choiceId) return;
    const choice = question.choices.find((c) => c.id === choiceId);
    if (choice?.followUp) push(BRANCH_QUESTIONS[choice.followUp]);
    if (question.next) push(BRANCH_QUESTIONS[question.next]);
  };

  for (const question of doorway.questions) push(question);
  return out;
}

/**
 * Whether an addiction question is earned. Facts only — contested Numbers are
 * never consulted, and no probe gates itself.
 */
export function isCandidateProbeEarned(
  probeId: string,
  doorwayId: string,
  answers: AnswerMap,
  summary: CandidateFactSummary,
): boolean {
  const answered = (id: string) => !!answers[id];
  const evidenceAnswered = ["addiction-e1", "addiction-e2", "addiction-e3", "addiction-e4"].filter(
    answered,
  ).length;

  switch (probeId) {
    // Upstream question: always opens the addiction investigation.
    case "addiction-e2":
      return unresolved(summary, "BASIC_LIFE_DISPLACEMENT");
    case "addiction-e1":
      return answered("addiction-e2") && unresolved(summary, "CONTROL_ATTEMPT");
    case "addiction-e3":
      return answered("addiction-e2") && unresolved(summary, "MEANINGFUL_COST");
    case "addiction-e4":
      return answered("addiction-e1") && unresolved(summary, "STOP_MECHANISM");

    case "gamble-g1":
      return doorwayId === "gamble" && establishedNow(summary, "CHASE_OR_CONTINUE");
    case "gamble-g2":
      return (
        doorwayId === "gamble" &&
        (establishedNow(summary, "LIMIT_MOVED") || establishedHistorically(summary, "LIMIT_MOVED"))
      );
    // G3 can never gate itself: only an upstream source counts.
    case "gamble-g3": {
      if (doorwayId !== "gamble") return false;
      const fact = summary.TIME_ROLE_DISPLACEMENT;
      const upstream = fact.sources.some((src) => src.questionId !== "gamble-g3");
      return fact.current === "ESTABLISHED" && upstream;
    }

    case "addiction-e5":
      return evidenceAnswered >= 2 && unresolved(summary, "RECOGNITION");
    case "addiction-e6": {
      const recognition = summary.RECOGNITION.current;
      return (
        answered("addiction-e5") &&
        (recognition === "ESTABLISHED" || recognition === "PROVISIONAL") &&
        unresolved(summary, "READINESS")
      );
    }
    default:
      return false;
  }
}

export interface CandidateSequence {
  questions: Question[];
  branchIds: string[];
  addictionIds: string[];
  closerIds: string[];
}

/**
 * Branch questions -> earned addiction questions -> at most one generic closer.
 */
export function buildCandidateSequence(doorwayId: string, answers: AnswerMap): CandidateSequence {
  const branch = expandBranch(doorwayId, answers);
  const branchIds = branch.map((q) => q.id);
  const branchComplete = branch.every((q) => !!answers[q.id]);

  const addiction: Question[] = [];
  if (branchComplete) {
    const ordered = [...branchIds, ...CANDIDATE_ADDICTION_ORDER];
    const summary = deriveCandidateFacts(ordered, answers);
    for (const id of CANDIDATE_ADDICTION_ORDER) {
      if (answers[id] || isCandidateProbeEarned(id, doorwayId, answers, summary)) {
        const question = ADDICTION_QUESTIONS[id];
        if (question) addiction.push(question);
      }
    }
  }

  const addictionComplete = addiction.every((q) => !!answers[q.id]);
  const closers = branchComplete && addiction.length > 0 && addictionComplete ? [CLOSER] : [];

  return {
    questions: [...branch, ...addiction, ...closers],
    branchIds,
    addictionIds: addiction.map((q) => q.id),
    closerIds: closers.map((q) => q.id),
  };
}
