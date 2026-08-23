/**
 * THE FIRE — optional "RIGHT NOW" release panel.
 *
 * Pressure release only. Nothing here is scored, saved, or read by the
 * Gabriel Number engine: no evidence, no weights, no thresholds, no result
 * logic. Text typed here never leaves component state.
 */
import { useCallback, useEffect, useRef, useState } from "react";

type SessionKey = "out" | "kids" | "good";

type Session = {
  key: SessionKey;
  seconds: number;
  heading: string;
  prompt: string;
  cues?: string[];
  placeholder: string;
};

const SESSIONS: Record<SessionKey, Session> = {
  out: {
    key: "out",
    seconds: 60,
    heading: "ONE MINUTE",
    prompt: "Say/write whatever the fuck you need to say.",
    cues: ["No analysis. No advice. No judgment."],
    placeholder: "Start typing. Nobody is reading this.",
  },
  kids: {
    key: "kids",
    seconds: 180,
    heading: "THREE MINUTES. TELL ME ABOUT YOUR KIDS.",
    prompt: "Whatever comes up first.",
    cues: [
      "The funny shit.",
      "Something they do that makes you laugh.",
      "Something you're proud of.",
      "Something you want to remember.",
    ],
    placeholder: "Tell me about them.",
  },
  good: {
    key: "good",
    seconds: 300,
    heading: "FIVE MINUTES. FIND FIVE THINGS THAT ARE STILL FUCKING GOOD.",
    prompt: "They don't have to be profound.",
    placeholder: "1.",
  },
};

function fmt(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function FireRelease({ onSkip }: { onSkip: () => void }) {
  const [active, setActive] = useState<SessionKey | null>(null);
  const [done, setDone] = useState<SessionKey | null>(null);
  const [text, setText] = useState("");
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const deadlineRef = useRef<number | null>(null);

  const session = active ? SESSIONS[active] : null;

  const begin = useCallback((key: SessionKey) => {
    setDone(null);
    setActive(key);
    setText("");
    setRemaining(SESSIONS[key].seconds * 1000);
    deadlineRef.current = Date.now() + SESSIONS[key].seconds * 1000;
    setRunning(true);
  }, []);

  const cancel = useCallback(() => {
    deadlineRef.current = null;
    setRunning(false);
    setActive(null);
    setDone(null);
    setText("");
  }, []);

  // Stops cleanly on unmount so a timer can never keep running after the
  // person moves on to the investigation.
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const left = deadline - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        deadlineRef.current = null;
        setDone(active);
        return;
      }
      setRemaining(left);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [running, active]);

  const total = session ? session.seconds * 1000 : 1;
  const progress = session ? 1 - remaining / total : 0;

  return (
    <section className="card-cream animate-fade-in overflow-hidden p-5 sm:p-7">
      <p className="eyebrow text-terracotta">Right now</p>
      <h2 className="rule-gold font-display text-2xl leading-tight sm:text-3xl">
        Need to burn some of this off first?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-olive-soft">
        Optional. Nothing here is scored and none of it touches your Gabriel Number.
      </p>

      {session && !done ? (
        <div className="mt-6">
          <div className="flex flex-col items-center">
            <Gauge progress={progress} label={fmt(remaining)} />
            <p className="mt-3 text-center font-display text-lg leading-snug sm:text-xl">
              {session.heading}
            </p>
            <p className="mt-1 text-center text-sm text-olive-soft">{session.prompt}</p>
            {session.cues ? (
              <ul className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {session.cues.map((cue) => (
                  <li key={cue}>{cue}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <label className="sr-only" htmlFor="fire-release-text">
            {session.heading}
          </label>
          <textarea
            id="fire-release-text"
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={session.placeholder}
            rows={7}
            className="mt-5 w-full resize-y rounded-xl border border-hairline bg-background/60 px-4 py-3 text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-teal/70"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setRunning((r) => !r)} className={ghostBtn}>
              {running ? "Pause" : "Resume"}
            </button>
            <button type="button" onClick={() => begin(session.key)} className={ghostBtn}>
              Restart
            </button>
            <button type="button" onClick={cancel} className={ghostBtn}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {done ? (
        <div className="mt-6">
          <p className="font-display text-2xl leading-tight sm:text-3xl">
            TIME. You got it out.
          </p>
          <p className="mt-2 text-sm text-olive-soft">
            Take another one, or go straight into it. Your call.
          </p>
          <div className="mt-5 flex flex-col gap-2.5">
            <button type="button" onClick={() => begin(done)} className={primaryBtn}>
              DO IT AGAIN
            </button>
            <button type="button" onClick={() => begin("kids")} className={optionBtn}>
              TALK ABOUT MY KIDS — 3:00
            </button>
            <button type="button" onClick={() => begin("good")} className={optionBtn}>
              FIND FIVE GOOD THINGS — 5:00
            </button>
            <button type="button" onClick={onSkip} className={optionBtn}>
              GO BACK TO THE FIRE
            </button>
          </div>
        </div>
      ) : null}

      {!session && !done ? (
        <div className="mt-6 flex flex-col gap-2.5">
          <button type="button" onClick={() => begin("out")} className={primaryBtn}>
            LET IT THE FUCK OUT — 1:00
          </button>
          <button type="button" onClick={() => begin("kids")} className={optionBtn}>
            TALK ABOUT MY KIDS — 3:00
          </button>
          <button type="button" onClick={() => begin("good")} className={optionBtn}>
            FIND FIVE GOOD THINGS — 5:00
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onSkip}
        className="mt-6 w-full rounded-full border border-hairline bg-background/60 px-4 py-2.5 text-xs tracking-wide text-olive-soft uppercase transition-colors hover:border-teal/60 hover:text-foreground"
      >
        Skip — go to the Fire
      </button>
    </section>
  );
}

const primaryBtn =
  "rounded-xl border border-terracotta/70 bg-terracotta/10 px-4 py-4 text-left font-display text-lg tracking-wide text-foreground transition-colors hover:bg-terracotta/20";
const optionBtn =
  "rounded-xl border border-hairline bg-background/50 px-4 py-3.5 text-left text-sm tracking-wide text-foreground transition-colors hover:border-teal/60 hover:bg-teal/5 sm:text-base";
const ghostBtn =
  "rounded-full border border-hairline bg-background/60 px-4 py-2 text-xs tracking-wide text-olive-soft uppercase transition-colors hover:border-teal/60 hover:text-foreground";

function Gauge({ progress, label }: { progress: number; label: string }) {
  const r = 76;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative"
      role="timer"
      aria-live="off"
      aria-label={`Time remaining ${label}`}
    >
      <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden>
        <circle cx="90" cy="90" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-cream-deep" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className="text-terracotta transition-[stroke-dashoffset] duration-200"
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
