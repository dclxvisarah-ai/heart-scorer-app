/**
 * Small tap controls for the general evaluation: a 1–5 pill scale and an
 * option-pill group for categorical answers.
 */

import { SCALE, type ScaleValue } from "../lib/evaluator";

interface ScaleChoiceProps {
  label: string;
  hint?: string | undefined;
  lowLabel?: string | undefined;
  highLabel?: string | undefined;
  value?: ScaleValue | undefined;
  onChange: (value: ScaleValue) => void;
}

export function ScaleChoice({
  label,
  hint,
  lowLabel,
  highLabel,
  value,
  onChange,
}: ScaleChoiceProps) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="text-[0.9375rem] font-medium text-olive">{label}</legend>
      {hint ? <p className="mt-1 text-[0.8125rem] text-muted-foreground">{hint}</p> : null}
      <div className="mt-3 flex items-center gap-2">
        {SCALE.map((step) => {
          const active = value === step;
          return (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              aria-pressed={active}
              aria-label={`${label}: ${step}`}
              className={[
                "numeral h-11 flex-1 rounded-xl border text-base transition-colors",
                active
                  ? "border-teal bg-teal text-teal-foreground"
                  : "border-hairline bg-cream text-olive hover:bg-cream-deep",
              ].join(" ")}
            >
              {step}
            </button>
          );
        })}
      </div>
      {lowLabel || highLabel ? (
        <div className="mt-2 flex justify-between text-[0.75rem] text-muted-foreground">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      ) : null}
    </fieldset>
  );
}

interface OptionChoiceProps<T extends string> {
  label: string;
  hint?: string | undefined;
  options: readonly T[];
  value?: T | undefined;
  onChange: (value: T) => void;
}

export function OptionChoice<T extends string>({
  label,
  hint,
  options,
  value,
  onChange,
}: OptionChoiceProps<T>) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="text-[0.9375rem] font-medium text-olive">{label}</legend>
      {hint ? <p className="mt-1 text-[0.8125rem] text-muted-foreground">{hint}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={active}
              className={[
                "rounded-full border px-4 py-2 text-[0.875rem] transition-colors",
                active
                  ? "border-teal bg-teal text-teal-foreground"
                  : "border-hairline bg-cream text-olive hover:bg-cream-deep",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
