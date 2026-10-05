import { useEffect, useState } from 'react';
import { fetchReadingPassage, submitReadingAttempt } from '../../api/reading';
import usePersistedState, { clearPersistedState } from '../../hooks/usePersistedState';
import PassagePicker from './PassagePicker';
import PassageViewer from './PassageViewer';
import ReadingResultsView from '../ReadingResultsView';

const KEYS = [
  'reading-practice-single:passageId',
  'reading-practice-single:answers',
  'reading-practice-single:result',
];

// The other half of Reading Practice: pick one specific passage and work
// through it on its own, with PassageViewer's own optional, pausable
// 20-minute timer — as opposed to ContinuousReadingTest's full 3-passage,
// one-continuous-clock test. Both are real practice needs: sometimes you
// want the full exam simulation, sometimes you want to drill one passage
// you're weak on without committing to all three.
export default function SinglePassagePractice() {
  const [passageId, setPassageId] = usePersistedState('reading-practice-single:passageId', null);
  const [passage, setPassage] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [answers, setAnswers] = usePersistedState('reading-practice-single:answers', {});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = usePersistedState('reading-practice-single:result', null);

  useEffect(() => {
    if (!passageId) return;
    setPassage(null);
    setLoadError(null);
    fetchReadingPassage(passageId)
      .then(setPassage)
      .catch((err) => setLoadError(err.message));
  }, [passageId]);

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitReadingAttempt(passageId, answers);
      setResult(data);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChooseAnother() {
    KEYS.forEach(clearPersistedState);
    setPassageId(null);
    setPassage(null);
    setAnswers({});
    setSubmitError(null);
    setResult(null);
  }

  // Arriving here should always start at "choose a passage," never resume
  // a finished attempt's results from a previous visit. This component has
  // its own result state entirely separate from ReadingPracticePage's (the
  // "full test" path reports its result up via onComplete, but single-
  // passage practice manages submission itself), so it needs the same
  // mount-time check independently. Runs once on mount only, so it doesn't
  // interfere with the in-session results view shown right after
  // submitting, which sets state directly without a remount.
  useEffect(() => {
    if (result) handleChooseAnother();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {passage && !result && (
        <div className="page-back-row">
          <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
            Choose a different passage
          </button>
        </div>
      )}

      {loadError && <div className="error-banner">{loadError}</div>}
      {submitError && <div className="error-banner">{submitError}</div>}

      {!passageId && !result && <PassagePicker onSelect={setPassageId} />}

      {passage && !result && (
        <PassageViewer
          passage={passage}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          submitting={submitting}
          persistKey="reading-practice-single"
        />
      )}

      {result && (
        <>
          <ReadingResultsView result={result} />
          <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
            Choose a different passage
          </button>
        </>
      )}
    </div>
  );
}
