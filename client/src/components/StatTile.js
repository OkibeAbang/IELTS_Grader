function formatDelta(delta) {
  if (delta > 0) return `+${delta.toFixed(1)}`;
  if (delta < 0) return delta.toFixed(1);
  return 'No change';
}

function deltaClass(delta) {
  if (delta > 0) return 'stat-tile-delta stat-tile-delta-up';
  if (delta < 0) return 'stat-tile-delta stat-tile-delta-down';
  return 'stat-tile-delta stat-tile-delta-flat';
}

export default function StatTile({ label, value, delta }) {
  return (
    <div className="stat-tile">
      <span className="stat-tile-label">{label}</span>
      <span className="stat-tile-value">{value}</span>
      {delta !== undefined && (
        <span className={deltaClass(delta)}>{formatDelta(delta)} vs previous</span>
      )}
    </div>
  );
}
