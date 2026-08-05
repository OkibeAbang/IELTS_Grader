import { useEffect, useState } from 'react';
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
            {t.topic}
          </button>
        ))}
      </div>
    </div>
  );
}
