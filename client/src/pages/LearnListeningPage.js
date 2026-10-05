import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchListeningSection, submitListeningDrill } from '../api/listening';
import usePersistedState, { clearPersistedState } from '../hooks/usePersistedState';
import SectionPicker from '../components/listening/SectionPicker';
import QuestionTypePicker from '../components/QuestionTypePicker';
import AudioScriptPlayer from '../components/listening/AudioScriptPlayer';
import DiagramView from '../components/listening/DiagramView';
import QuestionList from '../components/QuestionList';
import ListeningResultsView from '../components/ListeningResultsView';

const TYPE_LABELS = {
  multiple_choice: { label: 'Multiple Choice', description: 'Pick the correct option' },
  short_answer: { label: 'Short Answer', description: 'Form/note completion' },
  multiple_select: { label: 'Multiple Select', description: 'Choose more than one correct option' },
  matching: { label: 'Matching', description: 'Match each item to an option from the list' },
  completion_box: { label: 'Completion', description: 'Complete the summary using words from a box' },
  diagram_label: { label: 'Diagram Labeling', description: 'Label the diagram using words from a box' },
};

const KEYS = ['listening-drill:sectionId', 'listening-drill:questionType', 'listening-drill:answers', 'listening-drill:result'];

export default function LearnListeningPage() {
  const [sectionId, setSectionId] = usePersistedState('listening-drill:sectionId', null);
  const [section, setSection] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [questionType, setQuestionType] = usePersistedState('listening-drill:questionType', null);
  const [answers, setAnswers] = usePersistedState('listening-drill:answers', {});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = usePersistedState('listening-drill:result', null);

  useEffect(() => {
    if (!sectionId) return;
    setSection(null);
    setLoadError(null);
    fetchListeningSection(sectionId)
      .then(setSection)
      .catch((err) => setLoadError(err.message));
  }, [sectionId]);

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

  function handleChooseAnotherSection() {
    KEYS.forEach(clearPersistedState);
    setSectionId(null);
    setSection(null);
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
    clearPersistedState('listening-drill:questionType');
    clearPersistedState('listening-drill:answers');
    clearPersistedState('listening-drill:result');
  }

  return (
    <div>
      <header className="app-header">
        <h1>Listening Drill</h1>
        <p className="app-subtitle">
          Drill just one question type at a time, with instant feedback.
        </p>
      </header>

      <div className="page-back-row">
        <Link to="/practice#drill-mode" className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Drill Mode
        </Link>
        {section && (
          <button type="button" className="btn-secondary" onClick={handleChooseAnotherSection}>
            Choose a different section
          </button>
        )}
        {section && questionType && (
          <button type="button" className="btn-secondary" onClick={handleChooseAnotherType}>
            Choose a different question type
          </button>
        )}
      </div>

      {loadError && <div className="error-banner">{loadError}</div>}

      {!sectionId && <SectionPicker onSelect={setSectionId} />}

      {section && !questionType && !result && (
        <QuestionTypePicker types={availableTypes} onSelect={setQuestionType} />
      )}

      {section && questionType && !result && (
        <div className="listening-layout">
          <AudioScriptPlayer key={section.id} sectionId={section.id} />
          {questionType === 'diagram_label' && section.diagram && <DiagramView diagram={section.diagram} />}

          <div className="reading-questions-col">
            <QuestionList
              questions={filteredQuestions}
              questionGroups={section.questionGroups}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />

            <button type="button" className="submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Scoring…' : 'Submit answers'}
            </button>
          </div>
        </div>
      )}

      {submitError && <div className="error-banner">{submitError}</div>}
      {result && <ListeningResultsView result={result} />}
    </div>
  );
}
