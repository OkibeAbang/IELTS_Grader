/**
 * Approximate IELTS raw-score (out of 40) -> band conversion, shared by
 * Reading and Listening scoring (both use the same 40-question, 9-band
 * scale). Real IELTS boundaries vary slightly test-to-test and slightly
 * between the Reading and Listening papers themselves — this is a commonly
 * published approximation, not an official Cambridge/IDP table. Treat it as
 * a study aid, not a certified conversion, same spirit as rubric.js's
 * disclaimer.
 */
const BAND_TABLE_OUT_OF_40 = [
  { min: 39, max: 40, band: 9 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8 },
  { min: 33, max: 34, band: 7.5 },
  { min: 30, max: 32, band: 7 },
  { min: 27, max: 29, band: 6.5 },
  { min: 23, max: 26, band: 6 },
  { min: 19, max: 22, band: 5.5 },
  { min: 15, max: 18, band: 5 },
  { min: 13, max: 14, band: 4.5 },
  { min: 11, max: 12, band: 4 },
  { min: 9, max: 10, band: 3.5 },
  { min: 6, max: 8, band: 3 },
  { min: 4, max: 5, band: 2.5 },
  { min: 0, max: 3, band: 2 },
];

function bandForRawScoreOutOf40(rawScore) {
  const entry = BAND_TABLE_OUT_OF_40.find((e) => rawScore >= e.min && rawScore <= e.max);
  return entry ? entry.band : 2;
}

/**
 * Content banks won't always have exactly 40 questions (v1's seed passage/
 * section each have 12) — real IELTS always does, across 3-4 passages/
 * sections. Rather than hand-author a separate table per question count,
 * scale the raw score onto the standard 40-question scale before lookup,
 * so this table stays valid unmodified as more content is added later.
 */
function bandForScore(correctCount, totalQuestions) {
  if (totalQuestions <= 0) return 2;
  const scaled = Math.round((correctCount / totalQuestions) * 40);
  return bandForRawScoreOutOf40(scaled);
}

export { BAND_TABLE_OUT_OF_40, bandForRawScoreOutOf40, bandForScore };
