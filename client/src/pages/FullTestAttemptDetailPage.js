import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFullTestDetail } from '../api/fullTest';
import { fetchListeningAttemptDetail } from '../api/listening';
import { fetchReadingAttemptDetail } from '../api/reading';
import { fetchEssayAttemptDetail } from '../api/writing';
import { fetchAttemptDetail } from '../api/speaking';
import FullTestResultsView from '../components/FullTestResultsView';

export default function FullTestAttemptDetailPage() {
  const { id } = useParams();
  const [resultsData, setResultsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setResultsData(null);
    setError(null);
    fetchFullTestDetail(id)
      .then(async (finalized) => {
        const [listeningDetail, readingDetail, task1Detail, task2Detail, speakingDetail] = await Promise.all([
          fetchListeningAttemptDetail(finalized.listeningAttemptId),
          fetchReadingAttemptDetail(finalized.readingAttemptId),
          fetchEssayAttemptDetail(finalized.writingTask1AttemptId),
          fetchEssayAttemptDetail(finalized.writingTask2AttemptId),
          fetchAttemptDetail(finalized.speakingAttemptId),
        ]);
        setResultsData({ finalized, listeningDetail, readingDetail, task1Detail, task2Detail, speakingDetail });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <header className="app-header">
        <h1>Full Test Result</h1>
        {resultsData && (
          <p className="app-subtitle">
            {new Date(resultsData.finalized.completedAt.replace(' ', 'T') + 'Z').toLocaleString()}
          </p>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {resultsData && <FullTestResultsView {...resultsData} />}

      <Link to="/speaking/history" className="btn-secondary">
        Back to dashboard
      </Link>
    </div>
  );
}
