import { AlertTriangle } from 'lucide-react';
import CriterionCard from './CriterionCard';

const PART_LABELS = {
  part1: 'Part 1 — Interview',
  part2: 'Part 2 — Long Turn',
  part3: 'Part 3 — Discussion',
};

function targetGapInfo(overallBand, targetBand) {
  const gap = Math.round((overallBand - targetBand) * 10) / 10;
  if (gap >= 0) return { label: gap === 0 ? 'On target' : `+${gap.toFixed(1)} above target`, className: 'target-gap-met' };
  return { label: `${gap.toFixed(1)} below target`, className: 'target-gap-below' };
}

export default function SpeakingResultsView({ result }) {
  const { criteria, overall_band, targetBand, top_3_improvements, next_band_gap, corrections, part_transcripts, preCheck } = result;
  const gapInfo = targetBand ? targetGapInfo(overall_band, targetBand) : null;

  return (
    <div className="results-view">
      {preCheck?.issues?.length > 0 && (
        <div className="precheck-warning">
          {preCheck.issues.map((issue, i) => (
            <p key={i}><AlertTriangle size={14} aria-hidden="true" /> {issue}</p>
          ))}
        </div>
      )}

      <div className="overall-band">
        <span className="overall-band-label">Overall Band</span>
        <span className="overall-band-score">{overall_band}</span>
        {gapInfo && (
          <span className={`target-gap ${gapInfo.className}`}>
            Target {Number(targetBand).toFixed(1)} · {gapInfo.label}
          </span>
        )}
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

      {corrections?.length > 0 && (
        <div className="corrections">
          <h3>Try saying it this way</h3>
          <p className="corrections-subtitle">
            Simple swaps that could lift your score{targetBand ? ` toward Band ${Number(targetBand).toFixed(1)}` : ''}.
          </p>
          <ul className="corrections-list">
            {corrections.map((c, i) => (
              <li key={i} className="correction-item">
                <div className="correction-original">
                  <span className="correction-label">You said</span>
                  <p>&ldquo;{c.original}&rdquo;</p>
                </div>
                <div className="correction-suggestion">
                  <span className="correction-label">Try instead</span>
                  <p>&ldquo;{c.correction}&rdquo;</p>
                </div>
                {c.why && <p className="correction-why">{c.why}</p>}
              </li>
            ))}
          </ul>
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
