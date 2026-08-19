import express from "express";
import { getListeningSectionBank, getListeningSection } from "../listeningPassageBank.js";
import { scoreListeningAttempt, scoreListeningDrill } from "../scoreListening.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { createAttempt, listAttemptsForUser, findAttemptById, deleteAttempt } from "../models/listeningAttempts.js";

const router = express.Router();

router.get("/sections", (_req, res) => {
  res.json({ sections: getListeningSectionBank() });
});

router.get("/sections/:id", (req, res) => {
  const section = getListeningSection(req.params.id);
  if (!section) return res.status(404).json({ error: "Section not found" });
  res.json({ section });
});

router.post("/attempts", requireAuth, async (req, res) => {
  const { sectionId, answers } = req.body ?? {};

  if (typeof sectionId !== "string" || !sectionId.trim()) {
    return res.status(400).json({ error: "sectionId is required" });
  }
  if (typeof answers !== "object" || answers === null) {
    return res.status(400).json({ error: "answers must be an object" });
  }

  try {
    const result = scoreListeningAttempt({ sectionId, answers });
    const attempt = await createAttempt({
      userId: req.user.id,
      sectionId: result.sectionId,
      sectionTitle: result.sectionTitle,
      answers,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      overallBand: result.overallBand,
      rawResult: result,
    });
    res.status(201).json({ ...result, attemptId: attempt.id });
  } catch (err) {
    if (err.code === "SECTION_NOT_FOUND") {
      return res.status(404).json({ error: "Section not found" });
    }
    console.error("Listening scoring failed:", err);
    res.status(502).json({ error: "Scoring failed. Please try again." });
  }
});

router.post("/attempts/drill", requireAuth, async (req, res) => {
  const { sectionId, questionType, answers } = req.body ?? {};

  if (typeof sectionId !== "string" || !sectionId.trim()) {
    return res.status(400).json({ error: "sectionId is required" });
  }
  if (typeof questionType !== "string" || !questionType.trim()) {
    return res.status(400).json({ error: "questionType is required" });
  }
  if (typeof answers !== "object" || answers === null) {
    return res.status(400).json({ error: "answers must be an object" });
  }

  try {
    const result = scoreListeningDrill({ sectionId, questionType, answers });
    const attempt = await createAttempt({
      userId: req.user.id,
      sectionId: result.sectionId,
      sectionTitle: result.sectionTitle,
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
    if (err.code === "SECTION_NOT_FOUND") {
      return res.status(404).json({ error: "Section not found" });
    }
    if (err.code === "NO_QUESTIONS_OF_TYPE") {
      return res.status(400).json({ error: "No questions of that type in this section" });
    }
    console.error("Listening drill scoring failed:", err);
    res.status(502).json({ error: "Scoring failed. Please try again." });
  }
});

router.get("/attempts", requireAuth, async (req, res) => {
  try {
    res.json({ attempts: await listAttemptsForUser(req.user.id) });
  } catch (err) {
    console.error("Listing listening attempts failed:", err);
    res.status(502).json({ error: "Could not load your listening history. Please try again." });
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
        sectionTitle: attempt.sectionTitle,
        createdAt: attempt.createdAt,
      },
    });
  } catch (err) {
    console.error("Loading listening attempt failed:", err);
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
    console.error("Deleting listening attempt failed:", err);
    res.status(502).json({ error: "Could not delete this attempt. Please try again." });
  }
});

export { router as listeningRouter };
