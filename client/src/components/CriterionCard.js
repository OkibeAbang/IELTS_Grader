const CRITERION_LABELS = {
  task_response: 'Task Response',
  task_achievement: 'Task Achievement',
  coherence_cohesion: 'Coherence & Cohesion',
  lexical_resource: 'Lexical Resource',
  grammar_accuracy: 'Grammatical Range & Accuracy',
  fluency_coherence: 'Fluency & Coherence',
  pronunciation: 'Pronunciation',
};

function stripQuotes(text) {
  return text.replace(/^[\s"'“”]+|[\s"'“”]+$/g, '');
}

export default function CriterionCard({ criterionKey, data }) {
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
          <h4>Evidence</h4>
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

export { CRITERION_LABELS };
