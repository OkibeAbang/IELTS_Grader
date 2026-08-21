import { findById } from "../models/users.js";

async function hasProAccess(userId) {
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
