import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EssayForm from '../components/EssayForm';
import ResultsView from '../components/ResultsView';
import { gradeEssay } from '../api/writing';

export default function EssayGraderPage() {
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit({ essay, prompt, taskType }) {
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

  return (
    <div>
      <header className="app-header">
        <h1>IELTS AI Essay Grader</h1>
        <p className="app-subtitle">
          Paste your Task 1 or Task 2 essay and get a 4-criterion band score with
          actionable feedback.
        </p>
      </header>

      <Link to="/practice" className="btn-secondary">
        <ArrowLeft size={16} aria-hidden="true" /> Back to Practice
      </Link>
      <p className="app-subtitle">
        Want to practice one paragraph at a time instead? Try the <Link to="/practice/drills/writing">Writing Drill</Link>.
      </p>

      <main className="app-main">
        <EssayForm onSubmit={handleSubmit} submitting={submitting} />

        {error && <div className="error-banner">{error}</div>}

        {result && <ResultsView result={result} />}
      </main>
    </div>
  );
}
