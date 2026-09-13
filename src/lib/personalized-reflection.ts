/**
 * PERSONALIZED REFLECTION (presentation only)
 * -------------------------------------------
 * Turns an already-computed result and relational state into one paragraph.
 * It never scores answers, changes evidence, or exposes internal territory
 * labels. The person's selected answer language is what makes each reflection
 * specific to the completed path.
 */

import { FORMULATIONS } from "./deep-reading";
import type { PatternResult } from "./gabriel";
import type { RelationalState } from "./relational-state";

export interface PersonalizedReflection {
  paragraph: string;
  ending: "question" | "statement";
}

function quotedAnswers(result: PatternResult, state: RelationalState | null): string[] {
  const labels = result.contributions.map((contribution) => contribution.choiceLabel);

  if (labels.length === 0) {
    for (const territory of state?.territories ?? []) {
      for (const snippet of territory.snippets) labels.push(snippet.choiceLabel);
    }
  }

  return [...new Set(labels)].slice(0, 2);
}

function answerOpening(labels: string[]): string {
  if (labels.length === 0) return "Taken together, your answers do not force a clean conclusion.";
  if (labels.length === 1) return `You answered “${labels[0]}.”`;
  return `You answered “${labels[0]}” and “${labels[1]}.”`;
}

/** Same inputs always produce the same single-paragraph reflection. */
export function buildPersonalizedReflection(
  result: PatternResult,
  state: RelationalState | null,
): PersonalizedReflection {
  const opening = answerOpening(quotedAnswers(result, state));

  if (!result.primary) {
    return {
      paragraph: `${opening} More than one pattern remains honestly present, without enough separation to name one as the answer. What becomes clearer if you let those answers stand together without forcing a verdict?`,
      ending: "question",
    };
  }

  const formulation = FORMULATIONS[result.primary];
  const question = formulation.recognitions[0];

  return {
    paragraph: `${opening} ${formulation.lead} ${question}`,
    ending: "question",
  };
}