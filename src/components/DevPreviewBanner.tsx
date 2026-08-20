/**
 * Temporary development-warning banner.
 *
 * Presentation-only: a prominent red strip at the very top of the home
 * page. Isolated UI we will remove later. Does not touch branch logic,
 * questions, scoring, framework, or result calculations.
 */
export function DevPreviewBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full border-b-2 border-red-700/60 bg-red-600 px-4 py-3 sm:py-3.5"
    >
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-center text-sm font-bold uppercase tracking-wide text-white sm:text-base">
          ⚠️ THIS SITE IS TEMPORARILY UNDER CONSTRUCTION AND DEVELOPMENT.
        </p>
        <p className="mt-1 text-center text-xs leading-snug text-red-50 sm:text-[13px]">
          This preview is still being built and tested. Content, branches,
          scoring, and results may change.
        </p>
      </div>
    </div>
  );
}
