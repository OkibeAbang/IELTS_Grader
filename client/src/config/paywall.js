// Temporary kill-switch: everything on the site is free for now. While
// false, the app treats every signed-in user as Pro (no upsell prompts)
// and hides the Pricing/Billing navigation entirely — the pages and Stripe
// flow underneath are untouched, just not linked to from anywhere. Flip
// back to true to bring the paywall back. Mirrors PAYWALL_ENABLED in
// server/src/billing/feedbackAccess.js — keep both in sync.
export const PAYWALL_ENABLED = false;
