import { verifyAdminSession, ADMIN_COOKIE_NAME } from "../auth/adminAuth.js";

function requireAdmin(req, res, next) {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Not signed in as admin" });
  }

  try {
    verifyAdminSession(token);
    next();
  } catch {
    return res.status(401).json({ error: "Admin session expired or invalid" });
  }
}

export { requireAdmin };
