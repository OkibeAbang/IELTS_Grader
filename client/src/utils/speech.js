const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Speaks `text` via the Web Speech API. `timeoutMs` is a safety net for
 * environments with no TTS voices installed, where `onend`/`onerror` can
 * silently never fire — the caller should scale it to the text length
 * (a fixed short timeout risks firing before a long sentence has actually
 * finished, cutting the next utterance in over it).
 */
function speak(text, { onStart, onEnd, timeoutMs = 15000 }) {
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

  setTimeout(finish, timeoutMs);
}

export { speechSupported, speak };
