import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 (S3-compatible object storage) when configured, falling back
 * to local disk otherwise — same optional-integration pattern used elsewhere
 * in this app (ANTHROPIC_API_KEY, GOOGLE_CLIENT_ID, SMTP_HOST). Local disk is
 * fine for dev but not for production on Render's free tier, which has no
 * persistent disk (see REMINDERS.md).
 *
 * Keys always use forward slashes regardless of host OS — unlike local
 * filesystem paths (built with path.join), object storage keys aren't real
 * paths and R2/S3 tooling expects '/' as the folder-style delimiter.
 */

const UPLOAD_ROOT = process.env.AUDIO_UPLOAD_DIR || path.join(process.cwd(), "uploads");
const R2_BUCKET = process.env.R2_BUCKET_NAME;

const r2 = process.env.R2_ACCOUNT_ID
  ? new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

function localPathFor(key) {
  return path.join(UPLOAD_ROOT, ...key.split("/"));
}

/**
 * Saves the 3 transcoded WAV buffers for one attempt under a random folder
 * (not the DB attempt id, since the row doesn't exist yet at this point) and
 * returns keys for storage in the DB — either R2 object keys or paths
 * relative to UPLOAD_ROOT, depending on which backend is active.
 */
async function saveAttemptAudio(userId, wavBuffers) {
  const folder = `speaking/${userId}/${crypto.randomUUID()}`;
  const paths = {};

  for (const part of ["part1", "part2", "part3"]) {
    const key = `${folder}/${part}.wav`;
    if (r2) {
      await r2.send(
        new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: wavBuffers[part], ContentType: "audio/wav" })
      );
    } else {
      const absPath = localPathFor(key);
      fs.mkdirSync(path.dirname(absPath), { recursive: true });
      fs.writeFileSync(absPath, wavBuffers[part]);
    }
    paths[`${part}AudioPath`] = key;
  }
  return paths;
}

/** Streams a saved audio file straight to an HTTP response. */
async function streamAttemptAudio(key, res) {
  if (r2) {
    const response = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    response.Body.pipe(res);
  } else {
    fs.createReadStream(localPathFor(key)).pipe(res);
  }
}

async function deleteAttemptAudio(attempt) {
  const keys = [attempt.part1AudioPath, attempt.part2AudioPath, attempt.part3AudioPath].filter(Boolean);
  if (keys.length === 0) return;

  if (r2) {
    await r2.send(new DeleteObjectsCommand({ Bucket: R2_BUCKET, Delete: { Objects: keys.map((Key) => ({ Key })) } }));
  } else {
    const dir = path.dirname(localPathFor(attempt.part1AudioPath));
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** Single-file analog of saveAttemptAudio, for a one-part Learn drill attempt. */
async function saveSpeakingDrillAudio(userId, part, wavBuffer) {
  const key = `speaking-drill/${userId}/${crypto.randomUUID()}/${part}.wav`;
  if (r2) {
    await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: wavBuffer, ContentType: "audio/wav" }));
  } else {
    const absPath = localPathFor(key);
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, wavBuffer);
  }
  return { audioPath: key };
}

async function deleteSpeakingDrillAudio(attempt) {
  if (!attempt.audioPath) return;

  if (r2) {
    await r2.send(new DeleteObjectsCommand({ Bucket: R2_BUCKET, Delete: { Objects: [{ Key: attempt.audioPath }] } }));
  } else {
    const dir = path.dirname(localPathFor(attempt.audioPath));
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Static, content-bank audio (rendered once per listening section by
 * scripts/renderListeningAudio.js, not per user/attempt) — key is just the
 * section id, no random folder, since re-rendering a section should
 * overwrite its one file rather than accumulate old versions.
 */
function listeningAudioKey(sectionId) {
  return `listening/${sectionId}.mp3`;
}

async function saveListeningAudio(sectionId, mp3Buffer) {
  const key = listeningAudioKey(sectionId);
  if (r2) {
    await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: mp3Buffer, ContentType: "audio/mpeg" }));
  } else {
    const absPath = localPathFor(key);
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, mp3Buffer);
  }
  return key;
}

async function listeningAudioExists(sectionId) {
  const key = listeningAudioKey(sectionId);
  if (r2) {
    try {
      await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
      return true;
    } catch {
      return false;
    }
  }
  return fs.existsSync(localPathFor(key));
}

/**
 * Streams with HTTP Range support (206 Partial Content) — unlike the
 * attempt-audio streamers above, this backs a native <audio> element's
 * scrub bar, which needs Range/Content-Length to know the track's duration
 * and seek without downloading the whole file first.
 */
async function streamListeningAudio(sectionId, req, res) {
  const key = listeningAudioKey(sectionId);
  const range = req.headers.range;

  if (r2) {
    const response = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key, Range: range }));
    res.set("Accept-Ranges", "bytes");
    res.set("Content-Length", String(response.ContentLength));
    if (response.ContentRange) {
      res.status(206);
      res.set("Content-Range", response.ContentRange);
    }
    response.Body.pipe(res);
    return;
  }

  const absPath = localPathFor(key);
  const { size } = fs.statSync(absPath);
  res.set("Accept-Ranges", "bytes");

  if (!range) {
    res.set("Content-Length", String(size));
    fs.createReadStream(absPath).pipe(res);
    return;
  }

  const match = /bytes=(\d*)-(\d*)/.exec(range);
  const start = match?.[1] ? Number(match[1]) : 0;
  const end = match?.[2] ? Number(match[2]) : size - 1;

  res.status(206);
  res.set("Content-Range", `bytes ${start}-${end}/${size}`);
  res.set("Content-Length", String(end - start + 1));
  fs.createReadStream(absPath, { start, end }).pipe(res);
}

export {
  saveAttemptAudio,
  streamAttemptAudio,
  deleteAttemptAudio,
  saveSpeakingDrillAudio,
  deleteSpeakingDrillAudio,
  saveListeningAudio,
  listeningAudioExists,
  streamListeningAudio,
};
