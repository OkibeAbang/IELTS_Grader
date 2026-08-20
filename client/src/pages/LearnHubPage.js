import { Link } from 'react-router-dom';
import { PenLine, BookOpen, Headphones, Mic } from 'lucide-react';

const LEARN_ITEMS = [
  {
    to: '/learn/writing',
    icon: PenLine,
    title: 'Writing',
    description: 'Drill just an introduction, body paragraph, or conclusion and get instant, focused feedback.',
    enabled: true,
  },
  {
    to: '/learn/reading',
    icon: BookOpen,
    title: 'Reading',
    description: 'Practice a single question type at a time.',
    enabled: true,
  },
  {
    to: '/learn/listening',
    icon: Headphones,
    title: 'Listening',
    description: 'Practice a single question type at a time.',
    enabled: true,
  },
  {
    to: '/learn/speaking',
    icon: Mic,
    title: 'Speaking',
    description: 'Drill a single part at a time, without the full test wrapper.',
    enabled: true,
  },
];

export default function LearnHubPage() {
  return (
    <div>
      <header className="app-header">
        <h1>Learn</h1>
        <p className="app-subtitle">
          Practice one task type at a time with instant feedback — a shorter, more focused
          alternative to a full timed test.
        </p>
      </header>

      <div className="hub-grid">
        {LEARN_ITEMS.map((item) =>
          item.enabled ? (
            <Link key={item.title} to={item.to} className="hub-card">
              <span className="hub-card-icon" aria-hidden="true"><item.icon size={28} /></span>
              <span className="hub-card-title">{item.title}</span>
              <p className="hub-card-description">{item.description}</p>
            </Link>
          ) : (
            <div key={item.title} className="hub-card hub-card-disabled" aria-disabled="true">
              <span className="hub-card-icon" aria-hidden="true"><item.icon size={28} /></span>
              <span className="hub-card-title">{item.title}</span>
              <p className="hub-card-description">{item.description}</p>
              <span className="hub-card-badge">Coming soon</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
