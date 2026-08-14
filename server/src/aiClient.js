import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import { Groq } from "groq-sdk";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const MODEL = "gemini-flash-latest";
const CLAUDE_MODEL = "claude-opus-5";
// Groq's free tier (no card required) — tried before Claude (paid, no free
// tier) since the whole point of this fallback is staying free. See
// REMINDERS.md for why: Gemini's free tier caps at 20 requests/day/model,
// which testing alone hits routinely; Groq's is 14,400/day.
const GROQ_MODEL = "llama-3.3-70b-versatile";

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced ? fenced[1] : text;
  return JSON.parse(jsonText.trim());
}

/** True for the errors a second provider can actually route around — rate limits and capacity, not bad requests. */
function isRetryableGeminiError(err) {
  return typeof err?.status === "number" && (err.status === 429 || err.status >= 500);
}

const GEMINI_MAX_ATTEMPTS = 3;
const GEMINI_RETRY_BASE_DELAY_MS = 1000;

/**
 * Retries transient Gemini errors (429/5xx) with exponential backoff before
 * giving up. This is the only protection audio calls get — generateJson
 * skips the Groq/Claude fallback entirely for `contents`-based (audio) calls
 * since neither provider accepts audio input, so a single 503 would
 * otherwise fail the whole speaking grading request outright.
 */
async function generateContentWithRetry(params) {
  for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt++) {
    try {
      return await genAI.models.generateContent(params);
    } catch (err) {
      if (!isRetryableGeminiError(err) || attempt === GEMINI_MAX_ATTEMPTS) throw err;
      const delay = GEMINI_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      console.warn(`Gemini call failed (status ${err.status}), retrying in ${delay}ms (attempt ${attempt}/${GEMINI_MAX_ATTEMPTS})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

/**
 * Text-only fallbacks used when Gemini's quota/capacity is exhausted. Neither
 * provider's chat API has an audio content type, so these only ever run for
 * plain text calls (contents-based/audio calls skip fallback entirely — see
 * generateJson).
 */
async function generateJsonWithGroq({ systemPrompt, userMessage, maxOutputTokens }) {
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    max_completion_tokens: maxOutputTokens,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  return extractJson(response.choices[0].message.content);
}

async function generateJsonWithClaude({ systemPrompt, userMessage, maxOutputTokens }) {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: maxOutputTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return extractJson(textBlock.text);
}

async function generateJson({ systemPrompt, userMessage, contents, maxOutputTokens = 4096 }) {
  try {
    const response = await generateContentWithRetry({
      model: MODEL,
      contents: contents ?? userMessage,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens,
        responseMimeType: "application/json",
      },
    });

    return extractJson(response.text);
  } catch (err) {
    if (contents || !isRetryableGeminiError(err)) {
      throw err;
    }

    // Free option first, paid option second — only reachable at all once
    // Gemini's own free tier is exhausted or briefly overloaded.
    if (groq) {
      try {
        console.warn(`Gemini unavailable (status ${err.status}), falling back to Groq (free):`, err.message);
        return await generateJsonWithGroq({ systemPrompt, userMessage, maxOutputTokens });
      } catch (groqErr) {
        console.warn("Groq fallback failed:", groqErr.message);
        if (!anthropic) throw groqErr;
      }
    }

    if (anthropic) {
      console.warn(`Falling back to Claude:`, err.message);
      return generateJsonWithClaude({ systemPrompt, userMessage, maxOutputTokens });
    }

    throw err;
  }
}

/**
 * Uploads a buffer to the Gemini Files API and waits for it to finish
 * processing. Files start in PROCESSING state; generateContent calls that
 * reference a file before it reaches ACTIVE will fail, so this polls briefly.
 */
async function uploadAudioFile(buffer, mimeType, displayName) {
  const blob = new Blob([buffer], { type: mimeType });
  let file = await genAI.files.upload({ file: blob, config: { mimeType, displayName } });

  const deadline = Date.now() + 30_000;
  while (file.state === "PROCESSING" && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1000));
    file = await genAI.files.get({ name: file.name });
  }

  if (file.state === "FAILED") {
    throw new Error(`Gemini file processing failed for ${displayName}`);
  }
  if (file.state === "PROCESSING") {
    throw new Error(`Gemini file processing timed out for ${displayName}`);
  }

  return { fileUri: file.uri, mimeType: file.mimeType };
}

export { generateJson, uploadAudioFile };
