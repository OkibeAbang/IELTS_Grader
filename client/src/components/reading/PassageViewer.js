import usePersistedState from '../../hooks/usePersistedState';
import usePersistedCountdown, { formatCountdown } from '../../hooks/usePersistedCountdown';
import QuestionInput from '../QuestionInput';

const TIMER_SECONDS = 20 * 60;

export default function PassageViewer({
  passage,
  answers,
  onAnswerChange,
  onSubmit,
  submitting,
  showTimer = true,
  persistKey,
  startIndex = 0,
  submitLabel = 'Submit answers',
  submittingLabel = 'Scoring…',
}) {
  const [timerEnabled, setTimerEnabled] = usePersistedState(
    persistKey ? `${persistKey}:timerEnabled` : 'passage-viewer:timerEnabled-unkeyed',
    false
  );
  const countdown = usePersistedCountdown(
    persistKey ? `${persistKey}:timer` : 'passage-viewer:timer-unkeyed',
    TIMER_SECONDS
  );

  function toggleTimer() {
    if (countdown.running) {
      countdown.pause();
    } else {
      countdown.start();
    }
  }

  function resetTimer() {
    countdown.reset();
  }

  const answeredCount = Object.values(answers).filter((v) => v && String(v).trim()).length;

  return (
    <div className="reading-layout">
      <div className="reading-passage-col">
        <h2 className="reading-passage-title">{passage.title}</h2>

        {showTimer && (
          <label className="timer-toggle">
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={(e) => {
                setTimerEnabled(e.target.checked);
                resetTimer();
              }}
            />
            Timer mode (20 min)
          </label>
        )}

        {showTimer && timerEnabled && (
          <div className="timer">
            <span className={countdown.secondsLeft === 0 ? 'timer-expired' : ''}>{formatCountdown(countdown.secondsLeft)}</span>
            <button type="button" onClick={toggleTimer}>
              {countdown.running ? 'Pause' : 'Start'}
            </button>
            <button type="button" onClick={resetTimer}>
              Reset
            </button>
          </div>
        )}

        {passage.paragraphs.map((p) => (
          <p key={p.label}>
            <strong>{p.label}.</strong> {p.text}
          </p>
        ))}
      </div>

      <div className="reading-questions-col">
        <p className="app-subtitle">
          {answeredCount} / {passage.questions.length} answered
        </p>

        {passage.questions.map((q, i) => (
          <div key={q.id} className="reading-question">
            <p className="reading-question-prompt">
              {startIndex + i + 1}. {q.prompt}
            </p>
            <QuestionInput question={q} value={answers[q.id]} onChange={onAnswerChange} />
          </div>
        ))}

        <button type="button" className="submit-btn" onClick={onSubmit} disabled={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </div>
  );
}
