import { Link } from 'react-router-dom';
import BandTrendChart from './BandTrendChart';
import StatTile from './StatTile';

function roundToHalfBand(value) {
  return Math.round(value * 2) / 2;
}

export default function AttemptSection({
  title,
  attempts,
  statsAttempts,
  error,
  emptyMessage,
  historyBasePath,
  onDelete,
  columns,
  chartLabelKey,
  showChart = true,
}) {
  // statsAttempts lets a caller compute the stat tiles/chart from a subset of
  // `attempts` (e.g. excluding drill-mode rows) while the table still shows
  // everything. Omitted, this is a no-op — stats come from `attempts` itself,
  // same as before this prop existed.
  const statsSource = statsAttempts ?? attempts;
  const hasAttempts = attempts && attempts.length > 0;
  const hasStatsAttempts = statsSource && statsSource.length > 0;
  // Attempts arrive newest-first from the API.
  const latest = hasStatsAttempts ? statsSource[0] : null;
  const previous = statsSource && statsSource.length > 1 ? statsSource[1] : null;
  const average = hasStatsAttempts
    ? roundToHalfBand(statsSource.reduce((sum, a) => sum + a.overallBand, 0) / statsSource.length)
    : null;
  const best = hasStatsAttempts ? Math.max(...statsSource.map((a) => a.overallBand)) : null;

  return (
    <>
      <h2>{title}</h2>

      {error && <div className="error-banner">{error}</div>}

      {attempts && attempts.length === 0 && <div className="dashboard-empty">{emptyMessage}</div>}

      {hasStatsAttempts && (
        <div className="dashboard-stats">
          <StatTile label="Total attempts" value={statsSource.length} />
          <StatTile label="Average band" value={average} />
          <StatTile
            label="Latest band"
            value={latest.overallBand}
            delta={previous ? latest.overallBand - previous.overallBand : undefined}
          />
          <StatTile label="Best band" value={best} />
        </div>
      )}

      {showChart && hasStatsAttempts && statsSource.length >= 2 && (
        <div className="dashboard-section">
          <BandTrendChart attempts={statsSource.map((a) => ({ ...a, topicLabel: a[chartLabelKey] }))} />
        </div>
      )}

      {hasAttempts && (
        <div className="dashboard-section">
          <h3>Recent attempts</h3>
          <table className="attempt-history-table">
            <thead>
              <tr>
                <th>Date</th>
                {columns.map((col) => (
                  <th key={col.header}>{col.header}</th>
                ))}
                <th>Overall Band</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.createdAt.replace(' ', 'T') + 'Z').toLocaleString()}</td>
                  {columns.map((col) => (
                    <td key={col.header}>{col.render(a)}</td>
                  ))}
                  <td>
                    <span className="band-badge">{a.overallBand}</span>
                  </td>
                  <td className="attempt-history-actions">
                    <Link to={`${historyBasePath}/${a.id}`} className="btn-secondary">
                      View
                    </Link>
                    <button type="button" className="btn-secondary" onClick={() => onDelete(a.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
