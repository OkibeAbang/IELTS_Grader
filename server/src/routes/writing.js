import express from "express";
import { gradeEssay } from "../grade.js";
import { gradeSection } from "../gradeSection.js";
import { getPromptBank } from "../promptBank.js";
import { generatePrompt } from "../generatePrompt.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireVerifiedEmail } from "../middleware/requireVerifiedEmail.js";
import { createAttempt, listAttemptsForUser, findAttemptById, deleteAttempt } from "../models/essayAttempts.js";
import { hasProAccess, gateFeedback } from "../billing/feedbackAccess.js";

const router = express.Router();

router.post("/grade", requireAuth, requireVerifiedEmail, async (req, res) => {
  const { essay, prompt, taskType } = req.body ?? {};

  if (typeof essay !== "string" || !essay.trim()) {
    return res.status(400).json({ error: "essay is required" });
  }
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }
  if (!["task1", "task2"].includes(taskType)) {
    return res.status(400).json({ error: "taskType must be 'task1' or 'task2'" });
  }

  try {
    const result = await gradeEssay({ essay, prompt, taskType });
    const attempt = await createAttempt({
      userId: req.user.id,
      mode: "full",
      taskType,
      promptText: prompt,
      essayText: essay,
      overallBand: result.overall_band,
      rawGraderResult: result,
    });
    const isPro = await hasProAccess(req.user.id);
    res.json({ ...gateFeedback(result, ["overall_band", "preCheck"], isPro), attemptId: attempt.id });
  } catch (err) {
    console.error("Grading failed:", err);
    res.status(502).json({ error: "Grading failed. Please try again." });
  }
});

router.post("/grade-section", requireAuth, requireVerifiedEmail, async (req, res) => {
  const { text, prompt, taskType, section } = req.body ?? {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }
  if (!["task1", "task2"].includes(taskType)) {
    return res.status(400).json({ error: "taskType must be 'task1' or 'task2'" });
  }
  if (!["introduction", "main_body", "conclusion"].includes(section)) {
    return res.status(400).json({ error: "section must be 'introduction', 'main_body', or 'conclusion'" });
  }

  try {
    const result = await gradeSection({ text, prompt, taskType, section });
    const attempt = await createAttempt({
      userId: req.user.id,
      mode: "section",
      taskType,
      section,
      promptText: prompt,
      essayText: text,
      overallBand: result.provisional_overall_band,
      rawGraderResult: result,
    });
    const isPro = await hasProAccess(req.user.id);
    res.json({ ...gateFeedback(result, ["provisional_overall_band", "preCheck"], isPro), attemptId: attempt.id });
  } catch (err) {
    console.error("Section grading failed:", err);
    res.status(502).json({ error: "Grading failed. Please try again." });
  }
});

router.get("/prompts", (req, res) => {
  const { taskType } = req.query;

  if (!["task1", "task2"].includes(taskType)) {
    return res.status(400).json({ error: "taskType must be 'task1' or 'task2'" });
  }

  res.json({ prompts: getPromptBank(taskType) });
});

router.post("/prompts/generate", requireAuth, async (req, res) => {
  const { taskType, topic } = req.body ?? {};

  if (!["task1", "task2"].includes(taskType)) {
    return res.status(400).json({ error: "taskType must be 'task1' or 'task2'" });
  }

  try {
    const result = await generatePrompt({ taskType, topic });
    res.json(result);
  } catch (err) {
    console.error("Prompt generation failed:", err);
    res.status(502).json({ error: "Question generation failed. Please try again." });
  }
});

router.get("/essays", requireAuth, async (req, res) => {
  try {
    res.json({ attempts: await listAttemptsForUser(req.user.id) });
  } catch (err) {
    console.error("Listing essay attempts failed:", err);
    res.status(502).json({ error: "Could not load your essay history. Please try again." });
  }
});

router.get("/essays/:id", requireAuth, async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    const isPro = await hasProAccess(req.user.id);
    const freeKeys = attempt.mode === "section" ? ["provisional_overall_band", "preCheck"] : ["overall_band", "preCheck"];
    res.json({
      attempt: {
        ...gateFeedback(attempt.rawGraderResult, freeKeys, isPro),
        attemptId: attempt.id,
        mode: attempt.mode,
        taskType: attempt.taskType,
        section: attempt.section,
        promptText: attempt.promptText,
        essayText: attempt.essayText,
        createdAt: attempt.createdAt,
      },
    });
  } catch (err) {
    console.error("Loading essay attempt failed:", err);
    res.status(502).json({ error: "Could not load this attempt. Please try again." });
  }
});

router.delete("/essays/:id", requireAuth, async (req, res) => {
  try {
    const attempt = await findAttemptById(req.params.id);
    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    await deleteAttempt(attempt.id);
    res.status(204).end();
  } catch (err) {
    console.error("Deleting essay attempt failed:", err);
    res.status(502).json({ error: "Could not delete this attempt. Please try again." });
  }
});

export { router as writingRouter };
