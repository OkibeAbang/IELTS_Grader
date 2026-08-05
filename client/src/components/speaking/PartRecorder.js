import { useAudioRecorder } from '../../hooks/useAudioRecorder';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function PartRecorder({ partLabel, title, questions, onComplete }) {
  const { status, durationSec, audioBlob, audioUrl, error, start, stop, reset } = useAudioRecorder();

  function handleContinue() {
    onComplete({ audioBlob, audioUrl, durationSec });
  }

  return (
    <div className="part-recorder">
      <h2>{partLabel}: {title}</h2>
      <ul className="speaking-questions">
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>

      {error && <div className="error-banner">{error}</div>}

      <div className="recorder-controls">
        {status === 'idle' && (
          <button type="button" className="submit-btn" onClick={start}>
            Start recording
          </button>
        )}
        {status === 'recording' && (
          <>
            <span className="recording-indicator">● Recording… {formatTime(durationSec)}</span>
            <button type="button" className="submit-btn" onClick={stop}>
              Stop
            </button>
          </>
        )}
        {status === 'stopped' && (
          <div className="recorder-review">
            <audio controls src={audioUrl} />
            <div className="recorder-review-actions">
              <button type="button" className="btn-secondary" onClick={reset}>
                Re-record
              </button>
              <button type="button" className="submit-btn" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
