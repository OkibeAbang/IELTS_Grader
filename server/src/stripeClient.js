import Stripe from "stripe";

// Mirrors the aiClient.js pattern: null until real keys are configured, so
// the rest of the app can boot and be tested before Stripe is set up.
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export { stripe };
