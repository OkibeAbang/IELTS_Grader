const PART_LABELS = {
  part1: 'Part 1 — Interview',
  part2: 'Part 2 — Long Turn',
  part3: 'Part 3 — Discussion',
};

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ReviewSubmit({ recordings, onReRecord, onSubmit, submitting }) {
  return (
    <div className="review-submit">
      <h2>Review your recordings</h2>
      <p className="app-subtitle">Listen back to each part before submitting for grading.</p>

      {Object.entries(PART_LABELS).map(([key, label]) => {
        const rec = recordings[key];
        if (!rec) return null;
        return (
          <div key={key} className="review-part">
            <div className="review-part-header">
              <h3>{label}</h3>
              <span className="timer">{formatTime(rec.durationSec)}</span>
            </div>
            <audio controls src={rec.audioUrl} />
            <button type="button" className="btn-secondary" onClick={() => onReRecord(key)}>
              Re-record {label}
            </button>
          </div>
        );
      })}

      <button type="button" className="submit-btn" onClick={onSubmit} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit for grading'}
      </button>
    </div>
  );
}
