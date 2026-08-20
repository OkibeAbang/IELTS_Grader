import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { fetchSpeakingTopics } from '../../api/speaking';

export default function TopicPicker({ onSelect }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpeakingTopics()
      .then(setTopics)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading topics…</p>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="topic-picker">
      <h2>Choose a topic</h2>
      <p className="app-subtitle">
        Each topic includes a Part 1 interview, a Part 2 cue card, and Part 3 follow-up
        questions — just like the real IELTS Speaking test.
      </p>
      <div className="topic-grid">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            className="topic-card"
            onClick={() => onSelect(t.id)}
          >
            <span className="topic-card-title">{t.topic}</span>
            <span className="topic-card-badges">
              <span className="topic-badge">Parts 1–3</span>
              <span className="topic-badge topic-badge-duration">
                <Clock size={12} aria-hidden="true" /> ~{t.estimatedMinutes} min
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
