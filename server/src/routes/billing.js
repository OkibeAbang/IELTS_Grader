import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { findById, findByStripeCustomerId, updateSubscription } from "../models/users.js";
import { stripe } from "../stripeClient.js";

const router = express.Router();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
  annual: process.env.STRIPE_PRICE_ID_PRO_ANNUAL,
};

function requireStripe(_req, res, next) {
  if (!stripe) {
    return res.status(503).json({ error: "Billing is not configured yet" });
  }
  next();
}

router.get("/status", requireAuth, async (req, res) => {
  const user = await findById(req.user.id);
  res.json({
    tier: user.subscription_tier,
    status: user.subscription_status,
    currentPeriodEnd: user.subscription_current_period_end,
  });
});

router.post("/checkout-session", requireAuth, requireStripe, async (req, res) => {
  const { plan } = req.body ?? {};
  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    return res.status(400).json({ error: "plan must be 'monthly' or 'annual', and its price must be configured" });
  }

  try {
    const user = await findById(req.user.id);
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: String(user.id) },
      });
      customerId = customer.id;
      await updateSubscription(user.id, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: user.stripe_subscription_id ?? null,
        tier: user.subscription_tier ?? "free",
        status: user.subscription_status ?? null,
        currentPeriodEnd: user.subscription_current_period_end ?? null,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: String(user.id),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${CLIENT_ORIGIN}/billing?checkout=success`,
      cancel_url: `${CLIENT_ORIGIN}/billing?checkout=cancelled`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Creating checkout session failed:", err);
    res.status(502).json({ error: "Couldn't start checkout. Please try again." });
  }
});

router.post("/portal-session", requireAuth, requireStripe, async (req, res) => {
  try {
    const user = await findById(req.user.id);
    if (!user.stripe_customer_id) {
      return res.status(404).json({ error: "No billing account yet. Upgrade to Pro first." });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${CLIENT_ORIGIN}/billing`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Creating billing portal session failed:", err);
    res.status(502).json({ error: "Couldn't open the billing portal. Please try again." });
  }
});

// Stripe needs the raw request body to verify the signature, so this handler
// is mounted directly in index.js ahead of the global express.json()
// middleware — it is deliberately NOT part of the router above.
async function stripeWebhookHandler(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: "Billing is not configured yet" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = Number(session.client_reference_id);
      if (userId) {
        // current_period_end isn't on the checkout session itself; the
        // customer.subscription.created event that follows shortly after
        // fills it in.
        await updateSubscription(userId, {
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          tier: "pro",
          status: "active",
          currentPeriodEnd: null,
        });
      }
    } else if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object;
      const user = await findByStripeCustomerId(subscription.customer);
      if (user) {
        const isActive = ["active", "trialing"].includes(subscription.status);
        // As of Stripe API 2025-03-31+, current_period_end lives on each
        // subscription item, not on the subscription object itself — we
        // only ever create single-item subscriptions, so items.data[0] is
        // always the one that matters here.
        const periodEndSeconds = subscription.items?.data?.[0]?.current_period_end;
        const currentPeriodEnd = periodEndSeconds ? new Date(periodEndSeconds * 1000).toISOString() : null;
        await updateSubscription(user.id, {
          stripeCustomerId: subscription.customer,
          stripeSubscriptionId: subscription.id,
          tier: isActive ? "pro" : "free",
          status: subscription.status,
          currentPeriodEnd,
        });
      }
    }
  } catch (err) {
    console.error("Stripe webhook handling failed:", err);
  }

  // Ack everything, including event types we don't act on — Stripe retries
  // (and eventually disables the endpoint) on anything but a 2xx.
  res.json({ received: true });
}

export { router as billingRouter, stripeWebhookHandler };
