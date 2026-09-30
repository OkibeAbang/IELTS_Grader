import { getListeningSectionWithAnswers, getAllListeningSectionsWithAnswers } from "./listeningPassageBank.js";
import { bandForScore } from "./bandConversionTable.js";
import { scoreQuestions } from "./markingEngine.js";

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
function scoreListeningFullTest({ answersBySectionId, sectionIds }) {
  const bank = getAllListeningSectionsWithAnswers();
  let sections = bank;

  // Score exactly the sections this test was made of. Scoring the whole
  // bank instead would count parts from other tests the user never saw as
  // all-wrong, understating the band.
  if (Array.isArray(sectionIds) && sectionIds.length > 0) {
    sections = sectionIds.map((id) => {
      const section = bank.find((s) => s.id === id);
      if (!section) {
        const err = new Error("Section not found");
        err.code = "SECTION_NOT_FOUND";
        throw err;
      }
      return section;
    });
  }

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
