import express from "express";
import multer from "multer";
import { getSpeakingTopicBank, getSpeakingTopic } from "../speakingQuestionBank.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireVerifiedEmail } from "../middleware/requireVerifiedEmail.js";
import { gradeSpeaking } from "../gradeSpeaking.js";
import { saveAttemptAudio, streamAttemptAudio, deleteAttemptAudio } from "../audioStorage.js";
import { createAttempt, listAttemptsForUser, findAttemptById, deleteAttempt } from "../models/speakingAttempts.js";
import { createLiveTicket } from "../liveSpeaking.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

function liveVoiceEnabled() {
  return process.env.ENABLE_LIVE_VOICE === "true";
}

router.get("/live/status", (_req, res) => {
  res.json({ enabled: liveVoiceEnabled() });
});

// Short-lived, single-use ticket for the WebSocket connection in liveSpeaking.js.
// The WS connects directly to this server's origin (not proxied through Vercel
// like other /api/* calls), so it can't rely on the session cookie the way an
// ordinary request can — see liveSpeaking.js for the full reasoning.
router.post("/live/ticket", requireAuth, requireVerifiedEmail, (req, res) => {
  if (!liveVoiceEnabled()) {
    return res.status(404).json({ error: "Live conversation is not enabled" });
  }
  const { topicId } = req.body ?? {};
  if (!topicId || !getSpeakingTopic(topicId)) {
    return res.status(400).json({ error: "A valid topicId is required" });
  }
  res.json({ ticket: createLiveTicket(req.user.id, topicId) });
});

router.get("/topics", (_req, res) => {
  res.json({ topics: getSpeakingTopicBank() });
});

router.get("/topics/:id", (req, res) => {
  const topic = getSpeakingTopic(req.params.id);
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  res.json({ topic });
});

const audioUpload = upload.fields([
  { name: "part1Audio", maxCount: 1 },
  { name: "part2Audio", maxCount: 1 },
  { name: "part3Audio", maxCount: 1 },
]);

router.post("/attempts", requireAuth, requireVerifiedEmail, audioUpload, async (req, res) => {
  const { topicId, part1DurationSec, part2DurationSec, part3DurationSec, targetBand } = req.body ?? {};
  const files = req.files ?? {};

  const topic = typeof topicId === "string" ? getSpeakingTopic(topicId) : null;
  if (!topic) {
    return res.status(400).json({ error: "A valid topicId is required" });
  }
  if (!files.part1Audio?.[0] || !files.part2Audio?.[0] || !files.part3Audio?.[0]) {
    return res.status(400).json({ error: "part1Audio, part2Audio, and part3Audio files are all required" });
  }

  let parsedTargetBand = null;
  if (targetBand !== undefined && targetBand !== "") {
    const n = Number(targetBand);
    if (!Number.isFinite(n) || n < 4 || n > 9) {
      return res.status(400).json({ error: "targetBand must be a number between 4 and 9" });
    }
    parsedTargetBand = n;
  }

  const durations = {
    part1DurationSec: Number(part1DurationSec) || 0,
    part2DurationSec: Number(part2DurationSec) || 0,
    part3DurationSec: Number(part3DurationSec) || 0,
  };

  try {
    const result = await gradeSpeaking({
      topic,
      part1Buffer: files.part1Audio[0].buffer,
      part2Buffer: files.part2Audio[0].buffer,
      part3Buffer: files.part3Audio[0].buffer,
      ...durations,
      targetBand: parsedTargetBand,
    });
    const { wavBuffers, ...gradedResult } = result;

    const audioPaths = await saveAttemptAudio(req.user.id, wavBuffers);
    const attempt = await createAttempt({
      userId: req.user.id,
      topicId: topic.id,
      topicLabel: topic.topic,
      ...audioPaths,
      criteria: gradedResult.criteria,
      overallBand: gradedResult.overall_band,
      targetBand: parsedTargetBand,
      rawGraderResult: gradedResult,
    });

    res.status(201).json({ ...gradedResult, attemptId: attempt.id, targetBand: attempt.targetBand });
  } catch (err) {
    console.error("Speaking grading failed:", err);
    res.status(502).json({ error: "Grading failed. Please try again." });
  }
});

router.get("/attempts", requireAuth, async (req, res) => {
  try {
    res.json({ attempts: await listAttemptsForUser(req.user.id) });
  } catch (err) {
    console.error("Listing attempts failed:", err);
    res.status(502).json({ error: "Could not load your attempts. Please try again." });
  }
});

router.get("/attempts/:id", requireAuth, async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    res.json({
      attempt: {
        ...attempt.rawGraderResult,
        attemptId: attempt.id,
        topicLabel: attempt.topicLabel,
        targetBand: attempt.targetBand,
        createdAt: attempt.createdAt,
      },
    });
  } catch (err) {
    console.error("Loading attempt failed:", err);
    res.status(502).json({ error: "Could not load this attempt. Please try again." });
  }
});

router.delete("/attempts/:id", requireAuth, async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    await deleteAttemptAudio(attempt);
    await deleteAttempt(attempt.id);
    res.status(204).end();
  } catch (err) {
    console.error("Deleting attempt failed:", err);
    res.status(502).json({ error: "Could not delete this attempt. Please try again." });
  }
});

router.get("/attempts/:id/audio/:part", requireAuth, async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    const pathKey = `${req.params.part}AudioPath`;
    const key = attempt[pathKey];
    if (!key) {
      return res.status(404).json({ error: "Audio part not found" });
    }
    res.set("Content-Type", "audio/wav");
    await streamAttemptAudio(key, res);
  } catch (err) {
    console.error("Streaming audio failed:", err);
    if (!res.headersSent) res.status(502).json({ error: "Could not load this audio file." });
  }
});

export { router as speakingRouter };
