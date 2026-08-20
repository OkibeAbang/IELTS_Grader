import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchListeningSections, fetchListeningSection, submitListeningDrill } from '../api/listening';
import QuestionTypePicker from '../components/QuestionTypePicker';
import AudioScriptPlayer from '../components/listening/AudioScriptPlayer';
import QuestionInput from '../components/QuestionInput';
import ListeningResultsView from '../components/ListeningResultsView';

const TYPE_LABELS = {
  multiple_choice: { label: 'Multiple Choice', description: 'Pick the correct option' },
  short_answer: { label: 'Short Answer', description: 'Form/note completion' },
};

export default function LearnListeningPage() {
  const [section, setSection] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [questionType, setQuestionType] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchListeningSections()
      .then((sections) => sections[0] && fetchListeningSection(sections[0].id))
      .then((s) => s && setSection(s))
      .catch((err) => setLoadError(err.message));
  }, []);

  const availableTypes = section
    ? [...new Set(section.questions.map((q) => q.type))].map((value) => ({ value, ...TYPE_LABELS[value] }))
    : [];

  const filteredQuestions = section && questionType ? section.questions.filter((q) => q.type === questionType) : [];

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitListeningDrill(section.id, questionType, answers);
      setResult(data);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChooseAnother() {
    setQuestionType(null);
    setAnswers({});
    setSubmitError(null);
    setResult(null);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Learn: Listening</h1>
        <p className="app-subtitle">
          Drill just one question type at a time, with instant feedback.
        </p>
      </header>

      <Link to="/learn" className="btn-secondary">
        <ArrowLeft size={16} aria-hidden="true" /> Back to Learn
      </Link>

      {loadError && <div className="error-banner">{loadError}</div>}

      {section && !questionType && !result && (
        <QuestionTypePicker types={availableTypes} onSelect={setQuestionType} />
      )}

      {section && questionType && !result && (
        <div className="listening-layout">
          <AudioScriptPlayer script={section.script} />

          <div className="reading-questions-col">
            {filteredQuestions.map((q, i) => (
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

      {questionType && (
        <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
          Choose a different question type
        </button>
      )}
    </div>
  );
}
