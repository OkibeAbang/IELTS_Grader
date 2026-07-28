const CRITERION_LABELS = {
  task_response: 'Task Response',
  task_achievement: 'Task Achievement',
  coherence_cohesion: 'Coherence & Cohesion',
  lexical_resource: 'Lexical Resource',
  grammar_accuracy: 'Grammatical Range & Accuracy',
};

function stripQuotes(text) {
  return text.replace(/^[\s"'“”]+|[\s"'“”]+$/g, '');
}

function CriterionCard({ criterionKey, data }) {
  return (
    <div className="criterion-card">
      <div className="criterion-header">
        <h3>{CRITERION_LABELS[criterionKey] || criterionKey}</h3>
        <span className="band-badge">{data.band}</span>
      </div>
      {data.strengths?.length > 0 && (
        <div className="criterion-section">
          <h4>Strengths</h4>
          <ul>
            {data.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {data.weaknesses?.length > 0 && (
        <div className="criterion-section">
          <h4>Weaknesses</h4>
          <ul>
            {data.weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      {data.evidence?.length > 0 && (
        <div className="criterion-section">
          <h4>Evidence from your essay</h4>
          <ul>
            {data.evidence.map((e, i) => (
              <li key={i} className="evidence">
                "{stripQuotes(e)}"
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ResultsView({ result }) {
  const { criteria, overall_band, top_3_improvements, next_band_gap, preCheck } = result;

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

      <p className="disclaimer">
        This is an AI-generated estimate, not a certified score. Treat it as a diagnostic
        signal for spotting patterns in your writing, not a guaranteed exam result.
      </p>
    </div>
  );
}
