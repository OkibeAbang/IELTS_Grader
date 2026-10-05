import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { fetchListeningTests } from '../../api/listening';

// Part 3 is a 3-4 person academic discussion, which Gemini's multi-speaker
// TTS can't render yet (capped at 2 voices) — so it's genuinely absent from
// every test rather than silently missing. Called out on each card so it's
// clear why a test has 3 parts instead of 4.
const MISSING_PART = 3;

export default function ListeningTestPicker({ onSelect }) {
  const [tests, setTests] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListeningTests()
      .then(setTests)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="error-banner">{error}</div>;
  if (!tests) return <p className="auth-loading">Loading tests…</p>;

  return (
    <div className="topic-picker">
      <h2>Choose a test</h2>
      <p className="app-subtitle">
        Each test runs all of its parts back to back in one sitting, just like the real IELTS
        Listening test.
      </p>
      <div className="topic-grid">
        {tests.map((test) => (
          <button
            key={test.testNumber}
            type="button"
            className="topic-card"
            onClick={() => onSelect(test)}
          >
            <span className="topic-card-title">Listening Test {test.testNumber}</span>
            <span className="topic-card-badges">
              {test.isNew && <span className="topic-badge topic-badge-new">New</span>}
              <span className="topic-badge">Parts {test.parts.join(', ')}</span>
              <span className="topic-badge">{test.questionCount} questions</span>
              <span className="topic-badge topic-badge-duration">
                <Clock size={12} aria-hidden="true" /> ~{test.estimatedMinutes} min
              </span>
            </span>
            {!test.parts.includes(MISSING_PART) && (
              <p className="hub-card-description">
                Part {MISSING_PART} (academic discussion) is still in progress and isn&apos;t
                included yet.
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
