import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchListeningSection, submitListeningAttempt } from '../api/listening';
import SectionPicker from '../components/listening/SectionPicker';
import AudioScriptPlayer from '../components/listening/AudioScriptPlayer';
import QuestionInput from '../components/QuestionInput';
import ListeningResultsView from '../components/ListeningResultsView';

export default function ListeningPracticePage() {
  const [step, setStep] = useState('pick');
  const [sectionId, setSectionId] = useState(null);
  const [section, setSection] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!sectionId) return;
    setSection(null);
    setLoadError(null);
    fetchListeningSection(sectionId)
      .then((s) => {
        setSection(s);
        setStep('section');
      })
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
    setSectionId(null);
    setSection(null);
    setStep('pick');
    setAnswers({});
    setSubmitError(null);
    setResult(null);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Listening Practice</h1>
        <p className="app-subtitle">
          Listen to a short recording and answer Multiple Choice and Note/Form Completion
          questions, just like the real IELTS Listening test.
        </p>
      </header>

      <Link to="/practice" className="btn-secondary">
        <ArrowLeft size={16} aria-hidden="true" /> Back to Practice
      </Link>

      {loadError && <div className="error-banner">{loadError}</div>}

      {step === 'pick' && !result && <SectionPicker onSelect={setSectionId} />}

      {section && step === 'section' && !result && (
        <div className="listening-layout">
          <AudioScriptPlayer script={section.script} />

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

      {submitError && <div className="error-banner">{submitError}</div>}
      {result && <ListeningResultsView result={result} />}

      {section && (
        <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
          Choose a different section
        </button>
      )}
    </div>
  );
}
