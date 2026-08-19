import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchReadingAttemptDetail } from '../api/reading';
import ReadingResultsView from '../components/ReadingResultsView';

export default function ReadingAttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAttempt(null);
    setError(null);
    fetchReadingAttemptDetail(id)
      .then(setAttempt)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <header className="app-header">
        <h1>{attempt ? attempt.passageTitle : 'Reading Attempt'}</h1>
        {attempt && (
          <p className="app-subtitle">
            {new Date(attempt.createdAt.replace(' ', 'T') + 'Z').toLocaleString()}
          </p>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {attempt && <ReadingResultsView result={attempt} />}

      <Link to="/speaking/history" className="btn-secondary">
        Back to history
      </Link>
    </div>
  );
}
