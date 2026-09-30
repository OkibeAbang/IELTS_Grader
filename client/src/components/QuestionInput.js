export default function QuestionInput({ question, value, onChange }) {
  if (question.type === 'multiple_choice') {
    return (
      <div className="reading-question-options">
        {question.options.map((opt) => (
          <label key={opt.key} className="reading-question-option">
            <input
              type="radio"
              name={question.id}
              value={opt.key}
              checked={value === opt.key}
              onChange={(e) => onChange(question.id, e.target.value)}
            />
            <span>{opt.key}. {opt.text}</span>
          </label>
        ))}
      </div>
    );
  }

  if (question.type === 'multiple_select') {
    const selected = Array.isArray(value) ? value : [];
    const atCap = selected.length >= question.chooseCount;

    function toggle(key) {
      if (selected.includes(key)) {
        onChange(question.id, selected.filter((k) => k !== key));
      } else if (!atCap) {
        onChange(question.id, [...selected, key]);
      }
    }

    return (
      <div className="reading-question-options">
        <p className="reading-word-limit-hint">
          Choose {question.chooseCount} — {selected.length} / {question.chooseCount} selected
        </p>
        {question.options.map((opt) => (
          <label key={opt.key} className="reading-question-option">
            <input
              type="checkbox"
              checked={selected.includes(opt.key)}
              disabled={!selected.includes(opt.key) && atCap}
              onChange={() => toggle(opt.key)}
            />
            <span>{opt.key}. {opt.text}</span>
          </label>
        ))}
      </div>
    );
  }

  if (question.type === 'true_false_not_given' || question.type === 'yes_no_not_given') {
    const options = question.type === 'yes_no_not_given' ? ['YES', 'NO', 'NOT GIVEN'] : ['TRUE', 'FALSE', 'NOT GIVEN'];
    return (
      <div className="reading-question-options">
        {options.map((opt) => (
          <label key={opt} className="reading-question-option">
            <input
              type="radio"
              name={question.id}
              value={opt}
              checked={value === opt}
              onChange={(e) => onChange(question.id, e.target.value)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="reading-short-answer">
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(question.id, e.target.value)}
        placeholder="Your answer"
      />
      {question.wordLimit && <span className="reading-word-limit-hint">{question.wordLimit}</span>}
    </div>
  );
}
