import { Link } from 'react-router-dom';

const URGENCY_LABELS = {
  final_push: 'Final push',
  focused_sprint: 'Focused sprint',
  steady_build: 'Steady build',
};

export default function StudyPlanView({ studyPlan, onRetake }) {
  const { plan, testDate, targetBand } = studyPlan;

  return (
    <div>
      <p className="app-subtitle">
        {targetBand ? `Target band ${Number(targetBand).toFixed(1)}` : 'No target band set'}
        {testDate ? ` · Test date ${new Date(testDate).toLocaleDateString()}` : ''}
      </p>

      <div className="precheck-warning">
        <p><strong>{URGENCY_LABELS[plan.urgency] ?? plan.urgency}</strong> — {plan.summary}</p>
      </div>

      <div className="hub-grid">
        {plan.focus.map((f) => (
          <div key={f.skill} className="hub-card">
            <span className="hub-card-title">{f.label}</span>
            <span className="hub-card-badge">{f.sessionsPerWeek}x / week</span>
            <p className="hub-card-description">{f.rationale}</p>
            {f.links.map((link) => (
              <Link key={link.to} to={link.to} className="btn-secondary">{link.label}</Link>
            ))}
          </div>
        ))}
      </div>

      <div className="improvements">
        <h3>Checkpoints</h3>
        <ol>
          {plan.checkpoints.map((c) => (
            <li key={c.label}><Link to={c.to}>{c.label}</Link></li>
          ))}
        </ol>
      </div>

      <button type="button" className="btn-secondary" onClick={onRetake}>
        Retake questionnaire
      </button>
    </div>
  );
}
