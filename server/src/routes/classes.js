import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { findClassByJoinCode } from "../models/classes.js";
import { addStudentToClass, listClassesForStudent } from "../models/classStudents.js";

const router = express.Router();

router.post("/join", requireAuth, async (req, res) => {
  const { code } = req.body ?? {};
  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "code is required" });
  }

  try {
    const cls = await findClassByJoinCode(code.trim().toUpperCase());
    if (!cls) {
      return res.status(404).json({ error: "That class code wasn't found. Double-check it with your teacher." });
    }
    await addStudentToClass({ classId: cls.id, userId: req.user.id });
    res.json({ class: { id: cls.id, name: cls.name } });
  } catch (err) {
    console.error("Joining class failed:", err);
    res.status(502).json({ error: "Could not join this class. Please try again." });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    res.json({ classes: await listClassesForStudent(req.user.id) });
  } catch (err) {
    console.error("Listing student classes failed:", err);
    res.status(502).json({ error: "Could not load your classes. Please try again." });
  }
});

export { router as classesRouter };
