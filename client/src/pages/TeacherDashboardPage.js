import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { teacherLogout, fetchClasses, createClass } from '../api/teacher';

export default function TeacherDashboardPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [newCode, setNewCode] = useState(null);

  function loadClasses() {
    fetchClasses().then(setClasses).catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadClasses();
  }, []);

  async function handleLogout() {
    await teacherLogout();
    navigate('/teacher/login', { replace: true });
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const created = await createClass({ name: name.trim() });
      setName('');
      setNewCode(created.joinCode);
      loadClasses();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="admin-standalone">
      <header className="admin-header">
        <h1>My classes</h1>
        <div className="admin-header-actions">
          <ThemeToggle />
          <button type="button" className="top-nav-logout" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-section">
        <h2>Create a class</h2>
        <form className="auth-form" onSubmit={handleCreate}>
          <label>
            Class name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tuesday Evening Cohort"
              required
            />
          </label>
          <button type="submit" className="submit-btn" disabled={creating}>
            {creating ? 'Creating…' : 'Create class'}
          </button>
        </form>
        {newCode && (
          <div className="hub-card-badge" style={{ marginTop: '0.75rem' }}>
            Join code for your new class: <strong>{newCode}</strong> — share this with your students.
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Your classes</h2>
        {!classes ? (
          <p className="auth-loading">Loading…</p>
        ) : classes.length === 0 ? (
          <div className="dashboard-empty">No classes yet — create one above.</div>
        ) : (
          <table className="attempt-history-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Join code</th>
                <th>Students</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.joinCode}</td>
                  <td>{c.studentCount}</td>
                  <td className="attempt-history-actions">
                    <Link className="btn-secondary" to={`/teacher/classes/${c.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
