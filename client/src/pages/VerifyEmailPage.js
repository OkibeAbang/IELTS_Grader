import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [error, setError] = useState(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('This verification link is missing its token.');
      return;
    }
    // The token is single-use — StrictMode's dev-mode double-invoke of this
    // effect would otherwise submit it twice, and the second call always
    // fails since the first already consumed it.
    if (requestedRef.current) return;
    requestedRef.current = true;

    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setError(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="auth-page">
      <h1>Verify your email</h1>

      {status === 'verifying' && <p>Verifying…</p>}

      {status === 'success' && (
        <>
          <p>Your email is verified. You're all set to submit speaking attempts for grading.</p>
          <Link to="/speaking" className="submit-btn">
            Go to Speaking Practice
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="error-banner">{error}</div>
          <p className="auth-switch">
            Need a new link? Log in and use "Resend verification email" from the speaking practice page.
          </p>
          <Link to="/login" className="btn-secondary">
            Log in
          </Link>
        </>
      )}
    </div>
  );
}
