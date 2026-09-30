import { useEffect, useState } from 'react';
import { fetchListeningSections, fetchListeningSection, submitListeningFullTest } from '../../api/listening';
import usePersistedState, { clearPersistedState } from '../../hooks/usePersistedState';
import usePersistedCountdown, { formatCountdown } from '../../hooks/usePersistedCountdown';
import AudioScriptPlayer from './AudioScriptPlayer';
import QuestionInput from '../QuestionInput';

const TEST_SECONDS = 30 * 60;

// Shared by the standalone Listening Practice page and Full Test's
// listening step — real IELTS Listening is every available part in one
// continuous ~30-minute sitting, one combined score, not a single section
// in isolation. Both callers get the same real test; only the page chrome
// around it (header, whether "Restart" makes sense) differs.
export default function ContinuousListeningTest({ persistPrefix, onComplete, allowRestart = true, allowTimerControl = true }) {
  const currentIndexKey = `${persistPrefix}:currentIndex`;
  const answersKey = `${persistPrefix}:answersBySectionId`;
  const timerKey = `${persistPrefix}:timer`;

  const [sections, setSections] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [currentIndex, setCurrentIndex] = usePersistedState(currentIndexKey, 0);
  const [answersBySectionId, setAnswersBySectionId] = usePersistedState(answersKey, {});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const countdown = usePersistedCountdown(timerKey, TEST_SECONDS, () => handleFinalSubmit());

  useEffect(() => {
    fetchListeningSections()
      .then((list) => {
        const sorted = [...list].sort((a, b) => a.part - b.part);
        return Promise.all(sorted.map((s) => fetchListeningSection(s.id)));
      })
      .then(setSections)
      .catch((err) => setLoadError(err.message));
  }, []);

  useEffect(() => {
    if (sections) countdown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  function handleAnswerChange(sectionId, questionId, value) {
    setAnswersBySectionId((prev) => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] ?? {}), [questionId]: value },
    }));
  }

  async function handleFinalSubmit() {
    countdown.pause();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitListeningFullTest(answersBySectionId);
      onComplete(data);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  function handleNextOrSubmit() {
    if (currentIndex < sections.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleFinalSubmit();
    }
  }

  function handleRestartTest() {
    [currentIndexKey, answersKey].forEach(clearPersistedState);
    setCurrentIndex(0);
    setAnswersBySectionId({});
    setSubmitError(null);
    countdown.reset();
    countdown.start();
  }

  // Restarts just the clock back to the full 30 minutes — distinct from
  // "Restart test" above, which also wipes answers and progress.
  function handleRestartTimer() {
    countdown.reset();
    countdown.start();
  }

  const currentSection = sections?.[currentIndex];
  const startIndex = sections ? sections.slice(0, currentIndex).reduce((sum, s) => sum + s.questionCount, 0) : 0;
  const isLastSection = sections && currentIndex === sections.length - 1;
  const currentAnswers = currentSection ? answersBySectionId[currentSection.id] ?? {} : {};

  return (
    <div>
      {allowRestart && sections && (
        <div className="page-back-row">
          <button type="button" className="btn-secondary" onClick={handleRestartTest}>
            Restart test
          </button>
        </div>
      )}

      {loadError && <div className="error-banner">{loadError}</div>}
      {submitError && <div className="error-banner">{submitError}</div>}

      {!sections && !loadError && <p className="auth-loading">Loading sections…</p>}

      {sections && currentSection && (
        <div className="listening-layout">
          <div className="timer">
            <span className={countdown.secondsLeft === 0 ? 'timer-expired' : ''}>
              {formatCountdown(countdown.secondsLeft)}
            </span>
            {allowTimerControl && (
              <>
                <button type="button" onClick={() => (countdown.running ? countdown.pause() : countdown.start())}>
                  {countdown.running ? 'Pause' : 'Resume'}
                </button>
                <button type="button" onClick={handleRestartTimer}>
                  Restart timer
                </button>
              </>
            )}
          </div>
          <p className="app-subtitle">
            Part {currentIndex + 1} of {sections.length}
          </p>
          <AudioScriptPlayer key={currentSection.id} sectionId={currentSection.id} />

          <div className="reading-questions-col">
            {currentSection.questions.map((q, i) => (
              <div key={q.id} className="reading-question">
                <p className="reading-question-prompt">
                  {startIndex + i + 1}. {q.prompt}
                </p>
                <QuestionInput
                  question={q}
                  value={currentAnswers[q.id]}
                  onChange={(questionId, value) => handleAnswerChange(currentSection.id, questionId, value)}
                />
              </div>
            ))}

            <button type="button" className="submit-btn" onClick={handleNextOrSubmit} disabled={submitting}>
              {submitting ? 'Scoring your test…' : isLastSection ? 'Submit Listening Test' : 'Next Part →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
