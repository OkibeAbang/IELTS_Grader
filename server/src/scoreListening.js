import { getListeningSectionWithAnswers } from "./listeningPassageBank.js";
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

function scoreListeningAttempt({ sectionId, answers }) {
  const section = getListeningSectionWithAnswers(sectionId);
  if (!section) {
    const err = new Error("Section not found");
    err.code = "SECTION_NOT_FOUND";
    throw err;
  }

  const questionResults = section.questions.map((q) => {
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
  const totalQuestions = section.questions.length;

  return {
    sectionId: section.id,
    sectionTitle: section.title,
    script: section.script,
    correctCount,
    totalQuestions,
    overallBand: bandForScore(correctCount, totalQuestions),
    questionResults,
  };
}

function scoreListeningDrill({ sectionId, questionType, answers }) {
  const section = getListeningSectionWithAnswers(sectionId);
  if (!section) {
    const err = new Error("Section not found");
    err.code = "SECTION_NOT_FOUND";
    throw err;
  }

  const questions = section.questions.filter((q) => q.type === questionType);
  if (questions.length === 0) {
    const err = new Error("No questions of that type in this section");
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
    sectionId: section.id,
    sectionTitle: section.title,
    script: section.script,
    questionType,
    correctCount,
    totalQuestions,
    overallBand: bandForScore(correctCount, totalQuestions),
    questionResults,
  };
}

export { scoreListeningAttempt, scoreListeningDrill };
