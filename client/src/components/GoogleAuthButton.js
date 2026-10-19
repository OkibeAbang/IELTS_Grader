import { useEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

// Google's official "G" logomark — kept in its real brand colors on
// purpose, same as how a colored Apple/Facebook button still shows their
// real white logo rather than a recolored one.
function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
      />
    </svg>
  );
}

/**
 * A green, brand-consistent "Sign in with Google" button. Google's own GSI
 * widget only offers blue/black/outline themes and renders inside a secure
 * iframe (its internal colors can't be CSS-recolored without distorting the
 * real logo), so this layers our own green pill UNDER the real widget, which
 * sits on top at opacity 0 and actually receives the click — the real,
 * unmodified GoogleLogin component still drives the whole flow (same
 * ID-token credential it always returned via onSuccess), only its paint is
 * hidden. The decorative layer is aria-hidden so screen readers only see
 * the real, properly-labelled Google button underneath.
 */
export default function GoogleAuthButton({ onSuccess, onError, label = 'Sign in with Google' }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w) setWidth(Math.round(w));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="google-login-row" ref={containerRef}>
      <div className="google-auth-styled" aria-hidden="true">
        <GoogleGlyph />
        <span>{label}</span>
      </div>
      {width && (
        <div className="google-auth-real">
          <GoogleLogin onSuccess={onSuccess} onError={onError} theme="outline" shape="pill" size="large" width={width} />
        </div>
      )}
    </div>
  );
}
