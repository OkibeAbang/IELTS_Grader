import { useEffect, useState } from 'react';

// True once `active` has stayed true for `delayMs` — used to avoid flashing
// a "this might be slow" hint on requests that resolve quickly, while still
// reassuring users during a genuinely slow one (e.g. a Render free-tier
// backend waking up from sleep, which can take up to ~a minute).
export default function useDelayedNotice(active, delayMs = 4000) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) {
      setShow(false);
      return undefined;
    }
    const timer = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);

  return show;
}
