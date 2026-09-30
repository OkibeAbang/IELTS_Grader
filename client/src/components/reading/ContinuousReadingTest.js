import { useEffect, useState } from 'react';
import { fetchReadingPassages, fetchReadingPassage, submitReadingFullTest } from '../../api/reading';
import usePersistedState, { clearPersistedState } from '../../hooks/usePersistedState';
import usePersistedCountdown, { formatCountdown } from '../../hooks/usePersistedCountdown';
import PassageViewer from './PassageViewer';

const TEST_SECONDS = 60 * 60;

// Shared by the standalone Reading Practice page and Full Test's reading
// step — real IELTS Reading is 3 passages in one continuous 60-minute
// sitting, 1-40 question numbering, one combined score, not a single
// passage in isolation. Both callers get the same real test; only the
// page chrome around it (header, whether "Restart" makes sense) differs.
export default function ContinuousReadingTest({ persistPrefix, onComplete, allowRestart = true, allowTimerControl = true }) {
  const currentIndexKey = `${persistPrefix}:currentIndex`;
  const answersKey = `${persistPrefix}:answersByPassageId`;
  const timerKey = `${persistPrefix}:timer`;

  const [passages, setPassages] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [currentIndex, setCurrentIndex] = usePersistedState(currentIndexKey, 0);
  const [answersByPassageId, setAnswersByPassageId] = usePersistedState(answersKey, {});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const countdown = usePersistedCountdown(timerKey, TEST_SECONDS, () => handleFinalSubmit());

  useEffect(() => {
    fetchReadingPassages()
      .then((list) => {
        const sorted = [...list].sort((a, b) => a.part - b.part);
        return Promise.all(sorted.map((p) => fetchReadingPassage(p.id)));
      })
      .then(setPassages)
      .catch((err) => setLoadError(err.message));
  }, []);

  useEffect(() => {
    if (passages) countdown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passages]);

  function handleAnswerChange(passageId, questionId, value) {
    setAnswersByPassageId((prev) => ({
      ...prev,
      [passageId]: { ...(prev[passageId] ?? {}), [questionId]: value },
    }));
  }

  async function handleFinalSubmit() {
    countdown.pause();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitReadingFullTest(answersByPassageId);
      onComplete(data);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  function handleNextOrSubmit() {
    if (currentIndex < passages.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleFinalSubmit();
    }
  }

  function handleRestartTest() {
    [currentIndexKey, answersKey].forEach(clearPersistedState);
    setCurrentIndex(0);
    setAnswersByPassageId({});
    setSubmitError(null);
    countdown.reset();
    countdown.start();
  }

  // Restarts just the clock back to the full 60 minutes — distinct from
  // "Restart test" above, which also wipes answers and progress. This is
  // practice, not exam day, so pausing/resuming and re-timing yourself is
  // meant to be normal, not something only available in a separate mode.
  function handleRestartTimer() {
    countdown.reset();
    countdown.start();
  }

  const currentPassage = passages?.[currentIndex];
  const startIndex = passages ? passages.slice(0, currentIndex).reduce((sum, p) => sum + p.questionCount, 0) : 0;
  const isLastPassage = passages && currentIndex === passages.length - 1;

  return (
    <div>
      {allowRestart && passages && (
        <div className="page-back-row">
          <button type="button" className="btn-secondary" onClick={handleRestartTest}>
            Restart test
          </button>
        </div>
      )}

      {loadError && <div className="error-banner">{loadError}</div>}
      {submitError && <div className="error-banner">{submitError}</div>}

      {!passages && !loadError && <p className="auth-loading">Loading passages…</p>}

      {passages && currentPassage && (
        <>
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
            Passage {currentIndex + 1} of {passages.length}
          </p>
          <PassageViewer
            passage={currentPassage}
            answers={answersByPassageId[currentPassage.id] ?? {}}
            onAnswerChange={(questionId, value) => handleAnswerChange(currentPassage.id, questionId, value)}
            onSubmit={handleNextOrSubmit}
            submitting={submitting}
            showTimer={false}
            startIndex={startIndex}
            submitLabel={isLastPassage ? 'Submit Reading Test' : 'Next Passage →'}
            submittingLabel="Scoring your test…"
          />
        </>
      )}
    </div>
  );
}
