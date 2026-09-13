import { NUMBERS, type PatternResult } from "@/lib/gabriel";
import type { PersonalizedReflection as Reflection } from "@/lib/personalized-reflection";

interface PersonalizedReflectionProps {
  result: PatternResult;
  reflection: Reflection;
}

/** The complete visible result: identity plus one answer-grounded paragraph. */
export function PersonalizedReflection({ result, reflection }: PersonalizedReflectionProps) {
  return (
    <div className="card-cream p-5 sm:p-7">
      {result.primary ? (
        <div className="flex items-baseline gap-4">
          <span className="numeral text-6xl text-teal sm:text-7xl">{result.primary}</span>
          <h2 className="font-display text-xl leading-tight sm:text-2xl">
            {NUMBERS[result.primary].name}
          </h2>
        </div>
      ) : (
        <h2 className="font-display text-2xl leading-tight sm:text-3xl">Undetermined</h2>
      )}

      <p className="mt-5 text-base leading-relaxed text-foreground">{reflection.paragraph}</p>
    </div>
  );
}