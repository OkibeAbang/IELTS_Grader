import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_ROOT = process.env.AUDIO_UPLOAD_DIR || path.join(process.cwd(), "uploads");

/**
 * Saves the 3 transcoded WAV buffers for one attempt under a random folder
 * (not the DB attempt id, since the row doesn't exist yet at this point) and
 * returns paths relative to UPLOAD_ROOT for storage in the DB.
 */
function saveAttemptAudio(userId, wavBuffers) {
  const folder = path.join("speaking", String(userId), crypto.randomUUID());
  const absDir = path.join(UPLOAD_ROOT, folder);
  fs.mkdirSync(absDir, { recursive: true });

  const paths = {};
  for (const part of ["part1", "part2", "part3"]) {
    const relativePath = path.join(folder, `${part}.wav`);
    fs.writeFileSync(path.join(UPLOAD_ROOT, relativePath), wavBuffers[part]);
    paths[`${part}AudioPath`] = relativePath;
  }
  return paths;
}

function resolveAudioPath(relativePath) {
  return path.join(UPLOAD_ROOT, relativePath);
}

function deleteAttemptAudio(attempt) {
  const dir = path.dirname(resolveAudioPath(attempt.part1AudioPath));
  fs.rmSync(dir, { recursive: true, force: true });
}

export { saveAttemptAudio, resolveAudioPath, deleteAttemptAudio };
