import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useDelayedNotice from '../hooks/useDelayedNotice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PasswordInput from '../components/PasswordInput';
import GoogleAuthButton from '../components/GoogleAuthButton';
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

        <button type="submit" className="submit-btn auth-submit-btn" disabled={submitting}>
          <Mail size={18} aria-hidden="true" />
          {submitting ? 'Logging in…' : 'Sign in with Email'}
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
        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google sign-in failed')}
          label="Sign in with Google"
        />
      )}

      <p className="auth-switch">
        Don't have an account? <Link to="/signup" state={location.state}>Sign up</Link>
      </p>
      <p className="auth-switch">
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p className="auth-switch auth-switch-row">
        <span>
          Teacher? <Link to="/teacher/login">Log in here</Link>
        </span>
        <span className="auth-switch-sep" aria-hidden="true">&middot;</span>
        <span>
          Admin? <Link to="/admin/login">Log in here</Link>
        </span>
      </p>
    </div>
  );
}
