import { useEffect, useRef, useState } from 'react';
import PromptPicker from './PromptPicker';

const MIN_WORDS = { task1: 150, task2: 250 };
const TIMER_SECONDS = 40 * 60;

function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function EssayForm({ onSubmit, submitting }) {
  const [taskType, setTaskType] = useState('task2');
  const [prompt, setPrompt] = useState('');
  const [essay, setEssay] = useState('');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef(null);

  const wordCount = countWords(essay);
  const minWords = MIN_WORDS[taskType];

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

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ essay, prompt, taskType });
  }

  return (
    <form className="essay-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <label>
          Task type
          <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
            <option value="task1">Task 1 (report/letter)</option>
            <option value="task2">Task 2 (essay)</option>
          </select>
        </label>

        <label className="timer-toggle">
          <input
            type="checkbox"
            checked={timerEnabled}
            onChange={(e) => {
              setTimerEnabled(e.target.checked);
              resetTimer();
            }}
          />
          Timer mode (40 min)
        </label>

        {timerEnabled && (
          <div className="timer">
            <span className={secondsLeft === 0 ? 'timer-expired' : ''}>
              {formatTime(secondsLeft)}
            </span>
            <button type="button" onClick={toggleTimer}>
              {timerRunning ? 'Pause' : 'Start'}
            </button>
            <button type="button" onClick={resetTimer}>
              Reset
            </button>
          </div>
        )}
      </div>

      <label>
        Task prompt
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste the exact IELTS question here..."
          rows={4}
          required
        />
      </label>

      <PromptPicker taskType={taskType} onSelect={setPrompt} />

      <label>
        Your essay
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Write or paste your essay here..."
          rows={16}
          required
        />
      </label>

      <div className="word-count-row">
        <span className={wordCount < minWords ? 'word-count-low' : 'word-count-ok'}>
          {wordCount} words (minimum {minWords})
        </span>
      </div>

      <button type="submit" disabled={submitting} className="submit-btn">
        {submitting ? 'Grading...' : 'Grade my essay'}
      </button>
    </form>
  );
}
