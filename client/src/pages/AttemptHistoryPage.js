import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAttemptHistory, deleteAttempt } from '../api/speaking';
import BandTrendChart from '../components/speaking/BandTrendChart';
import StatTile from '../components/StatTile';

function roundToHalfBand(value) {
  return Math.round(value * 2) / 2;
}

export default function AttemptHistoryPage() {
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState(null);

  function load() {
    fetchAttemptHistory()
      .then(setAttempts)
      .catch((err) => setError(err.message));
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

  const hasAttempts = attempts && attempts.length > 0;
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
          Your speaking practice history and band trend over time. Essay grading doesn't save
          attempts, so this covers speaking practice only.
        </p>
      </header>

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
    </div>
  );
}
