import { useState } from 'react';
import EssayForm from './components/EssayForm';
import ResultsView from './components/ResultsView';
import PracticeForm from './components/PracticeForm';
import SectionResultsView from './components/SectionResultsView';
import { gradeEssay, gradeSection } from './api';
import './App.css';

export default function App() {
  const [mode, setMode] = useState('full');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function switchMode(nextMode) {
    setMode(nextMode);
    setResult(null);
    setError(null);
  }

  async function handleFullSubmit({ essay, prompt, taskType }) {
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const data = await gradeEssay({ essay, prompt, taskType });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSectionSubmit({ text, prompt, taskType, section }) {
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const data = await gradeSection({ text, prompt, taskType, section });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>IELTS AI Essay Grader</h1>
        <p className="app-subtitle">
          Paste your Task 1 or Task 2 essay and get a 4-criterion band score with
          actionable feedback.
        </p>
      </header>

      <nav className="mode-tabs">
        <button
          type="button"
          className={mode === 'full' ? 'mode-tab active' : 'mode-tab'}
          onClick={() => switchMode('full')}
        >
          Full Essay
        </button>
        <button
          type="button"
          className={mode === 'practice' ? 'mode-tab active' : 'mode-tab'}
          onClick={() => switchMode('practice')}
        >
          Practice by Section
        </button>
      </nav>

      <main className="app-main">
        {mode === 'full' ? (
          <EssayForm onSubmit={handleFullSubmit} submitting={submitting} />
        ) : (
          <PracticeForm onSubmit={handleSectionSubmit} submitting={submitting} />
        )}

        {error && <div className="error-banner">{error}</div>}

        {result && mode === 'full' && <ResultsView result={result} />}
        {result && mode === 'practice' && <SectionResultsView result={result} />}
      </main>
    </div>
  );
}
