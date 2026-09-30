import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import usePersistedState, { clearPersistedState } from '../hooks/usePersistedState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import ContinuousReadingTest from '../components/reading/ContinuousReadingTest';
import SinglePassagePractice from '../components/reading/SinglePassagePractice';
import ReadingFullTestResultsView from '../components/ReadingFullTestResultsView';

export default function ReadingPracticePage() {
  useDocumentTitle('Reading Practice');
  const [mode, setMode] = usePersistedState('reading-practice:mode', null);
  const [result, setResult] = usePersistedState('reading-practice:result', null);

  function handleChangeMode() {
    clearPersistedState('reading-practice:mode');
    setMode(null);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Reading Practice</h1>
        <p className="app-subtitle">
          Read a passage and answer Multiple Choice, True/False/Not Given, Yes/No/Not Given, and
          Short Answer questions, just like the real IELTS Reading test.
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
              <span className="topic-card-title">Full Reading Test</span>
              <p className="hub-card-description">
                All passages in one continuous 60-minute sitting, just like the real test.
              </p>
            </button>
            <button type="button" className="topic-card" onClick={() => setMode('single')}>
              <span className="topic-card-title">Choose a Single Passage</span>
              <p className="hub-card-description">
                Pick one passage to focus on, with its own optional, pausable timer.
              </p>
            </button>
          </div>
        </div>
      )}

      {mode === 'full-test' && !result && (
        <ContinuousReadingTest persistPrefix="reading-practice" onComplete={setResult} />
      )}

      {mode === 'single' && <SinglePassagePractice />}

      {result && <ReadingFullTestResultsView result={result} />}
    </div>
  );
}
