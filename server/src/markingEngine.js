/**
 * Shared marking logic for Reading and Listening (previously duplicated,
 * near-verbatim, in scoreReading.js and scoreListening.js). Built out
 * against a rubric of real IELTS marking behavior:
 *
 *   - 1 mark per correct answer, no negative marking
 *   - Word limits enforced: exceeding one is wrong even if the content is
 *     right
 *   - Misspellings marked wrong (this is intentionally strict — spelling
 *     variants below are dialect equivalents, e.g. colour/color, not a
 *     typo-tolerance feature)
 *   - British and American spelling both accepted
 *   - Case-insensitive, whitespace-normalized matching
 *   - Numbers accepted as digits or words
 *   - Answer keys support optional words, e.g. "(the) museum" accepts both
 *     "the museum" and "museum"
 *   - Wrong singular/plural is NOT auto-forgiven — when a plural genuinely
 *     changes the answer, the exam marks it wrong, so this deliberately
 *     does not fuzz singular/plural. If both forms are genuinely
 *     acceptable for a specific question, list both explicitly in that
 *     question's acceptableAnswers.
 */

// Common British/American spelling pairs likely to show up in short-answer
// completion questions. Not exhaustive — add pairs here as real content
// authoring surfaces a need, rather than trying to enumerate every English
// spelling variant up front.
const SPELLING_PAIRS = [
  ["colour", "color"],
  ["favourite", "favorite"],
  ["neighbour", "neighbor"],
  ["honour", "honor"],
  ["labour", "labor"],
  ["centre", "center"],
  ["theatre", "theater"],
  ["metre", "meter"],
  ["litre", "liter"],
  ["fibre", "fiber"],
  ["organise", "organize"],
  ["organised", "organized"],
  ["organisation", "organization"],
  ["realise", "realize"],
  ["realised", "realized"],
  ["recognise", "recognize"],
  ["analyse", "analyze"],
  ["analysed", "analyzed"],
  ["apologise", "apologize"],
  ["programme", "program"],
  ["travelling", "traveling"],
  ["traveller", "traveler"],
  ["cancelled", "canceled"],
  ["labelled", "labeled"],
  ["modelling", "modeling"],
  ["practise", "practice"],
  ["licence", "license"],
  ["defence", "defense"],
  ["offence", "offense"],
  ["catalogue", "catalog"],
  ["dialogue", "dialog"],
  ["grey", "gray"],
  ["jewellery", "jewelry"],
  ["mould", "mold"],
  ["cheque", "check"],
];

const WORD_TO_NUMBER = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90, hundred: 100,
};
const NUMBER_TO_WORD = Object.fromEntries(Object.entries(WORD_TO_NUMBER).map(([w, n]) => [n, w]));

// "ONE" through "SIX" is the realistic range for IELTS completion word
// limits ("NO MORE THAN THREE WORDS", etc.) — anything else falls through
// to "don't enforce" rather than guessing.
const LIMIT_WORD_TO_COUNT = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function countWords(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

// "NO MORE THAN THREE WORDS", "NO MORE THAN TWO WORDS AND/OR A NUMBER",
// "ONE WORD ONLY" -> 3, 2, 1. A number ("AND/OR A NUMBER") counts as one
// word for this purpose, same as the real exam. Returns null (don't
// enforce) if the text doesn't match a recognized pattern, rather than
// guessing wrong and rejecting a valid answer.
function parseMaxWords(wordLimitText) {
  if (!wordLimitText) return null;
  const match = String(wordLimitText)
    .toLowerCase()
    .match(/\b(one|two|three|four|five|six)\s+words?\b/);
  return match ? LIMIT_WORD_TO_COUNT[match[1]] : null;
}

// "(the) museum" -> ["the museum", "museum"]. Only one bracketed group is
// realistic for this app's content; expand it in both directions rather
// than requiring authors to spell out both forms by hand.
function expandOptionalWords(answer) {
  if (!/\([^)]*\)/.test(answer)) return [answer];
  const withWord = answer.replace(/[()]/g, "");
  const withoutWord = answer.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  return [withWord, withoutWord];
}

function expandSpellingVariants(answer) {
  const variants = new Set([answer]);
  for (const [uk, us] of SPELLING_PAIRS) {
    for (const existing of [...variants]) {
      if (existing.includes(uk)) variants.add(existing.split(uk).join(us));
      if (existing.includes(us)) variants.add(existing.split(us).join(uk));
    }
  }
  return [...variants];
}

// Only handles the case where the whole answer is a single number, spelled
// out or as digits (e.g. "20" <-> "twenty") — deliberately not attempting
// to parse numbers embedded in a longer phrase, where the ambiguity risk
// is higher than the benefit.
function expandNumberVariants(answer) {
  const variants = new Set([answer]);
  if (/^\d+$/.test(answer) && Number(answer) in NUMBER_TO_WORD) {
    variants.add(NUMBER_TO_WORD[Number(answer)]);
  } else if (answer in WORD_TO_NUMBER) {
    variants.add(String(WORD_TO_NUMBER[answer]));
  }
  return [...variants];
}

// Full accepted-answer set for a short-answer question: every explicitly
// authored acceptableAnswer (or correctAnswer, if that's all a question
// has), each expanded through optional-words, spelling, and number
// equivalents, normalized and deduplicated.
function buildAcceptedAnswerSet(question) {
  const authored = question.acceptableAnswers ?? [question.correctAnswer];
  const expanded = new Set();
  for (const answer of authored) {
    for (const withOptional of expandOptionalWords(answer)) {
      for (const withSpelling of expandSpellingVariants(withOptional)) {
        for (const withNumber of expandNumberVariants(withSpelling)) {
          expanded.add(normalize(withNumber));
        }
      }
    }
  }
  return expanded;
}

function isCorrect(question, userAnswer) {
  const norm = normalize(userAnswer);
  if (!norm) return false;

  if (question.type === "short_answer") {
    const maxWords = parseMaxWords(question.wordLimit);
    if (maxWords !== null && countWords(userAnswer) > maxWords) return false;
    return buildAcceptedAnswerSet(question).has(norm);
  }

  // Fixed-option types (multiple choice, true/false/not given,
  // yes/no/not given) — exact match against the single correct option,
  // no expansion needed.
  return normalize(question.correctAnswer) === norm;
}

export { normalize, countWords, parseMaxWords, isCorrect };
