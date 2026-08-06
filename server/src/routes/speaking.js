import fs from "node:fs";
import express from "express";
import multer from "multer";
import { getSpeakingTopicBank, getSpeakingTopic } from "../speakingQuestionBank.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireVerifiedEmail } from "../middleware/requireVerifiedEmail.js";
import { gradeSpeaking } from "../gradeSpeaking.js";
import { saveAttemptAudio, resolveAudioPath, deleteAttemptAudio } from "../audioStorage.js";
import { createAttempt, listAttemptsForUser, findAttemptById, deleteAttempt } from "../models/speakingAttempts.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

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
    });
    const { wavBuffers, ...gradedResult } = result;

    const audioPaths = saveAttemptAudio(req.user.id, wavBuffers);
    const attempt = createAttempt({
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

router.get("/attempts", requireAuth, (req, res) => {
  res.json({ attempts: listAttemptsForUser(req.user.id) });
});

router.get("/attempts/:id", requireAuth, (req, res) => {
  const attempt = findAttemptById(req.params.id);
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
});

router.delete("/attempts/:id", requireAuth, (req, res) => {
  const attempt = findAttemptById(req.params.id);
  if (!attempt || attempt.userId !== req.user.id) {
    return res.status(404).json({ error: "Attempt not found" });
  }
  deleteAttemptAudio(attempt);
  deleteAttempt(attempt.id);
  res.status(204).end();
});

router.get("/attempts/:id/audio/:part", requireAuth, (req, res) => {
  const attempt = findAttemptById(req.params.id);
  if (!attempt || attempt.userId !== req.user.id) {
    return res.status(404).json({ error: "Attempt not found" });
  }
  const pathKey = `${req.params.part}AudioPath`;
  const relativePath = attempt[pathKey];
  if (!relativePath) {
    return res.status(404).json({ error: "Audio part not found" });
  }
  res.set("Content-Type", "audio/wav");
  fs.createReadStream(resolveAudioPath(relativePath)).pipe(res);
});

export { router as speakingRouter };
