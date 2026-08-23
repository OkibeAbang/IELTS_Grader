import { useEffect, useRef, useState } from 'react';
import usePersistedState from './usePersistedState';

// Replaces the old useCountdown.js: a countdown that survives navigation
// away from the page and back. The naive approach — persisting a raw
// "seconds remaining" number — would be wrong on resume, since real time
// keeps passing while you're away. Instead this persists an absolute
// expiresAt timestamp while running, and recomputes secondsLeft from
// Date.now() every tick — so a running timer keeps counting down in real
// time even while you're on another page (matching a real exam clock),
// while a paused one stays exactly where you left it (a frozen
// remainingSeconds snapshot, no timestamp involved).
export default function usePersistedCountdown(key, totalSeconds, onExpire) {
  const [state, setState] = usePersistedState(key, {
    status: 'idle', // idle | running | paused | expired
    expiresAt: null,
    remainingSeconds: totalSeconds,
  });
  const [, forceTick] = useState(0);
  const firedRef = useRef(state.status === 'expired');
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const secondsLeft =
    state.status === 'running'
      ? Math.max(0, Math.round((state.expiresAt - Date.now()) / 1000))
      : state.remainingSeconds;

  useEffect(() => {
    if (state.status !== 'running') return undefined;
    const id = setInterval(() => forceTick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, [state.status]);

  useEffect(() => {
    if (state.status === 'running' && secondsLeft <= 0 && !firedRef.current) {
      firedRef.current = true;
      setState({ status: 'expired', expiresAt: null, remainingSeconds: 0 });
      onExpireRef.current?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, state.status]);

  function start() {
    // Idempotent: every call site calls start() unconditionally on mount
    // (including when resuming an already-running persisted timer), so this
    // must never reset progress on an in-flight countdown.
    firedRef.current = false;
    setState((s) => {
      if (s.status === 'running') return s;
      const remaining = s.status === 'paused' ? s.remainingSeconds : totalSeconds;
      return { status: 'running', expiresAt: Date.now() + remaining * 1000, remainingSeconds: remaining };
    });
  }

  function pause() {
    setState((s) => (s.status === 'running' ? { status: 'paused', expiresAt: null, remainingSeconds: secondsLeft } : s));
  }

  function reset(next = totalSeconds) {
    firedRef.current = false;
    setState({ status: 'idle', expiresAt: null, remainingSeconds: next });
  }

  return { secondsLeft, running: state.status === 'running', start, pause, reset };
}

export function formatCountdown(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
