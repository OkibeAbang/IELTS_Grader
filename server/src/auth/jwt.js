import jwt from "jsonwebtoken";

const SESSION_COOKIE_NAME = "ielts_session";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// SameSite=None is required for the cookie to be sent on cross-origin fetches
// (frontend and backend on different domains in production); browsers require
// Secure whenever SameSite=None is used, which is why both are keyed off the
// same production check.
const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: COOKIE_MAX_AGE_MS,
};

function signSession(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function verifySession(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export { signSession, verifySession, SESSION_COOKIE_NAME, cookieOptions };
