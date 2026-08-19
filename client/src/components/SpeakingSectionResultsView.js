import CriterionCard from './CriterionCard';

const PART_LABELS = {
  part1: 'Part 1 — Interview',
  part2: 'Part 2 — Long Turn',
  part3: 'Part 3 — Discussion',
};

export default function SpeakingSectionResultsView({ result }) {
  const { part, criteria, provisional_overall_band, top_improvements, confidence_note, corrections, transcript, preCheck } = result;

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
        <span className="overall-band-label">
          Provisional Band {part ? `— ${PART_LABELS[part] ?? part}` : '(this part only)'}
        </span>
        <span className="overall-band-score">{provisional_overall_band}</span>
      </div>

      <div className="criteria-grid">
        {Object.entries(criteria).map(([key, data]) => (
          <CriterionCard key={key} criterionKey={key} data={data} />
        ))}
      </div>

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

      {corrections?.length > 0 && (
        <div className="corrections">
          <h3>Try saying it this way</h3>
          <p className="corrections-subtitle">Simple swaps that could lift your score.</p>
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

      {transcript && (
        <div className="transcripts">
          <h3>Transcript</h3>
          <p>{transcript}</p>
        </div>
      )}

      <p className="disclaimer">
        This is a single-part practice estimate, not a certified full-Speaking-test band. Real
        IELTS Speaking is judged holistically across all 3 parts — grade a full attempt for a
        real band estimate.
      </p>
    </div>
  );
}
