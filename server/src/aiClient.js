import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

const MODEL = "gemini-flash-latest";
const CLAUDE_MODEL = "claude-opus-5";

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced ? fenced[1] : text;
  return JSON.parse(jsonText.trim());
}

/** True for the errors a second provider can actually route around — rate limits and capacity, not bad requests. */
function isRetryableGeminiError(err) {
  return typeof err?.status === "number" && (err.status === 429 || err.status >= 500);
}

/**
 * Text-only fallback used when Gemini's quota/capacity is exhausted. Claude's
 * Messages API has no audio content type, so this only ever runs for plain
 * text calls (contents-based/audio calls skip it entirely — see generateJson).
 */
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
    const response = await genAI.models.generateContent({
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
    if (contents || !anthropic || !isRetryableGeminiError(err)) {
      throw err;
    }
    console.warn(`Gemini unavailable (status ${err.status}), falling back to Claude:`, err.message);
    return generateJsonWithClaude({ systemPrompt, userMessage, maxOutputTokens });
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
