import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEssayAttemptDetail } from '../api/writing';
import ResultsView from '../components/ResultsView';
import SectionResultsView from '../components/SectionResultsView';

const SECTION_LABELS = {
  introduction: 'Introduction',
  main_body: 'Main Body Paragraph',
  conclusion: 'Conclusion',
};

export default function EssayAttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAttempt(null);
    setError(null);
    fetchEssayAttemptDetail(id)
      .then(setAttempt)
      .catch((err) => setError(err.message));
  }, [id]);

  const taskLabel = attempt ? (attempt.taskType === 'task1' ? 'Task 1' : 'Task 2') : '';
  const modeLabel = attempt
    ? attempt.mode === 'full'
      ? 'Full Essay'
      : `Practice by Section — ${SECTION_LABELS[attempt.section] ?? attempt.section}`
    : '';

  return (
    <div>
      <header className="app-header">
        <h1>{attempt ? `${taskLabel} — ${modeLabel}` : 'Essay Attempt'}</h1>
        {attempt && (
          <p className="app-subtitle">
            {new Date(attempt.createdAt.replace(' ', 'T') + 'Z').toLocaleString()}
          </p>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {attempt && (
        <>
          <div className="transcripts">
            <h3>Prompt</h3>
            <p>{attempt.promptText}</p>
            <h3>Your {attempt.mode === 'full' ? 'essay' : 'text'}</h3>
            <p>{attempt.essayText}</p>
          </div>
          {attempt.mode === 'full' ? <ResultsView result={attempt} /> : <SectionResultsView result={attempt} />}
        </>
      )}

      <Link to="/speaking/history" className="btn-secondary">
        Back to dashboard
      </Link>
    </div>
  );
}
