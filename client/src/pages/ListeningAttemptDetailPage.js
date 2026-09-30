import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchListeningAttemptDetail } from '../api/listening';
import ListeningResultsView from '../components/ListeningResultsView';
import ListeningFullTestResultsView from '../components/ListeningFullTestResultsView';

export default function ListeningAttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAttempt(null);
    setError(null);
    fetchListeningAttemptDetail(id)
      .then(setAttempt)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <header className="app-header">
        <h1>{attempt ? attempt.sectionTitle : 'Listening Attempt'}</h1>
        {attempt && (
          <p className="app-subtitle">
            {new Date(attempt.createdAt.replace(' ', 'T') + 'Z').toLocaleString()}
          </p>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {attempt && attempt.sectionResults && <ListeningFullTestResultsView result={attempt} />}
      {attempt && !attempt.sectionResults && <ListeningResultsView result={attempt} />}

      <Link to="/speaking/history" className="btn-secondary">
        Back to history
      </Link>
    </div>
  );
}
