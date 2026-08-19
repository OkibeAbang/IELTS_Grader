import { useEffect, useState } from 'react';
import {
  fetchAttemptHistory,
  deleteAttempt,
  fetchSpeakingDrillHistory,
  deleteSpeakingDrillAttempt,
} from '../api/speaking';
import { fetchEssayHistory, deleteEssayAttempt } from '../api/writing';
import { fetchReadingHistory, deleteReadingAttempt } from '../api/reading';
import { fetchListeningHistory, deleteListeningAttempt } from '../api/listening';
import AttemptSection from '../components/AttemptSection';

const SECTION_LABELS = {
  introduction: 'Introduction',
  main_body: 'Main Body Paragraph',
  conclusion: 'Conclusion',
};

const QUESTION_TYPE_LABELS = {
  multiple_choice: 'Multiple Choice',
  true_false_not_given: 'True/False/Not Given',
  short_answer: 'Short Answer',
};

const SPEAKING_PART_LABELS = {
  part1: 'Part 1',
  part2: 'Part 2',
  part3: 'Part 3',
};

function modeLabel(attempt) {
  if (attempt.mode === 'full') return 'Full Test';
  return `Drill — ${QUESTION_TYPE_LABELS[attempt.questionType] ?? attempt.questionType}`;
}

export default function AttemptHistoryPage() {
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState(null);
  const [essayAttempts, setEssayAttempts] = useState(null);
  const [essayError, setEssayError] = useState(null);
  const [readingAttempts, setReadingAttempts] = useState(null);
  const [readingError, setReadingError] = useState(null);
  const [listeningAttempts, setListeningAttempts] = useState(null);
  const [listeningError, setListeningError] = useState(null);
  const [speakingDrillAttempts, setSpeakingDrillAttempts] = useState(null);
  const [speakingDrillError, setSpeakingDrillError] = useState(null);

  function load() {
    fetchAttemptHistory()
      .then(setAttempts)
      .catch((err) => setError(err.message));
    fetchEssayHistory()
      .then(setEssayAttempts)
      .catch((err) => setEssayError(err.message));
    fetchReadingHistory()
      .then(setReadingAttempts)
      .catch((err) => setReadingError(err.message));
    fetchListeningHistory()
      .then(setListeningAttempts)
      .catch((err) => setListeningError(err.message));
    fetchSpeakingDrillHistory()
      .then(setSpeakingDrillAttempts)
      .catch((err) => setSpeakingDrillError(err.message));
  }

  useEffect(load, []);

  async function handleDelete(id) {
    try {
      await deleteAttempt(id);
      setAttempts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEssayDelete(id) {
    try {
      await deleteEssayAttempt(id);
      setEssayAttempts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setEssayError(err.message);
    }
  }

  async function handleReadingDelete(id) {
    try {
      await deleteReadingAttempt(id);
      setReadingAttempts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setReadingError(err.message);
    }
  }

  async function handleListeningDelete(id) {
    try {
      await deleteListeningAttempt(id);
      setListeningAttempts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setListeningError(err.message);
    }
  }

  async function handleSpeakingDrillDelete(id) {
    try {
      await deleteSpeakingDrillAttempt(id);
      setSpeakingDrillAttempts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setSpeakingDrillError(err.message);
    }
  }

  return (
    <div>
      <header className="app-header">
        <h1>Dashboard</h1>
        <p className="app-subtitle">
          Your speaking, essay, reading, and listening history, and your band trend over time.
        </p>
      </header>

      <AttemptSection
        title="Speaking Practice"
        attempts={attempts}
        error={error}
        emptyMessage="No attempts yet. Complete a speaking practice session to see your progress here."
        historyBasePath="/speaking/history"
        onDelete={handleDelete}
        chartLabelKey="topicLabel"
        columns={[{ header: 'Topic', render: (a) => a.topicLabel }]}
      />

      <AttemptSection
        title="Essay Grading"
        attempts={essayAttempts}
        error={essayError}
        emptyMessage="No essay attempts yet. Grade an essay or practice a section to see your progress here."
        historyBasePath="/essay-grader/history"
        onDelete={handleEssayDelete}
        showChart={false}
        columns={[
          { header: 'Task', render: (a) => (a.taskType === 'task1' ? 'Task 1' : 'Task 2') },
          {
            header: 'Mode',
            render: (a) => (a.mode === 'full' ? 'Full Essay' : `Section — ${SECTION_LABELS[a.section] ?? a.section}`),
          },
        ]}
      />

      <AttemptSection
        title="Reading Practice"
        attempts={readingAttempts}
        statsAttempts={readingAttempts?.filter((a) => a.mode !== 'drill')}
        error={readingError}
        emptyMessage="No reading attempts yet. Complete a passage to see your progress here."
        historyBasePath="/reading/history"
        onDelete={handleReadingDelete}
        chartLabelKey="passageTitle"
        columns={[
          { header: 'Passage', render: (a) => a.passageTitle },
          { header: 'Correct', render: (a) => `${a.correctCount} / ${a.totalQuestions}` },
          { header: 'Mode', render: modeLabel },
        ]}
      />

      <AttemptSection
        title="Listening Practice"
        attempts={listeningAttempts}
        statsAttempts={listeningAttempts?.filter((a) => a.mode !== 'drill')}
        error={listeningError}
        emptyMessage="No listening attempts yet. Complete a section to see your progress here."
        historyBasePath="/listening/history"
        onDelete={handleListeningDelete}
        chartLabelKey="sectionTitle"
        columns={[
          { header: 'Section', render: (a) => a.sectionTitle },
          { header: 'Correct', render: (a) => `${a.correctCount} / ${a.totalQuestions}` },
          { header: 'Mode', render: modeLabel },
        ]}
      />

      <AttemptSection
        title="Speaking Drills"
        attempts={speakingDrillAttempts}
        error={speakingDrillError}
        emptyMessage="No speaking drills yet. Practice a single part in Learn to see your progress here."
        historyBasePath="/speaking/drill-history"
        onDelete={handleSpeakingDrillDelete}
        chartLabelKey="topicLabel"
        columns={[
          { header: 'Topic', render: (a) => a.topicLabel },
          { header: 'Part', render: (a) => SPEAKING_PART_LABELS[a.part] ?? a.part },
        ]}
      />
    </div>
  );
}
