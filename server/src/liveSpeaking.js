import crypto from "node:crypto";
import { WebSocketServer } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";
import { findById } from "./models/users.js";

/**
 * Opt-in, feature-flagged real-time voice conversation for Part 1 (see
 * REMINDERS.md). Architecture: browser <-> this relay <-> Gemini Live API.
 * The Gemini API key never reaches the browser, and the WebSocket itself is
 * authenticated with a short-lived single-use ticket (not the session
 * cookie) because it connects directly to this server's own origin,
 * cross-site from the Vercel-hosted frontend — Vercel's rewrite proxy that
 * keeps normal /api/* calls same-origin does not support proxying
 * WebSocket upgrades to an external backend.
 */

const LIVE_MODEL = "gemini-3.1-flash-live-preview";
const SESSION_CAP_MS = 8 * 60 * 1000; // real IELTS Part 1 runs ~4-5 min; generous headroom
const TICKET_TTL_MS = 30 * 1000;

const tickets = new Map(); // ticket -> { userId, expiresAt }
const activeUserSessions = new Set(); // userId currently in a live session

function createLiveTicket(userId) {
  const ticket = crypto.randomBytes(24).toString("hex");
  tickets.set(ticket, { userId, expiresAt: Date.now() + TICKET_TTL_MS });
  return ticket;
}

function consumeTicket(ticket) {
  const entry = tickets.get(ticket);
  if (!entry) return null;
  tickets.delete(ticket);
  if (entry.expiresAt < Date.now()) return null;
  return entry.userId;
}

// Tickets are single-use and expire in seconds, but sweep stragglers from
// abandoned connection attempts so this Map can't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [ticket, entry] of tickets) {
    if (entry.expiresAt < now) tickets.delete(ticket);
  }
}, 60 * 1000).unref();

function buildLiveExaminerPrompt() {
  return `You are a friendly, professional IELTS Speaking examiner conducting Part 1 of the test (the short interview).

- Ask the candidate 4 to 6 short questions about everyday, personal topics — for example their hometown, work or study, hobbies, or daily routine. Pick ONE topic area for this session and stay on it, the way a real Part 1 interview does.
- Ask ONE question at a time and wait for the candidate's full answer before continuing.
- You may ask a brief, natural follow-up if their answer is very short, but keep the interview moving — this is Part 1, not a deep discussion.
- Keep your own turns brief (a sentence or less). You are the interviewer, not the speaker.
- After 4-6 questions, thank the candidate and say the interview is complete, then stop.
- Do not grade, correct, or comment on their English — that happens separately after this conversation.`;
}

function sendControl(ws, payload) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

async function handleConnection(ws, userId) {
  if (activeUserSessions.has(userId)) {
    sendControl(ws, { type: "error", message: "You already have a live session open." });
    ws.close();
    return;
  }
  activeUserSessions.add(userId);

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let geminiSession = null;
  let capTimer = null;
  let closed = false;

  function cleanup() {
    if (closed) return;
    closed = true;
    activeUserSessions.delete(userId);
    if (capTimer) clearTimeout(capTimer);
    try {
      geminiSession?.close();
    } catch {
      // already closed
    }
    if (ws.readyState === ws.OPEN || ws.readyState === ws.CONNECTING) {
      ws.close();
    }
  }

  try {
    geminiSession = await genAI.live.connect({
      model: LIVE_MODEL,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: buildLiveExaminerPrompt(),
      },
      callbacks: {
        onopen: () => sendControl(ws, { type: "ready" }),
        onmessage: (message) => {
          if (message?.serverContent?.interrupted) {
            sendControl(ws, { type: "interrupted" });
          }
          const parts = message?.serverContent?.modelTurn?.parts ?? [];
          for (const part of parts) {
            const inline = part?.inlineData;
            if (inline?.data && ws.readyState === ws.OPEN) {
              ws.send(Buffer.from(inline.data, "base64"));
            }
          }
          if (message?.serverContent?.turnComplete) {
            sendControl(ws, { type: "turn_complete" });
          }
        },
        onerror: (err) => {
          console.error("Gemini Live session error:", err?.message || err);
          sendControl(ws, { type: "error", message: "The examiner connection had a problem." });
          cleanup();
        },
        onclose: () => cleanup(),
      },
    });
  } catch (err) {
    console.error("Failed to open Gemini Live session:", err?.message || err);
    sendControl(ws, { type: "error", message: "Couldn't start the live examiner. Please try again." });
    cleanup();
    return;
  }

  capTimer = setTimeout(() => {
    sendControl(ws, { type: "time_up" });
    cleanup();
  }, SESSION_CAP_MS);

  ws.on("message", (data, isBinary) => {
    if (!isBinary || closed) return;
    geminiSession.sendRealtimeInput({
      audio: { data: data.toString("base64"), mimeType: "audio/pcm;rate=16000" },
    });
  });

  ws.on("close", cleanup);
  ws.on("error", cleanup);
}

function attachLiveSpeaking(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url, "http://internal");
    if (url.pathname !== "/ws/speaking/live") {
      return; // not ours — let any other upgrade handler (none today) or the default deal with it
    }

    const ticket = url.searchParams.get("ticket");
    const userId = ticket ? consumeTicket(ticket) : null;
    if (!userId || !findById(userId)) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      handleConnection(ws, userId);
    });
  });
}

export { attachLiveSpeaking, createLiveTicket };
