import { verifySession, SESSION_COOKIE_NAME } from "../auth/jwt.js";

function requireAuth(req, res, next) {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Not signed in" });
  }

  try {
    const payload = verifySession(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
}

export { requireAuth };
