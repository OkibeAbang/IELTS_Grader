import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await resetPassword({ token, password });
      navigate('/practice', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <h1>Reset your password</h1>
        <div className="error-banner">This reset link is missing its token.</div>
        <p className="auth-switch">
          <Link to="/forgot-password">Request a new link</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <h1>Choose a new password</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          New password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>

        {error && <div className="error-banner">{error}</div>}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </div>
  );
}
