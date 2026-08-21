import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Pencil, CreditCard, Timer } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const isPro = user.subscriptionTier === 'pro';
  const displayName = user.displayName || user.email.split('@')[0];
  const initial = displayName[0].toUpperCase();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  function startEditing() {
    setNameInput(user.displayName || '');
    setSaveError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setSaveError(null);
  }

  async function handleSaveName() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateProfile({ displayName: nameInput });
      setEditing(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <header className="app-header">
        <h1>Profile Settings</h1>
        <p className="app-subtitle">Manage your account information and preferences.</p>
      </header>

      <div className="profile-grid">
        <div className="profile-card">
          <span className="profile-avatar" aria-hidden="true">{initial}</span>
          <span className="profile-card-name">{displayName}</span>
          <span className="profile-card-email">{user.email}</span>
          <span className={isPro ? 'tier-badge tier-badge-pro' : 'tier-badge'}>
            {isPro ? 'PRO PLAN' : 'FREE PLAN'}
          </span>
          <button type="button" className="btn-secondary" onClick={handleLogout}>
            <LogOut size={16} aria-hidden="true" /> Sign Out
          </button>
        </div>

        <div className="profile-main">
          <section className="profile-section">
            <div className="profile-section-header">
              <h2>Personal Information</h2>
              {!editing && (
                <button type="button" className="btn-secondary" onClick={startEditing}>
                  <Pencil size={14} aria-hidden="true" /> Edit
                </button>
              )}
            </div>

            {saveError && <div className="error-banner">{saveError}</div>}

            <div className="profile-info-row">
              <span className="profile-info-label">Email Address</span>
              <span className="profile-info-value">{user.email}</span>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Display Name</span>
              {editing ? (
                <input
                  type="text"
                  className="profile-edit-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={100}
                  autoFocus
                />
              ) : (
                <span className="profile-info-value">{displayName}</span>
              )}
            </div>

            {editing && (
              <div className="profile-edit-actions">
                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSaveName}
                  disabled={saving || !nameInput.trim()}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button type="button" className="btn-secondary" onClick={cancelEditing} disabled={saving}>
                  Cancel
                </button>
              </div>
            )}
          </section>

          <section className="profile-section">
            <h2>Subscription Details</h2>
            <div className="billing-card">
              <span className="pricing-card-title">{isPro ? 'Pro' : 'Free'} plan</span>
              {isPro && user.subscriptionCurrentPeriodEnd && (
                <p className="hub-card-description">
                  Renews {new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString()}
                </p>
              )}
              {!isPro && <p className="hub-card-description">Limited access to detailed feedback and the study plan.</p>}
              <Link to="/billing" className="submit-btn">Manage Billing</Link>
            </div>
          </section>

          <section className="profile-section">
            <h2>Quick Actions</h2>
            <div className="profile-quick-actions">
              <Link to="/billing" className="btn-secondary">
                <CreditCard size={16} aria-hidden="true" /> Manage Subscription
              </Link>
              <Link to="/full-test" className="btn-secondary">
                <Timer size={16} aria-hidden="true" /> Start Full Test
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
