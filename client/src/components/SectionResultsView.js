import { AlertTriangle, Check } from 'lucide-react';
import CriterionCard from './CriterionCard';
import LockedFeedback from './LockedFeedback';

export default function SectionResultsView({ result }) {
  const {
    criteria,
    provisional_overall_band,
    section_checklist,
    top_improvements,
    confidence_note,
    preCheck,
    proLocked,
  } = result;

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
        <span className="overall-band-label">Provisional Band (this section only)</span>
        <span className="overall-band-score">{provisional_overall_band}</span>
      </div>

      {section_checklist && (
        <div
          className={
            section_checklist.meets_structural_purpose ? 'improvements' : 'precheck-warning'
          }
        >
          <h3>
            {section_checklist.meets_structural_purpose ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <AlertTriangle size={16} aria-hidden="true" />
            )}{' '}
            Does this section do its job?
          </h3>
          <p>{section_checklist.notes}</p>
        </div>
      )}

      {proLocked ? (
        <LockedFeedback />
      ) : (
        <div className="criteria-grid">
          {Object.entries(criteria).map(([key, data]) => (
            <CriterionCard key={key} criterionKey={key} data={data} />
          ))}
        </div>
      )}

      {top_improvements?.length > 0 && (
        <div className="improvements">
          <h3>Top improvements to focus on</h3>
          <ol>
            {top_improvements.map((imp, i) => (
              <li key={i}>{imp}</li>
            ))}
          </ol>
        </div>
      )}

      {confidence_note && (
        <div className="next-band-gap">
          <h3>About this estimate</h3>
          <p>{confidence_note}</p>
        </div>
      )}

      <p className="disclaimer">
        This is a single-section practice estimate, not a certified full-essay band. Criteria
        like Task Response and Coherence & Cohesion can only be fully judged once the whole
        essay exists — grade a complete essay for a real band estimate.
      </p>
    </div>
  );
}
