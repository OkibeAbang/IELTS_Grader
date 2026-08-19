import { generateJson, uploadAudioFile } from "./aiClient.js";
import { renderSpeakingRubricText, CRITERION_LABELS } from "./speakingRubric.js";
import { transcodeToWav } from "./audioTranscode.js";
import { MIN_PART1_SECONDS, MIN_PART2_SECONDS, MIN_PART3_SECONDS } from "./gradeSpeaking.js";

const MIN_SECONDS_BY_PART = {
  part1: MIN_PART1_SECONDS,
  part2: MIN_PART2_SECONDS,
  part3: MIN_PART3_SECONDS,
};

const PART_LABELS = {
  part1: "Part 1 (short interview)",
  part2: "Part 2 (2-minute long turn)",
  part3: "Part 3 (follow-up discussion)",
};

function preCheckSpeakingSection({ part, durationSec }) {
  const issues = [];
  const min = MIN_SECONDS_BY_PART[part];
  if (durationSec < min) {
    issues.push(`This recording is only ${durationSec}s — likely too short to fairly assess ${PART_LABELS[part]}.`);
  }
  return { durationSec, issues };
}

function buildSpeakingSectionSystemPrompt({ part }) {
  const rubricText = renderSpeakingRubricText();

  return `You are an official IELTS examiner grading a candidate's practice recording of ONE part of the IELTS Speaking test: ${PART_LABELS[part]}.

This is a drill, not a full Speaking test — the candidate is practicing just this one part. Grade strictly against the official IELTS Speaking band descriptors below, but treat the resulting score as PROVISIONAL: a real IELTS Speaking band is judged holistically across all 3 parts, and some evidence (e.g. sustained fluency over a longer performance) can only be fully judged with more material than one part provides.

${rubricText}

## How to grade (follow this order, do not skip steps)

1. Listen to the recording and produce a rough transcript (does not need to be perfectly verbatim — capture what the candidate actually said, including notable hesitations, false starts, or repetition if relevant to Fluency & Coherence).
2. Analyze the evidence against each of the four criteria SEPARATELY: ${CRITERION_LABELS.fluency_coherence}, ${CRITERION_LABELS.lexical_resource}, ${CRITERION_LABELS.grammar_accuracy}, ${CRITERION_LABELS.pronunciation}. Quote or closely paraphrase specific things the candidate said as evidence before assigning a score.
3. Only after the evidence-based analysis, assign a band score (1-9, half-bands like 6.5 allowed) per criterion, citing which band descriptor it matches most closely.
4. Compute the provisional overall band as the average of the 4 criteria, rounded to the nearest half band per IELTS convention (round .25 up to the next half band, round .75 up to the next whole band).
5. Corrections: pick 2-5 specific things the candidate actually said (quote or closely paraphrase the transcript) where the wording held their score back — a grammar mistake, an awkward or imprecise phrase, weak vocabulary. For each, write a corrected version that expresses the SAME idea, in language the candidate could realistically use on their next attempt.
   - Never give a pronunciation "correction" — pronunciation is about how something sounds, not what is said, and can't be fixed by rewriting text.
6. Confidence note: 1-2 sentences reminding the candidate this is a single-part, provisional estimate — name specifically which criteria are hardest to judge fairly from just this part (e.g. Fluency & Coherence benefits from a longer sample).

## Guard against grade inflation

Most LLMs cluster scores in the 6.5-7.5 range regardless of actual quality. Use the FULL 1-9 range. Score each criterion independently against its own descriptor language — do not let overall confidence/fluency impression drag every criterion toward the same number. For Pronunciation specifically, judge only what is audible in the recording — do not infer it from grammar or vocabulary quality.

## Output format

Respond with ONLY a single JSON object (no markdown fences, no prose outside the JSON) matching this shape:

{
  "transcript": string,
  "criteria": {
    "fluency_coherence": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "lexical_resource": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "grammar_accuracy": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "pronunciation": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] }
  },
  "provisional_overall_band": number,
  "top_improvements": string[],
  "confidence_note": string,
  "corrections": [ { "original": string, "correction": string, "why": string } ]
}`;
}

function questionTextForPart(topic, part) {
  if (part === "part1") {
    return `Part 1 questions asked:\n${topic.part1.questions.map((q) => `- ${q}`).join("\n")}`;
  }
  if (part === "part2") {
    const { cueCard } = topic.part2;
    return `Part 2 cue card given to the candidate:\n"${cueCard.topic}"\n${cueCard.bulletPoints.map((b) => `- ${b}`).join("\n")}`;
  }
  return `Part 3 discussion questions asked:\n${topic.part3.questions.map((q) => `- ${q}`).join("\n")}`;
}

function buildSpeakingSectionContents({ topic, part, fileRef }) {
  return [
    {
      role: "user",
      parts: [
        { text: `${questionTextForPart(topic, part)}\n\nCandidate's recording:` },
        { fileData: fileRef },
      ],
    },
  ];
}

async function gradeSpeakingSection({ topic, part, audioBuffer, durationSec }) {
  const check = preCheckSpeakingSection({ part, durationSec });

  const wavBuffer = await transcodeToWav(audioBuffer);
  const fileRef = await uploadAudioFile(wavBuffer, "audio/wav", `speaking-drill-${part}-${topic.id}`);

  const systemPrompt = buildSpeakingSectionSystemPrompt({ part });
  const contents = buildSpeakingSectionContents({ topic, part, fileRef });

  const result = await generateJson({ systemPrompt, contents, maxOutputTokens: 4000 });

  return { ...result, preCheck: check, wavBuffer };
}

export { gradeSpeakingSection, preCheckSpeakingSection };
