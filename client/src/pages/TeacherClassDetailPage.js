import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchClassDetail, removeStudentFromClass } from '../api/teacher';

export default function TeacherClassDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  function load() {
    fetchClassDetail(id).then(setData).catch((err) => setError(err.message));
  }

  useEffect(() => {
    setData(null);
    setError(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleRemove(student) {
    if (!window.confirm(`Remove ${student.email} from this class?`)) return;
    setRemovingId(student.id);
    try {
      await removeStudentFromClass(id, student.id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="admin-standalone">
      <header className="app-header">
        <h1>{data ? data.class.name : 'Class'}</h1>
        {data && <p className="app-subtitle">Join code: {data.class.joinCode}</p>}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {data && (
        <div className="dashboard-section">
          <h2>Students</h2>
          {data.students.length === 0 ? (
            <div className="dashboard-empty">No students yet — share the join code above.</div>
          ) : (
            <table className="attempt-history-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Attempts</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.displayName || '—'}</td>
                    <td>{s.email}</td>
                    <td>{s.attemptCount}</td>
                    <td className="attempt-history-actions">
                      <Link className="btn-secondary" to={`/teacher/students/${s.id}`}>View progress</Link>
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={removingId === s.id}
                        onClick={() => handleRemove(s)}
                      >
                        {removingId === s.id ? 'Removing…' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Link to="/teacher" className="btn-secondary">
        Back to my classes
      </Link>
    </div>
  );
}
