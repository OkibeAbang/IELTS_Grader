import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { fetchReadingPassages } from '../../api/reading';

export default function PassagePicker({ onSelect }) {
  const [passages, setPassages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReadingPassages()
      .then(setPassages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading passages…</p>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="topic-picker">
      <h2>Choose a passage</h2>
      <p className="app-subtitle">
        Read the passage and answer a mix of question types, just like the real IELTS
        Reading test.
      </p>
      <div className="topic-grid">
        {passages.map((p) => (
          <button key={p.id} type="button" className="topic-card" onClick={() => onSelect(p.id)}>
            <span className="topic-card-title">{p.title}</span>
            <span className="topic-card-badges">
              <span className="topic-badge">{p.questionCount} questions</span>
              <span className="topic-badge topic-badge-duration">
                <Clock size={12} aria-hidden="true" /> ~{p.estimatedMinutes} min
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
