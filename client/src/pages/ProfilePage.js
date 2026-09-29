import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Pencil, CreditCard, Timer, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PAYWALL_ENABLED } from '../config/paywall';
import { fetchMyClasses, joinClass } from '../api/classes';
import { changePassword } from '../api/auth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PasswordInput from '../components/PasswordInput';

export default function ProfilePage() {
  useDocumentTitle('Profile Settings');
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [classes, setClasses] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    fetchMyClasses().then(setClasses).catch(() => setClasses([]));
  }, []);

  async function handleJoinClass(e) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoining(true);
    setJoinError(null);
    try {
      await joinClass(joinCode.trim());
      setJoinCode('');
      setClasses(await fetchMyClasses());
    } catch (err) {
      setJoinError(err.message);
    } finally {
      setJoining(false);
    }
  }

  const isPro = !PAYWALL_ENABLED || user.subscriptionTier === 'pro';
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

  function startChangingPassword() {
    setCurrentPassword('');
    setNewPassword('');
    setPasswordError(null);
    setPasswordSuccess(false);
    setChangingPassword(true);
  }

  function cancelChangingPassword() {
    setChangingPassword(false);
    setPasswordError(null);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError(null);
    try {
      await changePassword({ currentPassword, newPassword });
      setChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordSaving(false);
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
          {PAYWALL_ENABLED && (
            <span className={isPro ? 'tier-badge tier-badge-pro' : 'tier-badge'}>
              {isPro ? 'PRO PLAN' : 'FREE PLAN'}
            </span>
          )}
          <button type="button" className="btn-danger" onClick={handleLogout}>
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
            <div className="profile-section-header">
              <h2>Password</h2>
              {!changingPassword && (
                <button type="button" className="btn-secondary" onClick={startChangingPassword}>
                  <Pencil size={14} aria-hidden="true" /> Change
                </button>
              )}
            </div>

            {passwordError && <div className="error-banner">{passwordError}</div>}
            {passwordSuccess && !changingPassword && (
              <div className="success-banner">Your password was updated.</div>
            )}

            {changingPassword ? (
              <form className="auth-form" onSubmit={handleChangePassword}>
                <label>
                  Current password
                  <PasswordInput
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </label>
                <label>
                  New password
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <span className="auth-field-hint">At least 8 characters</span>
                </label>
                <div className="profile-edit-actions">
                  <button type="submit" className="submit-btn" disabled={passwordSaving}>
                    {passwordSaving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={cancelChangingPassword}
                    disabled={passwordSaving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info-row">
                <span className="profile-info-label">Password</span>
                <span className="profile-info-value">••••••••</span>
              </div>
            )}
          </section>

          <section className="profile-section">
            <h2>Class</h2>
            {classes === null ? (
              <p className="auth-loading">Loading…</p>
            ) : classes.length > 0 ? (
              <div>
                {classes.map((c) => (
                  <p key={c.id} className="hub-card-description">
                    {c.name} — {c.teacherName}
                  </p>
                ))}
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleJoinClass}>
                <label>
                  Join code
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter the code your teacher gave you"
                  />
                </label>
                {joinError && <div className="error-banner">{joinError}</div>}
                <button type="submit" className="submit-btn" disabled={joining}>
                  {joining ? 'Joining…' : 'Join class'}
                </button>
              </form>
            )}
          </section>

          {PAYWALL_ENABLED && (
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
          )}

          <section className="profile-section">
            <h2>Quick Actions</h2>
            <div className="profile-quick-actions">
              {PAYWALL_ENABLED && (
                <Link to="/billing" className="btn-secondary">
                  <CreditCard size={16} aria-hidden="true" /> Manage Subscription
                </Link>
              )}
              <Link to="/full-test" className="btn-secondary">
                <Timer size={16} aria-hidden="true" /> Start Full Test
              </Link>
              <Link to="/speaking/history" className="btn-secondary">
                <LayoutDashboard size={16} aria-hidden="true" /> View Dashboard
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
