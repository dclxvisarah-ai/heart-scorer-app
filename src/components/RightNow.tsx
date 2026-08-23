/**
 * RIGHT NOW — optional immediate de-escalation tool inside THE FIRE.
 *
 * This is NOT a Gabriel Number calculation and NOT a scored assessment.
 * Nothing in this file is read by the engine: no evidence, no weights, no
 * thresholds, no result logic. Nothing typed here leaves component state.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Phase = "menu" | "rage" | "cooldown" | "needs" | "reflect" | "kids" | "good";

const RAGE_SECONDS = 60;
const COOLDOWN_SECONDS = 15;
const KIDS_SECONDS = 180;
const GOOD_SECONDS = 300;

/** Validation only. Never retaliation, never instruction, never analysis. */
const RAGE_LINES = [
  "THE FUCKING AUDACITY.",
  "Seriously? They did THAT to you?",
  "That was fucking disrespectful.",
  "You don't have to pretend you're okay right now.",
  "Yeah. You're fucking angry.",
  "You don't have to make sense of it yet.",
  "That fucking hurt.",
  "You didn't deserve that.",
  "You don't have to forgive anybody right now.",
  "Of course you're still thinking about it.",
  "You're allowed to be this angry.",
  "It wasn't fair. Full fucking stop.",
];

const IMPACT_MARKS = ["!", "#", "%", "?!", "×"];

const REFLECT_PROMPTS = [
  "What actually felt unfair about it?",
  "Where did it feel disrespectful?",
  "What did they cross that shouldn't have been crossed?",
  "What hurt more than you'd admit to anyone?",
  "What do you wish had happened instead?",
];

/** Kids: raw → light. Never a straight jump into a cheesy joke. */
const KIDS_STEPS = [
  { at: 0, text: "LOOK AT THEM.", sub: "Pick whichever way is easiest right now." },
  { at: 25, text: "Remember something ridiculous they did.", sub: "The stupid stuff counts." },
  { at: 70, text: "Something they did that made you laugh.", sub: "Even if you didn't want to laugh." },
  { at: 115, text: "Something you're proud of.", sub: "Small is fine." },
  { at: 150, text: "Something you want to remember about them.", sub: "That's it. That's the whole thing." },
];

const GOOD_STEPS = [
  { at: 0, text: "FIND SOMETHING THAT IS STILL FUCKING GOOD.", sub: "One thing. They don't have to be profound." },
  { at: 60, text: "Alright. Another one.", sub: "Doesn't have to be bigger than the first." },
  { at: 140, text: "One more.", sub: "Something small and ordinary is fine." },
  { at: 220, text: "One that has nothing to do with today.", sub: "Something that's just true." },
  { at: 275, text: "Last one. Anything.", sub: "Then you're done." },
];

const KIDS_OPTIONS = [
  "LOOK AT THEIR PHOTOS",
  "PICTURE THEM IN YOUR HEAD",
  "IMAGINE THEY COULD SEE YOU RIGHT NOW",
];

function fmt(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Single shared countdown. Stops cleanly on unmount or phase change. */
function useCountdown(seconds: number | null, onDone: () => void) {
  const [remaining, setRemaining] = useState(seconds ? seconds * 1000 : 0);
  const [running, setRunning] = useState(seconds !== null);
  const deadline = useRef<number | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const reset = useCallback(() => {
    if (seconds === null) return;
    setRemaining(seconds * 1000);
    deadline.current = Date.now() + seconds * 1000;
    setRunning(true);
  }, [seconds]);

  useEffect(() => {
    if (seconds === null) return;
    setRemaining(seconds * 1000);
    deadline.current = Date.now() + seconds * 1000;
    setRunning(true);
  }, [seconds]);

  useEffect(() => {
    if (!running || seconds === null) return;
    if (deadline.current === null) deadline.current = Date.now() + remaining;
    const tick = () => {
      const d = deadline.current;
      if (d === null) return;
      const left = d - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        deadline.current = null;
        doneRef.current();
        return;
      }
      setRemaining(left);
    };
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, seconds]);

  const pause = useCallback(() => {
    deadline.current = null;
    setRunning(false);
  }, []);
  const resume = useCallback(() => {
    deadline.current = Date.now() + remaining;
    setRunning(true);
  }, [remaining]);

  const total = seconds ? seconds * 1000 : 1;
  return { remaining, running, progress: 1 - remaining / total, reset, pause, resume };
}

export function RightNow({
  onExit,
  exitLabel = "Back to the Fire",
}: {
  onExit: () => void;
  exitLabel?: string;
}) {
  const [phase, setPhase] = useState<Phase>("menu");

  return (
    <section
      className={`card-cream animate-fade-in overflow-hidden p-5 transition-colors duration-700 sm:p-7 ${
        phase === "rage" ? "right-now-rage" : phase === "cooldown" ? "right-now-cooldown" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-terracotta">Right now</p>
          <h2 className="rule-gold font-display text-2xl leading-tight sm:text-3xl">
            {phase === "menu" ? "You don't have to hold it together." : "RIGHT NOW"}
          </h2>
        </div>
        <button type="button" onClick={onExit} className={ghostBtn}>
          ← {exitLabel}
        </button>
      </div>

      {phase === "menu" ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-olive-soft">
            Optional. Nothing here is scored and none of it touches your Gabriel Number. Use it as
            often as you want.
          </p>
          <MenuButtons onPick={setPhase} first />
        </>
      ) : null}

      {phase === "rage" ? (
        <Rage onDone={() => setPhase("cooldown")} onCancel={() => setPhase("menu")} />
      ) : null}

      {phase === "cooldown" ? <Cooldown onDone={() => setPhase("needs")} /> : null}

      {phase === "needs" ? (
        <>
          <p className="mt-4 font-display text-xl leading-snug sm:text-2xl">WHAT DO YOU NEED NOW?</p>
          <MenuButtons onPick={setPhase} />
        </>
      ) : null}

      {phase === "reflect" ? <Reflect onBack={() => setPhase("needs")} onExit={onExit} /> : null}

      {phase === "kids" ? (
        <Guided
          seconds={KIDS_SECONDS}
          steps={KIDS_STEPS}
          options={KIDS_OPTIONS}
          tone="warm"
          onDone={() => setPhase("needs")}
        />
      ) : null}

      {phase === "good" ? (
        <Guided
          seconds={GOOD_SECONDS}
          steps={GOOD_STEPS}
          tone="bright"
          onDone={() => setPhase("needs")}
        />
      ) : null}

      {phase !== "menu" && phase !== "rage" ? (
        <button type="button" onClick={() => setPhase("menu")} className="mt-6 w-full rounded-full border border-hairline bg-background/60 px-4 py-2.5 text-xs tracking-wide text-olive-soft uppercase transition-colors hover:border-teal/60 hover:text-foreground">
          Right Now menu
        </button>
      ) : null}
    </section>
  );
}

function MenuButtons({ onPick, first }: { onPick: (p: Phase) => void; first?: boolean }) {
  return (
    <div className="mt-5 flex flex-col gap-2.5">
      <button type="button" onClick={() => onPick("rage")} className={primaryBtn}>
        🔥 {first ? "LET THE FUCK OUT" : "LET THE FUCK OUT AGAIN"} — 1:00
      </button>
      <button type="button" onClick={() => onPick("reflect")} className={optionBtn}>
        🪞 REFLECT
      </button>
      <button type="button" onClick={() => onPick("kids")} className={optionBtn}>
        👦 TALK ABOUT MY KIDS — 3:00
      </button>
      <button type="button" onClick={() => onPick("good")} className={optionBtn}>
        ✨ FIND SOMETHING GOOD — 5:00
      </button>
    </div>
  );
}

/* ------------------------------- RAGE ---------------------------------- */

function Rage({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const timer = useCountdown(RAGE_SECONDS, onDone);
  const elapsed = RAGE_SECONDS * 1000 - timer.remaining;
  const line = RAGE_LINES[Math.floor(elapsed / 5000) % RAGE_LINES.length] ?? RAGE_LINES[0] ?? "Yeah. You're fucking angry.";

  return (
    <div className="relative mt-6 overflow-hidden rounded-xl px-2 py-5 sm:px-5">
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {IMPACT_MARKS.map((mark, i) => (
          <span
            key={`${mark}-${i}`}
            className={`rage-mark rage-mark-${i + 1} font-display font-black`}
          >
            {mark}
          </span>
        ))}
        <span className="rage-face" role="presentation">😡</span>
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <Gauge progress={timer.progress} label={fmt(timer.remaining)} intense />
        <p
          key={line}
          className="animate-fade-in mt-5 min-h-[4.5rem] text-center font-display text-2xl leading-tight text-terracotta sm:text-3xl"
        >
          {line}
        </p>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Nothing to type. Nothing to say. Just let it run.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={timer.running ? timer.pause : timer.resume} className={ghostBtn}>
          {timer.running ? "Pause" : "Resume"}
        </button>
        <button type="button" onClick={timer.reset} className={ghostBtn}>
          Restart
        </button>
        <button type="button" onClick={onCancel} className={ghostBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- COOLDOWN -------------------------------- */

function Cooldown({ onDone }: { onDone: () => void }) {
  const timer = useCountdown(COOLDOWN_SECONDS, onDone);
  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="cooldown-scene relative flex h-44 w-full max-w-sm items-end overflow-hidden rounded-xl border border-hairline bg-teal/5">
        <span aria-hidden className="cooldown-sun" />
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24 rounded-[50%] bg-teal/15 motion-reduce:animate-none"
            style={{
              animation: `settle-wave ${7 + i * 2}s ease-in-out ${i * 0.8}s infinite`,
              bottom: `${i * 10}px`,
            }}
          />
        ))}
        <span className="relative z-10 mx-auto mb-6 rounded-full bg-cream/80 px-4 py-1 font-display text-3xl tabular-nums text-teal backdrop-blur-sm">
          {fmt(timer.remaining)}
        </span>
      </div>
      <p className="mt-5 text-center font-display text-xl leading-snug sm:text-2xl">
        You might not feel better yet. That's okay.
      </p>
      <button type="button" onClick={onDone} className={`mt-5 ${ghostBtn}`}>
        Skip
      </button>
    </div>
  );
}

/* ------------------------------ REFLECT -------------------------------- */

function Reflect({ onBack, onExit }: { onBack: () => void; onExit: () => void }) {
  const [notes, setNotes] = useState<string[]>(() => REFLECT_PROMPTS.map(() => ""));
  return (
    <div className="mt-5">
      <p className="font-display text-xl leading-snug sm:text-2xl">
        What happened, in your own words.
      </p>
      <p className="mt-2 text-sm text-olive-soft">
        No timer. No number. Nobody reads this. Answer any of it, or none of it.
      </p>
      <div className="mt-5 flex flex-col gap-4">
        {REFLECT_PROMPTS.map((prompt, i) => (
          <label key={prompt} className="flex flex-col gap-2">
            <span className="text-sm text-foreground">{prompt}</span>
            <textarea
              value={notes[i]}
              onChange={(e) =>
                setNotes((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
              }
              rows={3}
              className="w-full resize-y rounded-xl border border-hairline bg-background/60 px-4 py-3 text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-teal/70"
              placeholder="Say it however it comes out."
            />
          </label>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Wherever this goes in your head, keep yourself and everyone else out of harm's way. You can
        be this angry without doing anything about it tonight.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={onBack} className={ghostBtn}>
          Back to Right Now
        </button>
        <button type="button" onClick={onExit} className={ghostBtn}>
          Back to the Fire
        </button>
      </div>
    </div>
  );
}

/* --------------------------- GUIDED SESSIONS --------------------------- */

type Step = { at: number; text: string; sub: string };

function Guided({
  seconds,
  steps,
  options,
  tone,
  onDone,
}: {
  seconds: number;
  steps: Step[];
  options?: string[];
  tone: "warm" | "bright";
  onDone: () => void;
}) {
  const timer = useCountdown(seconds, onDone);
  const elapsedSec = (seconds * 1000 - timer.remaining) / 1000;
  const step = useMemo<Step>(() => {
    let out: Step = steps[0] as Step;
    for (const s of steps) if (elapsedSec >= s.at) out = s;
    return out;
  }, [elapsedSec, steps]);

  return (
    <div className="mt-6 flex flex-col items-center">
      <div
        className={`flex w-full flex-col items-center rounded-xl border border-hairline p-5 ${
          tone === "warm" ? "bg-gold/10" : "bg-teal/5"
        }`}
      >
        <Gauge progress={timer.progress} label={fmt(timer.remaining)} tone={tone} />
        <p
          key={step.text}
          className="animate-fade-in mt-5 text-center font-display text-2xl leading-tight sm:text-3xl"
        >
          {step.text}
        </p>
        <p className="mt-2 text-center text-sm text-olive-soft">{step.sub}</p>
        {options && elapsedSec < 25 ? (
          <ul className="mt-4 flex flex-col items-center gap-1.5 text-sm text-olive-soft">
            {options.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={timer.running ? timer.pause : timer.resume} className={ghostBtn}>
          {timer.running ? "Pause" : "Resume"}
        </button>
        <button type="button" onClick={timer.reset} className={ghostBtn}>
          Restart
        </button>
        <button type="button" onClick={onDone} className={ghostBtn}>
          Skip
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- UI ---------------------------------- */

const primaryBtn =
  "rounded-xl border border-terracotta/70 bg-terracotta/10 px-4 py-4 text-left font-display text-lg tracking-wide text-foreground transition-colors hover:bg-terracotta/20";
const optionBtn =
  "rounded-xl border border-hairline bg-background/50 px-4 py-3.5 text-left text-sm tracking-wide text-foreground transition-colors hover:border-teal/60 hover:bg-teal/5 sm:text-base";
const ghostBtn =
  "shrink-0 rounded-full border border-hairline bg-background/60 px-3.5 py-2 text-xs tracking-wide text-olive-soft uppercase transition-colors hover:border-teal/60 hover:text-foreground";

function Gauge({
  progress,
  label,
  intense,
  tone,
}: {
  progress: number;
  label: string;
  intense?: boolean;
  tone?: "warm" | "bright";
}) {
  const r = 76;
  const c = 2 * Math.PI * r;
  const stroke = intense ? "text-terracotta" : tone === "warm" ? "text-gold" : "text-teal";
  return (
    <div className="relative" role="timer" aria-live="off" aria-label={`Time remaining ${label}`}>
      {intense ? (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-terracotta/20 motion-reduce:animate-none"
          style={{ animation: "impact-pulse 1.1s ease-in-out infinite" }}
        />
      ) : null}
      <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden>
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-cream-deep"
        />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className={`${stroke} transition-[stroke-dashoffset] duration-200`}
          strokeDasharray={c}
          strokeDashoffset={c * Math.min(1, Math.max(0, progress))}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-4xl tabular-nums sm:text-5xl">
        {label}
      </span>
    </div>
  );
}
