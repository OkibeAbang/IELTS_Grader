import { useEffect, useState } from 'react';
import { fetchListeningSection, submitListeningFullTest } from '../../api/listening';
import usePersistedState, { clearPersistedState } from '../../hooks/usePersistedState';
import usePersistedCountdown, { formatCountdown } from '../../hooks/usePersistedCountdown';
import AudioScriptPlayer from './AudioScriptPlayer';
import DiagramView from './DiagramView';
import QuestionList from '../QuestionList';

const TEST_SECONDS = 30 * 60;

// Shared by the standalone Listening Practice page and Full Test's
// listening step. A "test" here is one complete set of parts (real IELTS
// Listening: Parts 1-4 in one continuous ~30-minute sitting, one combined
// score) — the caller picks which test, this runs all of its parts in
// order. Both callers get the same real test; only the page chrome around
// it (header, whether "Restart" makes sense) differs.
export default function ContinuousListeningTest({
  persistPrefix,
  test,
  onComplete,
  allowRestart = true,
  allowTimerControl = true,
}) {
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

  const testSectionIds = test?.sectionIds;

  useEffect(() => {
    if (!testSectionIds) return undefined;
    let cancelled = false;
    setSections(null);
    setLoadError(null);

    Promise.all(testSectionIds.map((id) => fetchListeningSection(id)))
      .then((loaded) => {
        if (!cancelled) setSections(loaded);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [testSectionIds]);

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
      // Derived from what's actually loaded rather than the test prop, so
      // the scored set can never drift from what was displayed.
      const data = await submitListeningFullTest(
        answersBySectionId,
        (sections ?? []).map((s) => s.id),
        test?.testNumber
      );
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
          {currentSection.diagram && <DiagramView diagram={currentSection.diagram} />}

          <div className="reading-questions-col">
            <QuestionList
              questions={currentSection.questions}
              questionGroups={currentSection.questionGroups}
              answers={currentAnswers}
              onAnswerChange={(questionId, value) => handleAnswerChange(currentSection.id, questionId, value)}
              startIndex={startIndex}
            />

            <button type="button" className="submit-btn" onClick={handleNextOrSubmit} disabled={submitting}>
              {submitting ? 'Scoring your test…' : isLastSection ? 'Submit Listening Test' : 'Next Part →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
