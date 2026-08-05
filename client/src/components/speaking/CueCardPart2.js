import { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function CueCardPart2({ cueCard, onComplete }) {
  const [phase, setPhase] = useState('prep'); // prep | recording | review
  const [prepRemaining, setPrepRemaining] = useState(cueCard.prepSeconds);
  const { status, durationSec, audioBlob, audioUrl, error, start, stop, reset } = useAudioRecorder();
  const prepTimerRef = useRef(null);

  useEffect(() => {
    if (phase !== 'prep') return undefined;

    prepTimerRef.current = setInterval(() => {
      setPrepRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(prepTimerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === 'prep' && prepRemaining === 0) {
      setPhase('recording');
      start();
    }
  }, [phase, prepRemaining, start]);

  useEffect(() => {
    if (phase === 'recording' && durationSec >= cueCard.speakSeconds) {
      stop();
    }
  }, [phase, durationSec, cueCard.speakSeconds, stop]);

  useEffect(() => {
    if (status === 'stopped') {
      setPhase('review');
    }
  }, [status]);

  function skipPrep() {
    clearInterval(prepTimerRef.current);
    setPrepRemaining(0);
  }

  function handleReRecord() {
    reset();
    setPrepRemaining(cueCard.prepSeconds);
    setPhase('prep');
  }

  function handleContinue() {
    onComplete({ audioBlob, audioUrl, durationSec });
  }

  return (
    <div className="cue-card-part2">
      <h2>Part 2: Long Turn</h2>
      <div className="cue-card">
        <p className="cue-card-topic">{cueCard.topic}</p>
        <ul>
          {cueCard.bulletPoints.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {phase === 'prep' && (
        <div className="recorder-controls">
          <span className="timer">Preparation time: {formatTime(prepRemaining)}</span>
          <button type="button" className="submit-btn" onClick={skipPrep}>
            Start speaking now
          </button>
        </div>
      )}

      {phase === 'recording' && (
        <div className="recorder-controls">
          <span className="recording-indicator">
            ● Recording… {formatTime(durationSec)} / {formatTime(cueCard.speakSeconds)}
          </span>
          <button type="button" className="submit-btn" onClick={stop}>
            Finish early
          </button>
        </div>
      )}

      {phase === 'review' && (
        <div className="recorder-review">
          <audio controls src={audioUrl} />
          <div className="recorder-review-actions">
            <button type="button" className="btn-secondary" onClick={handleReRecord}>
              Re-record
            </button>
            <button type="button" className="submit-btn" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
