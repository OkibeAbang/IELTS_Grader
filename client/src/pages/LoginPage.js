import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import useDelayedNotice from '../hooks/useDelayedNotice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PasswordInput from '../components/PasswordInput';
import { toolRedirectLabel } from '../config/toolRedirects';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const showColdStartHint = useDelayedNotice(submitting);

  const redirectTo = location.state?.from ?? '/practice';
  const toolLabel = toolRedirectLabel(redirectTo);
  const heading = toolLabel ? `Log in to ${toolLabel}` : 'Log in';
  useDocumentTitle(heading);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    setError(null);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <h1>{heading}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="error-banner">{error}</div>}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
        {showColdStartHint && (
          <p className="cold-start-hint">
            Still working on it — if the server's been idle for a while, this can take up to a
            minute.
          </p>
        )}
      </form>

      {process.env.REACT_APP_GOOGLE_CLIENT_ID && (
        <div className="auth-divider">
          <span>or</span>
        </div>
      )}
      {process.env.REACT_APP_GOOGLE_CLIENT_ID && (
        <div className="google-login-row">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in failed')} />
        </div>
      )}

      <p className="auth-switch">
        Don't have an account? <Link to="/signup" state={location.state}>Sign up</Link>
      </p>
      <p className="auth-switch">
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
    </div>
  );
}
