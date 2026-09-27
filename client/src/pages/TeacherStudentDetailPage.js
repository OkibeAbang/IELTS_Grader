import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchStudentDetail } from '../api/teacher';

function formatDate(value) {
  return new Date(value.replace(' ', 'T') + 'Z').toLocaleString();
}

function AttemptTable({ title, rows, labelFor, reviewPath }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="dashboard-section">
        <h2>{title}</h2>
        <div className="dashboard-empty">No attempts yet.</div>
      </div>
    );
  }
  return (
    <div className="dashboard-section">
      <h2>{title}</h2>
      <table className="attempt-history-table">
        <thead>
          <tr>
            <th>Detail</th>
            <th>Band</th>
            <th>Date</th>
            {reviewPath && <th></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{labelFor(r)}</td>
              <td>{r.overallBand}</td>
              <td>{formatDate(r.createdAt)}</td>
              {reviewPath && (
                <td className="attempt-history-actions">
                  <Link className="btn-secondary" to={reviewPath(r)}>Review</Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TeacherStudentDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    fetchStudentDetail(id).then(setData).catch((err) => setError(err.message));
  }, [id]);

  return (
    <div className="admin-standalone">
      <header className="app-header">
        <h1>{data ? data.student.displayName || data.student.email : 'Student'}</h1>
        {data && <p className="app-subtitle">{data.student.email}</p>}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {data && (
        <>
          <AttemptTable
            title="Essays"
            rows={data.attempts.essay}
            labelFor={(r) => `${r.taskType === 'task1' ? 'Task 1' : 'Task 2'}${r.mode === 'section' ? ` — ${r.section}` : ''}`}
            reviewPath={(r) => `/teacher/essays/${r.id}`}
          />
          <AttemptTable
            title="Speaking (full)"
            rows={data.attempts.speaking}
            labelFor={(r) => r.topicLabel}
            reviewPath={(r) => `/teacher/speaking-attempts/${r.id}`}
          />
          <AttemptTable
            title="Speaking (drill)"
            rows={data.attempts.speakingDrill}
            labelFor={(r) => `${r.topicLabel} — ${r.part}`}
            reviewPath={(r) => `/teacher/speaking-drill-attempts/${r.id}`}
          />
          <AttemptTable
            title="Reading"
            rows={data.attempts.reading}
            labelFor={(r) => r.passageTitle}
          />
          <AttemptTable
            title="Listening"
            rows={data.attempts.listening}
            labelFor={(r) => r.sectionTitle}
          />
        </>
      )}

      <Link to="/teacher" className="btn-secondary">
        Back to my classes
      </Link>
    </div>
  );
}
