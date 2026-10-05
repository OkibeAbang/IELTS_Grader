import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import usePersistedState, { clearPersistedState } from '../hooks/usePersistedState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import ContinuousReadingTest from '../components/reading/ContinuousReadingTest';
import SinglePassagePractice from '../components/reading/SinglePassagePractice';
import ReadingFullTestResultsView from '../components/ReadingFullTestResultsView';

// Everything this page and ContinuousReadingTest persist. Starting a new
// test has to clear all of it, not just the result: leaving the in-progress
// keys behind would drop you back into the finished test's last passage
// with its old answers already filled in, and leaving the timer behind
// would resume the previous sitting's clock instead of a fresh 60 minutes.
const TEST_KEYS = [
  'reading-practice:mode',
  'reading-practice:result',
  'reading-practice:currentIndex',
  'reading-practice:answersByPassageId',
  'reading-practice:assignedPassageIds',
  'reading-practice:timer',
];

export default function ReadingPracticePage() {
  useDocumentTitle('Reading Practice');
  const [mode, setMode] = usePersistedState('reading-practice:mode', null);
  const [result, setResult] = usePersistedState('reading-practice:result', null);

  // Safe to clear the timer key directly here: ContinuousReadingTest is
  // unmounted whenever this runs (the results view is what's showing), so
  // no mounted countdown hook is holding in-memory state that would go
  // stale. See FullTestPage's handleStart for the same reasoning.
  function handleStartNewTest() {
    TEST_KEYS.forEach(clearPersistedState);
    setMode(null);
    setResult(null);
  }

  // Arriving at this page should always start at "choose a mode," never
  // resume a finished test's results from a previous visit — a completed
  // result sitting in storage from before this mount means the test is
  // over, not that there's anything to resume. Runs once on mount only
  // (empty deps), so it doesn't interfere with the in-session "Start a new
  // test" click right after finishing one, which sets state directly
  // without a remount.
  useEffect(() => {
    if (result) handleStartNewTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {mode && (
          <button type="button" className="btn-secondary" onClick={handleStartNewTest}>
            {result ? 'Start a new test' : 'Change practice mode'}
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

      {mode === 'single' && !result && <SinglePassagePractice />}

      {result && (
        <>
          <ReadingFullTestResultsView result={result} />
          <button type="button" className="submit-btn" onClick={handleStartNewTest}>
            Start a new test
          </button>
        </>
      )}
    </div>
  );
}
