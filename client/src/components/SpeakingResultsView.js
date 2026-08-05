import CriterionCard from './CriterionCard';

const PART_LABELS = {
  part1: 'Part 1 — Interview',
  part2: 'Part 2 — Long Turn',
  part3: 'Part 3 — Discussion',
};

export default function SpeakingResultsView({ result }) {
  const { criteria, overall_band, top_3_improvements, next_band_gap, part_transcripts, preCheck } = result;

  return (
    <div className="results-view">
      {preCheck?.issues?.length > 0 && (
        <div className="precheck-warning">
          {preCheck.issues.map((issue, i) => (
            <p key={i}>⚠ {issue}</p>
          ))}
        </div>
      )}

      <div className="overall-band">
        <span className="overall-band-label">Overall Band</span>
        <span className="overall-band-score">{overall_band}</span>
      </div>

      <div className="criteria-grid">
        {Object.entries(criteria).map(([key, data]) => (
          <CriterionCard key={key} criterionKey={key} data={data} />
        ))}
      </div>

      {top_3_improvements?.length > 0 && (
        <div className="improvements">
          <h3>Top improvements to focus on</h3>
          <ol>
            {top_3_improvements.map((imp, i) => (
              <li key={i}>{imp}</li>
            ))}
          </ol>
        </div>
      )}

      {next_band_gap && (
        <div className="next-band-gap">
          <h3>What separates this from the next band</h3>
          <p>{next_band_gap}</p>
        </div>
      )}

      {part_transcripts && (
        <div className="transcripts">
          <h3>Transcripts</h3>
          {Object.entries(PART_LABELS).map(([key, label]) =>
            part_transcripts[key] ? (
              <div key={key} className="transcript-part">
                <h4>{label}</h4>
                <p>{part_transcripts[key]}</p>
              </div>
            ) : null
          )}
        </div>
      )}

      <p className="disclaimer">
        This is an AI-generated estimate, not a certified score. Treat it as a diagnostic
        signal for spotting patterns in your speaking, not a guaranteed exam result.
      </p>
    </div>
  );
}
