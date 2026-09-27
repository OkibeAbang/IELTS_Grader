import { verifyTeacherSession, TEACHER_COOKIE_NAME } from "../auth/teacherAuth.js";

function requireTeacher(req, res, next) {
  const token = req.cookies?.[TEACHER_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Not signed in as teacher" });
  }

  try {
    const payload = verifyTeacherSession(token);
    req.teacher = { id: payload.sub, username: payload.username };
    next();
  } catch {
    return res.status(401).json({ error: "Teacher session expired or invalid" });
  }
}

export { requireTeacher };
