import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { createCheckoutSession } from '../api/billing';

const FREE_FEATURES = [
  { text: 'Unlimited practice attempts across Writing, Reading, Listening, and Speaking' },
  { text: 'Overall band score on every graded attempt' },
  { text: 'Full attempt history and progress dashboard' },
];

const PRO_FEATURES = [
  { text: 'Everything in Free' },
  { text: 'Detailed criteria breakdown, corrections, and improvement suggestions on every result' },
  { text: 'Full-length timed placement test', soon: true },
  { text: 'Personalized study plan', soon: true },
];

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPro = user?.subscriptionTier === 'pro';

  async function handleUpgrade() {
    if (!user) {
      navigate('/signup');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { url } = await createCheckoutSession(billingCycle);
      window.location.href = url;
    } catch (err) {
      setError(err.message || 'Could not start checkout. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="app-header">
        <h1>Pricing</h1>
        <p className="app-subtitle">Start free. Upgrade for the full detail behind every band score.</p>
      </header>

      <div className="pricing-toggle" role="group" aria-label="Billing cycle">
        <button
          type="button"
          className={billingCycle === 'monthly' ? 'pricing-toggle-btn active' : 'pricing-toggle-btn'}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          type="button"
          className={billingCycle === 'annual' ? 'pricing-toggle-btn active' : 'pricing-toggle-btn'}
          onClick={() => setBillingCycle('annual')}
        >
          Annual <span className="pricing-toggle-save">Save ~35%</span>
        </button>
      </div>

      {error && <p className="error-banner">{error}</p>}

      <div className="pricing-grid">
        <div className="pricing-card">
          <span className="pricing-card-title">Free</span>
          <div className="pricing-price">
            <span className="pricing-price-amount">$0</span>
          </div>
          <ul className="pricing-feature-list">
            {FREE_FEATURES.map((f) => (
              <li key={f.text}>
                <Check size={16} aria-hidden="true" />
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
          {!isPro && <span className="pricing-card-current">Your current plan</span>}
        </div>

        <div className="pricing-card pricing-card-featured">
          <span className="hub-card-badge">Most popular</span>
          <span className="pricing-card-title">Pro</span>
          <div className="pricing-price">
            <span className="pricing-price-amount">{billingCycle === 'monthly' ? '$9.99' : '$79'}</span>
            <span className="pricing-price-period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
          </div>
          <ul className="pricing-feature-list">
            {PRO_FEATURES.map((f) => (
              <li key={f.text}>
                <Check size={16} aria-hidden="true" />
                <span className="pricing-feature-body">
                  <span>{f.text}</span>
                  {f.soon && <span className="pricing-feature-soon">Coming soon</span>}
                </span>
              </li>
            ))}
          </ul>
          {isPro ? (
            <Link to="/billing" className="submit-btn">Manage subscription</Link>
          ) : (
            <button type="button" className="submit-btn" onClick={handleUpgrade} disabled={loading}>
              {loading ? 'Redirecting…' : user ? 'Upgrade to Pro' : 'Sign up to upgrade'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
