import { Link } from 'react-router-dom';
import { PenLine, BookOpen, Headphones, Mic } from 'lucide-react';

const PRACTICE_ITEMS = [
  {
    to: '/essay-grader',
    icon: PenLine,
    title: 'Essay Grading',
    description: 'Submit a full Task 1 or Task 2 essay and get an AI band score across all 4 criteria.',
  },
  {
    to: '/reading',
    icon: BookOpen,
    title: 'Reading Practice',
    description: 'Read a passage and answer Multiple Choice, True/False/Not Given, and Short Answer questions.',
  },
  {
    to: '/listening',
    icon: Headphones,
    title: 'Listening Practice',
    description: 'Listen to a short recording and answer questions, just like the real IELTS Listening test.',
  },
  {
    to: '/speaking',
    icon: Mic,
    title: 'Speaking Practice',
    description: 'Record real IELTS Speaking Parts 1–3 and get a rubric-based band score.',
  },
];

export default function PracticeHubPage() {
  return (
    <div>
      <header className="app-header">
        <h1>Practice</h1>
        <p className="app-subtitle">
          Choose a section to take a full, timed practice attempt with AI-scored feedback.
        </p>
      </header>

      <div className="hub-grid">
        {PRACTICE_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className="hub-card">
            <span className="hub-card-icon" aria-hidden="true"><item.icon size={28} /></span>
            <span className="hub-card-title">{item.title}</span>
            <p className="hub-card-description">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
