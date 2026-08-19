import { getReadingPassageWithAnswers } from "./readingPassageBank.js";
import { bandForScore } from "./bandConversionTable.js";

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isCorrect(question, userAnswer) {
  const norm = normalize(userAnswer);
  if (!norm) return false;
  if (question.type === "short_answer") {
    const accepted = (question.acceptableAnswers ?? [question.correctAnswer]).map(normalize);
    return accepted.includes(norm);
  }
  return normalize(question.correctAnswer) === norm;
}

function scoreReadingAttempt({ passageId, answers }) {
  const passage = getReadingPassageWithAnswers(passageId);
  if (!passage) {
    const err = new Error("Passage not found");
    err.code = "PASSAGE_NOT_FOUND";
    throw err;
  }

  const questionResults = passage.questions.map((q) => {
    const userAnswer = answers?.[q.id] ?? "";
    return {
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: isCorrect(q, userAnswer),
    };
  });

  const correctCount = questionResults.filter((r) => r.isCorrect).length;
  const totalQuestions = passage.questions.length;

  return {
    passageId: passage.id,
    passageTitle: passage.title,
    correctCount,
    totalQuestions,
    overallBand: bandForScore(correctCount, totalQuestions),
    questionResults,
  };
}

function scoreReadingDrill({ passageId, questionType, answers }) {
  const passage = getReadingPassageWithAnswers(passageId);
  if (!passage) {
    const err = new Error("Passage not found");
    err.code = "PASSAGE_NOT_FOUND";
    throw err;
  }

  const questions = passage.questions.filter((q) => q.type === questionType);
  if (questions.length === 0) {
    const err = new Error("No questions of that type in this passage");
    err.code = "NO_QUESTIONS_OF_TYPE";
    throw err;
  }

  const questionResults = questions.map((q) => {
    const userAnswer = answers?.[q.id] ?? "";
    return {
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: isCorrect(q, userAnswer),
    };
  });

  const correctCount = questionResults.filter((r) => r.isCorrect).length;
  const totalQuestions = questions.length;

  return {
    passageId: passage.id,
    passageTitle: passage.title,
    questionType,
    correctCount,
    totalQuestions,
    overallBand: bandForScore(correctCount, totalQuestions),
    questionResults,
  };
}

export { scoreReadingAttempt, scoreReadingDrill };
