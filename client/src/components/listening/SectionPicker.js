import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { fetchListeningSections } from '../../api/listening';

// Real IELTS Listening Section 3 is a 3-4 person academic discussion.
// Gemini's multi-speaker TTS caps out at exactly 2 voices per section, so
// this content type can't be rendered yet — needs a per-speaker
// synthesize-and-stitch fallback first (tracked in REMINDERS.md). Shown as a
// disabled placeholder, in its correct position, rather than silently
// omitted, so it's visible to both students and whoever picks this back up.
const SECTION_3_PLACEHOLDER = {
  id: '__section-3-coming-soon__',
  title: 'Section 3 (academic discussion)',
  part: 3,
  comingSoon: true,
};

function withComingSoonPlaceholder(sections) {
  const sorted = [...sections].sort((a, b) => a.part - b.part);
  const insertAt = sorted.findIndex((s) => s.part > 3);
  sorted.splice(insertAt === -1 ? sorted.length : insertAt, 0, SECTION_3_PLACEHOLDER);
  return sorted;
}

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
        questions, just like the real IELTS Listening test.
      </p>
      <div className="topic-grid">
        {withComingSoonPlaceholder(sections).map((s) =>
          s.comingSoon ? (
            <div key={s.id} className="topic-card topic-card-coming-soon" aria-disabled="true">
              <span className="topic-card-title">{s.title}</span>
              <span className="topic-card-badges">
                <span className="topic-badge">Part {s.part}</span>
                <span className="topic-badge">Coming soon</span>
              </span>
            </div>
          ) : (
            <button key={s.id} type="button" className="topic-card" onClick={() => onSelect(s.id)}>
              <span className="topic-card-title">{s.title}</span>
              <span className="topic-card-badges">
                <span className="topic-badge">Part {s.part}</span>
                <span className="topic-badge">{s.questionCount} questions</span>
                <span className="topic-badge topic-badge-duration">
                  <Clock size={12} aria-hidden="true" /> ~{s.estimatedMinutes} min
                </span>
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
