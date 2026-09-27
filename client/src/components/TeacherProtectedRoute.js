import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getTeacherSession } from '../api/teacher';
import LoadingScreen from './LoadingScreen';

export default function TeacherProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    getTeacherSession()
      .then((teacher) => {
        if (!cancelled) setStatus(teacher ? 'authorized' : 'unauthorized');
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
    return <Navigate to="/teacher/login" replace />;
  }
  return children;
}
