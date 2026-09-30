import { Check, X } from 'lucide-react';

export default function ListeningFullTestResultsView({ result }) {
  const { correctCount, totalQuestions, overallBand, sectionResults } = result;

  let runningIndex = 0;

  return (
    <div className="results-view">
      <div className="overall-band">
        <span className="overall-band-label">Overall Band</span>
        <span className="overall-band-score">{overallBand}</span>
        <span>{correctCount} / {totalQuestions} correct</span>
      </div>

      {sectionResults.map((section) => (
        <div key={section.sectionId} className="reading-full-test-passage-section">
          <h3>
            Part {section.part} — {section.sectionTitle}
            <span className="topic-badge"> {section.correctCount} / {section.totalQuestions} correct</span>
          </h3>
          <div className="reading-review-list">
            {section.questionResults.map((q) => {
              runningIndex += 1;
              return (
                <div
                  key={q.id}
                  className={q.isCorrect ? 'reading-review-item reading-answer-correct' : 'reading-review-item reading-answer-incorrect'}
                >
                  <p className="reading-question-prompt">
                    {runningIndex}. {q.prompt}
                  </p>
                  <p>Your answer: <strong>{q.userAnswer || '—'}</strong></p>
                  {!q.isCorrect && <p>Correct answer: <strong>{q.correctAnswer}</strong></p>}
                  <span>
                    {q.isCorrect ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}{' '}
                    {q.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              );
            })}
          </div>

          {section.script?.length > 0 && (
            <div className="transcripts">
              <h4>Transcript — Part {section.part}</h4>
              {section.script.map((turn, i) => (
                <p key={i}>
                  <strong>{turn.speaker}:</strong> {turn.line}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}

      <p className="disclaimer">
        This score is calculated from a published approximation of the IELTS Listening band
        conversion table, not an official Cambridge/IDP score.
      </p>
    </div>
  );
}
