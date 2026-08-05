import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAttemptDetail, attemptAudioUrl } from '../api/speaking';
import SpeakingResultsView from '../components/SpeakingResultsView';

export default function AttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAttempt(null);
    setError(null);
    fetchAttemptDetail(id)
      .then(setAttempt)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <header className="app-header">
        <h1>{attempt ? attempt.topicLabel : 'Speaking Attempt'}</h1>
        {attempt && (
          <p className="app-subtitle">
            {new Date(attempt.createdAt.replace(' ', 'T') + 'Z').toLocaleString()}
          </p>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {attempt && (
        <>
          <div className="review-submit">
            <h2>Recordings</h2>
            {['part1', 'part2', 'part3'].map((part) => (
              <audio key={part} controls src={attemptAudioUrl(attempt.attemptId, part)} />
            ))}
          </div>
          <SpeakingResultsView result={attempt} />
        </>
      )}

      <Link to="/speaking/history" className="btn-secondary">
        Back to history
      </Link>
    </div>
  );
}
