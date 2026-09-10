# Internal design note — future visual for the hidden semantic map

> Not shown in the app. Internal architecture/planning only.
> Status: open. No final visualization chosen yet.

## Context

The Relational State layer derives active semantic territories and
evidence-supported relationships from the user's real answers. The
internal semantic vocabulary/lexicon (`TERRITORIES` vocabulary arrays in
`src/lib/relational-state.ts`) and the role-based connection rules
(leading vs supporting, single-answer-carries-both, vocabulary-overlap-
is-never-proof) are **proprietary architecture** and must never be shown
to the user.

As of this change, the user-facing Relational State panel shows only:
- the coordinate label (e.g. "2 Duality × 3 Pattern × 5 Discernment")
- active territories with their structural question and quoted answers
- evidence-supported relationships in plain language (when warranted)
- resolution status (resolved / partially resolved / unresolved)

It no longer shows:
- the vocabulary word list / "Vocabulary field" heading
- the "active side by side but not connected" unsupported-pairs disclosure
- the "shared vocabulary doesn't count" explanatory sentence
- per-snippet role labels (leading / underneath)

## Goal

Eventually replace the now-hidden internals with a single visual that
ties the whole result page together and communicates the **resulting
relational structure** — which territories are active, which are
connected, and the resolution status — **without exposing**:

- the underlying vocabulary/lexicon
- the role rules used to derive a connection
- the unsupported-pair / vocabulary-overlap test logic

## Candidate forms (not chosen yet)

To be evaluated against research, not picked here:

- Venn-style overlap diagram (territories as sets, intersections as
  evidence-supported connections; non-intersecting sets = active but
  unconnected)
- Network / node-link graph (territories as nodes, supported
  relationships as edges; edge weight could reflect strength without
  revealing the role rule)
- Tree-like / Tree-of-Life-inspired layout (kept strictly as a visual
  metaphor; must not falsely present Gabriel's nine as identical to the
  traditional ten-sefirot Tree)
- A single composed image / illustration
- A restrained abstract container (overlapping translucent shapes)

## Constraints for whichever form is chosen

1. Communicates relational structure (active, connected, resolution)
   at a glance.
2. Never labels or lists the internal vocabulary terms.
3. Never reveals the connection-derivation rule (leading/underneath,
   single-answer-carries-both, vocabulary-overlap rejection).
4. Works when Gabriel's Number is Undetermined (relational state can
   still exist).
5. Does not alter scoring, evidence weights, or relational inference —
   visual layer only, fed by the existing `RelationalState` output.
6. Visually consistent with the warm off-white / cream / olive /
   teal-gold direction; does not clash with the existing result page.

## Next step (not started)

Research + a separate design pass to select one form and prototype it.
No code change authorized in this task.
