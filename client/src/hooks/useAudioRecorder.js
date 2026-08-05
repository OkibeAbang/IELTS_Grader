import { useCallback, useEffect, useRef, useState } from 'react';

const CANDIDATE_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/ogg;codecs=opus',
  'audio/mp4',
  'audio/webm',
];

function pickMimeType() {
  if (typeof MediaRecorder === 'undefined') return null;
  return CANDIDATE_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

/**
 * Wraps getUserMedia/MediaRecorder. The recorded mimeType doesn't need to match
 * what the grading API accepts — the server always transcodes to WAV before
 * doing anything else with the audio, so any browser-native format is fine here.
 */
export function useAudioRecorder() {
  const [status, setStatus] = useState('idle'); // idle | recording | stopped
  const [durationSec, setDurationSec] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setDurationSec(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stopStream();
      };

      recorder.start();
      setStatus('recording');

      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        setDurationSec(Math.floor((Date.now() - startedAt) / 1000));
      }, 250);
    } catch (err) {
      setError(err.message || 'Could not access the microphone');
      setStatus('idle');
    }
  }, [stopStream]);

  const stop = useCallback(() => {
    stopTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setStatus('stopped');
  }, [stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    stopStream();
    setStatus('idle');
    setDurationSec(0);
    setAudioBlob(null);
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    chunksRef.current = [];
  }, [stopStream, stopTimer]);

  useEffect(() => () => {
    stopTimer();
    stopStream();
  }, [stopStream, stopTimer]);

  return { status, durationSec, audioBlob, audioUrl, error, start, stop, reset };
}
