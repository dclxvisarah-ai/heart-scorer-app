import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ClarityDial } from "@/components/ClarityDial";
import { ProvisionalNote } from "@/components/ProvisionalNote";
import { ScaleChoice } from "@/components/ScaleChoice";
import {
  AGREEMENT_LABELS,
  BRANCHES,
  GAP_READINGS,
  GENERAL_QUESTIONS,
  INITIAL_SCALE_LABELS,
  REFLECTION_PROMPTS,
  evaluate,
  getBranch,
  type Answers,
  type Branch,
  type Question,
  type ScaleValue,
} from "@/lib/evaluator";
import { formatGap, loadHistory, newId, saveEntry, type HistoryEntry } from "@/lib/history";

const TITLE = "Gabriel's Number Clarity Evaluator";
const DESCRIPTION =
  "A provisional, self-guided evaluation: rate your clarity by feel, work through general and situation-specific questions, then compare your perception against the evaluated figure.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${TITLE} — Provisional Clarity Evaluation` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EvaluatorPage,
});

type Stage =
  | "start"
  | "initial"
  | "branch"
  | "general"
  | "focused"
  | "reveal"
  | "compare"
  | "sources"
  | "reflection"
  | "done";

const STEP_LABELS: { stage: Stage; label: string }[] = [
  { stage: "initial", label: "By feel" },
  { stage: "branch", label: "Branch" },
  { stage: "general", label: "General" },
  { stage: "focused", label: "Focused" },
];

function EvaluatorPage() {
  const [stage, setStage] = useState<Stage>("start");
  const [initial, setInitial] = useState<ScaleValue | undefined>();
  const [branchId, setBranchId] = useState<string | undefined>();
  const [answers, setAnswers] = useState<Answers>({});
  const [generalIndex, setGeneralIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [reflection, setReflection] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const branch = branchId ? getBranch(branchId) : undefined;

  const result = useMemo(() => {
    if (!branch || !initial) return undefined;
    return evaluate(branch, answers, initial);
  }, [branch, answers, initial]);

  const setAnswer = useCallback((id: string, value: ScaleValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const restart = useCallback(() => {
    setStage("start");
    setInitial(undefined);
    setBranchId(undefined);
    setAnswers({});
    setGeneralIndex(0);
    setFocusedIndex(0);
    setReflection("");
    setSaved(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const complete = useCallback(() => {
    if (!branch || !initial || !result || saved) {
      setStage("done");
      return;
    }
    const entry: HistoryEntry = {
      id: newId(),
      createdAt: new Date().toISOString(),
      branchId: branch.id,
      branchLabel: branch.label,
      initial,
      evaluated: result.evaluated,
      clarityGap: result.clarityGap,
      gapDirection: result.gapDirection,
      generalMean: result.generalMean,
      focusedMean: result.focusedMean,
      answers,
      reflection: reflection.trim(),
    };
    setHistory(saveEntry(entry));
    setSaved(true);
    setStage("done");
    toast.success("Evaluation saved to this device");
  }, [branch, initial, result, answers, reflection, saved]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage, generalIndex, focusedIndex]);

  const activeStepIndex = STEP_LABELS.findIndex((step) => step.stage === stage);

  return (
    <main className="paper min-h-screen">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Gabriel's Number</p>
            <h1 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
              Clarity Evaluator
            </h1>
          </div>
          <Link
            to="/history"
            className="mt-1 shrink-0 rounded-full border border-hairline bg-cream px-3 py-1.5 text-xs text-olive-soft transition-colors hover:border-teal/60 hover:text-foreground"
          >
            History{history.length > 0 ? ` (${history.length})` : ""}
          </Link>
        </header>

        {activeStepIndex >= 0 ? (
          <ol className="mb-6 flex items-center gap-2" aria-label="Progress">
            {STEP_LABELS.map((step, index) => (
              <li key={step.stage} className="flex flex-1 flex-col gap-1.5">
                <span
                  className={`h-1 rounded-full ${
                    index <= activeStepIndex ? "bg-teal" : "bg-cream-deep"
                  }`}
                />
                <span
                  className={`text-[0.625rem] tracking-[0.12em] uppercase ${
                    index === activeStepIndex ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        {stage === "start" ? <StartStage onBegin={() => setStage("initial")} /> : null}

        {stage === "initial" ? (
          <InitialStage
            value={initial}
            onChange={setInitial}
            onNext={() => setStage("branch")}
            onBack={() => setStage("start")}
          />
        ) : null}

        {stage === "branch" ? (
          <BranchStage
            selected={branchId}
            onSelect={(id) => {
              setBranchId(id);
              setAnswers({});
              setGeneralIndex(0);
              setFocusedIndex(0);
            }}
            onNext={() => setStage("general")}
            onBack={() => setStage("initial")}
          />
        ) : null}

        {stage === "general" ? (
          <QuestionStage
            eyebrow="General clarity"
            heading="Questions asked of every situation"
            questions={GENERAL_QUESTIONS}
            index={generalIndex}
            answers={answers}
            onAnswer={setAnswer}
            onIndexChange={setGeneralIndex}
            onComplete={() => setStage("focused")}
            onExitBack={() => setStage("branch")}
          />
        ) : null}

        {stage === "focused" && branch ? (
          <QuestionStage
            eyebrow={branch.label}
            heading="Focused on this situation"
            questions={branch.questions}
            index={focusedIndex}
            answers={answers}
            onAnswer={setAnswer}
            onIndexChange={setFocusedIndex}
            onComplete={() => setStage("reveal")}
            onExitBack={() => {
              setGeneralIndex(GENERAL_QUESTIONS.length - 1);
              setStage("general");
            }}
          />
        ) : null}

        {stage === "reveal" && result && branch ? (
          <RevealStage
            evaluated={result.evaluated}
            band={result.band}
            generalMean={result.generalMean}
            focusedMean={result.focusedMean}
            branch={branch}
            onNext={() => setStage("compare")}
          />
        ) : null}

        {stage === "compare" && result && initial ? (
          <CompareStage
            initial={initial}
            evaluated={result.evaluated}
            clarityGap={result.clarityGap}
            gapDirection={result.gapDirection}
            onNext={() => setStage("sources")}
            onBack={() => setStage("reveal")}
          />
        ) : null}

        {stage === "sources" && result ? (
          <SourcesStage
            sources={result.mismatchSources}
            gapDirection={result.gapDirection}
            onNext={() => setStage("reflection")}
            onBack={() => setStage("compare")}
          />
        ) : null}

        {stage === "reflection" ? (
          <ReflectionStage
            value={reflection}
            onChange={setReflection}
            onComplete={complete}
            onBack={() => setStage("sources")}
          />
        ) : null}

        {stage === "done" && result && branch && initial ? (
          <DoneStage
            branch={branch}
            initial={initial}
            result={result}
            reflection={reflection}
            onRestart={restart}
          />
        ) : null}
      </div>
    </main>
  );
}

/* ---------- stages ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return <section className="card-cream animate-rise p-5 sm:p-7">{children}</section>;
}

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 w-full items-center justify-center rounded-full bg-teal px-6 text-sm font-medium text-teal-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
    >
      {children}
    </button>
  );
}

function QuietButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center justify-center rounded-full border border-hairline px-5 text-sm text-olive-soft transition-colors hover:border-teal/60 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function StartStage({ onBegin }: { onBegin: () => void }) {
  return (
    <Card>
      <p className="eyebrow">Before you begin</p>
      <h2 className="rule-gold mt-2 font-display text-xl sm:text-2xl">
        A structured way to check how clear something actually is
      </h2>
      <div className="mt-5 space-y-3 text-sm leading-relaxed text-olive-soft sm:text-base">
        <p>
          You will give a first reading by feel, choose the kind of situation you are evaluating,
          answer a set of general clarity questions and then a focused set, and finally compare your
          first reading against the provisional evaluated figure.
        </p>
        <p>
          The difference between those two readings is the <strong>Clarity Gap</strong>. It is the
          part worth sitting with.
        </p>
      </div>
      <ProvisionalNote className="mt-5" />
      <div className="mt-6">
        <PrimaryButton onClick={onBegin}>Begin</PrimaryButton>
      </div>
    </Card>
  );
}

function InitialStage({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: ScaleValue | undefined;
  onChange: (value: ScaleValue) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <p className="eyebrow">Step one</p>
      <h2 className="mt-2 font-display text-xl sm:text-2xl">
        Before any questions — how clear does this feel?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-olive-soft">
        Answer by feel, quickly. Do not reason it out. This first reading is what the evaluation will
        later be compared against, so it only works if it is unconsidered.
      </p>
      <div className="mt-6">
        <ScaleChoice
          name="Initial clarity by feel"
          value={value}
          onChange={onChange}
          labels={INITIAL_SCALE_LABELS}
          variant="expanded"
        />
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <QuietButton onClick={onBack}>Back</QuietButton>
        <PrimaryButton disabled={!value} onClick={onNext}>
          Continue
        </PrimaryButton>
      </div>
    </Card>
  );
}

function BranchStage({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: string | undefined;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <p className="eyebrow">Step two</p>
      <h2 className="mt-2 font-display text-xl sm:text-2xl">Choose your evaluation branch</h2>
      <p className="mt-3 text-sm leading-relaxed text-olive-soft">
        Pick the one that fits closest. The branch decides which focused questions you are asked
        after the general set.
      </p>
      <div className="mt-6 flex flex-col gap-2.5">
        {BRANCHES.map((branch) => {
          const active = selected === branch.id;
          return (
            <button
              key={branch.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(branch.id)}
              className={`rounded-xl border px-4 py-3.5 text-left transition-colors ${
                active
                  ? "border-teal bg-teal/10"
                  : "border-hairline bg-background/40 hover:border-teal/50"
              }`}
            >
              <span className="block font-display text-base text-foreground">{branch.label}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {branch.description}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <QuietButton onClick={onBack}>Back</QuietButton>
        <PrimaryButton disabled={!selected} onClick={onNext}>
          Continue
        </PrimaryButton>
      </div>
    </Card>
  );
}

function QuestionStage({
  eyebrow,
  heading,
  questions,
  index,
  answers,
  onAnswer,
  onIndexChange,
  onComplete,
  onExitBack,
}: {
  eyebrow: string;
  heading: string;
  questions: Question[];
  index: number;
  answers: Answers;
  onAnswer: (id: string, value: ScaleValue) => void;
  onIndexChange: (index: number) => void;
  onComplete: () => void;
  onExitBack: () => void;
}) {
  const question = questions[index];
  if (!question) return null;
  const value = answers[question.id];
  const isLast = index === questions.length - 1;

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3">
        <p className="eyebrow">{eyebrow}</p>
        <p className="numeral text-sm text-muted-foreground">
          {index + 1}/{questions.length}
        </p>
      </div>
      <h2 className="mt-2 font-display text-lg text-olive-soft sm:text-xl">{heading}</h2>

      <div className="mt-6 border-t border-hairline pt-6">
        <p className="font-display text-xl leading-snug text-foreground sm:text-2xl">
          {question.text}
        </p>
        {question.note ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{question.note}</p>
        ) : null}
        <div className="mt-6">
          <ScaleChoice
            name={question.text}
            value={value}
            onChange={(next) => onAnswer(question.id, next)}
            labels={AGREEMENT_LABELS}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <QuietButton onClick={() => (index === 0 ? onExitBack() : onIndexChange(index - 1))}>
          Back
        </QuietButton>
        <PrimaryButton
          disabled={!value}
          onClick={() => (isLast ? onComplete() : onIndexChange(index + 1))}
        >
          {isLast ? "See provisional clarity" : "Next question"}
        </PrimaryButton>
      </div>
    </Card>
  );
}

function RevealStage({
  evaluated,
  band,
  generalMean,
  focusedMean,
  branch,
  onNext,
}: {
  evaluated: number;
  band: string;
  generalMean: number;
  focusedMean: number;
  branch: Branch;
  onNext: () => void;
}) {
  return (
    <Card>
      <p className="eyebrow">Step three</p>
      <h2 className="mt-2 font-display text-xl sm:text-2xl">Provisional evaluated clarity</h2>
      <div className="mt-7 flex justify-center">
        <ClarityDial value={evaluated} caption={band} tone="teal" />
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-hairline bg-background/40 px-4 py-3">
          <dt className="eyebrow">General</dt>
          <dd className="numeral mt-1 text-2xl text-foreground">{generalMean.toFixed(1)}</dd>
        </div>
        <div className="rounded-xl border border-hairline bg-background/40 px-4 py-3">
          <dt className="eyebrow">Focused</dt>
          <dd className="numeral mt-1 text-2xl text-foreground">{focusedMean.toFixed(1)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-relaxed text-olive-soft">
        The two halves are weighted equally: general clarity and clarity specific to this branch —{" "}
        {branch.label} — each account for half of the figure above.
      </p>
      <ProvisionalNote className="mt-4" />
      <div className="mt-6">
        <PrimaryButton onClick={onNext}>Compare with your first reading</PrimaryButton>
      </div>
    </Card>
  );
}

function CompareStage({
  initial,
  evaluated,
  clarityGap,
  gapDirection,
  onNext,
  onBack,
}: {
  initial: ScaleValue;
  evaluated: number;
  clarityGap: number;
  gapDirection: "overestimated" | "underestimated" | "aligned";
  onNext: () => void;
  onBack: () => void;
}) {
  const tone = gapDirection === "aligned" ? "teal" : "terracotta";
  return (
    <Card>
      <p className="eyebrow">Step four</p>
      <h2 className="mt-2 font-display text-xl sm:text-2xl">Perception against evaluation</h2>

      <div className="mt-7 grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <ClarityDial value={initial} size="md" tone="gold" animate={false} />
          <p className="mt-2 text-center text-xs tracking-[0.12em] text-muted-foreground uppercase">
            By feel
          </p>
        </div>
        <div className="flex flex-col items-center">
          <ClarityDial value={evaluated} size="md" tone="teal" animate={false} />
          <p className="mt-2 text-center text-xs tracking-[0.12em] text-muted-foreground uppercase">
            Evaluated
          </p>
        </div>
      </div>

      <div
        className={`mt-7 rounded-2xl border px-5 py-5 text-center ${
          tone === "teal" ? "border-teal/40 bg-teal/8" : "border-terracotta/40 bg-terracotta/8"
        }`}
      >
        <p className="eyebrow">Clarity Gap</p>
        <p
          className={`numeral mt-2 text-4xl sm:text-5xl ${
            tone === "teal" ? "text-teal" : "text-terracotta"
          }`}
        >
          {formatGap(clarityGap)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-olive-soft">{GAP_READINGS[gapDirection]}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <QuietButton onClick={onBack}>Back</QuietButton>
        <PrimaryButton onClick={onNext}>Possible mismatch sources</PrimaryButton>
      </div>
    </Card>
  );
}

function SourcesStage({
  sources,
  gapDirection,
  onNext,
  onBack,
}: {
  sources: Question[];
  gapDirection: "overestimated" | "underestimated" | "aligned";
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <p className="eyebrow">Possible mismatch sources</p>
      <h2 className="mt-2 font-display text-xl sm:text-2xl">
        Where the two readings may have come apart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-olive-soft">
        These come from the questions you rated lowest. They are possibilities to check, not
        conclusions about you or about the situation.
      </p>

      {sources.length === 0 ? (
        <p className="mt-6 rounded-xl border border-hairline bg-background/40 px-4 py-4 text-sm leading-relaxed text-olive-soft">
          You rated every question at four or above, so there is no low-scoring question to point at.
          If the gap still felt large,{" "}
          {gapDirection === "overestimated"
            ? "the difference may sit in something none of these questions asked about."
            : "it may be worth re-reading the questions once more without rushing."}
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {sources.map((source) => (
            <li
              key={source.id}
              className="rounded-xl border border-hairline bg-background/40 px-4 py-4"
            >
              <p className="font-display text-base leading-snug text-foreground">{source.text}</p>
              <p className="mt-2 text-sm leading-relaxed text-olive-soft">{source.mismatchSource}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <QuietButton onClick={onBack}>Back</QuietButton>
        <PrimaryButton onClick={onNext}>Reflection</PrimaryButton>
      </div>
    </Card>
  );
}

function ReflectionStage({
  value,
  onChange,
  onComplete,
  onBack,
}: {
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <p className="eyebrow">Reflection</p>
      <h2 className="mt-2 font-display text-xl sm:text-2xl">Put it in your own words</h2>
      <ul className="mt-4 flex flex-col gap-2">
        {REFLECTION_PROMPTS.map((prompt) => (
          <li key={prompt} className="flex gap-2.5 text-sm leading-relaxed text-olive-soft">
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
            {prompt}
          </li>
        ))}
      </ul>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        placeholder="Optional — stays on this device."
        className="mt-5 w-full resize-y rounded-xl border border-hairline bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/25 focus:outline-none"
      />
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <QuietButton onClick={onBack}>Back</QuietButton>
        <PrimaryButton onClick={onComplete}>Save evaluation</PrimaryButton>
      </div>
    </Card>
  );
}

function DoneStage({
  branch,
  initial,
  result,
  reflection,
  onRestart,
}: {
  branch: Branch;
  initial: ScaleValue;
  result: ReturnType<typeof evaluate>;
  reflection: string;
  onRestart: () => void;
}) {
  return (
    <Card>
      <p className="eyebrow">Complete</p>
      <h2 className="rule-gold mt-2 font-display text-xl sm:text-2xl">Saved to this device</h2>

      <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
        <Row label="Branch" value={branch.label} />
        <Row label="By feel" value={initial.toFixed(1)} />
        <Row label="Evaluated (provisional)" value={result.evaluated.toFixed(1)} />
        <Row label="Clarity Gap" value={formatGap(result.clarityGap)} />
      </dl>

      {reflection.trim() ? (
        <div className="mt-5 rounded-xl border border-hairline bg-background/40 px-4 py-4">
          <p className="eyebrow">Your reflection</p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-olive-soft">
            {reflection.trim()}
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/history"
          className="inline-flex h-11 items-center justify-center rounded-full border border-hairline px-5 text-sm text-olive-soft transition-colors hover:border-teal/60 hover:text-foreground"
        >
          View history
        </Link>
        <PrimaryButton onClick={onRestart}>Start a new evaluation</PrimaryButton>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="numeral text-base text-foreground">{value}</dd>
    </div>
  );
}
