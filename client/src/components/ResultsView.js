import { AlertTriangle } from 'lucide-react';
import CriterionCard from './CriterionCard';
import LockedFeedback from './LockedFeedback';

export default function ResultsView({ result }) {
  const { criteria, overall_band, top_3_improvements, next_band_gap, preCheck, proLocked } = result;

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
      </div>

      {proLocked ? (
        <LockedFeedback />
      ) : (
        <div className="criteria-grid">
          {Object.entries(criteria).map(([key, data]) => (
            <CriterionCard key={key} criterionKey={key} data={data} />
          ))}
        </div>
      )}

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

      <p className="disclaimer">
        This is an AI-generated estimate, not a certified score. Treat it as a diagnostic
        signal for spotting patterns in your writing, not a guaranteed exam result.
      </p>
    </div>
  );
}
