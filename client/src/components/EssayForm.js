import usePersistedState from '../hooks/usePersistedState';
import usePersistedCountdown, { formatCountdown } from '../hooks/usePersistedCountdown';
import PromptPicker from './PromptPicker';

const MIN_WORDS = { task1: 150, task2: 250 };
const TIMER_SECONDS = 40 * 60;

function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function EssayForm({ onSubmit, submitting, persistKey = 'essay-grader' }) {
  const [taskType, setTaskType] = usePersistedState(`${persistKey}:taskType`, 'task2');
  const [prompt, setPrompt] = usePersistedState(`${persistKey}:prompt`, '');
  const [essay, setEssay] = usePersistedState(`${persistKey}:essay`, '');
  const [timerEnabled, setTimerEnabled] = usePersistedState(`${persistKey}:timerEnabled`, false);
  const countdown = usePersistedCountdown(`${persistKey}:timer`, TIMER_SECONDS);

  const wordCount = countWords(essay);
  const minWords = MIN_WORDS[taskType];

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
            <span className={countdown.secondsLeft === 0 ? 'timer-expired' : ''}>
              {formatCountdown(countdown.secondsLeft)}
            </span>
            <button type="button" onClick={toggleTimer}>
              {countdown.running ? 'Pause' : 'Start'}
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
