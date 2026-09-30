import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import usePersistedState, { clearPersistedState } from '../hooks/usePersistedState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import ListeningTestPicker from '../components/listening/ListeningTestPicker';
import ContinuousListeningTest from '../components/listening/ContinuousListeningTest';
import ListeningFullTestResultsView from '../components/ListeningFullTestResultsView';

// Everything this page and ContinuousListeningTest persist. The timer key
// belongs here too — without it, starting another test resumes the previous
// sitting's clock instead of a fresh 30 minutes. Safe to clear directly
// because ContinuousListeningTest unmounts as soon as the test is cleared,
// so no mounted countdown hook is left holding stale in-memory state.
const KEYS = [
  'listening-practice:test',
  'listening-practice:result',
  'listening-practice:currentIndex',
  'listening-practice:answersBySectionId',
  'listening-practice:timer',
];

export default function ListeningPracticePage() {
  useDocumentTitle('Listening Practice');
  const [test, setTest] = usePersistedState('listening-practice:test', null);
  const [result, setResult] = usePersistedState('listening-practice:result', null);

  function handleChooseAnotherTest() {
    KEYS.forEach(clearPersistedState);
    setTest(null);
    setResult(null);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Listening Practice</h1>
        <p className="app-subtitle">
          Listen and answer Multiple Choice and Short Answer questions, just like the real IELTS
          Listening test.
        </p>
      </header>

      <div className="page-back-row">
        <Link to="/practice" className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Practice
        </Link>
        {test && (
          <button type="button" className="btn-secondary" onClick={handleChooseAnotherTest}>
            {result ? 'Start a new test' : 'Choose a different test'}
          </button>
        )}
      </div>

      {!test && !result && <ListeningTestPicker onSelect={setTest} />}

      {test && !result && (
        <ContinuousListeningTest
          persistPrefix="listening-practice"
          test={test}
          onComplete={setResult}
        />
      )}

      {result && (
        <>
          <ListeningFullTestResultsView result={result} />
          <button type="button" className="submit-btn" onClick={handleChooseAnotherTest}>
            Start a new test
          </button>
        </>
      )}
    </div>
  );
}
