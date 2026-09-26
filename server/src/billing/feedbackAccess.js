import { findById } from "../models/users.js";

// Temporary kill-switch: everything on the site is free for now. With this
// false, every account is treated as Pro everywhere hasProAccess() is
// checked (detailed feedback gating in writing.js/speaking.js, and the
// study-plan Pro gate in studyPlan.js) — nothing else needs to change.
// Flip back to true to re-enable the paywall. Mirrors PAYWALL_ENABLED in
// client/src/config/paywall.js — keep both in sync.
const PAYWALL_ENABLED = false;

async function hasProAccess(userId) {
  if (!PAYWALL_ENABLED) return true;
  const user = await findById(userId);
  return user?.subscription_tier === "pro";
}

// Filters a raw grader result down to just the free-tier fields (plus a
// proLocked flag the client uses to render an upsell) unless the requester
// is Pro. Applied at response time, not at grading/storage time, so the DB
// always keeps the full result and upgrading unlocks past attempts too.
function gateFeedback(result, freeKeys, isPro) {
  if (isPro) return { ...result, proLocked: false };

  const gated = { proLocked: true };
  for (const key of freeKeys) {
    if (result[key] !== undefined) gated[key] = result[key];
  }
  return gated;
}

export { hasProAccess, gateFeedback };
