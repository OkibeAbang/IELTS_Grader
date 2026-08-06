import { useCallback, useRef, useState } from 'react';

/**
 * Captures microphone audio as a stream of 16-bit PCM chunks (via the
 * pcm-worklet-processor AudioWorklet) for the live conversation feature.
 * Distinct from useAudioRecorder, which produces one opaque encoded blob at
 * the end via MediaRecorder — this hook streams raw chunks continuously,
 * since the Gemini Live API needs audio in near-real-time, not all at once.
 */
export function useLiveMic({ onAudioChunk }) {
  const [level, setLevel] = useState(0);
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const streamRef = useRef(null);
  const meterFrameRef = useRef(null);
  const onAudioChunkRef = useRef(onAudioChunk);
  onAudioChunkRef.current = onAudioChunk;

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;

    await audioContext.audioWorklet.addModule('/pcm-worklet-processor.js');

    const source = audioContext.createMediaStreamSource(stream);
    const workletNode = new AudioWorkletNode(audioContext, 'pcm-worklet-processor');
    workletNodeRef.current = workletNode;
    workletNode.port.onmessage = (event) => onAudioChunkRef.current(event.data);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    source.connect(workletNode);
    // Deliberately not connected to destination — we don't want to hear our own mic.

    const levelData = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteTimeDomainData(levelData);
      let sumSquares = 0;
      for (let i = 0; i < levelData.length; i++) {
        const normalized = (levelData[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      setLevel(Math.min(1, Math.sqrt(sumSquares / levelData.length) * 4));
      meterFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const stop = useCallback(() => {
    if (meterFrameRef.current) {
      cancelAnimationFrame(meterFrameRef.current);
      meterFrameRef.current = null;
    }
    workletNodeRef.current?.disconnect();
    workletNodeRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    setLevel(0);
  }, []);

  return { level, start, stop };
}
