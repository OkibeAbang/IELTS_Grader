import { useEffect, useRef, useState } from 'react';
import QuestionInput from '../QuestionInput';

const TIMER_SECONDS = 20 * 60;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PassageViewer({ passage, answers, onAnswerChange, onSubmit, submitting, showTimer = true }) {
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!timerRunning) return undefined;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setTimerRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  function toggleTimer() {
    if (timerRunning) {
      setTimerRunning(false);
    } else {
      if (secondsLeft === 0) setSecondsLeft(TIMER_SECONDS);
      setTimerRunning(true);
    }
  }

  function resetTimer() {
    setTimerRunning(false);
    setSecondsLeft(TIMER_SECONDS);
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
            <span className={secondsLeft === 0 ? 'timer-expired' : ''}>{formatTime(secondsLeft)}</span>
            <button type="button" onClick={toggleTimer}>
              {timerRunning ? 'Pause' : 'Start'}
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
              {i + 1}. {q.prompt}
            </p>
            <QuestionInput question={q} value={answers[q.id]} onChange={onAnswerChange} />
          </div>
        ))}

        <button type="button" className="submit-btn" onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Scoring…' : 'Submit answers'}
        </button>
      </div>
    </div>
  );
}
