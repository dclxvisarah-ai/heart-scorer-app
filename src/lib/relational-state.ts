/**
 * RELATIONAL STATE LAYER
 * ----------------------
 * A read-only layer on top of the protected 1-9 engine. It changes nothing
 * about scoring: it consumes the same `sequence` + `answers` that
 * `evaluatePattern` consumes, plus the `PatternResult` the engine already
 * produced, and describes the *relationship* between the structural
 * territories the evidence activated.
 *
 * Architecture rules encoded here:
 *  - Semantic overlap is information: several territories may be active at once.
 *  - Vocabulary overlap alone NEVER establishes an intersection. A relationship
 *    exists only when a single real answer carries evidence for both
 *    territories, and at least one of them is a leading role in that answer.
 *  - Active territory and evidence-supported relationship are distinct.
 *  - Relationship language is generated from evidence ROLES, not from a
 *    per-combination dictionary and not from keyword matching.
 *  - A relational state can exist while Gabriel's Number is Undetermined.
 */

import {
  G_NUMBERS,
  NUMBERS,
  type AnswerMap,
  type GNumber,
  type PatternResult,
  type Question,
} from "./gabriel";

/* ------------------------------------------------------------------ */
/* Semantic / vocabulary field (context only, never proof)             */
/* ------------------------------------------------------------------ */

/**
 * The structural question each coordinate asks, plus the vocabulary field
 * drawn from the expanded research layer. This is presented to the person as
 * semantic context. It carries no weight and cannot create a relationship.
 */
export const TERRITORIES: Record<GNumber, { structuralQuestion: string; vocabulary: string[] }> = {
  1: {
    structuralQuestion: "What has become identifiable?",
    vocabulary: ["origin", "naming", "first appearance", "identification"],
  },
  2: {
    structuralQuestion: "What has become meaningfully differentiated?",
    vocabulary: ["difference", "the other", "two sides", "assumption about someone else"],
  },
  3: {
    structuralQuestion: "What relationship has become recognizable?",
    vocabulary: ["pattern", "repetition", "connection", "recognition"],
  },
  4: {
    structuralQuestion: "What relationships have become organized?",
    vocabulary: ["structure", "order", "containment", "arrangement"],
  },
  5: {
    structuralQuestion: "What distinction or judgment becomes necessary?",
    vocabulary: ["discernment", "missing information", "weighing", "judgment"],
  },
  6: {
    structuralQuestion: "What previously differentiated elements can function together?",
    vocabulary: ["integration", "working together", "reconciliation", "fit"],
  },
  7: {
    structuralQuestion: "What persists or remains active?",
    vocabulary: ["persistence", "endurance", "staying", "sustained attention"],
  },
  8: {
    structuralQuestion: "What information is being received or recognized?",
    vocabulary: ["listening", "reception", "being told", "unspoken information"],
  },
  9: {
    structuralQuestion: "What has become sufficiently resolved or complete?",
    vocabulary: ["embodiment", "completion", "carrying forward", "next step"],
  },
};

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** How an answer carried a territory: leading, or present underneath. */
export type EvidenceRole = "leading" | "supporting";

export interface EvidenceSnippet {
  questionId: string;
  questionPrompt: string;
  choiceLabel: string;
  /** Territories this single answer contributed evidence to, ascending. */
  numbers: GNumber[];
  /** Role per territory in this answer. */
  roles: Partial<Record<GNumber, EvidenceRole>>;
}

export interface ActiveTerritory {
  n: GNumber;
  name: string;
  weight: number;
  structuralQuestion: string;
  vocabulary: string[];
  /** The person's own answers that put evidence into this territory. */
  snippets: EvidenceSnippet[];
}

export interface TerritoryRelationship {
  pair: [GNumber, GNumber];
  /** Answers that carried BOTH territories at once. */
  support: EvidenceSnippet[];
  /** Count of leading roles across the supporting answers. */
  strength: number;
  /** Plain-language, generated from the evidence roles. */
  description: string;
}

export type ResolutionStatus = "resolved" | "partially resolved" | "unresolved";

export interface RelationalState {
  /** e.g. "2 Duality × 3 Pattern × 5 Discernment". Empty when nothing active. */
  coordinateLabel: string;
  territories: ActiveTerritory[];
  relationships: TerritoryRelationship[];
  /**
   * Pairs of active territories whose vocabulary sits side by side but where no
   * single answer carried both. Shown as *not* an intersection.
   */
  unsupportedPairs: [GNumber, GNumber][];
  /** Deduplicated vocabulary across active territories, in territory order. */
  vocabularyField: string[];
  status: ResolutionStatus;
  /** One-line plain-language reading of the state. */
  summary: string;
}

/**
 * A territory counts as active at the same weight the engine already uses to
 * call a pattern "present" (`MIN_SUPPORT_WEIGHT`). Mirrored, not changed.
 */
export const ACTIVATION_WEIGHT = 1.8;

/**
 * No cap: every territory the evidence actually activated is described,
 * strongest first. Active territories are never silently discarded.
 */

/* ------------------------------------------------------------------ */
/* Derivation                                                          */
/* ------------------------------------------------------------------ */

function collectSnippets(sequence: Question[], answers: AnswerMap): EvidenceSnippet[] {
  const snippets: EvidenceSnippet[] = [];
  for (const question of sequence) {
    const choiceId = answers[question.id];
    if (!choiceId) continue;
    const choice = question.choices.find((c) => c.id === choiceId);
    if (!choice) continue;

    const entries = G_NUMBERS.map((n) => ({ n, w: choice.evidence[n] ?? 0 })).filter((e) => e.w > 0);
    if (entries.length === 0) continue;
    const max = Math.max(...entries.map((e) => e.w));

    const roles: Partial<Record<GNumber, EvidenceRole>> = {};
    for (const e of entries) roles[e.n] = e.w === max ? "leading" : "supporting";

    snippets.push({
      questionId: question.id,
      questionPrompt: question.prompt,
      choiceLabel: choice.label,
      numbers: entries.map((e) => e.n),
      roles,
    });
  }
  return snippets;
}

/** "2 Duality" */
function label(n: GNumber): string {
  return `${n} ${NUMBERS[n].name}`;
}

/**
 * Relationship language from roles only. No number-pair dictionary: the shape
 * of the sentence comes from how the shared answers carried the two
 * territories, and the nouns come from each territory's structural question.
 */
function describe(a: GNumber, b: GNumber, support: EvidenceSnippet[]): string {
  const bothLeading = support.filter((s) => s.roles[a] === "leading" && s.roles[b] === "leading");
  const aLeads = support.filter((s) => s.roles[a] === "leading" && s.roles[b] === "supporting");
  const bLeads = support.filter((s) => s.roles[b] === "leading" && s.roles[a] === "supporting");
  const count = support.length;
  const answers = `${count} of your answers carr${count === 1 ? "ies" : "y"} both`;

  if (bothLeading.length > 0) {
    return `${answers}, and in "${bothLeading[0]!.choiceLabel}" they arrive with equal weight — in that answer neither ${label(a)} nor ${label(b)} is carrying more of it than the other.`;
  }
  if (aLeads.length > 0 && bLeads.length > 0) {
    return `${answers}. Sometimes ${label(a)} leads and ${label(b)} sits underneath, sometimes it reverses — the two keep trading places rather than settling.`;
  }
  if (aLeads.length > 0) {
    return `${answers}: "${aLeads[0]!.choiceLabel}" leads with ${label(a)} and carries ${label(b)} underneath it, so ${label(b)} is showing up through ${label(a)} rather than on its own.`;
  }
  if (bLeads.length > 0) {
    return `${answers}: "${bLeads[0]!.choiceLabel}" leads with ${label(b)} and carries ${label(a)} underneath it, so ${label(a)} is showing up through ${label(b)} rather than on its own.`;
  }
  return `${answers}, both as background weight — the link is real but faint.`;
}

/**
 * Builds the relational state from the completed branch. Pure and
 * deterministic: same sequence + answers + result always give the same object.
 */
export function deriveRelationalState(
  sequence: Question[],
  answers: AnswerMap,
  result: PatternResult,
): RelationalState {
  const snippets = collectSnippets(sequence, answers);

  const weightOf = new Map<GNumber, number>(result.tallies.map((t) => [t.n, t.weight]));

  const activeNumbers = result.tallies
    .filter((t) => t.weight >= ACTIVATION_WEIGHT)
    
    .map((t) => t.n);

  const territories: ActiveTerritory[] = activeNumbers.map((n) => ({
    n,
    name: NUMBERS[n].name,
    weight: weightOf.get(n) ?? 0,
    structuralQuestion: TERRITORIES[n].structuralQuestion,
    vocabulary: TERRITORIES[n].vocabulary,
    snippets: snippets.filter((s) => s.numbers.includes(n)),
  }));

  // Relationships: only where a single answer carried both territories AND at
  // least one of them led that answer. Vocabulary proximity is never enough.
  const relationships: TerritoryRelationship[] = [];
  const unsupportedPairs: [GNumber, GNumber][] = [];

  for (let i = 0; i < activeNumbers.length; i++) {
    for (let j = i + 1; j < activeNumbers.length; j++) {
      const a = activeNumbers[i]!;
      const b = activeNumbers[j]!;
      const shared = snippets.filter((s) => s.numbers.includes(a) && s.numbers.includes(b));
      const qualifying = shared.filter(
        (s) => s.roles[a] === "leading" || s.roles[b] === "leading",
      );
      if (qualifying.length === 0) {
        unsupportedPairs.push([a, b]);
        continue;
      }
      const strength = qualifying.reduce(
        (sum, s) => sum + (s.roles[a] === "leading" ? 1 : 0) + (s.roles[b] === "leading" ? 1 : 0),
        0,
      );
      relationships.push({
        pair: [a, b],
        support: qualifying,
        strength,
        description: describe(a, b, qualifying),
      });
    }
  }

  relationships.sort(
    (x, y) =>
      y.strength - x.strength ||
      y.support.length - x.support.length ||
      x.pair[0] - y.pair[0] ||
      x.pair[1] - y.pair[1],
  );

  const coordinateLabel = territories.map((t) => label(t.n)).join(" × ");

  const vocabularyField: string[] = [];
  for (const t of territories) {
    for (const word of t.vocabulary) if (!vocabularyField.includes(word)) vocabularyField.push(word);
  }

  const status = resolutionStatus(result, territories, relationships);
  const summary = summarise(result, territories, relationships, status);

  return {
    coordinateLabel,
    territories,
    relationships,
    unsupportedPairs,
    vocabularyField,
    status,
    summary,
  };
}

function resolutionStatus(
  result: PatternResult,
  territories: ActiveTerritory[],
  relationships: TerritoryRelationship[],
): ResolutionStatus {
  if (!result.primary) return "unresolved";
  if (territories.length <= 1) return "resolved";
  const linkedToPrimary = relationships.some((r) => r.pair.includes(result.primary!));
  const everyPairLinked = relationships.length === (territories.length * (territories.length - 1)) / 2;
  if (linkedToPrimary && everyPairLinked) return "resolved";
  return "partially resolved";
}

function summarise(
  result: PatternResult,
  territories: ActiveTerritory[],
  relationships: TerritoryRelationship[],
  status: ResolutionStatus,
): string {
  if (territories.length === 0) {
    return "There isn't enough evidence in these answers to place a relational state yet.";
  }
  const names = territories.map((t) => label(t.n));
  const list = names.join(", ").replace(/, ([^,]*)$/, " and $1");

  if (status === "unresolved") {
    const link =
      relationships.length > 0
        ? " Your answers do tie some of them together, but not far enough apart to separate one from the rest."
        : " Nothing in your answers ties them together yet — they are running alongside each other.";
    const verb = territories.length === 1 ? "is" : "are";
    return `${list} ${verb} active in what you described.${link}`;
  }
  if (status === "partially resolved") {
    return `${list} are active. ${label(result.primary!)} is the clearest, and part of what surrounds it is connected to it by your own answers while part of it is still standing on its own.`;
  }
  if (territories.length === 1) {
    return `${list} is the only territory your answers actually put weight into, and it holds on its own.`;
  }
  return `${list} are active, and every pair of them is held together by answers you actually gave — this reads as one connected state rather than separate threads.`;
}
