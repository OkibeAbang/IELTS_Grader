import { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { mergeAudioBlobs } from '../../utils/mergeAudioBlobs';
import AudioVisualizer from './AudioVisualizer';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

function speak(text, { onStart, onEnd }) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    onEnd();
  };

  utterance.onstart = onStart;
  utterance.onend = finish;
  utterance.onerror = finish;
  window.speechSynthesis.speak(utterance);

  // Safety net: some environments (e.g. no TTS voices installed) never fire
  // onend/onerror at all — don't let that permanently disable the Answer button.
  setTimeout(finish, 15000);
}

export default function Part1Conversation({ questions, onComplete }) {
  const [answers, setAnswers] = useState([]);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { status, durationSec, audioBlob, audioUrl, error, audioLevel, start, stop, reset } = useAudioRecorder();

  const currentIndex = answers.length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentQuestion = questions[currentIndex];

  // Guards StrictMode's dev double-invoke from reading the same question twice.
  const lastSpokenIndexRef = useRef(-1);

  useEffect(() => {
    if (!speechSupported || currentIndex >= questions.length) return undefined;
    if (lastSpokenIndexRef.current === currentIndex) return undefined;
    lastSpokenIndexRef.current = currentIndex;

    speak(currentQuestion, { onStart: () => setIsSpeaking(true), onEnd: () => setIsSpeaking(false) });

    return () => window.speechSynthesis.cancel();
  }, [currentIndex, currentQuestion, questions.length]);

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  function handleReplay() {
    speak(currentQuestion, { onStart: () => setIsSpeaking(true), onEnd: () => setIsSpeaking(false) });
  }

  // Hold Space to record — a keyboard alternative to the Answer/Stop buttons
  // (which stay the primary interaction, since there's no spacebar on mobile).
  useEffect(() => {
    function isTypingTarget(target) {
      const tag = target?.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable;
    }

    function handleKeyDown(e) {
      if (e.code !== 'Space' || e.repeat || isTypingTarget(e.target)) return;
      if (isSpeaking || status !== 'idle') return;
      e.preventDefault();
      start();
    }

    function handleKeyUp(e) {
      if (e.code !== 'Space' || isTypingTarget(e.target)) return;
      if (status !== 'recording') return;
      e.preventDefault();
      stop();
    }

    function handleBlur() {
      if (status === 'recording') stop();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [status, isSpeaking, start, stop]);

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
        {speechSupported
          ? "The examiner reads each question aloud — answer, and the next question follows, just like a real conversation."
          : "Answer each question like a real conversation — the next question appears once you've confirmed your answer."}
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
            <div className="chat-bubble chat-bubble-examiner">
              <span>{currentQuestion}</span>
              {speechSupported && (
                <button
                  type="button"
                  className="chat-bubble-replay"
                  onClick={handleReplay}
                  disabled={isSpeaking}
                  aria-label="Replay question"
                  title="Replay question"
                >
                  <Volume2 size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            {error && <div className="error-banner">{error}</div>}

            {status === 'idle' && (
              <div className="recorder-controls">
                <button type="button" className="submit-btn" onClick={start} disabled={isSpeaking}>
                  {isSpeaking ? 'Examiner is speaking…' : 'Answer'}
                </button>
                {!isSpeaking && <span className="spacebar-hint">or hold Space</span>}
              </div>
            )}

            {status === 'recording' && (
              <div className="recorder-controls">
                <AudioVisualizer level={audioLevel} />
                <span className="recording-indicator">● Recording… {formatTime(durationSec)}</span>
                <button type="button" className="submit-btn" onClick={stop}>
                  Stop
                </button>
                <span className="spacebar-hint">release Space to stop</span>
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
