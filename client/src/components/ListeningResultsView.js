import { Check, X } from 'lucide-react';

export default function ListeningResultsView({ result }) {
  const { correctCount, totalQuestions, overallBand, questionResults, script } = result;

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
            <span>
              {q.isCorrect ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}{' '}
              {q.isCorrect ? 'Correct' : 'Incorrect'}
            </span>
          </div>
        ))}
      </div>

      {script?.length > 0 && (
        <div className="transcripts">
          <h3>Transcript</h3>
          <p className="corrections-subtitle">Now that you've submitted, here's what was said.</p>
          {script.map((turn, i) => (
            <p key={i}>
              <strong>{turn.speaker}:</strong> {turn.line}
            </p>
          ))}
        </div>
      )}

      <p className="disclaimer">
        This score is calculated from a published approximation of the IELTS Listening band
        conversion table, not an official Cambridge/IDP score.
      </p>
    </div>
  );
}
