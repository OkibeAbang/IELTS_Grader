import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAttemptHistory, deleteAttempt } from '../api/speaking';
import { fetchEssayHistory, deleteEssayAttempt } from '../api/writing';
import BandTrendChart from '../components/speaking/BandTrendChart';
import StatTile from '../components/StatTile';

const SECTION_LABELS = {
  introduction: 'Introduction',
  main_body: 'Main Body Paragraph',
  conclusion: 'Conclusion',
};

function roundToHalfBand(value) {
  return Math.round(value * 2) / 2;
}

export default function AttemptHistoryPage() {
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState(null);
  const [essayAttempts, setEssayAttempts] = useState(null);
  const [essayError, setEssayError] = useState(null);

  function load() {
    fetchAttemptHistory()
      .then(setAttempts)
      .catch((err) => setError(err.message));
    fetchEssayHistory()
      .then(setEssayAttempts)
      .catch((err) => setEssayError(err.message));
  }

  useEffect(load, []);

  async function handleDelete(id) {
    try {
      await deleteAttempt(id);
      setAttempts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEssayDelete(id) {
    try {
      await deleteEssayAttempt(id);
      setEssayAttempts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setEssayError(err.message);
    }
  }

  const hasAttempts = attempts && attempts.length > 0;
  const hasEssayAttempts = essayAttempts && essayAttempts.length > 0;
  const essayAverage = hasEssayAttempts
    ? roundToHalfBand(essayAttempts.reduce((sum, a) => sum + a.overallBand, 0) / essayAttempts.length)
    : null;
  const essayLatest = hasEssayAttempts ? essayAttempts[0] : null;
  const essayPrevious = essayAttempts && essayAttempts.length > 1 ? essayAttempts[1] : null;
  const essayBest = hasEssayAttempts ? Math.max(...essayAttempts.map((a) => a.overallBand)) : null;
  // Attempts arrive newest-first from the API.
  const latest = hasAttempts ? attempts[0] : null;
  const previous = attempts && attempts.length > 1 ? attempts[1] : null;
  const average = hasAttempts
    ? roundToHalfBand(attempts.reduce((sum, a) => sum + a.overallBand, 0) / attempts.length)
    : null;
  const best = hasAttempts ? Math.max(...attempts.map((a) => a.overallBand)) : null;

  return (
    <div>
      <header className="app-header">
        <h1>Dashboard</h1>
        <p className="app-subtitle">
          Your speaking and essay grading history, and your band trend over time.
        </p>
      </header>

      <h2>Speaking Practice</h2>

      {error && <div className="error-banner">{error}</div>}

      {attempts && attempts.length === 0 && (
        <div className="dashboard-empty">
          No attempts yet. Complete a speaking practice session to see your progress here.
        </div>
      )}

      {hasAttempts && (
        <>
          <div className="dashboard-stats">
            <StatTile label="Total attempts" value={attempts.length} />
            <StatTile label="Average band" value={average} />
            <StatTile
              label="Latest band"
              value={latest.overallBand}
              delta={previous ? latest.overallBand - previous.overallBand : undefined}
            />
            <StatTile label="Best band" value={best} />
          </div>

          {attempts.length >= 2 && (
            <div className="dashboard-section">
              <BandTrendChart attempts={attempts} />
            </div>
          )}

          <div className="dashboard-section">
            <h2>Recent attempts</h2>
            <table className="attempt-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Overall Band</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.createdAt.replace(' ', 'T') + 'Z').toLocaleString()}</td>
                    <td>{a.topicLabel}</td>
                    <td>
                      <span className="band-badge">{a.overallBand}</span>
                    </td>
                    <td className="attempt-history-actions">
                      <Link to={`/speaking/history/${a.id}`} className="btn-secondary">
                        View
                      </Link>
                      <button type="button" className="btn-secondary" onClick={() => handleDelete(a.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2>Essay Grading</h2>

      {essayError && <div className="error-banner">{essayError}</div>}

      {essayAttempts && essayAttempts.length === 0 && (
        <div className="dashboard-empty">
          No essay attempts yet. Grade an essay or practice a section to see your progress here.
        </div>
      )}

      {hasEssayAttempts && (
        <>
          <div className="dashboard-stats">
            <StatTile label="Total attempts" value={essayAttempts.length} />
            <StatTile label="Average band" value={essayAverage} />
            <StatTile
              label="Latest band"
              value={essayLatest.overallBand}
              delta={essayPrevious ? essayLatest.overallBand - essayPrevious.overallBand : undefined}
            />
            <StatTile label="Best band" value={essayBest} />
          </div>

          <div className="dashboard-section">
            <h3>Recent attempts</h3>
            <table className="attempt-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Task</th>
                  <th>Mode</th>
                  <th>Overall Band</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {essayAttempts.map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.createdAt.replace(' ', 'T') + 'Z').toLocaleString()}</td>
                    <td>{a.taskType === 'task1' ? 'Task 1' : 'Task 2'}</td>
                    <td>{a.mode === 'full' ? 'Full Essay' : `Section — ${SECTION_LABELS[a.section] ?? a.section}`}</td>
                    <td>
                      <span className="band-badge">{a.overallBand}</span>
                    </td>
                    <td className="attempt-history-actions">
                      <Link to={`/essay-grader/history/${a.id}`} className="btn-secondary">
                        View
                      </Link>
                      <button type="button" className="btn-secondary" onClick={() => handleEssayDelete(a.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
