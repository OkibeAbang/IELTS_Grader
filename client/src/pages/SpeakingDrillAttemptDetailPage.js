import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSpeakingDrillAttemptDetail, speakingDrillAudioUrl } from '../api/speaking';
import SpeakingSectionResultsView from '../components/SpeakingSectionResultsView';

const PART_LABELS = {
  part1: 'Part 1 — Interview',
  part2: 'Part 2 — Long Turn',
  part3: 'Part 3 — Discussion',
};

export default function SpeakingDrillAttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAttempt(null);
    setError(null);
    fetchSpeakingDrillAttemptDetail(id)
      .then(setAttempt)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <header className="app-header">
        <h1>{attempt ? attempt.topicLabel : 'Speaking Drill'}</h1>
        {attempt && (
          <p className="app-subtitle">
            {PART_LABELS[attempt.part] ?? attempt.part} ·{' '}
            {new Date(attempt.createdAt.replace(' ', 'T') + 'Z').toLocaleString()}
          </p>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {attempt && (
        <>
          <div className="review-submit">
            <h2>Recording</h2>
            <audio controls src={speakingDrillAudioUrl(attempt.attemptId)} />
          </div>
          <SpeakingSectionResultsView result={attempt} />
        </>
      )}

      <Link to="/speaking/history" className="btn-secondary">
        Back to history
      </Link>
    </div>
  );
}
