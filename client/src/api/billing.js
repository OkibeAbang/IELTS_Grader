import { requestJson } from './http';

export async function getBillingStatus() {
  return requestJson('/api/billing/status');
}

export async function createCheckoutSession(plan) {
  return requestJson('/api/billing/checkout-session', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
}

export async function createPortalSession() {
  return requestJson('/api/billing/portal-session', { method: 'POST' });
}
