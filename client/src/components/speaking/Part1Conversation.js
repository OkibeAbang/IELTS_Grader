import { useState } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { mergeAudioBlobs } from '../../utils/mergeAudioBlobs';
import AudioVisualizer from './AudioVisualizer';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Part1Conversation({ questions, onComplete }) {
  const [answers, setAnswers] = useState([]);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState(null);
  const { status, durationSec, audioBlob, audioUrl, error, audioLevel, start, stop, reset } = useAudioRecorder();

  const currentIndex = answers.length;
  const isLastQuestion = currentIndex === questions.length - 1;

  async function handleConfirmAnswer() {
    // A URL of our own, independent of the recorder hook's — reset()/start()
    // revoke the hook's own audioUrl on the next question, which would
    // otherwise kill playback for every answer already confirmed.
    const thisAnswer = { audioBlob, audioUrl: URL.createObjectURL(audioBlob), durationSec };
    const nextAnswers = [...answers, thisAnswer];

    if (nextAnswers.length < questions.length) {
      setAnswers(nextAnswers);
      reset();
      return;
    }

    setFinishing(true);
    setFinishError(null);
    try {
      const mergedBlob = await mergeAudioBlobs(nextAnswers.map((a) => a.audioBlob));
      const totalDuration = nextAnswers.reduce((sum, a) => sum + a.durationSec, 0);
      onComplete({ audioBlob: mergedBlob, audioUrl: URL.createObjectURL(mergedBlob), durationSec: totalDuration });
    } catch (err) {
      setFinishError(err.message || "Couldn't combine your answers — please try again.");
      setFinishing(false);
    }
  }

  return (
    <div className="part-recorder">
      <h2>Part 1: Interview</h2>
      <p className="app-subtitle">
        Answer each question like a real conversation — the next question appears once you've
        confirmed your answer.
      </p>

      <div className="conversation-thread">
        {questions.slice(0, currentIndex).map((q, i) => (
          <div key={i} className="conversation-turn">
            <div className="chat-bubble chat-bubble-examiner">{q}</div>
            <div className="chat-bubble chat-bubble-you">
              <audio controls src={answers[i].audioUrl} />
            </div>
          </div>
        ))}

        {currentIndex < questions.length && (
          <div className="conversation-turn">
            <div className="chat-bubble chat-bubble-examiner">{questions[currentIndex]}</div>

            {error && <div className="error-banner">{error}</div>}

            {status === 'idle' && (
              <button type="button" className="submit-btn" onClick={start}>
                Answer
              </button>
            )}

            {status === 'recording' && (
              <div className="recorder-controls">
                <AudioVisualizer level={audioLevel} />
                <span className="recording-indicator">● Recording… {formatTime(durationSec)}</span>
                <button type="button" className="submit-btn" onClick={stop}>
                  Stop
                </button>
              </div>
            )}

            {status === 'stopped' && (
              <div className="chat-bubble chat-bubble-you">
                <div className="recorder-review">
                  <audio controls src={audioUrl} />
                  <div className="recorder-review-actions">
                    <button type="button" className="btn-secondary" onClick={reset} disabled={finishing}>
                      Re-record
                    </button>
                    <button type="button" className="submit-btn" onClick={handleConfirmAnswer} disabled={finishing}>
                      {finishing ? 'Combining…' : isLastQuestion ? 'Finish Part 1' : 'Next question'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {finishError && <div className="error-banner">{finishError}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
