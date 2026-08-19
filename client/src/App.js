import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import OverviewPage from './pages/OverviewPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAttemptDetailPage from './pages/AdminAttemptDetailPage';
import PracticeHubPage from './pages/PracticeHubPage';
import LearnHubPage from './pages/LearnHubPage';
import LearnWritingPage from './pages/LearnWritingPage';
import LearnReadingPage from './pages/LearnReadingPage';
import LearnListeningPage from './pages/LearnListeningPage';
import LearnSpeakingPage from './pages/LearnSpeakingPage';
import SpeakingDrillAttemptDetailPage from './pages/SpeakingDrillAttemptDetailPage';
import EssayGraderPage from './pages/EssayGraderPage';
import EssayAttemptDetailPage from './pages/EssayAttemptDetailPage';
import ReadingPracticePage from './pages/ReadingPracticePage';
import ReadingAttemptDetailPage from './pages/ReadingAttemptDetailPage';
import ListeningPracticePage from './pages/ListeningPracticePage';
import ListeningAttemptDetailPage from './pages/ListeningAttemptDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SpeakingPracticePage from './pages/SpeakingPracticePage';
import AttemptHistoryPage from './pages/AttemptHistoryPage';
import AttemptDetailPage from './pages/AttemptDetailPage';
import './App.css';

const SIDEBAR_COLLAPSED_KEY = 'ielts-grader-sidebar-collapsed';

const NAV_ITEMS = [
  { to: '/practice', icon: '📚', label: 'Practice', end: true },
  { to: '/learn', icon: '🎓', label: 'Learn', end: false },
];

function sidebarLinkClass({ isActive }) {
  return isActive ? 'sidebar-link active' : 'sidebar-link';
}

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true');

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const brandTarget = user ? '/practice' : '/';

  return (
    <aside className={collapsed ? 'sidebar sidebar-collapsed' : 'sidebar'}>
      <div className="sidebar-top-row">
        <Link to={brandTarget} className="sidebar-brand">IELTS Grader</Link>
        <button
          type="button"
          className="theme-toggle sidebar-collapse-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={sidebarLinkClass}
            title={item.label}
            aria-label={item.label}
          >
            <span className="sidebar-item-icon" aria-hidden="true">{item.icon}</span>
            <span className="sidebar-item-label">{item.label}</span>
          </NavLink>
        ))}
        {user && (
          <NavLink to="/speaking/history" className={sidebarLinkClass} title="Dashboard" aria-label="Dashboard">
            <span className="sidebar-item-icon" aria-hidden="true">📊</span>
            <span className="sidebar-item-label">Dashboard</span>
          </NavLink>
        )}
      </nav>
      <span className="sidebar-spacer" />
      <div className="sidebar-account">
        <ThemeToggle className="sidebar-theme-toggle" />
        {user ? (
          <>
            <span className="sidebar-account-email">{user.email}</span>
            <button type="button" className="top-nav-logout" onClick={handleLogout} title="Log out" aria-label="Log out">
              <span className="sidebar-item-icon" aria-hidden="true">🚪</span>
              <span className="sidebar-item-label">Log out</span>
            </button>
          </>
        ) : (
          <NavLink to="/login" className={sidebarLinkClass} title="Log in" aria-label="Log in">
            <span className="sidebar-item-icon" aria-hidden="true">→</span>
            <span className="sidebar-item-label">Log in</span>
          </NavLink>
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
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <PracticeHubPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <LearnHubPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/writing"
          element={
            <ProtectedRoute>
              <LearnWritingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/reading"
          element={
            <ProtectedRoute>
              <LearnReadingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/listening"
          element={
            <ProtectedRoute>
              <LearnListeningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/speaking"
          element={
            <ProtectedRoute>
              <LearnSpeakingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/essay-grader"
          element={
            <ProtectedRoute>
              <EssayGraderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/essay-grader/history/:id"
          element={
            <ProtectedRoute>
              <EssayAttemptDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading"
          element={
            <ProtectedRoute>
              <ReadingPracticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading/history/:id"
          element={
            <ProtectedRoute>
              <ReadingAttemptDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listening"
          element={
            <ProtectedRoute>
              <ListeningPracticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listening/history/:id"
          element={
            <ProtectedRoute>
              <ListeningAttemptDetailPage />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/speaking/drill-history/:id"
          element={
            <ProtectedRoute>
              <SpeakingDrillAttemptDetailPage />
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

  const withTheme = <ThemeProvider>{content}</ThemeProvider>;

  return googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>{withTheme}</GoogleOAuthProvider>
  ) : (
    withTheme
  );
}
