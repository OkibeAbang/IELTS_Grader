import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatTile from '../components/StatTile';
import ThemeToggle from '../components/ThemeToggle';
import { adminLogout, fetchAdminStats, fetchAdminUsers, fetchAdminAttempts, deleteAdminUser } from '../api/admin';

const TABS = ['Overview', 'Users', 'Attempts'];

function formatDate(value) {
  return new Date(value.replace(' ', 'T') + 'Z').toLocaleString();
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState(null);
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadStats = useCallback(() => {
    fetchAdminStats().then(setStats).catch((err) => setError(err.message));
  }, []);
  const loadUsers = useCallback(() => {
    fetchAdminUsers().then(setUsers).catch((err) => setError(err.message));
  }, []);
  const loadAttempts = useCallback(() => {
    fetchAdminAttempts().then((data) => setAttempts(data.attempts)).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setError(null);
    if (tab === 'Overview' && !stats) loadStats();
    if (tab === 'Users' && !users) loadUsers();
    if (tab === 'Attempts' && !attempts) loadAttempts();
  }, [tab, stats, users, attempts, loadStats, loadUsers, loadAttempts]);

  async function handleLogout() {
    await adminLogout();
    navigate('/admin/login', { replace: true });
  }

  async function handleDeleteUser(user) {
    if (!window.confirm(`Delete ${user.email} and all of their speaking attempts? This can't be undone.`)) {
      return;
    }
    setDeletingId(user.id);
    try {
      await deleteAdminUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-standalone">
      <header className="admin-header">
        <h1>Admin</h1>
        <div className="admin-header-actions">
          <ThemeToggle />
          <button type="button" className="top-nav-logout" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <div className="mode-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={t === tab ? 'mode-tab active' : 'mode-tab'}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {tab === 'Overview' && stats && (
        <>
          <div className="dashboard-stats">
            <StatTile label="Total Users" value={stats.totalUsers} />
            <StatTile label="Total Attempts" value={stats.totalAttempts} />
            <StatTile label="New Users (7d)" value={stats.newUsersLast7Days} />
            <StatTile label="Attempts (7d)" value={stats.attemptsLast7Days} />
            <StatTile label="Avg Overall Band" value={stats.averageOverallBand ?? '—'} />
          </div>

          <div className="dashboard-section">
            <h2>Recent signups</h2>
            {stats.recentUsers.length === 0 ? (
              <div className="dashboard-empty">No users yet.</div>
            ) : (
              <table className="attempt-history-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Verified</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.emailVerified ? 'Yes' : 'No'}</td>
                      <td>{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="dashboard-section">
            <h2>Recent attempts</h2>
            {stats.recentAttempts.length === 0 ? (
              <div className="dashboard-empty">No attempts yet.</div>
            ) : (
              <table className="attempt-history-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Topic</th>
                    <th>Band</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAttempts.map((a) => (
                    <tr key={a.id}>
                      <td>{a.userEmail}</td>
                      <td>{a.topicLabel}</td>
                      <td>{a.overallBand}</td>
                      <td>{formatDate(a.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {tab === 'Users' && users && (
        <div className="dashboard-section">
          {users.length === 0 ? (
            <div className="dashboard-empty">No users yet.</div>
          ) : (
            <table className="attempt-history-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Provider</th>
                  <th>Verified</th>
                  <th>Attempts</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.authProvider}</td>
                    <td>{u.emailVerified ? 'Yes' : 'No'}</td>
                    <td>{u.attemptCount}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td className="attempt-history-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={deletingId === u.id}
                        onClick={() => handleDeleteUser(u)}
                      >
                        {deletingId === u.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'Attempts' && attempts && (
        <div className="dashboard-section">
          {attempts.length === 0 ? (
            <div className="dashboard-empty">No attempts yet.</div>
          ) : (
            <table className="attempt-history-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Topic</th>
                  <th>Band</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.userEmail}</td>
                    <td>{a.topicLabel}</td>
                    <td>{a.overallBand}</td>
                    <td>{formatDate(a.createdAt)}</td>
                    <td className="attempt-history-actions">
                      <Link className="btn-secondary" to={`/admin/attempts/${a.id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
