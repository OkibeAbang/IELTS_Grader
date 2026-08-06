import { Link } from 'react-router-dom';

const CHECKLIST = [
  'Full essay grading for Writing Task 1 & 2, or practice one section at a time',
  'Record real IELTS Speaking Parts 1–3 and get a rubric-based band score',
  'Criterion-by-criterion feedback: Task Response, Coherence, Lexical Resource, Grammar, Fluency, Pronunciation',
  'Track every essay and speaking score over time on a personal dashboard',
];

const TOOLS = [
  {
    title: 'Essay Grading',
    body: 'Paste a Task 1 or Task 2 response and get a band score with detailed, criterion-by-criterion feedback in seconds. Every attempt is saved to your dashboard so you can track your progress.',
    cta: 'Grade my essay',
    to: '/essay-grader',
  },
  {
    title: 'Speaking Practice',
    body: 'Pick a real past IELTS speaking topic, record your answer for all three parts, and get graded against the official speaking rubric. Free account required for both tools.',
    cta: 'Start speaking practice',
    to: '/speaking',
  },
];

export default function OverviewPage() {
  return (
    <div className="marketing-page">
      <header className="marketing-nav">
        <div className="marketing-nav-inner">
          <Link to="/" className="marketing-brand">IELTS Grader</Link>
          <nav className="marketing-nav-links">
            <Link to="/essay-grader">Essay Grading</Link>
            <Link to="/speaking">Speaking Practice</Link>
          </nav>
          <div className="marketing-nav-actions">
            <Link to="/login" className="marketing-nav-login">Log in</Link>
            <Link to="/essay-grader" className="submit-btn">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="marketing-hero">
          <div className="marketing-hero-copy">
            <span className="marketing-eyebrow">AI-powered IELTS prep</span>
            <h1>Know your band score before test day.</h1>
            <p className="marketing-hero-subtitle">
              Get instant, rubric-accurate feedback on IELTS Writing and Speaking — graded
              against the same criteria examiners use, so you know exactly what to fix.
            </p>
            <ul className="marketing-checklist">
              {CHECKLIST.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="marketing-hero-actions">
              <Link to="/essay-grader" className="submit-btn">Start grading your essay</Link>
              <Link to="/speaking" className="btn-secondary">Try speaking practice</Link>
            </div>
          </div>

          <div className="marketing-hero-visual" aria-hidden="true">
            <div className="hero-mock-card">
              <div className="hero-mock-band">
                <span className="hero-mock-band-label">Overall Band</span>
                <span className="hero-mock-band-score">7.5</span>
              </div>
              <div className="hero-mock-criteria">
                <div className="hero-mock-criterion">
                  <span>Task Response</span>
                  <span className="hero-mock-badge">7</span>
                </div>
                <div className="hero-mock-criterion">
                  <span>Coherence &amp; Cohesion</span>
                  <span className="hero-mock-badge">8</span>
                </div>
                <div className="hero-mock-criterion">
                  <span>Lexical Resource</span>
                  <span className="hero-mock-badge">7</span>
                </div>
                <div className="hero-mock-criterion">
                  <span>Grammatical Range</span>
                  <span className="hero-mock-badge">8</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-tools">
          <h2 className="marketing-section-title">Two ways to practice</h2>
          <div className="marketing-tools-grid">
            {TOOLS.map((tool) => (
              <div className="marketing-tool-card" key={tool.title}>
                <h3>{tool.title}</h3>
                <p>{tool.body}</p>
                <Link to={tool.to} className="btn-secondary">{tool.cta}</Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="marketing-footer">
        <p>
          IELTS Grader is an independent practice tool. Scores are AI-generated estimates,
          not certified results — use them as a diagnostic signal, not a guaranteed exam outcome.
        </p>
      </footer>
    </div>
  );
}
