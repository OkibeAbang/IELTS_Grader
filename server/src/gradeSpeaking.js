import { generateJson, uploadAudioFile } from "./aiClient.js";
import { renderSpeakingRubricText, CRITERION_LABELS } from "./speakingRubric.js";
import { transcodeToWav } from "./audioTranscode.js";

const MIN_PART1_SECONDS = 15;
const MIN_PART2_SECONDS = 30;
const MIN_PART3_SECONDS = 15;

function preCheckSpeaking({ part1DurationSec, part2DurationSec, part3DurationSec }) {
  const issues = [];

  if (part1DurationSec < MIN_PART1_SECONDS) {
    issues.push(`Part 1 recording is only ${part1DurationSec}s — likely too short to assess Fluency & Coherence.`);
  }
  if (part2DurationSec < MIN_PART2_SECONDS) {
    issues.push(
      `Part 2 recording is only ${part2DurationSec}s — the long turn is meant to be up to 2 minutes, so this may be too short to assess fairly.`
    );
  }
  if (part3DurationSec < MIN_PART3_SECONDS) {
    issues.push(`Part 3 recording is only ${part3DurationSec}s — likely too short to assess the discussion.`);
  }

  return { part1DurationSec, part2DurationSec, part3DurationSec, issues };
}

function buildSpeakingSystemPrompt() {
  const rubricText = renderSpeakingRubricText();

  return `You are an official IELTS examiner grading a candidate's Speaking test from audio recordings of all 3 parts (Part 1: short interview, Part 2: 2-minute long turn on a cue card, Part 3: follow-up discussion).

Grade strictly against the official IELTS Speaking band descriptors below. Do not use your own memorized notion of the scale — use only the language given here as your anchor for each band.

${rubricText}

## How to grade (follow this order, do not skip steps)

1. Listen to all 3 parts and produce a rough transcript for each (this does not need to be perfectly verbatim — capture what the candidate actually said, including notable hesitations, false starts, or repetition if relevant to Fluency & Coherence).
2. Grade HOLISTICALLY across all 3 parts as a single performance — this is how real IELTS Speaking is scored (one examiner, one overall judgement per criterion), not a per-part sub-score. Analyze the evidence against each of the four criteria SEPARATELY: ${CRITERION_LABELS.fluency_coherence}, ${CRITERION_LABELS.lexical_resource}, ${CRITERION_LABELS.grammar_accuracy}, ${CRITERION_LABELS.pronunciation}. Quote or closely paraphrase specific things the candidate said as evidence before assigning a score.
3. Only after the evidence-based analysis, assign a band score (1-9, half-bands like 6.5 allowed) per criterion, citing which band descriptor it matches most closely.
4. Compute the overall band as the average of the 4 criteria, rounded to the nearest half band per IELTS convention (round .25 up to the next half band, round .75 up to the next whole band).

## Guard against grade inflation

Most LLMs cluster scores in the 6.5-7.5 range regardless of actual quality. Use the FULL 1-9 range. A candidate who speaks confidently but with frequent grammar errors can legitimately score high on Fluency & Coherence and low on Grammatical Range & Accuracy. Do not let overall confidence/fluency impression drag every criterion toward the same number — score each criterion independently against its own descriptor language. For Pronunciation specifically, judge only what is audible in the recording (clarity, intelligibility, stress/intonation) — do not infer it from grammar or vocabulary quality.

## Output format

Respond with ONLY a single JSON object (no markdown fences, no prose outside the JSON) matching this shape:

{
  "part_transcripts": { "part1": string, "part2": string, "part3": string },
  "criteria": {
    "fluency_coherence": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "lexical_resource": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "grammar_accuracy": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] },
    "pronunciation": { "band": number, "strengths": string[], "weaknesses": string[], "evidence": string[] }
  },
  "overall_band": number,
  "top_3_improvements": string[],
  "next_band_gap": string
}`;
}

function buildSpeakingContents({ topic, part1FileRef, part2FileRef, part3FileRef }) {
  return [
    {
      role: "user",
      parts: [
        { text: `Part 1 questions asked:\n${topic.part1.questions.map((q) => `- ${q}`).join("\n")}\n\nPart 1 recording (candidate's answers):` },
        { fileData: part1FileRef },
        {
          text: `Part 2 cue card given to the candidate:\n"${topic.part2.cueCard.topic}"\n${topic.part2.cueCard.bulletPoints.map((b) => `- ${b}`).join("\n")}\n\nPart 2 recording (candidate's 2-minute long turn):`,
        },
        { fileData: part2FileRef },
        { text: `Part 3 discussion questions asked:\n${topic.part3.questions.map((q) => `- ${q}`).join("\n")}\n\nPart 3 recording (candidate's answers):` },
        { fileData: part3FileRef },
      ],
    },
  ];
}

async function gradeSpeaking({
  topic,
  part1Buffer,
  part2Buffer,
  part3Buffer,
  part1DurationSec,
  part2DurationSec,
  part3DurationSec,
}) {
  const check = preCheckSpeaking({ part1DurationSec, part2DurationSec, part3DurationSec });

  const [part1Wav, part2Wav, part3Wav] = await Promise.all([
    transcodeToWav(part1Buffer),
    transcodeToWav(part2Buffer),
    transcodeToWav(part3Buffer),
  ]);

  const [part1FileRef, part2FileRef, part3FileRef] = await Promise.all([
    uploadAudioFile(part1Wav, "audio/wav", `speaking-part1-${topic.id}`),
    uploadAudioFile(part2Wav, "audio/wav", `speaking-part2-${topic.id}`),
    uploadAudioFile(part3Wav, "audio/wav", `speaking-part3-${topic.id}`),
  ]);

  const systemPrompt = buildSpeakingSystemPrompt();
  const contents = buildSpeakingContents({ topic, part1FileRef, part2FileRef, part3FileRef });

  const result = await generateJson({ systemPrompt, contents, maxOutputTokens: 6000 });

  return { ...result, preCheck: check, wavBuffers: { part1: part1Wav, part2: part2Wav, part3: part3Wav } };
}

export { gradeSpeaking, preCheckSpeaking };
