import jwt from "jsonwebtoken";

const SESSION_COOKIE_NAME = "ielts_session";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// The frontend proxies /api/* through Vercel (see client/vercel.json) rather
// than calling the Render backend cross-origin directly, so from the
// browser's perspective every request is same-origin — SameSite=Lax works
// everywhere and avoids Safari/iOS blocking a cross-site cookie.
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
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
