import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { fetchListeningSections } from '../../api/listening';

export default function SectionPicker({ onSelect }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListeningSections()
      .then(setSections)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading sections…</p>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="topic-picker">
      <h2>Choose a section</h2>
      <p className="app-subtitle">
        Listen to a short recording and answer Multiple Choice and Note/Form Completion
        questions, just like the real IELTS Listening test. Uses your browser's built-in
        text-to-speech — no transcript is shown while you listen.
      </p>
      <div className="topic-grid">
        {sections.map((s) => (
          <button key={s.id} type="button" className="topic-card" onClick={() => onSelect(s.id)}>
            <span className="topic-card-title">{s.title}</span>
            <span className="topic-card-badges">
              <span className="topic-badge">{s.questionCount} questions</span>
              <span className="topic-badge topic-badge-duration">
                <Clock size={12} aria-hidden="true" /> ~{s.estimatedMinutes} min
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
