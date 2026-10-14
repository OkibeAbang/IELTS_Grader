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

// Safety net for a real, observed Gemini Live reliability gap: the model is
// instructed to call advance_part(3) the instant Part 2's long turn ends,
// but in practice it can keep right on talking/asking real Part 3 questions
// without ever making that call — the conversation itself moves on, the app
// just never finds out. Part 2's answer is capped "up to 2 minutes" in the
// prompt, so if no part_started(3) arrives within a generous multiple of
// that, force the same transition the tool call would have caused rather
// than silently misattributing real Part 3 answers into Part 2's recording.
const PART3_FALLBACK_MS = 3 * 60 * 1000;

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
  // null | 'greeting' | 'part2-ready' — a sign telling the candidate to say
  // a specific trigger phrase before the examiner will proceed.
  const [livePrompt, setLivePrompt] = useState(null);

  const wsRef = useRef(null);
  const partChunksRef = useRef({ 1: [], 2: [], 3: [] });
  const currentPartRef = useRef(1);
  // Audio is always streamed to the model (it needs to hear "Hello" and "I
  // am ready to speak" to know when to proceed) — this only gates whether
  // a chunk also gets recorded into the graded take, so prep-time muttering
  // or the greeting itself isn't counted as answer content.
  const recordingGateOpenRef = useRef(false);
  const part2TurnHeardRef = useRef(false);
  const sessionEndedRef = useRef(false);
  const playbackCtxRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const playingSourcesRef = useRef([]);
  const elapsedTimerRef = useRef(null);
  const prepTimerRef = useRef(null);
  const part3FallbackTimerRef = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  function clearPart3FallbackTimer() {
    if (part3FallbackTimerRef.current) {
      clearTimeout(part3FallbackTimerRef.current);
      part3FallbackTimerRef.current = null;
    }
  }

  function beginPart3() {
    clearPart3FallbackTimer();
    currentPartRef.current = 3;
    clearPrepTimer();
    setPhase('part3');
    setLivePrompt(null);
  }

  const handleAudioChunk = useCallback((chunk) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(chunk);
    }
    // Only counts toward the graded recording once the relevant gate has
    // opened (see recordingGateOpenRef) — e.g. the initial greeting and
    // Part 2's prep-time muttering are heard by the model but not recorded.
    if (recordingGateOpenRef.current) {
      partChunksRef.current[currentPartRef.current].push(chunk);
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
  }

  function startPart2PrepTimer() {
    const prepSeconds = topic.part2.cueCard.prepSeconds;
    setPrepRemaining(prepSeconds);
    prepTimerRef.current = setInterval(() => {
      setPrepRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current);
          prepTimerRef.current = null;
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
      clearPart3FallbackTimer();
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
    recordingGateOpenRef.current = false;
    part2TurnHeardRef.current = false;
    setLivePrompt(null);
    clearPart3FallbackTimer();

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
            setLivePrompt('greeting');
            elapsedTimerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
          } else if (msg.type === 'test_started') {
            setLivePrompt(null);
            recordingGateOpenRef.current = true;
          } else if (msg.type === 'part_started') {
            currentPartRef.current = msg.part;
            clearPrepTimer();
            if (msg.part === 2) {
              setPhase('part2');
              startPart2PrepTimer();
              // Instructions/prep aren't graded content — recording reopens
              // once the candidate actually says they're ready (below).
              recordingGateOpenRef.current = false;
              part2TurnHeardRef.current = false;
              setLivePrompt(null);
            } else if (msg.part === 3) {
              // The real signal arrived — the fallback timer below is now
              // unnecessary for this session.
              beginPart3();
            }
          } else if (msg.type === 'part2_recording_started') {
            setLivePrompt(null);
            recordingGateOpenRef.current = true;
            clearPart3FallbackTimer();
            part3FallbackTimerRef.current = setTimeout(() => {
              if (phaseRef.current === 'part2') beginPart3();
            }, PART3_FALLBACK_MS);
          } else if (msg.type === 'interrupted') {
            clearPlayback();
          } else if (msg.type === 'turn_complete') {
            setAiSpeaking(false);
            // The sign to say "I am ready to speak" should appear only
            // after the examiner finishes reading the Part 2 instructions
            // (its first turn in this part), not while it's still talking.
            if (phaseRef.current === 'part2' && !part2TurnHeardRef.current && !recordingGateOpenRef.current) {
              part2TurnHeardRef.current = true;
              setLivePrompt('part2-ready');
            }
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
      clearPart3FallbackTimer();
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

        {livePrompt === 'greeting' && (
          <div className="live-sign">
            Say <strong>&ldquo;Hello&rdquo;</strong> to begin the test.
          </div>
        )}
        {livePrompt === 'part2-ready' && (
          <div className="live-sign">
            When you&rsquo;re ready to begin, say <strong>&ldquo;I am ready to speak.&rdquo;</strong>
          </div>
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
