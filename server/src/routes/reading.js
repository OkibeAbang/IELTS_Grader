import express from "express";
import { getReadingPassageBank, getReadingPassage } from "../readingPassageBank.js";
import { scoreReadingAttempt, scoreReadingDrill } from "../scoreReading.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { createAttempt, listAttemptsForUser, findAttemptById, deleteAttempt } from "../models/readingAttempts.js";

const router = express.Router();

router.get("/passages", (_req, res) => {
  res.json({ passages: getReadingPassageBank() });
});

router.get("/passages/:id", (req, res) => {
  const passage = getReadingPassage(req.params.id);
  if (!passage) return res.status(404).json({ error: "Passage not found" });
  res.json({ passage });
});

router.post("/attempts", requireAuth, async (req, res) => {
  const { passageId, answers } = req.body ?? {};

  if (typeof passageId !== "string" || !passageId.trim()) {
    return res.status(400).json({ error: "passageId is required" });
  }
  if (typeof answers !== "object" || answers === null) {
    return res.status(400).json({ error: "answers must be an object" });
  }

  try {
    const result = scoreReadingAttempt({ passageId, answers });
    const attempt = await createAttempt({
      userId: req.user.id,
      passageId: result.passageId,
      passageTitle: result.passageTitle,
      answers,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      overallBand: result.overallBand,
      rawResult: result,
    });
    res.status(201).json({ ...result, attemptId: attempt.id });
  } catch (err) {
    if (err.code === "PASSAGE_NOT_FOUND") {
      return res.status(404).json({ error: "Passage not found" });
    }
    console.error("Reading scoring failed:", err);
    res.status(502).json({ error: "Scoring failed. Please try again." });
  }
});

router.post("/attempts/drill", requireAuth, async (req, res) => {
  const { passageId, questionType, answers } = req.body ?? {};

  if (typeof passageId !== "string" || !passageId.trim()) {
    return res.status(400).json({ error: "passageId is required" });
  }
  if (typeof questionType !== "string" || !questionType.trim()) {
    return res.status(400).json({ error: "questionType is required" });
  }
  if (typeof answers !== "object" || answers === null) {
    return res.status(400).json({ error: "answers must be an object" });
  }

  try {
    const result = scoreReadingDrill({ passageId, questionType, answers });
    const attempt = await createAttempt({
      userId: req.user.id,
      passageId: result.passageId,
      passageTitle: result.passageTitle,
      mode: "drill",
      questionType: result.questionType,
      answers,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      overallBand: result.overallBand,
      rawResult: result,
    });
    res.status(201).json({ ...result, attemptId: attempt.id });
  } catch (err) {
    if (err.code === "PASSAGE_NOT_FOUND") {
      return res.status(404).json({ error: "Passage not found" });
    }
    if (err.code === "NO_QUESTIONS_OF_TYPE") {
      return res.status(400).json({ error: "No questions of that type in this passage" });
    }
    console.error("Reading drill scoring failed:", err);
    res.status(502).json({ error: "Scoring failed. Please try again." });
  }
});

router.get("/attempts", requireAuth, async (req, res) => {
  try {
    res.json({ attempts: await listAttemptsForUser(req.user.id) });
  } catch (err) {
    console.error("Listing reading attempts failed:", err);
    res.status(502).json({ error: "Could not load your reading history. Please try again." });
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
        ...attempt.rawResult,
        attemptId: attempt.id,
        passageTitle: attempt.passageTitle,
        createdAt: attempt.createdAt,
      },
    });
  } catch (err) {
    console.error("Loading reading attempt failed:", err);
    res.status(502).json({ error: "Could not load this attempt. Please try again." });
  }
});

router.delete("/attempts/:id", requireAuth, async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    await deleteAttempt(attempt.id);
    res.status(204).end();
  } catch (err) {
    console.error("Deleting reading attempt failed:", err);
    res.status(502).json({ error: "Could not delete this attempt. Please try again." });
  }
});

export { router as readingRouter };
