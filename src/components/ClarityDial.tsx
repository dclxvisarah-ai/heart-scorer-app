/**
 * Semicircular 1–5 clarity gauge with a pointer.
 *
 * Used interactively for the initial felt reading and read-only for the
 * evaluated result.
 */

import { SCALE, type ScaleValue } from "../lib/evaluator";

interface ClarityDialProps {
  /** Selected / displayed value. May be fractional in read-only mode. */
  value?: number | undefined;
  onChange?: ((value: ScaleValue) => void) | undefined;
  label?: string | undefined;
  tone?: "teal" | "terracotta" | undefined;
}

const RADIUS = 78;
const CENTER_X = 100;
const CENTER_Y = 92;

function pointOnArc(fraction: number, radius: number) {
  const angle = Math.PI * (1 - Math.min(Math.max(fraction, 0), 1));
  return {
    x: CENTER_X + radius * Math.cos(angle),
    y: CENTER_Y - radius * Math.sin(angle),
  };
}

export function ClarityDial({ value, onChange, label, tone = "teal" }: ClarityDialProps) {
  const fraction = value === undefined ? undefined : (value - 1) / 4;
  const stroke = tone === "teal" ? "var(--color-teal)" : "var(--color-terracotta)";
  const start = pointOnArc(0, RADIUS);
  const end = pointOnArc(1, RADIUS);
  const pointer = fraction === undefined ? undefined : pointOnArc(fraction, RADIUS - 6);
  const progressEnd = fraction === undefined ? undefined : pointOnArc(fraction, RADIUS);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 200 108"
        className="w-full max-w-[19rem]"
        role="img"
        aria-label={
          value === undefined ? "Clarity dial, nothing selected" : `Clarity dial at ${value} of 5`
        }
      >
        <path
          d={`M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {progressEnd && fraction !== undefined && fraction > 0 ? (
          <path
            d={`M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${progressEnd.x} ${progressEnd.y}`}
            fill="none"
            stroke={stroke}
            strokeWidth={10}
            strokeLinecap="round"
          />
        ) : null}

        {SCALE.map((step) => {
          const tick = pointOnArc((step - 1) / 4, RADIUS - 20);
          return (
            <text
              key={step}
              x={tick.x}
              y={tick.y + 4}
              textAnchor="middle"
              className="numeral"
              fontSize="11"
              fill="var(--color-olive-soft)"
            >
              {step}
            </text>
          );
        })}

        {pointer ? (
          <>
            <line
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={pointer.x}
              y2={pointer.y}
              stroke={stroke}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <circle cx={CENTER_X} cy={CENTER_Y} r={5} fill={stroke} />
          </>
        ) : (
          <circle cx={CENTER_X} cy={CENTER_Y} r={5} fill="var(--color-hairline)" />
        )}
      </svg>

      <div className="-mt-3 text-center">
        <div className="numeral text-5xl text-olive">
          {value === undefined ? "—" : value}
        </div>
        {label ? <p className="mt-2 eyebrow">{label}</p> : null}
      </div>

      {onChange ? (
        <div className="mt-6 flex w-full max-w-sm items-center justify-center gap-2">
          {SCALE.map((step) => {
            const active = value === step;
            return (
              <button
                key={step}
                type="button"
                onClick={() => onChange(step)}
                aria-pressed={active}
                className={[
                  "numeral h-12 w-12 rounded-full border text-lg transition-colors",
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
      ) : null}
    </div>
  );
}
