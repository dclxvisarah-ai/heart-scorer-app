# One personalized result reflection

## Goal
Replace the separate Deep Reading and Relational State displays with one restrained result: the Gabriel Number and plain-English name, followed by exactly one paragraph grounded in that person’s selected answers. Undetermined uses the same format with “Undetermined” in place of a number and name.

## Changes

### Build one reflection from existing evidence
- Add a focused reflection builder that reads the already-computed result, the person’s recorded answer contributions/evidence snippets, and the existing relational state.
- Produce one paragraph rather than separate lead, support, companion, territory, relationship, vocabulary, and question sections.
- Weave recognizable language from the person’s actual selected answers into the reflection without exposing internal weights, territory numbers, semantic vocabulary, or “leading/underneath” roles.
- End each paragraph in exactly one of two ways: one open question, or one short declarative truth. Never append both, and never stack multiple questions.
- Preserve the approved Number formulations as interpretive guidance, including the Number 9 bridge-question requirement, while making the delivered paragraph specific to the answers.

### Replace the result presentation
- Replace `DeepReadingPanel` and `RelationalStatePanel` on every branch with a single personalized reflection component.
- The component contains only:
  - the Gabriel Number and plain-English name, or “Undetermined”;
  - one personalized reflection paragraph.
- Remove the separate result sections for reasoning/contributions, supporting patterns, and the framing note so no explanatory material appears beyond that paragraph.
- Keep only navigation actions beneath the reflection: back, restart/try another question, and past readings.
- For Undetermined, remove the current multi-block explanation and deeper-probe offer from the result screen; show “Undetermined” plus one personalized paragraph and the same navigation actions.

### Preserve protected logic
- Do not change the evaluator, Number meanings, evidence, thresholds, question graph, territory derivation, relationship derivation, answer history, or branch behavior.
- Keep the relational layer available internally as an input to reflection writing; only its visible panel is removed.
- Do not alter how answers are gathered or how results are saved.

## Verification
- Add focused tests proving the reflection is deterministic, uses selected-answer language, contains one paragraph, and ends with either one question or one declarative statement—not both.
- Cover a resolved result, a multi-territory result, Number 9, and Undetermined.
- Confirm forbidden visible material is absent: territory coordinates/numbers, semantic vocabulary lists, role labels, stacked questions, canned supporting sections, and both former panels.
- Run the relevant tests and full test suite, then verify the result flow in the browser on mobile and desktop, including one resolved branch and one Undetermined path.
