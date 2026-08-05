import { Readable, PassThrough } from "node:stream";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Transcodes an arbitrary browser-recorded audio buffer (webm/ogg/mp4, whatever
 * MediaRecorder produced) to 16kHz mono WAV. Browsers don't agree on a single
 * MediaRecorder output format, and none of the common ones are on Gemini's
 * documented supported audio MIME list, so every upload is normalized here
 * before it's stored or sent to the grading model.
 */
function transcodeToWav(buffer) {
  return new Promise((resolve, reject) => {
    const input = Readable.from(buffer);
    const output = new PassThrough();
    const chunks = [];

    output.on("data", (chunk) => chunks.push(chunk));
    output.on("end", () => resolve(Buffer.concat(chunks)));
    output.on("error", reject);

    ffmpeg(input)
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .on("error", reject)
      .pipe(output, { end: true });
  });
}

export { transcodeToWav };
