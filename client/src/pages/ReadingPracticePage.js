import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchReadingPassage, submitReadingAttempt } from '../api/reading';
import PassagePicker from '../components/reading/PassagePicker';
import PassageViewer from '../components/reading/PassageViewer';
import ReadingResultsView from '../components/ReadingResultsView';

export default function ReadingPracticePage() {
  const [step, setStep] = useState('pick');
  const [passageId, setPassageId] = useState(null);
  const [passage, setPassage] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!passageId) return;
    setPassage(null);
    setLoadError(null);
    fetchReadingPassage(passageId)
      .then((p) => {
        setPassage(p);
        setStep('passage');
      })
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
    setPassageId(null);
    setPassage(null);
    setStep('pick');
    setAnswers({});
    setSubmitError(null);
    setResult(null);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Reading Practice</h1>
        <p className="app-subtitle">
          Read a passage and answer Multiple Choice, True/False/Not Given, and Short
          Answer questions, just like the real IELTS Reading test.
        </p>
      </header>

      <Link to="/practice" className="btn-secondary">
        <ArrowLeft size={16} aria-hidden="true" /> Back to Practice
      </Link>

      {loadError && <div className="error-banner">{loadError}</div>}

      {step === 'pick' && !result && <PassagePicker onSelect={setPassageId} />}

      {passage && step === 'passage' && !result && (
        <PassageViewer
          passage={passage}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}

      {submitError && <div className="error-banner">{submitError}</div>}
      {result && <ReadingResultsView result={result} />}

      {passage && (
        <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
          Choose a different passage
        </button>
      )}
    </div>
  );
}
