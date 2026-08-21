import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { hasProAccess } from "../billing/feedbackAccess.js";
import { generateStudyPlan, SKILLS } from "../studyPlan.js";
import { upsertStudyPlan, findStudyPlanForUser } from "../models/studyPlans.js";

const router = express.Router();

async function requirePro(req, res, next) {
  if (!(await hasProAccess(req.user.id))) {
    return res.status(403).json({ error: "The study plan is a Pro feature", code: "PRO_REQUIRED" });
  }
  next();
}

router.post("/", requireAuth, requirePro, async (req, res) => {
  const { testDate, targetBand, currentBands, weeklyHours, weakestSkill } = req.body ?? {};

  if (targetBand !== undefined && targetBand !== null && (typeof targetBand !== "number" || targetBand < 4 || targetBand > 9)) {
    return res.status(400).json({ error: "targetBand must be a number between 4 and 9" });
  }
  if (weakestSkill !== undefined && weakestSkill !== null && !SKILLS.includes(weakestSkill)) {
    return res.status(400).json({ error: "weakestSkill must be one of listening, reading, writing, speaking" });
  }
  const cleanCurrentBands = {};
  for (const skill of SKILLS) {
    const value = currentBands?.[skill];
    if (value !== undefined && value !== null) {
      if (typeof value !== "number" || value < 4 || value > 9) {
        return res.status(400).json({ error: `currentBands.${skill} must be a number between 4 and 9` });
      }
      cleanCurrentBands[skill] = value;
    }
  }

  try {
    const plan = generateStudyPlan({
      testDate: testDate || null,
      targetBand: targetBand ?? null,
      currentBands: cleanCurrentBands,
      weeklyHours: weeklyHours ?? null,
      weakestSkill: weakestSkill ?? null,
    });

    const saved = await upsertStudyPlan({
      userId: req.user.id,
      testDate: testDate || null,
      targetBand: targetBand ?? null,
      currentBands: cleanCurrentBands,
      weeklyHours: weeklyHours ?? null,
      weakestSkill: weakestSkill ?? null,
      plan,
    });

    res.status(201).json({ studyPlan: saved });
  } catch (err) {
    console.error("Generating study plan failed:", err);
    res.status(502).json({ error: "Could not generate a study plan. Please try again." });
  }
});

router.get("/", requireAuth, requirePro, async (req, res) => {
  try {
    const studyPlan = await findStudyPlanForUser(req.user.id);
    if (!studyPlan) {
      return res.status(404).json({ error: "No study plan yet", code: "NO_PLAN" });
    }
    res.json({ studyPlan });
  } catch (err) {
    console.error("Loading study plan failed:", err);
    res.status(502).json({ error: "Could not load your study plan. Please try again." });
  }
});

export { router as studyPlanRouter };
