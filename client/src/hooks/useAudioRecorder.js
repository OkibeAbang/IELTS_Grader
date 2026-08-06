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
  const [audioLevel, setAudioLevel] = useState(0); // 0..1, live input level while recording

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const meterFrameRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopMeter = useCallback(() => {
    if (meterFrameRef.current) {
      cancelAnimationFrame(meterFrameRef.current);
      meterFrameRef.current = null;
    }
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
    setAudioLevel(0);
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

      // Best-effort: a visual level meter, not required for recording itself,
      // so a construction failure here shouldn't break the actual recording.
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContextClass();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sumSquares = 0;
          for (let i = 0; i < data.length; i++) {
            const normalized = (data[i] - 128) / 128;
            sumSquares += normalized * normalized;
          }
          const rms = Math.sqrt(sumSquares / data.length);
          setAudioLevel(Math.min(1, rms * 4));
          meterFrameRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        // No visual meter — recording still works fine without it.
      }
    } catch (err) {
      setError(err.message || 'Could not access the microphone');
      setStatus('idle');
    }
  }, [stopStream]);

  const stop = useCallback(() => {
    stopTimer();
    stopMeter();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setStatus('stopped');
  }, [stopTimer, stopMeter]);

  const reset = useCallback(() => {
    stopTimer();
    stopMeter();
    stopStream();
    setStatus('idle');
    setDurationSec(0);
    setAudioBlob(null);
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    chunksRef.current = [];
  }, [stopStream, stopTimer, stopMeter]);

  useEffect(() => () => {
    stopTimer();
    stopMeter();
    stopStream();
  }, [stopStream, stopTimer, stopMeter]);

  return { status, durationSec, audioBlob, audioUrl, error, audioLevel, start, stop, reset };
}
