import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../hooks/useAuth';

const CHECKLIST = [
  'Full essay grading for Writing Task 1 & 2, or practice one section at a time',
  'Record real IELTS Speaking Parts 1–3 and get a rubric-based band score',
  'Reading and Listening practice with instant, objectively-scored feedback',
  'Track every attempt over time on a personal dashboard',
];

const TOOLS = [
  {
    title: 'Essay Grading',
    body: 'Paste a Task 1 or Task 2 response and get a band score with detailed, criterion-by-criterion feedback in seconds. Every attempt is saved to your dashboard so you can track your progress.',
    cta: 'Grade my essay',
    to: '/essay-grader',
  },
  {
    title: 'Reading Practice',
    body: 'Read a passage and answer Multiple Choice, True/False/Not Given, and Short Answer questions, just like the real IELTS Reading test — scored instantly.',
    cta: 'Try reading practice',
    to: '/reading',
  },
  {
    title: 'Listening Practice',
    body: 'Listen to a short recording and answer questions as you go, then get an instant, objectively-scored band estimate.',
    cta: 'Try listening practice',
    to: '/listening',
  },
  {
    title: 'Speaking Practice',
    body: 'Pick a real past IELTS speaking topic, record your answer for all three parts, and get graded against the official speaking rubric. Free account required for all four tools.',
    cta: 'Start speaking practice',
    to: '/speaking',
  },
];

const PREVIEW_TABS = [
  {
    key: 'writing',
    label: 'Writing',
    heading: 'See exactly where your essay loses marks',
    body: 'A full band breakdown across all 4 IELTS criteria, plus the specific improvements that would lift your score the most.',
  },
  {
    key: 'reading',
    label: 'Reading',
    heading: 'Practice with real passages, not flashcards',
    body: 'Multiple Choice, True/False/Not Given, and Short Answer — the same question types as the real test, scored the moment you submit.',
  },
  {
    key: 'listening',
    label: 'Listening',
    heading: 'Train your ear, then check your answers instantly',
    body: 'Listen to a short recording and fill in the blanks as you go, just like a real IELTS Listening section.',
  },
  {
    key: 'speaking',
    label: 'Speaking',
    heading: 'Get corrections you can actually use',
    body: 'Not just a band score — specific phrases you said, and a natural-sounding way to say them better next time.',
  },
];

function PreviewMockup({ tab }) {
  if (tab === 'writing') {
    return (
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
    );
  }

  if (tab === 'reading') {
    return (
      <div className="hero-mock-card">
        <p className="preview-mock-passage">
          &ldquo;For nearly 400 years, the Eurasian beaver was absent from the rivers and
          wetlands of Britain. Once found in almost every county, the species was hunted to
          extinction by the 16th century…&rdquo;
        </p>
        <div className="reading-question">
          <p className="reading-question-prompt">1. Why were beavers hunted to extinction in Britain?</p>
          <div className="reading-question-options">
            <div className="reading-question-option">A. Their dams caused flooding of farmland</div>
            <div className="reading-question-option preview-mock-correct">
              B. They were valued for their fur, meat and castoreum ✓
            </div>
            <div className="reading-question-option">C. They competed with livestock for grazing land</div>
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'listening') {
    return (
      <div className="hero-mock-card">
        <div className="listening-audio-player">
          <p className="listening-audio-player-progress">Line 6 of 15 — Playing…</p>
          <div className="recorder-controls">
            <button type="button" className="submit-btn" disabled>Replay</button>
            <button type="button" className="btn-secondary" disabled>Stop</button>
          </div>
        </div>
        <div className="reading-question">
          <p className="reading-question-prompt">2. What is the caller's phone number?</p>
          <div className="reading-short-answer">
            <input type="text" readOnly value="0114 496 2273" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-mock-card">
      <div className="hero-mock-band">
        <span className="hero-mock-band-label">Overall Band</span>
        <span className="hero-mock-band-score">6.5</span>
      </div>
      <div className="corrections">
        <h3>Try saying it this way</h3>
        <div className="correction-item">
          <div className="correction-original">
            <span className="correction-label">You said</span>
            <p>&ldquo;I think that is very good idea.&rdquo;</p>
          </div>
          <div className="correction-suggestion">
            <span className="correction-label">Try instead</span>
            <p>&ldquo;I think that's a really good idea.&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('writing');
  const activePreview = PREVIEW_TABS.find((t) => t.key === activeTab);

  return (
    <div className="marketing-page">
      <header className="marketing-nav">
        <div className="marketing-nav-inner">
          <Link to="/" className="marketing-brand">IELTS Grader</Link>
          <nav className="marketing-nav-links">
            <Link to="/essay-grader">Essay Grading</Link>
            <Link to="/reading">Reading</Link>
            <Link to="/listening">Listening</Link>
            <Link to="/speaking">Speaking</Link>
            <Link to="/pricing">Pricing</Link>
          </nav>
          <div className="marketing-nav-actions">
            <ThemeToggle />
            {user ? (
              <Link to="/practice" className="submit-btn">Go to Practice</Link>
            ) : (
              <>
                <Link to="/login" className="marketing-nav-login">Log in</Link>
                <Link to="/signup" className="submit-btn">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="marketing-hero">
          <div className="marketing-hero-copy">
            <span className="marketing-eyebrow">AI-powered IELTS prep</span>
            <h1>Know your band score before test day.</h1>
            <p className="marketing-hero-subtitle">
              Get instant, rubric-accurate feedback on IELTS Writing, Reading, Listening and
              Speaking — graded against the same criteria examiners use, so you know exactly
              what to fix.
            </p>
            <ul className="marketing-checklist">
              {CHECKLIST.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="marketing-hero-actions">
              {user ? (
                <Link to="/practice" className="submit-btn">Go to Practice</Link>
              ) : (
                <>
                  <Link to="/signup" className="submit-btn">Create your free account</Link>
                  <Link to="/login" className="btn-secondary">Log in</Link>
                </>
              )}
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

        <section className="marketing-preview">
          <h2 className="marketing-section-title">See it in action</h2>
          <p className="marketing-preview-subtitle">
            A quick look at what you'll actually see — pick a section below.
          </p>

          <nav className="mode-tabs marketing-preview-tabs">
            {PREVIEW_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={activeTab === tab.key ? 'mode-tab active' : 'mode-tab'}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="marketing-preview-body">
            <div className="marketing-preview-copy">
              <h3>{activePreview.heading}</h3>
              <p>{activePreview.body}</p>
              <Link to="/signup" className="submit-btn">Start practicing free</Link>
            </div>

            <Link to="/signup" className="preview-mockup-wrapper" aria-label="Sign up to try it yourself">
              <PreviewMockup tab={activeTab} />
              <span className="preview-mockup-overlay">
                Try it yourself <ArrowRight size={18} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </section>

        <section className="marketing-tools">
          <h2 className="marketing-section-title">Four ways to practice</h2>
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
