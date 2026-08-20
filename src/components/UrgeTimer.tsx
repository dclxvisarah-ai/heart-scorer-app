/**
 * Reusable "sit with the urge" timer.
 *
 * Behavioural-support feature ONLY. It is completely independent of the
 * Gabriel Number framework: it never reads answers, never writes evidence,
 * and never touches scoring, weights, thresholds or result logic.
 *
 * Four consecutive 3-minute intervals: 3 → 6 → 9 → 12 minutes. The person
 * can stop at any moment and keep answering questions while it runs.
 */
import { useCallback, useEffect, useRef, useState } from "react";

const INTERVAL_MS = 3 * 60 * 1000;
const TOTAL_INTERVALS = 4;

type Phase = "idle" | "running" | "checkpoint" | "complete" | "stopped";

export type UrgeTimerState = {
  phase: Phase;
  /** Completed 3-minute intervals so far (0–4). */
  completed: number;
  /** Milliseconds left in the current interval. */
  remaining: number;
  start: () => void;
  continueNext: () => void;
  stop: () => void;
  reset: () => void;
  active: boolean;
};

/**
 * Held at page level so the timer survives moving between questions inside
 * the same session. Nothing here is persisted or scored.
 */
export function useUrgeTimer(): UrgeTimerState {
  const [phase, setPhase] = useState<Phase>("idle");
  const [completed, setCompleted] = useState(0);
  const [remaining, setRemaining] = useState(INTERVAL_MS);
  const deadlineRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const left = deadline - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setCompleted((c) => {
          const next = c + 1;
          setPhase(next >= TOTAL_INTERVALS ? "complete" : "checkpoint");
          return next;
        });
        return;
      }
      setRemaining(left);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [phase]);

  const begin = useCallback(() => {
    deadlineRef.current = Date.now() + INTERVAL_MS;
    setRemaining(INTERVAL_MS);
    setPhase("running");
  }, []);

  const start = useCallback(() => {
    setCompleted(0);
    begin();
  }, [begin]);

  const stop = useCallback(() => {
    deadlineRef.current = null;
    setPhase("stopped");
  }, []);

  const reset = useCallback(() => {
    deadlineRef.current = null;
    setCompleted(0);
    setRemaining(INTERVAL_MS);
    setPhase("idle");
  }, []);

  return {
    phase,
    completed,
    remaining,
    start,
    continueNext: begin,
    stop,
    reset,
    active: phase === "running" || phase === "checkpoint",
  };
}

/** Branches where the timer is offered today. */
const INTROS: Record<string, string> = {
  drink:
    "Feeling the urge right now? You don't have to act on it. Let's give it 3 minutes.",
  bet: "Feeling the urge to bet right now? You don't have to act on it. Let's give it 3 minutes.",
  spiral:
    "Caught in it right now? You don't have to chase the next thought. Let's give it 3 minutes.",
};

export function urgeTimerIntro(doorwayId: string | undefined): string | undefined {
  return doorwayId ? INTROS[doorwayId] : undefined;
}

function clock(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 7) * 0.18}s`,
  color: ["var(--color-gold)", "var(--color-teal)", "var(--color-terracotta)"][i % 3],
}));

function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {CONFETTI.map((piece, i) => (
        <span
          key={i}
          className="absolute -top-2 h-2 w-1.5 rounded-sm confetti-fall"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
          }}
        />
      ))}
    </div>
  );
}

/** Full card, shown on the first question of a supported branch. */
export function UrgeTimer({
  timer,
  intro,
}: {
  timer: UrgeTimerState;
  intro: string;
}) {
  const minutes = timer.completed * 3;

  return (
    <section className="relative overflow-hidden rounded-xl border-2 border-terracotta/70 bg-terracotta/8 p-4 sm:p-5">
      {timer.phase === "complete" ? <Confetti /> : null}

      <p className="eyebrow text-terracotta">Sit with the urge</p>

      {timer.phase === "idle" || timer.phase === "stopped" ? (
        <>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground">
            {timer.phase === "stopped"
              ? "Whenever you want it, it's here. No pressure, and no score attached."
              : intro}
          </p>
          <button
            type="button"
            onClick={timer.start}
            className="mt-3.5 inline-flex h-11 w-full items-center justify-center rounded-full bg-terracotta px-5 text-sm font-medium text-terracotta-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            Sit With the Urge — 3 Minutes
          </button>
        </>
      ) : null}

      {timer.phase === "running" ? (
        <>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="numeral text-4xl text-terracotta sm:text-5xl">
              {clock(timer.remaining)}
            </span>
            <span className="text-xs text-olive-soft">
              interval {timer.completed + 1} of {TOTAL_INTERVALS}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-olive-soft">
            Nothing to do here. Breathe, notice it, keep answering the question below if you
            want to.
          </p>
          <button
            type="button"
            onClick={timer.stop}
            className="mt-3 text-xs text-olive-soft underline-offset-4 hover:underline"
          >
            Stop the timer
          </button>
        </>
      ) : null}

      {timer.phase === "checkpoint" ? (
        <>
          <p className="mt-1.5 font-display text-lg leading-snug">
            You made it {minutes} minutes. Can you sit with it for 3 more?
          </p>
          <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={timer.continueNext}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-terracotta px-5 text-sm font-medium text-terracotta-foreground transition-opacity hover:opacity-90"
            >
              Keep Going — 3 More Minutes
            </button>
            <button
              type="button"
              onClick={timer.stop}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-hairline bg-cream px-5 text-sm text-olive-soft transition-colors hover:border-terracotta/60 hover:text-foreground"
            >
              Stop here
            </button>
          </div>
        </>
      ) : null}

      {timer.phase === "complete" ? (
        <>
          <p className="mt-1.5 font-display text-xl leading-snug">
            12 minutes complete. You did something different this time.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            You gave yourself time to experience the urge without immediately acting on it.
            That's a first step toward changing the pattern.
          </p>
          <button
            type="button"
            onClick={timer.reset}
            className="mt-3 text-xs text-olive-soft underline-offset-4 hover:underline"
          >
            Close
          </button>
        </>
      ) : null}
    </section>
  );
}

/** Compact strip so a running timer stays visible on later questions. */
export function UrgeTimerStrip({ timer }: { timer: UrgeTimerState }) {
  if (!timer.active) return null;
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-terracotta/60 bg-terracotta/8 px-3 py-2">
      {timer.phase === "running" ? (
        <p className="text-sm text-foreground">
          <span className="numeral text-terracotta">{clock(timer.remaining)}</span>{" "}
          <span className="text-xs text-olive-soft">
            sitting with it — interval {timer.completed + 1} of {TOTAL_INTERVALS}
          </span>
        </p>
      ) : (
        <p className="text-sm text-foreground">
          You made it {timer.completed * 3} minutes. 3 more?
        </p>
      )}
      {timer.phase === "checkpoint" ? (
        <button
          type="button"
          onClick={timer.continueNext}
          className="shrink-0 rounded-full bg-terracotta px-3 py-1.5 text-xs font-medium text-terracotta-foreground"
        >
          Keep going
        </button>
      ) : (
        <button
          type="button"
          onClick={timer.stop}
          className="shrink-0 text-xs text-olive-soft underline-offset-4 hover:underline"
        >
          Stop
        </button>
      )}
    </div>
  );
}
