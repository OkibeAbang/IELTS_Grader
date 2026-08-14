import crypto from "node:crypto";
import { WebSocketServer } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";
import { findById } from "./models/users.js";
import { getSpeakingTopic } from "./speakingQuestionBank.js";

/**
 * Opt-in, feature-flagged real-time voice conversation covering the FULL
 * speaking test (Parts 1-3) in one continuous session (see REMINDERS.md).
 * Architecture: browser <-> this relay <-> Gemini Live API. The Gemini API
 * key never reaches the browser, and the WebSocket itself is authenticated
 * with a short-lived single-use ticket (not the session cookie) because it
 * connects directly to this server's own origin, cross-site from the
 * Vercel-hosted frontend — Vercel's rewrite proxy that keeps normal /api/*
 * calls same-origin does not support proxying WebSocket upgrades to an
 * external backend.
 *
 * The model itself drives all 3 parts from one system prompt built from the
 * candidate's chosen topic, and signals each part transition by calling one
 * of two tools (advance_part / end_test) rather than the server trying to
 * parse free text for transitions — this is far more reliable, and lets the
 * client split the candidate's mic audio into per-part buffers that slot
 * straight into the existing (unchanged) grading pipeline.
 */

const LIVE_MODEL = "gemini-3.1-flash-live-preview";
// A real full 3-part speaking test runs ~11-14 min; generous headroom.
const SESSION_CAP_MS = 18 * 60 * 1000;
const TICKET_TTL_MS = 30 * 1000;

const tickets = new Map(); // ticket -> { userId, topicId, expiresAt }
const activeUserSessions = new Set(); // userId currently in a live session

const ADVANCE_PART_TOOL = {
  name: "advance_part",
  description: "Call this the moment you finish one part of the test and are moving on to the next. Do not call this for part 1 (the test starts there already).",
  parametersJsonSchema: {
    type: "object",
    properties: {
      part: { type: "integer", enum: [2, 3], description: "The part number you are now moving into." },
    },
    required: ["part"],
  },
};

const END_TEST_TOOL = {
  name: "end_test",
  description: "Call this once, right after your closing remark at the very end of Part 3, to signal the whole test is complete.",
  parametersJsonSchema: { type: "object", properties: {} },
};

function createLiveTicket(userId, topicId) {
  const ticket = crypto.randomBytes(24).toString("hex");
  tickets.set(ticket, { userId, topicId, expiresAt: Date.now() + TICKET_TTL_MS });
  return ticket;
}

function consumeTicket(ticket) {
  const entry = tickets.get(ticket);
  if (!entry) return null;
  tickets.delete(ticket);
  if (entry.expiresAt < Date.now()) return null;
  return entry;
}

// Tickets are single-use and expire in seconds, but sweep stragglers from
// abandoned connection attempts so this Map can't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [ticket, entry] of tickets) {
    if (entry.expiresAt < now) tickets.delete(ticket);
  }
}, 60 * 1000).unref();

function buildFullTestExaminerPrompt(topic) {
  const part1Questions = topic.part1.questions.map((q) => `- ${q}`).join("\n");
  const part3Questions = topic.part3.questions.map((q) => `- ${q}`).join("\n");
  const cueCard = topic.part2.cueCard;
  const bulletPoints = cueCard.bulletPoints.map((b) => `- ${b}`).join("\n");
  const prepMinutes = Math.round(cueCard.prepSeconds / 60);

  return `You are a friendly, professional IELTS Speaking examiner conducting a FULL speaking test with 3 parts, back to back, in one continuous conversation. Follow this script closely and in order.

## Part 1 — Interview (start here immediately)
Ask the candidate these questions about "${topic.topic}", one at a time, waiting for their full answer before continuing. You may ask a brief natural follow-up if an answer is very short, but keep it moving — this is a short interview, not a deep discussion.
${part1Questions}

## Part 2 — Long Turn
When Part 1's questions are done, call the "advance_part" tool with part=2, then say something like "Now I'd like you to talk about a topic for one to two minutes" and read out this cue card:
"${cueCard.topic}"
${bulletPoints}
Tell the candidate they have ${prepMinutes} minute(s) to prepare, and that they can make notes if they want. During that preparation time, stay completely silent and do NOT respond to anything you hear — the candidate may be thinking aloud or making notes, not talking to you. After roughly ${prepMinutes} minute(s) of silence, prompt them to begin speaking now. Let them speak for up to 2 minutes with minimal interruption (only a brief "thank you" if they stop early or run long).

## Part 3 — Discussion
When Part 2's long turn is finished, call the "advance_part" tool with part=3, then ask these follow-up discussion questions one at a time, allowing brief natural follow-ups:
${part3Questions}

## Ending the test
After the candidate answers the last Part 3 question, give a brief closing remark (e.g. "That's the end of the test, thank you.") and then call the "end_test" tool. Do not call it before that.

## General rules
- Keep your own turns brief (a sentence or two). You are the interviewer, not the speaker.
- Ask ONE question at a time.
- Do not grade, correct, or comment on their English — that happens separately after this conversation.
- Always call "advance_part" and "end_test" exactly as instructed above — the app relies on these calls to track progress through the test.`;
}

function sendControl(ws, payload) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

async function handleConnection(ws, userId, topicId) {
  const topic = getSpeakingTopic(topicId);
  if (!topic) {
    sendControl(ws, { type: "error", message: "That topic could not be found." });
    ws.close();
    return;
  }

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

  function handleToolCall(functionCalls) {
    const responses = [];
    for (const call of functionCalls) {
      if (call.name === "advance_part") {
        sendControl(ws, { type: "part_started", part: call.args?.part });
      } else if (call.name === "end_test") {
        sendControl(ws, { type: "test_complete" });
      }
      responses.push({ id: call.id, name: call.name, response: { output: "ok" } });
    }
    geminiSession.sendToolResponse({ functionResponses: responses });
  }

  try {
    geminiSession = await genAI.live.connect({
      model: LIVE_MODEL,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: buildFullTestExaminerPrompt(topic),
        tools: [{ functionDeclarations: [ADVANCE_PART_TOOL, END_TEST_TOOL] }],
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
          if (message?.toolCall?.functionCalls?.length) {
            handleToolCall(message.toolCall.functionCalls);
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

  httpServer.on("upgrade", async (req, socket, head) => {
    const url = new URL(req.url, "http://internal");
    if (url.pathname !== "/ws/speaking/live") {
      return; // not ours — let any other upgrade handler (none today) or the default deal with it
    }

    const ticket = url.searchParams.get("ticket");
    const entry = ticket ? consumeTicket(ticket) : null;

    let user = null;
    try {
      user = entry ? await findById(entry.userId) : null;
    } catch (err) {
      console.error("Live voice ticket lookup failed:", err.message);
    }

    if (!user) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      handleConnection(ws, entry.userId, entry.topicId);
    });
  });
}

export { attachLiveSpeaking, createLiveTicket };
