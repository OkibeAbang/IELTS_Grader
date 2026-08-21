import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createCheckoutSession, createPortalSession } from '../api/billing';

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const checkoutResult = searchParams.get('checkout');

  useEffect(() => {
    if (checkoutResult === 'success') {
      refreshUser();
    }
  }, [checkoutResult, refreshUser]);

  const isPro = user?.subscriptionTier === 'pro';

  async function handleUpgrade() {
    setError('');
    setLoading(true);
    try {
      const { url } = await createCheckoutSession('monthly');
      window.location.href = url;
    } catch (err) {
      setError(err.message || 'Could not start checkout. Please try again.');
      setLoading(false);
    }
  }

  async function handleManage() {
    setError('');
    setLoading(true);
    try {
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (err) {
      setError(err.message || 'Could not open the billing portal. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="app-header">
        <h1>Billing</h1>
        <p className="app-subtitle">Manage your subscription.</p>
      </header>

      {checkoutResult === 'success' && (
        <p className="success-banner">You're on Pro! Thanks for upgrading — your new access is active now.</p>
      )}
      {checkoutResult === 'cancelled' && (
        <p className="error-banner">Checkout was cancelled — you're still on the Free plan.</p>
      )}
      {error && <p className="error-banner">{error}</p>}

      <div className="billing-card">
        <span className="pricing-card-title">{isPro ? 'Pro' : 'Free'} plan</span>
        {isPro && user.subscriptionCurrentPeriodEnd && (
          <p className="hub-card-description">
            Renews {new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString()}
          </p>
        )}
        {isPro ? (
          <button type="button" className="submit-btn" onClick={handleManage} disabled={loading}>
            {loading ? 'Opening…' : 'Manage subscription'}
          </button>
        ) : (
          <button type="button" className="submit-btn" onClick={handleUpgrade} disabled={loading}>
            {loading ? 'Redirecting…' : 'Upgrade to Pro'}
          </button>
        )}
        <Link to="/pricing" className="btn-secondary">Compare plans</Link>
      </div>
    </div>
  );
}
