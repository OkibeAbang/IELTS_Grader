import jwt from "jsonwebtoken";

const ADMIN_COOKIE_NAME = "ielts_admin_session";
const ADMIN_TOKEN_TTL = "12h";

// See jwt.js — the frontend proxies /api/* through Vercel, so this is always
// same-origin from the browser's perspective; SameSite=Lax is correct here too.
const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 12 * 60 * 60 * 1000,
};

function signAdminSession() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: ADMIN_TOKEN_TTL });
}

function verifyAdminSession(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload.role !== "admin") {
    throw new Error("Not an admin session");
  }
  return payload;
}

export { signAdminSession, verifyAdminSession, ADMIN_COOKIE_NAME, adminCookieOptions };
