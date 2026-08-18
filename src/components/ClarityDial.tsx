import { useEffect, useState } from "react";

interface ClarityDialProps {
  /** Value on the 1–5 scale. */
  value: number;
  /** Caption under the numeral. */
  caption?: string;
  /** Accent ring color. */
  tone?: "teal" | "terracotta" | "gold";
  size?: "md" | "lg";
  /** Animate the sweep on mount. */
  animate?: boolean;
}

const TONE_STROKE: Record<NonNullable<ClarityDialProps["tone"]>, string> = {
  teal: "var(--color-teal)",
  terracotta: "var(--color-terracotta)",
  gold: "var(--color-gold)",
};

/**
 * Dial treatment for the provisional clarity figure: an open arc on cream,
 * with the number set in the display face.
 */
export function ClarityDial({
  value,
  caption,
  tone = "teal",
  size = "lg",
  animate = true,
}: ClarityDialProps) {
  const [shown, setShown] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate) {
      setShown(value);
      return;
    }
    const frame = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(frame);
  }, [value, animate]);

  // Arc spans 240 degrees, from -210deg to +30deg.
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 240 / 360;
  const arcLength = circumference * arcFraction;
  const clamped = Math.min(5, Math.max(1, shown));
  const progress = (clamped - 1) / 4;

  const px = size === "lg" ? "h-44 w-44 sm:h-52 sm:w-52" : "h-28 w-28";

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${px}`}>
        {/* Rotated so the 120deg opening in the arc is centred at the bottom. */}
        <svg viewBox="0 0 128 128" className="h-full w-full rotate-[150deg]">

          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="var(--color-cream-deep)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={TONE_STROKE[tone]}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${arcLength * progress} ${circumference}`}
            style={{ transition: "stroke-dasharray 1.1s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`numeral text-foreground ${size === "lg" ? "text-5xl sm:text-6xl" : "text-2xl"}`}
          >
            {value.toFixed(1)}
          </span>
          <span className="mt-1 text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase">
            of 5
          </span>
        </div>
      </div>
      {caption ? (
        <p className="mt-3 max-w-[16rem] text-center text-sm text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  );
}
