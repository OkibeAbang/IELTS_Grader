import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchReadingPassage, submitReadingDrill } from '../api/reading';
import usePersistedState, { clearPersistedState } from '../hooks/usePersistedState';
import PassagePicker from '../components/reading/PassagePicker';
import QuestionTypePicker from '../components/QuestionTypePicker';
import PassageViewer from '../components/reading/PassageViewer';
import ReadingResultsView from '../components/ReadingResultsView';

const TYPE_LABELS = {
  multiple_choice: { label: 'Multiple Choice', description: 'Pick the correct option' },
  true_false_not_given: { label: 'True / False / Not Given', description: 'Judge each factual statement' },
  yes_no_not_given: { label: 'Yes / No / Not Given', description: "Judge the writer's stated opinions" },
  short_answer: { label: 'Short Answer', description: 'Fill in the blank' },
};

const KEYS = ['reading-drill:passageId', 'reading-drill:questionType', 'reading-drill:answers', 'reading-drill:result'];

export default function LearnReadingPage() {
  const [passageId, setPassageId] = usePersistedState('reading-drill:passageId', null);
  const [passage, setPassage] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [questionType, setQuestionType] = usePersistedState('reading-drill:questionType', null);
  const [answers, setAnswers] = usePersistedState('reading-drill:answers', {});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = usePersistedState('reading-drill:result', null);

  useEffect(() => {
    if (!passageId) return;
    setPassage(null);
    setLoadError(null);
    fetchReadingPassage(passageId)
      .then(setPassage)
      .catch((err) => setLoadError(err.message));
  }, [passageId]);

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

  function handleChooseAnotherPassage() {
    KEYS.forEach(clearPersistedState);
    setPassageId(null);
    setPassage(null);
    setQuestionType(null);
    setAnswers({});
    setSubmitError(null);
    setResult(null);
  }

  function handleChooseAnotherType() {
    setQuestionType(null);
    setAnswers({});
    setSubmitError(null);
    setResult(null);
    clearPersistedState('reading-drill:questionType');
    clearPersistedState('reading-drill:answers');
    clearPersistedState('reading-drill:result');
  }

  return (
    <div>
      <header className="app-header">
        <h1>Reading Drill</h1>
        <p className="app-subtitle">
          Drill just one question type at a time, with instant feedback.
        </p>
      </header>

      <div className="page-back-row">
        <Link to="/practice#drill-mode" className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Drill Mode
        </Link>
        {passage && (
          <button type="button" className="btn-secondary" onClick={handleChooseAnotherPassage}>
            Choose a different passage
          </button>
        )}
        {passage && questionType && (
          <button type="button" className="btn-secondary" onClick={handleChooseAnotherType}>
            Choose a different question type
          </button>
        )}
      </div>

      {loadError && <div className="error-banner">{loadError}</div>}

      {!passageId && <PassagePicker onSelect={setPassageId} />}

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
          persistKey="reading-drill"
        />
      )}

      {submitError && <div className="error-banner">{submitError}</div>}
      {result && <ReadingResultsView result={result} />}
    </div>
  );
}
