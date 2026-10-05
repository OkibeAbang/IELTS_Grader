import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { fetchListeningSections } from '../../api/listening';

// Real IELTS Listening Section 3 is usually a 3-4 person academic
// discussion, which Gemini's multi-speaker TTS can't render (capped at 2
// voices) without a per-speaker synthesize-and-stitch fallback (tracked in
// REMINDERS.md) — so this placeholder exists for whenever no Part 3
// content has been authored yet, same reasoning as a "coming soon" state
// anywhere else. A Part 3 section kept to 2 speakers, like ls-09, sidesteps
// the limitation entirely and makes this placeholder disappear (see
// withComingSoonPlaceholder below) rather than sitting stale next to it.
const SECTION_3_PLACEHOLDER = {
  id: '__section-3-coming-soon__',
  title: 'Section 3 (academic discussion)',
  part: 3,
  comingSoon: true,
};

function withComingSoonPlaceholder(sections) {
  const sorted = [...sections].sort((a, b) => a.part - b.part);
  // Only insert the placeholder while Part 3 is genuinely absent — once a
  // real Part 3 section exists (e.g. one kept to 2 speakers, within
  // Gemini's current cap), showing a disabled "coming soon" card right
  // next to a real, working one would be actively misleading.
  if (sorted.some((s) => s.part === 3)) return sorted;
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
                {s.isNew && <span className="topic-badge topic-badge-new">New</span>}
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
