import { generateJson } from "./aiClient.js";
import { SUBTYPE_LABELS } from "./promptBank.js";

const TASK2_SUBTYPES = [
  "opinion",
  "discussion",
  "problem_solution",
  "advantage_disadvantage",
  "two_part_question",
];

const TASK1_SUBTYPES = ["line_graph", "bar_chart", "pie_chart", "process", "map", "table", "letter"];

const TOPIC_AREAS =
  "education, environment, technology, health, crime and justice, government and public spending, work and employment, globalization, arts and media, family and relationships, urban development, tourism and travel";

function buildGenerateSystemPrompt(taskType) {
  const taskLabel = taskType === "task1" ? "IELTS Writing Task 1" : "IELTS Writing Task 2";
  const subtypes = taskType === "task1" ? TASK1_SUBTYPES : TASK2_SUBTYPES;
  const subtypeLabels = subtypes.map((s) => `"${s}" (${SUBTYPE_LABELS[s]})`).join(", ");

  const styleNotes =
    taskType === "task1"
      ? `- For chart/graph/table/process/map subtypes, end with the standard instruction "Summarise the information by selecting and reporting the main features, and make comparisons where relevant." (omit the comparison clause for a single process diagram or map if only one is shown).
- For the "letter" subtype, phrase it as a General Training letter task: a short situation description followed by "Write a letter to..." and three bullet points of what to include.
- Do not actually invent specific numbers/data — Task 1 prompts describe what a visual shows in general terms; the visual itself doesn't need to be generated.`
      : `- Use standard IELTS Task 2 phrasing conventions for the subtype, e.g. "To what extent do you agree or disagree?" for opinion, "Discuss both views and give your own opinion." for discussion, "What are the advantages and disadvantages of this?" for advantage/disadvantage.`;

  return `You are an IELTS question writer creating ONE original practice question for ${taskLabel}.

Pick a topic from this common IELTS topic range (or use the student's requested topic if one is given): ${TOPIC_AREAS}.

Pick ONE subtype from: ${subtypeLabels}.

${styleNotes}

Do NOT copy any specific real exam question verbatim — write an original question in the same style and register as genuine IELTS questions.

Respond with ONLY a single JSON object (no markdown fences, no prose outside the JSON):

{
  "subtype": string (one of the subtype keys listed above),
  "topic": string (short label for the topic area used, e.g. "environment"),
  "prompt_text": string (the full question text, ready to paste into an essay prompt field)
}`;
}

function buildGenerateUserMessage(topicHint) {
  return topicHint && topicHint.trim()
    ? `Requested topic: ${topicHint.trim()}`
    : "No specific topic requested — pick any suitable topic from the allowed range.";
}

async function generatePrompt({ taskType, topic }) {
  if (!["task1", "task2"].includes(taskType)) {
    throw new Error("taskType must be 'task1' or 'task2'");
  }

  const systemPrompt = buildGenerateSystemPrompt(taskType);
  const userMessage = buildGenerateUserMessage(topic);

  const result = await generateJson({ systemPrompt, userMessage, maxOutputTokens: 2048 });
  return result;
}

export { generatePrompt };
