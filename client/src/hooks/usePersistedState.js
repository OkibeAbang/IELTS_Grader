import { useState } from 'react';

// Survives SPA navigation (module-level Map lives for the tab's lifetime,
// regardless of what React mounts/unmounts) and, best-effort, a full page
// reload (mirrored to localStorage). Non-serializable values (e.g. audio
// Blobs) silently stay memory-only instead of throwing — correct, since
// those only need to survive in-app navigation, not a hard refresh.
const memoryStore = new Map();

function storageKey(key) {
  return `resumable:${key}`;
}

function readInitial(key, fallback) {
  if (memoryStore.has(key)) return memoryStore.get(key);
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (raw != null) {
      const parsed = JSON.parse(raw);
      memoryStore.set(key, parsed);
      return parsed;
    }
  } catch {
    // Corrupt/unavailable storage — fall through to the caller's default.
  }
  return fallback;
}

export default function usePersistedState(key, fallback) {
  const [value, setValue] = useState(() => readInitial(key, fallback));

  function setPersistedValue(next) {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      memoryStore.set(key, resolved);
      try {
        localStorage.setItem(storageKey(key), JSON.stringify(resolved));
      } catch {
        // Non-serializable (e.g. contains a Blob) or storage full/unavailable
        // — memory-only for this value, which is an acceptable degradation.
      }
      return resolved;
    });
  }

  return [value, setPersistedValue];
}

// Non-hook accessor for reading a persisted value at call time (e.g. inside
// an event handler) rather than at the calling component's mount time —
// a `usePersistedState` call only reads its initial value once (React's
// lazy useState initializer), so a component that mounts before the value
// is written elsewhere would otherwise be stuck with a stale snapshot.
export function getPersistedValue(key, fallback) {
  return readInitial(key, fallback);
}

export function clearPersistedState(key) {
  memoryStore.delete(key);
  try {
    localStorage.removeItem(storageKey(key));
  } catch {
    // Nothing to do if storage is unavailable.
  }
}
