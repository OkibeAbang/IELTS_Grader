import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchTeacherAttempt, saveReview } from '../api/teacher';
import ResultsView from '../components/ResultsView';
import SectionResultsView from '../components/SectionResultsView';
import SpeakingResultsView from '../components/SpeakingResultsView';
import SpeakingSectionResultsView from '../components/SpeakingSectionResultsView';

function pickResultsView(attemptType, attempt) {
  if (attemptType === 'essay') {
    return attempt.mode === 'section' ? SectionResultsView : ResultsView;
  }
  return attemptType === 'speaking' ? SpeakingResultsView : SpeakingSectionResultsView;
}

export default function TeacherAttemptReviewPage({ attemptType }) {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState(null);
  const [overrideBand, setOverrideBand] = useState('');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAttempt(null);
    setError(null);
    setSaved(false);
    fetchTeacherAttempt(attemptType, id)
      .then((data) => {
        setAttempt(data);
        setOverrideBand(data.teacherReview?.overrideBand != null ? String(data.teacherReview.overrideBand) : '');
        setComment(data.teacherReview?.comment || '');
      })
      .catch((err) => setError(err.message));
  }, [attemptType, id]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const review = await saveReview({
        attemptType,
        attemptId: Number(id),
        overrideBand: overrideBand.trim() ? Number(overrideBand) : null,
        comment: comment.trim() || null,
      });
      setAttempt((prev) => ({ ...prev, teacherReview: review }));
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const ResultsComponent = attempt ? pickResultsView(attemptType, attempt) : null;

  return (
    <div className="admin-standalone">
      <header className="app-header">
        <h1>Attempt review</h1>
        {attempt && (
          <p className="app-subtitle">
            {new Date(attempt.createdAt.replace(' ', 'T') + 'Z').toLocaleString()}
          </p>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {attempt && ResultsComponent && <ResultsComponent result={attempt} />}

      {attempt && (
        <div className="dashboard-section">
          <h2>Your review</h2>
          <form className="auth-form" onSubmit={handleSave}>
            <label>
              Override band (optional, 1–9)
              <input
                type="number"
                min="1"
                max="9"
                step="0.5"
                value={overrideBand}
                onChange={(e) => setOverrideBand(e.target.value)}
                placeholder="Leave blank to keep the AI band"
              />
            </label>
            <label>
              Comment (optional)
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Feedback the student will see alongside their AI feedback"
              />
            </label>
            {saved && <div className="hub-card-badge">Saved — visible to the student now.</div>}
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? 'Saving…' : 'Save review'}
            </button>
          </form>
        </div>
      )}

      <Link to="/teacher" className="btn-secondary">
        Back to my classes
      </Link>
    </div>
  );
}
