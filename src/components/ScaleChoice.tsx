import { SCALE_VALUES, type ScaleValue } from "@/lib/evaluator";

interface ScaleChoiceProps {
  value: ScaleValue | undefined;
  onChange: (value: ScaleValue) => void;
  labels: Record<ScaleValue, string>;
  /** Accessible group label. */
  name: string;
  /** Show the full label under each number rather than only at the ends. */
  variant?: "compact" | "expanded";
}

/**
 * The 1–5 rating control used for both the initial "by feel" reading and
 * every evaluation question. Radio semantics, large touch targets.
 */
export function ScaleChoice({
  value,
  onChange,
  labels,
  name,
  variant = "compact",
}: ScaleChoiceProps) {
  if (variant === "expanded") {
    return (
      <div role="radiogroup" aria-label={name} className="flex flex-col gap-2">
        {SCALE_VALUES.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-teal bg-teal/10 text-foreground"
                  : "border-hairline bg-background/40 text-muted-foreground hover:border-teal/50 hover:text-foreground"
              }`}
            >
              <span
                className={`numeral flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${
                  selected ? "bg-teal text-teal-foreground" : "bg-cream-deep text-olive-soft"
                }`}
              >
                {option}
              </span>
              <span className="text-sm sm:text-base">{labels[option]}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div role="radiogroup" aria-label={name} className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {SCALE_VALUES.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${option} — ${labels[option]}`}
              onClick={() => onChange(option)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-3 transition-colors ${
                selected
                  ? "border-teal bg-teal/10"
                  : "border-hairline bg-background/40 hover:border-teal/50"
              }`}
            >
              <span
                className={`numeral flex h-9 w-9 items-center justify-center rounded-full text-base ${
                  selected ? "bg-teal text-teal-foreground" : "bg-cream-deep text-olive-soft"
                }`}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{labels[1]}</span>
        <span>{labels[5]}</span>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-center text-sm text-foreground">
        {value ? labels[value] : ""}
      </p>
    </div>
  );
}
