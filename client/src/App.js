import { BrowserRouter, Routes, Route, Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import OverviewPage from './pages/OverviewPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAttemptDetailPage from './pages/AdminAttemptDetailPage';
import EssayGraderPage from './pages/EssayGraderPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SpeakingPracticePage from './pages/SpeakingPracticePage';
import AttemptHistoryPage from './pages/AttemptHistoryPage';
import AttemptDetailPage from './pages/AttemptDetailPage';
import './App.css';

function sidebarLinkClass({ isActive }) {
  return isActive ? 'sidebar-link active' : 'sidebar-link';
}

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <aside className="sidebar">
      <Link to="/essay-grader" className="sidebar-brand">IELTS Grader</Link>
      <nav className="sidebar-nav">
        <NavLink to="/essay-grader" end className={sidebarLinkClass}>Essay Grading</NavLink>
        <NavLink to="/speaking" end className={sidebarLinkClass}>Speaking Practice</NavLink>
        {user && <NavLink to="/speaking/history" className={sidebarLinkClass}>Dashboard</NavLink>}
      </nav>
      <span className="sidebar-spacer" />
      <div className="sidebar-account">
        {user ? (
          <>
            <span className="sidebar-account-email">{user.email}</span>
            <button type="button" className="top-nav-logout" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/login" className={sidebarLinkClass}>Log in</NavLink>
        )}
      </div>
    </aside>
  );
}

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="main-content-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OverviewPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/attempts/:id"
        element={
          <AdminProtectedRoute>
            <AdminAttemptDetailPage />
          </AdminProtectedRoute>
        }
      />
      <Route element={<AppLayout />}>
        <Route path="/essay-grader" element={<EssayGraderPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/speaking"
          element={
            <ProtectedRoute>
              <SpeakingPracticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/speaking/history"
          element={
            <ProtectedRoute>
              <AttemptHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/speaking/history/:id"
          element={
            <ProtectedRoute>
              <AttemptDetailPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const content = (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );

  return googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>
  ) : (
    content
  );
}
