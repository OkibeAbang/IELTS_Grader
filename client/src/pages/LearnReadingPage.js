import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchReadingPassages, fetchReadingPassage, submitReadingDrill } from '../api/reading';
import QuestionTypePicker from '../components/QuestionTypePicker';
import PassageViewer from '../components/reading/PassageViewer';
import ReadingResultsView from '../components/ReadingResultsView';

const TYPE_LABELS = {
  multiple_choice: { label: 'Multiple Choice', description: 'Pick the correct option' },
  true_false_not_given: { label: 'True / False / Not Given', description: 'Judge each statement' },
  short_answer: { label: 'Short Answer', description: 'Fill in the blank' },
};

export default function LearnReadingPage() {
  const [passage, setPassage] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [questionType, setQuestionType] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchReadingPassages()
      .then((passages) => passages[0] && fetchReadingPassage(passages[0].id))
      .then((p) => p && setPassage(p))
      .catch((err) => setLoadError(err.message));
  }, []);

  const availableTypes = passage
    ? [...new Set(passage.questions.map((q) => q.type))].map((value) => ({ value, ...TYPE_LABELS[value] }))
    : [];

  const filteredQuestions = passage && questionType ? passage.questions.filter((q) => q.type === questionType) : [];

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitReadingDrill(passage.id, questionType, answers);
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
        <h1>Reading Drill</h1>
        <p className="app-subtitle">
          Drill just one question type at a time, with instant feedback.
        </p>
      </header>

      <Link to="/practice" className="btn-secondary">
        <ArrowLeft size={16} aria-hidden="true" /> Back to Practice
      </Link>

      {loadError && <div className="error-banner">{loadError}</div>}

      {passage && !questionType && !result && (
        <QuestionTypePicker types={availableTypes} onSelect={setQuestionType} />
      )}

      {passage && questionType && !result && (
        <PassageViewer
          passage={{ ...passage, questions: filteredQuestions }}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          submitting={submitting}
          showTimer={false}
        />
      )}

      {submitError && <div className="error-banner">{submitError}</div>}
      {result && <ReadingResultsView result={result} />}

      {questionType && (
        <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
          Choose a different question type
        </button>
      )}
    </div>
  );
}
