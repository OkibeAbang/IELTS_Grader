import { getListeningSectionWithAnswers, getAllListeningSectionsWithAnswers } from "./listeningPassageBank.js";
import { bandForScore } from "./bandConversionTable.js";
import { isCorrect } from "./markingEngine.js";

function scoreQuestions(questions, answers) {
  return questions.map((q) => {
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
}

function scoreListeningAttempt({ sectionId, answers }) {
  const section = getListeningSectionWithAnswers(sectionId);
  if (!section) {
    const err = new Error("Section not found");
    err.code = "SECTION_NOT_FOUND";
    throw err;
  }

  const questionResults = scoreQuestions(section.questions, answers);
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

// Scores every section in the bank as one continuous test (real IELTS
// Listening: 4 parts, one continuous recording, one combined score) rather
// than a single section in isolation. answersBySectionId is keyed by
// section id, each value the same {questionId: answer} shape
// scoreListeningAttempt takes.
function scoreListeningFullTest({ answersBySectionId }) {
  const sections = getAllListeningSectionsWithAnswers();

  const sectionResults = sections.map((section) => {
    const answers = answersBySectionId?.[section.id] ?? {};
    const questionResults = scoreQuestions(section.questions, answers);
    const correctCount = questionResults.filter((r) => r.isCorrect).length;
    return {
      sectionId: section.id,
      sectionTitle: section.title,
      part: section.part,
      script: section.script,
      correctCount,
      totalQuestions: section.questions.length,
      questionResults,
    };
  });

  const correctCount = sectionResults.reduce((sum, s) => sum + s.correctCount, 0);
  const totalQuestions = sectionResults.reduce((sum, s) => sum + s.totalQuestions, 0);

  return {
    correctCount,
    totalQuestions,
    overallBand: bandForScore(correctCount, totalQuestions),
    sectionResults,
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

  const questionResults = scoreQuestions(questions, answers);

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

export { scoreListeningAttempt, scoreListeningDrill, scoreListeningFullTest };
