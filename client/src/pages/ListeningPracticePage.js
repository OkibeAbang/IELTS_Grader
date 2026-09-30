import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import usePersistedState, { clearPersistedState } from '../hooks/usePersistedState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import ContinuousListeningTest from '../components/listening/ContinuousListeningTest';
import SingleSectionPractice from '../components/listening/SingleSectionPractice';
import ListeningFullTestResultsView from '../components/ListeningFullTestResultsView';

export default function ListeningPracticePage() {
  useDocumentTitle('Listening Practice');
  const [mode, setMode] = usePersistedState('listening-practice:mode', null);
  const [result, setResult] = usePersistedState('listening-practice:result', null);

  function handleChangeMode() {
    clearPersistedState('listening-practice:mode');
    setMode(null);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Listening Practice</h1>
        <p className="app-subtitle">
          Listen to a short recording and answer Multiple Choice and Short Answer questions, just
          like the real IELTS Listening test.
        </p>
      </header>

      <div className="page-back-row">
        <Link to="/practice" className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Practice
        </Link>
        {mode && !result && (
          <button type="button" className="btn-secondary" onClick={handleChangeMode}>
            Change practice mode
          </button>
        )}
      </div>

      {!mode && !result && (
        <div className="topic-picker">
          <h2>How would you like to practice?</h2>
          <div className="topic-grid">
            <button type="button" className="topic-card" onClick={() => setMode('full-test')}>
              <span className="topic-card-title">Full Listening Test</span>
              <p className="hub-card-description">
                All available parts in one continuous sitting, just like the real test.
              </p>
            </button>
            <button type="button" className="topic-card" onClick={() => setMode('single')}>
              <span className="topic-card-title">Choose a Single Part</span>
              <p className="hub-card-description">
                Pick one part to focus on, without committing to the whole test.
              </p>
            </button>
          </div>
        </div>
      )}

      {mode === 'full-test' && !result && (
        <ContinuousListeningTest persistPrefix="listening-practice" onComplete={setResult} />
      )}

      {mode === 'single' && <SingleSectionPractice />}

      {result && <ListeningFullTestResultsView result={result} />}
    </div>
  );
}
