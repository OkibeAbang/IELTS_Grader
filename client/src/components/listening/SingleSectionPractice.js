import { useEffect, useState } from 'react';
import { fetchListeningSection, submitListeningAttempt } from '../../api/listening';
import usePersistedState, { clearPersistedState } from '../../hooks/usePersistedState';
import SectionPicker from './SectionPicker';
import AudioScriptPlayer from './AudioScriptPlayer';
import QuestionInput from '../QuestionInput';
import ListeningResultsView from '../ListeningResultsView';

const KEYS = [
  'listening-practice-single:sectionId',
  'listening-practice-single:answers',
  'listening-practice-single:result',
];

// The other half of Listening Practice: pick one specific part and work
// through it on its own — as opposed to ContinuousListeningTest's full,
// one-continuous-clock test across every part.
export default function SingleSectionPractice() {
  const [sectionId, setSectionId] = usePersistedState('listening-practice-single:sectionId', null);
  const [section, setSection] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [answers, setAnswers] = usePersistedState('listening-practice-single:answers', {});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = usePersistedState('listening-practice-single:result', null);

  useEffect(() => {
    if (!sectionId) return;
    setSection(null);
    setLoadError(null);
    fetchListeningSection(sectionId)
      .then(setSection)
      .catch((err) => setLoadError(err.message));
  }, [sectionId]);

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitListeningAttempt(sectionId, answers);
      setResult(data);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChooseAnother() {
    KEYS.forEach(clearPersistedState);
    setSectionId(null);
    setSection(null);
    setAnswers({});
    setSubmitError(null);
    setResult(null);
  }

  return (
    <div>
      {section && !result && (
        <div className="page-back-row">
          <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
            Choose a different section
          </button>
        </div>
      )}

      {loadError && <div className="error-banner">{loadError}</div>}
      {submitError && <div className="error-banner">{submitError}</div>}

      {!sectionId && !result && <SectionPicker onSelect={setSectionId} />}

      {section && !result && (
        <div className="listening-layout">
          <AudioScriptPlayer key={section.id} sectionId={section.id} />
          <div className="reading-questions-col">
            {section.questions.map((q, i) => (
              <div key={q.id} className="reading-question">
                <p className="reading-question-prompt">
                  {i + 1}. {q.prompt}
                </p>
                <QuestionInput question={q} value={answers[q.id]} onChange={handleAnswerChange} />
              </div>
            ))}
            <button type="button" className="submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Scoring…' : 'Submit answers'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <>
          <ListeningResultsView result={result} />
          <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
            Choose a different section
          </button>
        </>
      )}
    </div>
  );
}
