import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchLiveTicket } from '../../api/speaking';
import { useLiveMic } from '../../hooks/useLiveMic';
import { pcmChunksToWav } from '../../utils/pcmToWav';
import AudioVisualizer from './AudioVisualizer';

// Gemini Live's documented native audio output rate. Preview API — verify
// against real behavior during manual testing and adjust if playback sounds
// pitched wrong.
const LIVE_OUTPUT_SAMPLE_RATE = 24000;
const LIVE_WS_ORIGIN = process.env.REACT_APP_LIVE_WS_URL || 'ws://localhost:4000';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Part1LiveConversation({ onComplete, onCancel }) {
  const [phase, setPhase] = useState('idle'); // idle | connecting | active | error
  const [error, setError] = useState(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const wsRef = useRef(null);
  const chunksRef = useRef([]);
  const playbackCtxRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const playingSourcesRef = useRef([]);
  const elapsedTimerRef = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const handleAudioChunk = useCallback((chunk) => {
    chunksRef.current.push(chunk);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(chunk);
    }
  }, []);

  const mic = useLiveMic({ onAudioChunk: handleAudioChunk });

  function ensurePlaybackContext() {
    if (!playbackCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      playbackCtxRef.current = new AudioContextClass();
      nextPlayTimeRef.current = 0;
    }
    return playbackCtxRef.current;
  }

  function playAudioChunk(arrayBuffer) {
    const ctx = ensurePlaybackContext();
    const int16 = new Int16Array(arrayBuffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 0x8000;

    const buffer = ctx.createBuffer(1, float32.length, LIVE_OUTPUT_SAMPLE_RATE);
    buffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => {
      playingSourcesRef.current = playingSourcesRef.current.filter((s) => s !== source);
    };

    const startAt = Math.max(ctx.currentTime, nextPlayTimeRef.current);
    source.start(startAt);
    nextPlayTimeRef.current = startAt + buffer.duration;
    playingSourcesRef.current.push(source);
    setAiSpeaking(true);
  }

  function clearPlayback() {
    playingSourcesRef.current.forEach((s) => {
      try {
        s.stop();
      } catch {
        // already stopped
      }
    });
    playingSourcesRef.current = [];
    if (playbackCtxRef.current) nextPlayTimeRef.current = playbackCtxRef.current.currentTime;
    setAiSpeaking(false);
  }

  const finishSession = useCallback(
    (reason) => {
      mic.stop();
      clearPlayback();
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
      wsRef.current?.close();
      wsRef.current = null;

      if (reason === 'error') return;

      if (chunksRef.current.length === 0) {
        setError("No audio was captured — please try again.");
        setPhase('error');
        return;
      }

      const totalSamples = chunksRef.current.reduce((sum, c) => sum + c.byteLength / 2, 0);
      const durationSec = Math.round(totalSamples / 16000);
      const audioBlob = pcmChunksToWav(chunksRef.current, 16000, 1);
      const audioUrl = URL.createObjectURL(audioBlob);
      onComplete({ audioBlob, audioUrl, durationSec });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function startSession() {
    setError(null);
    setPhase('connecting');
    chunksRef.current = [];

    try {
      const ticket = await fetchLiveTicket();
      const ws = new WebSocket(`${LIVE_WS_ORIGIN}/ws/speaking/live?ticket=${encodeURIComponent(ticket)}`);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onmessage = async (event) => {
        if (typeof event.data === 'string') {
          let msg;
          try {
            msg = JSON.parse(event.data);
          } catch {
            return;
          }
          if (msg.type === 'ready') {
            await mic.start();
            setPhase('active');
            elapsedTimerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
          } else if (msg.type === 'interrupted') {
            clearPlayback();
          } else if (msg.type === 'turn_complete') {
            setAiSpeaking(false);
          } else if (msg.type === 'time_up') {
            finishSession('cap');
          } else if (msg.type === 'error') {
            setError(msg.message || 'Something went wrong with the live examiner.');
            setPhase('error');
            finishSession('error');
          }
        } else {
          playAudioChunk(event.data);
        }
      };

      ws.onerror = () => {
        if (phaseRef.current === 'connecting' || phaseRef.current === 'active') {
          setError('Connection to the live examiner was lost.');
          setPhase('error');
        }
      };

      ws.onclose = () => {
        if (phaseRef.current === 'active') {
          finishSession('closed');
        }
      };
    } catch (err) {
      setError(err.message || 'Could not start the live conversation.');
      setPhase('error');
    }
  }

  function endSession() {
    finishSession('user');
  }

  useEffect(() => {
    function isTypingTarget(target) {
      const tag = target?.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable;
    }
    function handleKeyDown(e) {
      if (e.code !== 'Space' || e.repeat || isTypingTarget(e.target)) return;
      e.preventDefault();
      if (phaseRef.current === 'idle') startSession();
      else if (phaseRef.current === 'active') endSession();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      wsRef.current?.close();
      mic.stop();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="part-recorder">
      <div className="live-conversation-header">
        <h2>Part 1: Interview (live, beta)</h2>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Switch to scripted mode
        </button>
      </div>
      <p className="app-subtitle">
        A real back-and-forth with an AI examiner. Press Space to start, and press Space again
        when you're done — capped at 8 minutes.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <div className="live-conversation-stage">
        {phase === 'idle' && (
          <button type="button" className="submit-btn" onClick={startSession}>
            Start live conversation
          </button>
        )}

        {phase === 'connecting' && <p className="live-status">Connecting to the examiner…</p>}

        {phase === 'active' && (
          <>
            <AudioVisualizer level={aiSpeaking ? 0.6 : mic.level} />
            <p className="live-status">
              {aiSpeaking ? 'Examiner is speaking…' : 'Listening…'} · {formatTime(elapsedSec)}
            </p>
            <button type="button" className="submit-btn" onClick={endSession}>
              End conversation
            </button>
            <span className="spacebar-hint">or press Space</span>
          </>
        )}
      </div>
    </div>
  );
}
