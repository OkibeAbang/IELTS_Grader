/**
 * Few-shot calibration examples for the grading prompt (README section 4.4).
 *
 * NOTE: These are illustrative placeholders, not verbatim official IELTS sample
 * essays — reproducing real copyrighted exam materials here would risk both
 * copyright issues and inaccurate/fabricated "official" scores. For real
 * calibration, replace these with essays + band scores you source yourself from
 * an official British Council/IDP/Cambridge practice book (section 4.4 of the
 * README explains why this matters: it anchors the model's scale and reduces
 * grade inflation). Keep 2-3 examples spanning a low-6 to high-7 range, since
 * that's where models most often drift.
 */

const TASK2_FEWSHOT = [];

const TASK1_FEWSHOT = [];

function renderFewShotText(taskType) {
  const examples = taskType === "task1" ? TASK1_FEWSHOT : TASK2_FEWSHOT;
  if (examples.length === 0) return "";

  const rendered = examples
    .map(
      (ex, i) => `Example ${i + 1} (real scored essay, overall band ${ex.overallBand}):
Prompt: ${ex.prompt}
Essay: ${ex.essay}
Examiner scores: ${JSON.stringify(ex.criteriaBands)}
Examiner comments: ${ex.comments}`
    )
    .join("\n\n");

  return `\n\n## Calibration examples\n${rendered}\n`;
}

export { TASK1_FEWSHOT, TASK2_FEWSHOT, renderFewShotText };
