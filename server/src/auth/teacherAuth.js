import jwt from "jsonwebtoken";

const TEACHER_COOKIE_NAME = "ielts_teacher_session";
const TEACHER_TOKEN_TTL = "12h";

const teacherCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 12 * 60 * 60 * 1000,
};

function signTeacherSession(teacher) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ sub: teacher.id, username: teacher.username, role: "teacher" }, process.env.JWT_SECRET, {
    expiresIn: TEACHER_TOKEN_TTL,
  });
}

function verifyTeacherSession(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload.role !== "teacher") {
    throw new Error("Not a teacher session");
  }
  return payload;
}

export { signTeacherSession, verifyTeacherSession, TEACHER_COOKIE_NAME, teacherCookieOptions };
