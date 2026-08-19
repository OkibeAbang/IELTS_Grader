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

  if (question.type === 'true_false_not_given') {
    return (
      <div className="reading-question-options">
        {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
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
