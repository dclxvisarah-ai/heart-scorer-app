import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ClarityDial } from "../components/ClarityDial";
import { OptionChoice, ScaleChoice } from "../components/ScaleChoice";
import {
  BRANCHES,
  BRANCH_PROMPT,
  EMPTY_GENERAL,
  INITIAL_NOTE,
  INITIAL_PROMPT,
  KNOWN_VS_FELT_OPTIONS,
  NERVOUS_SYSTEM_OPTIONS,
  OBSERVATION_OPTIONS,
  PROVISIONAL_NOTE,
  REFLECTION_PROMPT,
  SOCIAL_TONE_OPTIONS,
  THOUGHT_STYLE_OPTIONS,
  evaluate,
  getBranch,
  isGeneralComplete,
  type BranchId,
  type GeneralEvaluation,
  type ScaleValue,
} from "../lib/evaluator";
import {
  formatEvaluationDate,
  newEvaluationId,
  saveEvaluation,
  type EvaluationRecord,
} from "../lib/evaluations";

const TITLE = "What's Gabriel's Number? — Clarity Evaluation";
const DESCRIPTION =
  "Record the clarity number you feel, answer a short set of evaluation questions, and compare your initial perception with an evaluated clarity reading and its Clarity Gap.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EvaluatorPage,
});

type Stage = "initial" | "branch" | "general" | "focused" | "reveal" | "reflection" | "saved";

const STAGE_ORDER: Stage[] = ["initial", "branch", "general", "focused", "reveal", "reflection"];

function EvaluatorPage() {
  const [stage, setStage] = useState<Stage>("initial");
  const [initial, setInitial] = useState<ScaleValue | undefined>();
  const [branchId, setBranchId] = useState<BranchId | undefined>();
  const [general, setGeneral] = useState<GeneralEvaluation>(EMPTY_GENERAL);
  const [focusedAnswers, setFocusedAnswers] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [savedRecord, setSavedRecord] = useState<EvaluationRecord | undefined>();

  const branch = getBranch(branchId);
  const outcome = useMemo(
    () => (initial === undefined ? undefined : evaluate(initial, general)),
    [initial, general],
  );

  function patch(next: Partial<GeneralEvaluation>) {
    setGeneral((current) => ({ ...current, ...next }));
  }

  function chooseBranch(id: BranchId) {
    setBranchId(id);
    const questions = getBranch(id)?.questions ?? [];
    setFocusedAnswers(questions.map(() => ""));
    setStage("general");
  }

  function restart() {
    setStage("initial");
    setInitial(undefined);
    setBranchId(undefined);
    setGeneral(EMPTY_GENERAL);
    setFocusedAnswers([]);
    setReflection("");
    setSavedRecord(undefined);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function back() {
    const index = STAGE_ORDER.indexOf(stage);
    if (index > 0) setStage(STAGE_ORDER[index - 1]!);
  }

  function save() {
    if (!outcome || initial === undefined || !branch) return;
    const record: EvaluationRecord = {
      id: newEvaluationId(),
      createdAt: new Date().toISOString(),
      initial,
      evaluated: outcome.evaluated,
      gap: outcome.gap,
      alignment: outcome.alignment,
      branchId: branch.id,
      branchLabel: branch.label,
      general,
      focused: branch.questions.map((question, index) => ({
        question,
        answer: focusedAnswers[index] ?? "",
      })),
      mismatchSources: outcome.mismatchSources,
      reflection,
    };
    saveEvaluation(record);
    setSavedRecord(record);
    setStage("saved");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  return (
    <main className="paper min-h-screen">
      <div className="mx-auto w-full max-w-2xl px-4 pb-4 pt-10 sm:px-6 sm:pt-14">
        <header className="text-center">
          <p className="eyebrow">Clarity evaluation</p>
          <h1 className="mt-3 text-3xl leading-tight text-olive sm:text-4xl">
            What's Gabriel's Number?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground">
            {DESCRIPTION}
          </p>
          <div className="mt-5">
            <Link
              to="/history"
              className="text-[0.8125rem] text-teal underline-offset-4 hover:underline"
            >
              Past evaluations
            </Link>
          </div>
        </header>

        <div className="mt-8 space-y-5">
          {stage === "initial" ? (
            <section className="card-cream animate-rise p-6 sm:p-8">
              <h2 className="text-xl text-olive">Initial clarity</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-olive-soft">
                {INITIAL_PROMPT}
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {INITIAL_NOTE}
              </p>
              <div className="mt-7">
                <ClarityDial value={initial} onChange={setInitial} label="Initial feeling" />
              </div>
              <div className="mt-8">
                <PrimaryButton disabled={initial === undefined} onClick={() => setStage("branch")}>
                  Continue
                </PrimaryButton>
                {initial === undefined ? (
                  <p className="mt-3 text-center text-[0.75rem] text-muted-foreground">
                    Pick a number to continue.
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}

          {stage === "branch" ? (
            <section className="card-cream animate-rise p-6 sm:p-8">
              <StepHeader step="Step 2" onBack={back} />
              <h2 className="mt-2 text-xl text-olive">{BRANCH_PROMPT}</h2>
              <div className="mt-5 space-y-2">
                {BRANCHES.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => chooseBranch(option.id)}
                    aria-pressed={branchId === option.id}
                    className={[
                      "w-full rounded-xl border px-4 py-3.5 text-left text-[0.9375rem] transition-colors",
                      branchId === option.id
                        ? "border-teal bg-teal text-teal-foreground"
                        : "border-hairline bg-cream text-olive hover:bg-cream-deep",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {stage === "general" ? (
            <section className="card-cream animate-rise p-6 sm:p-8">
              <StepHeader step="Step 3" onBack={back} />
              <h2 className="mt-2 text-xl text-olive">General evaluation</h2>
              <p className="mt-2 text-[0.8125rem] text-muted-foreground">
                Answer as you actually are right now, not as you'd like to be.
              </p>

              <div className="mt-7 space-y-7">
                <ScaleChoice
                  label="Mental Clarity"
                  lowLabel="Foggy"
                  highLabel="Clear"
                  value={general.mentalClarity}
                  onChange={(value) => patch({ mentalClarity: value })}
                />
                <ScaleChoice
                  label="Emotional Load"
                  hint="How much emotional weight are you carrying right now?"
                  lowLabel="Light"
                  highLabel="Heavy"
                  value={general.emotionalLoad}
                  onChange={(value) => patch({ emotionalLoad: value })}
                />
                <OptionChoice
                  label="Nervous System State"
                  options={NERVOUS_SYSTEM_OPTIONS}
                  value={general.nervousSystem}
                  onChange={(value) => patch({ nervousSystem: value })}
                />
                <OptionChoice
                  label="Thought Style"
                  options={THOUGHT_STYLE_OPTIONS}
                  value={general.thoughtStyle}
                  onChange={(value) => patch({ thoughtStyle: value })}
                />
                <OptionChoice
                  label="Social Tone"
                  options={SOCIAL_TONE_OPTIONS}
                  value={general.socialTone}
                  onChange={(value) => patch({ socialTone: value })}
                />
                <OptionChoice
                  label="Observation vs. Reaction"
                  options={OBSERVATION_OPTIONS}
                  value={general.observation}
                  onChange={(value) => patch({ observation: value })}
                />
                <OptionChoice
                  label="What I Know vs. What I Feel"
                  options={KNOWN_VS_FELT_OPTIONS}
                  value={general.knownVsFelt}
                  onChange={(value) => patch({ knownVsFelt: value })}
                />

                <TextField
                  label="Mindframe Snapshot"
                  hint="A line or two describing the frame you're in."
                  value={general.mindframe}
                  onChange={(value) => patch({ mindframe: value })}
                  rows={2}
                />
                <TextField
                  label="What discomfort am I avoiding?"
                  value={general.avoiding}
                  onChange={(value) => patch({ avoiding: value })}
                  rows={3}
                />
                <TextField
                  label="What would a steady response look like?"
                  value={general.steadyResponse}
                  onChange={(value) => patch({ steadyResponse: value })}
                  rows={2}
                />
              </div>

              <div className="mt-8">
                <PrimaryButton
                  disabled={!isGeneralComplete(general)}
                  onClick={() => setStage("focused")}
                >
                  Continue to focused questions
                </PrimaryButton>
                {!isGeneralComplete(general) ? (
                  <p className="mt-3 text-center text-[0.75rem] text-muted-foreground">
                    Answer each scale and option question to continue.
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}

          {stage === "focused" && branch ? (
            <section className="card-cream animate-rise p-6 sm:p-8">
              <StepHeader step="Step 4" onBack={back} />
              <h2 className="mt-2 text-xl text-olive">Focused evaluation</h2>
              <p className="mt-2 text-[0.8125rem] text-muted-foreground">{branch.label}</p>

              <div className="mt-7 space-y-6">
                {branch.questions.map((question, index) => (
                  <TextField
                    key={question}
                    label={question}
                    value={focusedAnswers[index] ?? ""}
                    onChange={(value) =>
                      setFocusedAnswers((current) => {
                        const next = [...current];
                        next[index] = value;
                        return next;
                      })
                    }
                    rows={3}
                  />
                ))}
              </div>

              <div className="mt-8">
                <PrimaryButton onClick={() => setStage("reveal")}>
                  Reveal evaluation
                </PrimaryButton>
                <p className="mt-3 text-center text-[0.75rem] text-muted-foreground">
                  These answers are for your reflection. They are not scored.
                </p>
              </div>
            </section>
          ) : null}

          {(stage === "reveal" || stage === "reflection") && outcome && initial !== undefined ? (
            <>
              <section className="card-cream animate-rise p-6 sm:p-8">
                <StepHeader step="Evaluation" onBack={back} />
                <h2 className="mt-2 text-xl text-olive">Initial feeling vs. evaluated state</h2>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-hairline bg-background/50 p-4">
                    <ClarityDial value={initial} label="Initial feeling" tone="terracotta" />
                  </div>
                  <div className="rounded-2xl border border-hairline bg-background/50 p-4">
                    <ClarityDial value={outcome.evaluated} label="Evaluated state" />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-hairline bg-cream-deep/60 p-5 text-center">
                  <p className="eyebrow">Clarity Gap</p>
                  <p className="numeral mt-2 text-4xl text-olive">{outcome.gap.toFixed(1)}</p>
                  <p className="mt-2 text-[0.9375rem] text-olive">{outcome.alignment}</p>
                  <p className="mt-1 text-[0.8125rem] text-muted-foreground">
                    {outcome.direction === "same"
                      ? "The evaluation landed on the number you felt."
                      : `The evaluated number is ${outcome.direction} than the number you felt.`}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-[0.9375rem] font-medium text-olive">
                    How the evaluated number was formed
                  </h3>
                  <ul className="mt-3 divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">
                    {outcome.parts.map((part) => (
                      <li
                        key={part.label}
                        className="flex items-center justify-between gap-4 px-4 py-2.5 text-[0.8125rem]"
                      >
                        <span className="text-olive-soft">{part.label}</span>
                        <span className="text-right text-olive">
                          {part.answer}
                          <span className="numeral ml-3 text-teal">{part.score}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
                    {PROVISIONAL_NOTE}
                  </p>
                </div>

                {outcome.mismatchSources.length > 0 ? (
                  <div className="mt-6 rounded-2xl border border-hairline bg-background/50 p-5">
                    <h3 className="text-[0.9375rem] font-medium text-olive">
                      Possible sources of mismatch
                    </h3>
                    <ul className="mt-3 space-y-2 text-[0.875rem] leading-relaxed text-olive-soft">
                      {outcome.mismatchSources.map((source) => (
                        <li key={source} className="flex gap-2">
                          <span className="text-gold">—</span>
                          <span>{source}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {stage === "reveal" ? (
                  <div className="mt-8">
                    <PrimaryButton onClick={() => setStage("reflection")}>
                      Continue to reflection
                    </PrimaryButton>
                  </div>
                ) : null}
              </section>

              {stage === "reflection" ? (
                <section className="card-cream animate-rise p-6 sm:p-8">
                  <StepHeader step="Reflection" onBack={back} />
                  <TextField label={REFLECTION_PROMPT} value={reflection} onChange={setReflection} rows={6} />
                  <div className="mt-6 space-y-3">
                    <PrimaryButton onClick={save}>Save evaluation</PrimaryButton>
                    <SecondaryButton onClick={restart}>Start another evaluation</SecondaryButton>
                  </div>
                </section>
              ) : null}
            </>
          ) : null}

          {stage === "saved" && savedRecord ? (
            <section className="card-cream animate-rise p-6 text-center sm:p-8">
              <p className="eyebrow">Saved to this device</p>
              <h2 className="mt-3 text-xl text-olive">Evaluation recorded</h2>
              <p className="mt-2 text-[0.875rem] text-muted-foreground">
                {formatEvaluationDate(savedRecord.createdAt)} · {savedRecord.branchLabel}
              </p>
              <p className="numeral mt-6 text-3xl text-olive">
                {savedRecord.initial} → {savedRecord.evaluated.toFixed(1)}
              </p>
              <p className="mt-2 text-[0.875rem] text-olive-soft">
                Clarity Gap {savedRecord.gap.toFixed(1)} · {savedRecord.alignment}
              </p>
              <div className="mt-8 space-y-3">
                <PrimaryButton onClick={restart}>Start another evaluation</PrimaryButton>
                <Link
                  to="/history"
                  className="block rounded-xl border border-hairline bg-cream px-5 py-3 text-center text-[0.9375rem] text-olive transition-colors hover:bg-cream-deep"
                >
                  View past evaluations
                </Link>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function StepHeader({ step, onBack }: { step: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <p className="eyebrow">{step}</p>
      <button
        type="button"
        onClick={onBack}
        className="text-[0.8125rem] text-muted-foreground underline-offset-4 transition-colors hover:text-olive hover:underline"
      >
        ← Back
      </button>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl bg-teal px-5 py-3.5 text-[0.9375rem] font-medium text-teal-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-hairline bg-cream px-5 py-3.5 text-[0.9375rem] text-olive transition-colors hover:bg-cream-deep"
    >
      {children}
    </button>
  );
}

function TextField({
  label,
  hint,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-[0.9375rem] font-medium text-olive">{label}</span>
      {hint ? <span className="mt-1 block text-[0.8125rem] text-muted-foreground">{hint}</span> : null}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-3 w-full rounded-xl border border-hairline bg-background/60 px-4 py-3 text-[0.9375rem] leading-relaxed text-olive outline-none transition-colors placeholder:text-muted-foreground focus:border-teal"
        placeholder="Optional"
      />
    </label>
  );
}
