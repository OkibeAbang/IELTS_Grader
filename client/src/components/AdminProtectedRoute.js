import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminSession } from '../api/admin';
import LoadingScreen from './LoadingScreen';

export default function AdminProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    getAdminSession()
      .then((admin) => {
        if (!cancelled) setStatus(admin ? 'authorized' : 'unauthorized');
      })
      .catch(() => {
        if (!cancelled) setStatus('unauthorized');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return <LoadingScreen message="Loading…" />;
  }
  if (status === 'unauthorized') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
