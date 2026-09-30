import { getReadingPassageWithAnswers, getAllReadingPassagesWithAnswers } from "./readingPassageBank.js";
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

function scoreReadingAttempt({ passageId, answers }) {
  const passage = getReadingPassageWithAnswers(passageId);
  if (!passage) {
    const err = new Error("Passage not found");
    err.code = "PASSAGE_NOT_FOUND";
    throw err;
  }

  const questionResults = scoreQuestions(passage.questions, answers);
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

// Scores every passage in the bank as one continuous test (real IELTS
// Reading: 3 passages, one sitting, one combined score) rather than a
// single passage in isolation. answersByPassageId is keyed by passage id,
// each value the same {questionId: answer} shape scoreReadingAttempt takes.
function scoreReadingFullTest({ answersByPassageId }) {
  const passages = getAllReadingPassagesWithAnswers();

  const passageResults = passages.map((passage) => {
    const answers = answersByPassageId?.[passage.id] ?? {};
    const questionResults = scoreQuestions(passage.questions, answers);
    const correctCount = questionResults.filter((r) => r.isCorrect).length;
    return {
      passageId: passage.id,
      passageTitle: passage.title,
      part: passage.part,
      correctCount,
      totalQuestions: passage.questions.length,
      questionResults,
    };
  });

  const correctCount = passageResults.reduce((sum, p) => sum + p.correctCount, 0);
  const totalQuestions = passageResults.reduce((sum, p) => sum + p.totalQuestions, 0);

  return {
    correctCount,
    totalQuestions,
    overallBand: bandForScore(correctCount, totalQuestions),
    passageResults,
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

  const questionResults = scoreQuestions(questions, answers);

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

export { scoreReadingAttempt, scoreReadingDrill, scoreReadingFullTest };
