export default function ReadingResultsView({ result }) {
  const { correctCount, totalQuestions, overallBand, questionResults } = result;

  return (
    <div className="results-view">
      <div className="overall-band">
        <span className="overall-band-label">Overall Band</span>
        <span className="overall-band-score">{overallBand}</span>
        <span>{correctCount} / {totalQuestions} correct</span>
      </div>

      <div className="reading-review-list">
        {questionResults.map((q, i) => (
          <div
            key={q.id}
            className={q.isCorrect ? 'reading-review-item reading-answer-correct' : 'reading-review-item reading-answer-incorrect'}
          >
            <p className="reading-question-prompt">
              {i + 1}. {q.prompt}
            </p>
            <p>Your answer: <strong>{q.userAnswer || '—'}</strong></p>
            {!q.isCorrect && <p>Correct answer: <strong>{q.correctAnswer}</strong></p>}
            <span>{q.isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
          </div>
        ))}
      </div>

      <p className="disclaimer">
        This score is calculated from a published approximation of the IELTS Reading band
        conversion table, not an official Cambridge/IDP score.
      </p>
    </div>
  );
}
