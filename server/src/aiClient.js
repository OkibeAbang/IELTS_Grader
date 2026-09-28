import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import { Groq } from "groq-sdk";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const MODEL = "gemini-flash-latest";
// A different model family (not just a different alias of the same model),
// so it plausibly has separate capacity from MODEL. Used only for audio
// (Speaking) calls when MODEL is overloaded — Speaking has no cross-provider
// fallback at all (neither Groq nor Claude accept audio), so this is its
// only safety net. Confirmed via a real 503 "high demand" outage during
// testing on 2026-09-28 that MODEL alone, even with retries, isn't always
// enough.
const AUDIO_FALLBACK_MODEL = "gemini-flash-lite-latest";
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

// Widened from 3 (~3s of total backoff) after a real Gemini "high demand"
// 503 outage during testing on 2026-09-28 outlasted the old window — most
// demand spikes are reported as temporary, so giving retries more time to
// ride one out converts what would've been a hard failure into a success.
const GEMINI_MAX_ATTEMPTS = 6;
const GEMINI_RETRY_BASE_DELAY_MS = 1000;

/**
 * Retries transient Gemini errors (429/5xx) with exponential backoff before
 * giving up. `maxAttempts` is overridable so the audio-fallback-model call
 * in generateJson (a last resort, not the primary path) doesn't also wait
 * through a full 6-attempt cycle on top of the primary model's.
 */
async function generateContentWithRetry(params, maxAttempts = GEMINI_MAX_ATTEMPTS) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await genAI.models.generateContent(params);
    } catch (err) {
      if (!isRetryableGeminiError(err) || attempt === maxAttempts) throw err;
      const delay = GEMINI_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      console.warn(`Gemini call failed (status ${err.status}), retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

/**
 * Text-only fallbacks used when Gemini's quota/capacity is exhausted. Neither
 * provider's chat API has an audio content type, so these only ever run for
 * plain text calls — audio calls get a same-provider fallback model instead
 * (AUDIO_FALLBACK_MODEL, handled directly in generateJson).
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
    if (!isRetryableGeminiError(err)) {
      throw err;
    }

    if (contents) {
      // Audio (Speaking) calls can't use the Groq/Claude fallback below —
      // neither accepts audio input — so the only remaining option is a
      // different Gemini model that may not be hitting the same capacity
      // limits as MODEL. Fewer attempts than the primary call (this is
      // already a last resort); if this also fails, that error propagates
      // as-is, same as any other unrecovered failure.
      console.warn(
        `Gemini (${MODEL}) unavailable for audio call (status ${err.status}), trying ${AUDIO_FALLBACK_MODEL}:`,
        err.message
      );
      const fallbackResponse = await generateContentWithRetry(
        {
          model: AUDIO_FALLBACK_MODEL,
          contents,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens,
            responseMimeType: "application/json",
          },
        },
        2
      );
      return extractJson(fallbackResponse.text);
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
