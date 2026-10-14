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

const PART_LABELS = { 1: 'Part 1: Interview', 2: 'Part 2: Long Turn', 3: 'Part 3: Discussion' };

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Runs the entire 3-part speaking test as one continuous live conversation
 * with an AI examiner (see liveSpeaking.js on the server for the script and
 * part-transition tool-calling this drives off of). Only manual interaction
 * is the initial Start click (mic permission needs a user gesture) and the
 * escape hatch back to the manual recording flow — everything else is the
 * candidate just talking.
 */
export default function LiveSpeakingSession({ topic, onComplete, onFallback }) {
  const [phase, setPhase] = useState('idle'); // idle | connecting | part1 | part2 | part3 | error
  const [error, setError] = useState(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [prepRemaining, setPrepRemaining] = useState(null);

  const wsRef = useRef(null);
  const partChunksRef = useRef({ 1: [], 2: [], 3: [] });
  const currentPartRef = useRef(1);
  const mutedRef = useRef(false);
  const sessionEndedRef = useRef(false);
  const playbackCtxRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const playingSourcesRef = useRef([]);
  const elapsedTimerRef = useRef(null);
  const prepTimerRef = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const handleAudioChunk = useCallback((chunk) => {
    // During Part 2's silent prep window we still stream *something* so the
    // model's own sense of real-time pacing doesn't stall, but it's
    // zero-filled silence rather than the real mic signal — otherwise the
    // model can (and in testing, did) react to ambient noise or the
    // candidate thinking aloud during a window it's instructed to stay
    // silent for. Not recorded into the graded take either, for the same
    // reason real answering hasn't started yet.
    if (mutedRef.current) {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(new ArrayBuffer(chunk.byteLength));
      }
      return;
    }
    partChunksRef.current[currentPartRef.current].push(chunk);
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

  function clearPrepTimer() {
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }
    setPrepRemaining(null);
    mutedRef.current = false;
  }

  function startPart2PrepTimer() {
    const prepSeconds = topic.part2.cueCard.prepSeconds;
    setPrepRemaining(prepSeconds);
    mutedRef.current = true;
    prepTimerRef.current = setInterval(() => {
      setPrepRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current);
          prepTimerRef.current = null;
          mutedRef.current = false;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const finishSession = useCallback(
    (reason) => {
      // onerror and onclose can both fire for the same dropped connection
      // (a close event normally follows an error) — guard against double-
      // running cleanup and double-calling onComplete.
      if (sessionEndedRef.current) return;
      sessionEndedRef.current = true;
      mic.stop();
      clearPlayback();
      clearPrepTimer();
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
      wsRef.current?.close();
      wsRef.current = null;

      // 'fallback' is the one deliberate "start over manually" action
      // (the "Switch to manual mode" button) — nothing to salvage there,
      // the candidate is explicitly choosing a clean restart. Every other
      // reason (hit the time cap, the socket closed, the model signalled
      // completion, a connection error) still hands back whatever parts
      // were actually captured rather than discarding a real recording —
      // previously, the model failing to call advance_part for a later
      // part (a real, observed Gemini Live reliability gap, not something
      // we can force) meant the whole session — including parts that
      // genuinely succeeded — was thrown away with no grade at all.
      if (reason === 'fallback') return;

      const recordings = {};
      for (const partNum of [1, 2, 3]) {
        const chunks = partChunksRef.current[partNum];
        if (chunks.length === 0) continue;
        const totalSamples = chunks.reduce((sum, c) => sum + c.byteLength / 2, 0);
        const durationSec = Math.round(totalSamples / 16000);
        const audioBlob = pcmChunksToWav(chunks, 16000, 1);
        const audioUrl = URL.createObjectURL(audioBlob);
        recordings[`part${partNum}`] = { audioBlob, audioUrl, durationSec };
      }
      onComplete(recordings);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function startSession() {
    setError(null);
    setPhase('connecting');
    partChunksRef.current = { 1: [], 2: [], 3: [] };
    currentPartRef.current = 1;
    sessionEndedRef.current = false;

    try {
      const ticket = await fetchLiveTicket(topic.id);
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
            setPhase('part1');
            elapsedTimerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
          } else if (msg.type === 'part_started') {
            currentPartRef.current = msg.part;
            clearPrepTimer();
            if (msg.part === 2) {
              setPhase('part2');
              startPart2PrepTimer();
            } else if (msg.part === 3) {
              setPhase('part3');
            }
          } else if (msg.type === 'interrupted') {
            clearPlayback();
          } else if (msg.type === 'turn_complete') {
            setAiSpeaking(false);
          } else if (msg.type === 'test_complete') {
            finishSession('complete');
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
        if (phaseRef.current === 'connecting' || ['part1', 'part2', 'part3'].includes(phaseRef.current)) {
          setError('Connection to the live examiner was lost.');
          setPhase('error');
          finishSession('error');
        }
      };

      ws.onclose = () => {
        if (['part1', 'part2', 'part3'].includes(phaseRef.current)) {
          finishSession('closed');
        }
      };
    } catch (err) {
      setError(err.message || 'Could not start the live conversation.');
      setPhase('error');
    }
  }

  function handleFallback() {
    finishSession('fallback');
    onFallback();
  }

  useEffect(
    () => () => {
      wsRef.current?.close();
      mic.stop();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const activePart = ['part1', 'part2', 'part3'].includes(phase) ? Number(phase.slice(-1)) : null;

  return (
    <div className="part-recorder">
      <div className="live-conversation-header">
        <h2>{activePart ? PART_LABELS[activePart] : 'Full Speaking Test (live, beta)'}</h2>
        <button type="button" className="btn-secondary" onClick={handleFallback}>
          Switch to manual mode
        </button>
      </div>
      <p className="app-subtitle">
        A real, continuous conversation with an AI examiner covering all 3 parts — just talk, no
        clicking between parts.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <div className="live-conversation-stage">
        {phase === 'idle' && (
          <button type="button" className="submit-btn" onClick={startSession}>
            Start speaking test
          </button>
        )}

        {phase === 'connecting' && <p className="live-status">Connecting to the examiner…</p>}

        {activePart === 1 && (
          <ul className="speaking-questions">
            {topic.part1.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        )}

        {activePart === 2 && (
          <div className="cue-card">
            <p className="cue-card-topic">{topic.part2.cueCard.topic}</p>
            <ul>
              {topic.part2.cueCard.bulletPoints.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            {prepRemaining > 0 && (
              <span className="timer">Preparation time: {formatTime(prepRemaining)}</span>
            )}
          </div>
        )}

        {activePart === 3 && (
          <ul className="speaking-questions">
            {topic.part3.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        )}

        {activePart && (
          <>
            <AudioVisualizer level={aiSpeaking ? 0.6 : mic.level} />
            <p className="live-status">
              {aiSpeaking ? 'Examiner is speaking…' : 'Listening…'} · {formatTime(elapsedSec)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
