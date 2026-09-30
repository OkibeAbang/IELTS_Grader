import { Check, X } from 'lucide-react';
import formatUserAnswer from '../utils/formatAnswer';

export default function ReadingFullTestResultsView({ result }) {
  const { correctCount, totalQuestions, overallBand, passageResults } = result;

  let runningIndex = 0;

  return (
    <div className="results-view">
      <div className="overall-band">
        <span className="overall-band-label">Overall Band</span>
        <span className="overall-band-score">{overallBand}</span>
        <span>{correctCount} / {totalQuestions} correct</span>
      </div>

      {passageResults.map((passage) => (
        <div key={passage.passageId} className="reading-full-test-passage-section">
          <h3>
            Part {passage.part} — {passage.passageTitle}
            <span className="topic-badge"> {passage.correctCount} / {passage.totalQuestions} correct</span>
          </h3>
          <div className="reading-review-list">
            {passage.questionResults.map((q) => {
              runningIndex += 1;
              return (
                <div
                  key={q.id}
                  className={q.isCorrect ? 'reading-review-item reading-answer-correct' : 'reading-review-item reading-answer-incorrect'}
                >
                  <p className="reading-question-prompt">
                    {runningIndex}. {q.prompt}
                  </p>
                  <p>Your answer: <strong>{formatUserAnswer(q.userAnswer)}</strong></p>
                  {!q.isCorrect && <p>Correct answer: <strong>{q.correctAnswer}</strong></p>}
                  <span>
                    {q.isCorrect ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}{' '}
                    {q.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="disclaimer">
        This score is calculated from a published approximation of the IELTS Reading band
        conversion table, not an official Cambridge/IDP score.
      </p>
    </div>
  );
}
