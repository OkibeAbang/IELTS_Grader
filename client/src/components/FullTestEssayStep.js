import { useEffect } from 'react';
import usePersistedState from '../hooks/usePersistedState';
import usePersistedCountdown, { formatCountdown } from '../hooks/usePersistedCountdown';

const MIN_WORDS = { task1: 150, task2: 250 };

function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function FullTestEssayStep({ persistKey, taskType, taskLabel, prompt, minutes, onSubmit, submitting }) {
  const [essay, setEssay] = usePersistedState(`${persistKey}:essay`, '');
  const countdown = usePersistedCountdown(`${persistKey}:timer`, minutes * 60, () => onSubmit(essay));

  useEffect(() => {
    countdown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wordCount = countWords(essay);
  const minWords = MIN_WORDS[taskType];

  return (
    <form
      className="essay-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(essay);
      }}
    >
      <div className="field-row">
        <h2>{taskLabel}</h2>
        <div className="timer">
          <span className={countdown.secondsLeft === 0 ? 'timer-expired' : ''}>
            {formatCountdown(countdown.secondsLeft)}
          </span>
        </div>
      </div>

      <p className="reading-question-prompt">{prompt}</p>

      <label>
        Your essay
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Write your essay here..."
          rows={16}
          required
        />
      </label>

      <div className="word-count-row">
        <span
          className={
            wordCount === 0 ? 'word-count-neutral' : wordCount < minWords ? 'word-count-low' : 'word-count-ok'
          }
        >
          {wordCount} words (minimum {minWords})
        </span>
      </div>

      <button type="submit" disabled={submitting} className="submit-btn">
        {submitting ? 'Grading...' : 'Submit & continue'}
      </button>
    </form>
  );
}
