import { generateJson } from "./aiClient.js";
import { renderRubricText, CRITERION_LABELS } from "./rubric.js";
import { SECTION_LABELS, TYPICAL_WORD_RANGE, getSectionGuidance } from "./sectionGuidance.js";

const MIN_ASSESSABLE_WORDS = 10;

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function preCheckSection({ text }) {
  const wordCount = countWords(text);
  const issues = [];

  if (wordCount < MIN_ASSESSABLE_WORDS) {
    issues.push(
      `Only ${wordCount} words submitted — too short for the model to meaningfully assess. Try writing a fuller attempt at this section.`
    );
  }

  return { wordCount, issues };
}

function buildSectionSystemPrompt(taskType, section) {
  const rubricText = renderRubricText(taskType);
  const taskLabel = taskType === "task1" ? "IELTS Writing Task 1" : "IELTS Writing Task 2";
  const sectionLabel = SECTION_LABELS[section];
  const structuralGuidance = getSectionGuidance(taskType, section);
  const firstCriterionKey = taskType === "task1" ? "task_achievement" : "task_response";
  const firstCriterionLabel = CRITERION_LABELS[firstCriterionKey];

  return `You are an IELTS writing coach helping a student practice ONE section of a ${taskLabel} response in isolation: the ${sectionLabel}.

This is section-level practice, not a full essay submission. The official IELTS band descriptors below are written to judge a complete response, so you cannot issue a certified full-essay band from a fragment. Instead, give a PROVISIONAL, band-descriptor-anchored estimate of what this section demonstrates, and be explicit about that limitation.

## What this section should accomplish structurally
${structuralGuidance}

## Official IELTS band descriptors (use as scoring anchors, bands 4-9)
${rubricText}

## How to grade (follow this order, do not skip steps)

1. State what this specific section (${sectionLabel}) needs to achieve structurally, referencing the guidance above.
2. Check whether the submitted text actually fulfils that structural purpose (e.g. for an introduction: does it paraphrase rather than copy, does it state a clear position/overview; for a body paragraph: is there one clear topic idea, developed with an example; for a conclusion: does it restate rather than repeat verbatim, without new arguments).
3. Analyze the text against each of the four criteria SEPARATELY, quoting or closely paraphrasing specific parts as evidence before scoring. Only score what is actually assessable from this fragment — for criteria that depend heavily on the whole essay (e.g. whether a position is "maintained throughout"), judge based on what this section suggests so far, not what you can't yet know.
4. Assign a provisional band (1-9, half-bands allowed) per criterion, citing the closest band descriptor language.
5. Compute a provisional overall band as the average of the 4, rounded to the nearest half band.

## Guard against grade inflation

Use the FULL 1-9 range. Do not default to 6.5-7.5 out of politeness. A technically fluent sentence that fails the section's structural purpose (e.g. an introduction that just copies the prompt, or a conclusion that introduces a brand new argument) should score low on ${firstCriterionLabel} regardless of how clean the grammar is.

## Output format

Respond with ONLY a single JSON object (no markdown fences, no prose outside the JSON) matching this shape:

{
  "section": "${section}",
  "task_type": "${taskType === "task1" ? "Task 1" : "Task 2"}",
  "word_count": number,
  "section_checklist": {
    "meets_structural_purpose": boolean,
    "notes": string
  },
  "criteria": {
    "${firstCriterionKey}": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "coherence_cohesion": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "lexical_resource": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "grammar_accuracy": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] }
  },
  "provisional_overall_band": number,
  "top_improvements": string[],
  "confidence_note": string
}

"confidence_note" must explicitly remind the student this is a single-section estimate, not a certified full-essay band, and name which criteria were hardest to judge from a fragment this size.`;
}

function buildSectionUserMessage({ text, prompt, taskType, section, wordCount }) {
  const taskLabel = taskType === "task1" ? "Task 1" : "Task 2";
  const sectionLabel = SECTION_LABELS[section];
  const typicalRange = TYPICAL_WORD_RANGE[section];

  return `${taskLabel} prompt:
${prompt}

Section being practiced: ${sectionLabel} (typical length for this section: ${typicalRange})
Student's submitted text for this section (word count: ${wordCount}):
${text}`;
}

async function gradeSection({ text, prompt, taskType, section }) {
  if (!["task1", "task2"].includes(taskType)) {
    throw new Error("taskType must be 'task1' or 'task2'");
  }
  if (!["introduction", "main_body", "conclusion"].includes(section)) {
    throw new Error("section must be 'introduction', 'main_body', or 'conclusion'");
  }

  const check = preCheckSection({ text });

  const systemPrompt = buildSectionSystemPrompt(taskType, section);
  const userMessage = buildSectionUserMessage({
    text,
    prompt,
    taskType,
    section,
    wordCount: check.wordCount,
  });

  const result = await generateJson({ systemPrompt, userMessage });

  return { ...result, preCheck: check };
}

export { gradeSection, preCheckSection };
