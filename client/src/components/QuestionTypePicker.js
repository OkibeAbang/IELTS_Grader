export default function QuestionTypePicker({
  types,
  onSelect,
  title = 'Choose a question type',
  subtitle = 'Drill just this type of question, with instant feedback.',
}) {
  return (
    <div className="topic-picker">
      <h2>{title}</h2>
      <p className="app-subtitle">{subtitle}</p>
      <div className="topic-grid">
        {types.map((t) => (
          <button key={t.value} type="button" className="topic-card" onClick={() => onSelect(t.value)}>
            <span className="topic-card-title">{t.label}</span>
            {t.description && <span className="topic-card-badges"><span className="topic-badge">{t.description}</span></span>}
          </button>
        ))}
      </div>
    </div>
  );
}
