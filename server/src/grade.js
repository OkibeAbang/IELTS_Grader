import { GoogleGenAI } from "@google/genai";
import { renderRubricText, MIN_WORD_COUNT, CRITERION_LABELS } from "./rubric.js";
import { renderFewShotText } from "./fewshot.js";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-flash-latest";

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Cheap heuristic off-topic / copied-prompt check (README 4.5).
 * Not a substitute for the model's own judgement, just a fast pre-filter
 * so we can flag obviously blank/copied/unrelated submissions before
 * spending an API call.
 */
function preCheck({ essay, prompt, taskType }) {
  const wordCount = countWords(essay);
  const minWords = MIN_WORD_COUNT[taskType];
  const issues = [];

  if (wordCount < minWords) {
    issues.push(
      `Essay is under the minimum word count (${wordCount}/${minWords} words). IELTS penalizes this directly.`
    );
  }

  const normalize = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3);

  const promptWords = new Set(normalize(prompt));
  const essayWords = normalize(essay);
  const overlap = essayWords.filter((w) => promptWords.has(w));
  const copiedRatio = essayWords.length > 0 ? overlap.length / essayWords.length : 0;

  if (copiedRatio > 0.5 && essayWords.length > 20) {
    issues.push(
      "A large portion of the essay appears to reuse wording directly from the prompt — possible copied-text submission."
    );
  }

  return { wordCount, minWords, issues };
}

function buildSystemPrompt(taskType) {
  const rubricText = renderRubricText(taskType);
  const fewShotText = renderFewShotText(taskType);
  const taskLabel = taskType === "task1" ? "IELTS Writing Task 1" : "IELTS Writing Task 2";
  const firstCriterionKey = taskType === "task1" ? "task_achievement" : "task_response";
  const firstCriterionLabel = CRITERION_LABELS[firstCriterionKey];

  return `You are an official IELTS examiner grading a ${taskLabel} response.

Grade strictly against the official IELTS band descriptors below. Do not use your own memorized notion of the scale — use only the language given here as your anchor for each band.

${rubricText}
${fewShotText}
## How to grade (follow this order, do not skip steps)

1. Restate the task prompt in your own words and what a fully-satisfying response would need to cover.
2. Analyze the essay against each of the four criteria SEPARATELY. For each criterion, quote or closely paraphrase specific parts of the essay as evidence before assigning a score. Do this for ${firstCriterionLabel}, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy, in that order.
3. Only after the evidence-based analysis, assign a band score (1-9, half-bands like 6.5 allowed) per criterion, citing which band descriptor it matches most closely.
4. Compute the overall band as the average of the 4 criteria, rounded to the nearest half band per IELTS convention (round .25 up to the next half band, round .75 up to the next whole band).

## Guard against grade inflation

Most LLMs cluster scores in the 6.5-7.5 range regardless of actual quality. Use the FULL 1-9 range. An essay with a clear, well-supported argument but frequent grammar errors can legitimately score high on Task Response/Achievement and low on Grammar. Do not let overall fluency impression drag every criterion toward the same number — score each criterion independently against its own descriptor language.

## Output format

Respond with ONLY a single JSON object (no markdown fences, no prose outside the JSON) matching this shape:

{
  "task_type": "Task 1" | "Task 2",
  "word_count": number,
  "criteria": {
    "${firstCriterionKey}": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "coherence_cohesion": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "lexical_resource": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "grammar_accuracy": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] }
  },
  "overall_band": number,
  "top_3_improvements": string[],
  "next_band_gap": string
}`;
}

function buildUserMessage({ essay, prompt, taskType, wordCount }) {
  const taskLabel = taskType === "task1" ? "Task 1" : "Task 2";
  return `${taskLabel} prompt:
${prompt}

Candidate essay (word count: ${wordCount}):
${essay}`;
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced ? fenced[1] : text;
  return JSON.parse(jsonText.trim());
}

async function gradeEssay({ essay, prompt, taskType }) {
  if (!["task1", "task2"].includes(taskType)) {
    throw new Error("taskType must be 'task1' or 'task2'");
  }

  const check = preCheck({ essay, prompt, taskType });

  const systemPrompt = buildSystemPrompt(taskType);
  const userMessage = buildUserMessage({ essay, prompt, taskType, wordCount: check.wordCount });

  const response = await genAI.models.generateContent({
    model: MODEL,
    contents: userMessage,
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  const result = extractJson(response.text);

  return { ...result, preCheck: check };
}

export { gradeEssay, preCheck, countWords };
