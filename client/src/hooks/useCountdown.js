import { useCallback, useEffect, useRef, useState } from 'react';

// Generalizes the countdown pattern duplicated across PassageViewer.js,
// EssayForm.js, and CueCardPart2.js, adding an onExpire callback so callers
// can enforce a real ceiling (auto-advance) rather than just pause/reset.
export default function useCountdown(totalSeconds, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(
    (next = totalSeconds) => {
      setRunning(false);
      setSecondsLeft(next);
    },
    [totalSeconds]
  );

  return { secondsLeft, running, start, pause, reset };
}

export function formatCountdown(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
