import { useEffect, useRef, useState } from 'react';
import { speechSupported, speak } from '../../utils/speech';

export default function AudioScriptPlayer({ script }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const playTokenRef = useRef(0);

  useEffect(
    () => () => {
      playTokenRef.current += 1;
      if (speechSupported) window.speechSynthesis.cancel();
    },
    []
  );

  function playFrom(index, token) {
    if (token !== playTokenRef.current) return;
    if (index >= script.length) {
      setIsPlaying(false);
      setCurrentLineIndex(-1);
      setHasPlayedOnce(true);
      return;
    }
    setCurrentLineIndex(index);
    const wordCount = script[index].line.split(/\s+/).length;
    const timeoutMs = Math.max(6000, wordCount * 450);
    speak(script[index].line, {
      onStart: () => {},
      onEnd: () => playFrom(index + 1, token),
      timeoutMs,
    });
  }

  function handlePlay() {
    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    setIsPlaying(true);
    playFrom(0, token);
  }

  function handleStop() {
    playTokenRef.current += 1;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentLineIndex(-1);
  }

  if (!speechSupported) {
    return (
      <div className="listening-audio-player listening-audio-player-unsupported">
        <p>
          Your browser doesn't support built-in text-to-speech playback, so this section
          can't be played here. Try Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  const statusText = isPlaying
    ? `Line ${currentLineIndex + 1} of ${script.length} — Playing…`
    : hasPlayedOnce
    ? 'Finished playing. Replay if you need to hear it again.'
    : 'Press Play to begin listening.';

  return (
    <div className="listening-audio-player">
      <p className="listening-audio-player-progress">{statusText}</p>
      <div className="recorder-controls">
        <button type="button" className="submit-btn" onClick={handlePlay} disabled={isPlaying}>
          {hasPlayedOnce ? 'Replay' : 'Play'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleStop} disabled={!isPlaying}>
          Stop
        </button>
      </div>
    </div>
  );
}
