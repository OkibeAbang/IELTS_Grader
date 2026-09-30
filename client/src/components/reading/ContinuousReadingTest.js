import { useEffect, useState } from 'react';
import { fetchReadingPassages, fetchReadingPassage, submitReadingFullTest } from '../../api/reading';
import usePersistedState, { clearPersistedState, getPersistedValue } from '../../hooks/usePersistedState';
import usePersistedCountdown, { formatCountdown } from '../../hooks/usePersistedCountdown';
import PassageViewer from './PassageViewer';

const TEST_SECONDS = 60 * 60;

// Assembles one test as a random pick of a single passage per part, so
// repeat practice isn't the same predictable sequence every time. With one
// passage per part in the bank today this still yields the same three, but
// it becomes genuinely varied as the bank grows — and the ordering is
// always by part, matching the real test's easy-to-hard progression.
function pickOnePassagePerPart(list) {
  const byPart = new Map();
  for (const passage of list) {
    if (!byPart.has(passage.part)) byPart.set(passage.part, []);
    byPart.get(passage.part).push(passage);
  }
  return [...byPart.keys()]
    .sort((a, b) => a - b)
    .map((part) => {
      const group = byPart.get(part);
      return group[Math.floor(Math.random() * group.length)].id;
    });
}

// Shared by the standalone Reading Practice page and Full Test's reading
// step — real IELTS Reading is 3 passages in one continuous 60-minute
// sitting, 1-40 question numbering, one combined score, not a single
// passage in isolation. Both callers get the same real test; only the
// page chrome around it (header, whether "Restart" makes sense) differs.
export default function ContinuousReadingTest({ persistPrefix, onComplete, allowRestart = true, allowTimerControl = true }) {
  const currentIndexKey = `${persistPrefix}:currentIndex`;
  const answersKey = `${persistPrefix}:answersByPassageId`;
  const assignedIdsKey = `${persistPrefix}:assignedPassageIds`;
  const timerKey = `${persistPrefix}:timer`;

  const [passages, setPassages] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [currentIndex, setCurrentIndex] = usePersistedState(currentIndexKey, 0);
  const [answersByPassageId, setAnswersByPassageId] = usePersistedState(answersKey, {});
  // Which passages this sitting was assigned. Persisted so resuming after a
  // refresh keeps the same three — re-rolling the random pick on resume
  // would leave already-saved answers pointing at passages no longer shown.
  // Only the setter is used here: the effect below reads the stored value at
  // run time via getPersistedValue rather than through a render-time
  // snapshot, which would be stale right after a restart clears it.
  const [, setAssignedPassageIds] = usePersistedState(assignedIdsKey, null);
  const [reloadToken, setReloadToken] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const countdown = usePersistedCountdown(timerKey, TEST_SECONDS, () => handleFinalSubmit());

  useEffect(() => {
    let cancelled = false;
    setPassages(null);
    setLoadError(null);

    fetchReadingPassages()
      .then((list) => {
        const existing = getPersistedValue(assignedIdsKey, null);
        const ids = existing ?? pickOnePassagePerPart(list);
        if (!existing) setAssignedPassageIds(ids);
        return Promise.all(ids.map((id) => fetchReadingPassage(id)));
      })
      .then((loaded) => {
        if (!cancelled) setPassages(loaded);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken]);

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
      // Derived from what's actually loaded rather than the assigned-ids
      // state, so the scored set can never drift from what was displayed.
      const data = await submitReadingFullTest(answersByPassageId, (passages ?? []).map((p) => p.id));
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
    // Clearing the assigned ids too means restarting re-rolls a fresh
    // random selection rather than replaying the identical test.
    [currentIndexKey, answersKey, assignedIdsKey].forEach(clearPersistedState);
    setCurrentIndex(0);
    setAnswersByPassageId({});
    setAssignedPassageIds(null);
    setSubmitError(null);
    countdown.reset();
    countdown.start();
    setReloadToken((t) => t + 1);
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
