import { Readable, PassThrough } from "node:stream";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

const TTS_MODEL = "gemini-3.8-flash-tts";

// The installed @google/genai SDK version predates this model's multi-speaker
// `speech_metadata.speaker` field (it silently drops the property rather than
// forwarding it), so this calls the REST API directly instead of going
// through the SDK — isolated to this one file, doesn't touch the SDK version
// aiClient.js relies on for grading.
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent`;

// A handful of Gemini's prebuilt studio voices, picked for contrast so two
// speakers in the same recording are easy to tell apart. Assigned in order
// of first appearance in a script, not tied to specific speaker names, so
// this works for any 2-speaker dialogue without per-script configuration.
const VOICE_PALETTE = ["Kore", "Puck", "Charon", "Leda"];

/**
 * Gemini's multi-speaker TTS supports exactly 2 speakers per request, and a
 * single-voice request (no multiSpeakerVoiceConfig at all) is the only way
 * to do a 1-speaker monologue. So: 1 speaker -> plain voiceConfig, 2 ->
 * multiSpeakerVoiceConfig, 3+ -> not supported (would need a
 * per-turn-synthesize-and-concatenate fallback — not built yet since nothing
 * in the content bank needs it; see REMINDERS.md).
 */
function buildSpeechConfig(uniqueSpeakers) {
  if (uniqueSpeakers.length > 2) {
    throw new Error(
      `Listening audio generation only supports up to 2 speakers per section (got ${uniqueSpeakers.length}: ${uniqueSpeakers.join(", ")}). ` +
        `A 3+-speaker script needs a per-turn synthesis fallback that hasn't been built yet.`
    );
  }
  if (uniqueSpeakers.length === 1) {
    return { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_PALETTE[0] } } };
  }
  return {
    multiSpeakerVoiceConfig: {
      speakerVoiceConfigs: uniqueSpeakers.map((speaker, i) => ({
        speaker,
        voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_PALETTE[i % VOICE_PALETTE.length] } },
      })),
    },
  };
}

// Multi-speaker TTS requires each turn tagged with which speaker delivers it
// via speechMetadata.speaker on its own part. A single-voice request has no
// speaker to disambiguate, so that tag is only added when there's more than
// one unique speaker in the script.
function buildContents(script, isMultiSpeaker) {
  return [
    {
      role: "user",
      parts: script.map(({ speaker, line }) =>
        isMultiSpeaker ? { text: line, speechMetadata: { speaker } } : { text: line }
      ),
    },
  ];
}

/** Pipes raw PCM (as returned by Gemini TTS) through ffmpeg to produce an MP3 buffer. */
function pcmToMp3(pcmBuffer, sampleRate) {
  return new Promise((resolve, reject) => {
    const input = Readable.from(pcmBuffer);
    const output = new PassThrough();
    const chunks = [];

    output.on("data", (chunk) => chunks.push(chunk));
    output.on("end", () => resolve(Buffer.concat(chunks)));
    output.on("error", reject);

    ffmpeg(input)
      .inputFormat("s16le")
      .inputOptions([`-ar ${sampleRate}`, "-ac 1"])
      .audioCodec("libmp3lame")
      .audioBitrate("96k")
      .format("mp3")
      .on("error", reject)
      .pipe(output, { end: true });
  });
}

/**
 * Generates one MP3 buffer for an entire listening section script, with a
 * distinct voice per speaker. This is meant to be run once per section
 * (see scripts/renderListeningAudio.js) and the result stored, not called
 * live per playback — see the cost/design notes in the implementation plan.
 */
async function generateListeningAudioBuffer(script) {
  const uniqueSpeakers = [...new Set(script.map((turn) => turn.speaker))];
  const speechConfig = buildSpeechConfig(uniqueSpeakers);
  const isMultiSpeaker = uniqueSpeakers.length > 1;

  const res = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: buildContents(script, isMultiSpeaker),
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini TTS request failed (${res.status}): ${errBody}`);
  }

  const response = await res.json();
  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    throw new Error("Gemini TTS response did not include audio data");
  }

  const { data, mimeType } = part.inlineData;
  const rateMatch = /rate=(\d+)/.exec(mimeType ?? "");
  const sampleRate = rateMatch ? Number(rateMatch[1]) : 24000;
  const pcmBuffer = Buffer.from(data, "base64");

  return pcmToMp3(pcmBuffer, sampleRate);
}

export { generateListeningAudioBuffer };
