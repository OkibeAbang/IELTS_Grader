import { useState } from 'react';
import { Link } from 'react-router-dom';
import PracticeForm from '../components/PracticeForm';
import SectionResultsView from '../components/SectionResultsView';
import { gradeSection } from '../api/writing';

export default function LearnWritingPage() {
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit({ text, prompt, taskType, section }) {
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
    <div>
      <header className="app-header">
        <h1>Learn: Writing</h1>
        <p className="app-subtitle">
          Practice one paragraph at a time — pick a section and get instant, focused feedback
          before you write a full essay.
        </p>
      </header>

      <Link to="/learn" className="btn-secondary">
        ← Back to Learn
      </Link>

      <main className="app-main">
        <PracticeForm onSubmit={handleSubmit} submitting={submitting} />

        {error && <div className="error-banner">{error}</div>}

        {result && <SectionResultsView result={result} />}
      </main>
    </div>
  );
}
