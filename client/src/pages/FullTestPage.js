import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { startFullTest, finalizeFullTest } from '../api/fullTest';
import { fetchListeningSection, submitListeningAttempt, fetchListeningAttemptDetail } from '../api/listening';
import { fetchReadingPassage, submitReadingAttempt, fetchReadingAttemptDetail } from '../api/reading';
import { gradeEssay, fetchEssayAttemptDetail } from '../api/writing';
import { fetchSpeakingTopic, submitSpeakingAttempt, fetchAttemptDetail } from '../api/speaking';
import usePersistedState, { clearPersistedState, getPersistedValue } from '../hooks/usePersistedState';
import usePersistedCountdown, { formatCountdown } from '../hooks/usePersistedCountdown';
import AudioScriptPlayer from '../components/listening/AudioScriptPlayer';
import QuestionInput from '../components/QuestionInput';
import PassageViewer from '../components/reading/PassageViewer';
import FullTestEssayStep from '../components/FullTestEssayStep';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Part1Conversation from '../components/speaking/Part1Conversation';
import CueCardPart2 from '../components/speaking/CueCardPart2';
import PartRecorder from '../components/speaking/PartRecorder';
import ReviewSubmit from '../components/speaking/ReviewSubmit';
import FullTestResultsView from '../components/FullTestResultsView';

// Every key this page (and its step sub-components) persists — cleared as a
// group whenever a brand new Full Test starts, so a fresh attempt never
// inherits state from a previous, possibly-abandoned one.
const FULL_TEST_KEYS = [
  'full-test:step',
  'full-test:fullTestId',
  'full-test:assignment',
  'full-test:listeningAttemptId',
  'full-test:readingAttemptId',
  'full-test:writingTask1AttemptId',
  'full-test:writingTask2AttemptId',
  'full-test:speakingAttemptId',
  'full-test:resultsData',
  'full-test-listening:answers',
  'full-test-listening:timer',
  'full-test-reading:answers',
  'full-test-reading:timer',
  'full-test-writing-task1:essay',
  'full-test-writing-task1:timer',
  'full-test-writing-task2:essay',
  'full-test-writing-task2:timer',
  'full-test-speaking:recordings',
];

function ListeningStep({ sectionId, onSubmit, submitting }) {
  const [section, setSection] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [answers, setAnswers] = usePersistedState('full-test-listening:answers', {});
  const countdown = usePersistedCountdown('full-test-listening:timer', 30 * 60, () => onSubmit(answers));

  useEffect(() => {
    fetchListeningSection(sectionId).then(setSection).catch((err) => setLoadError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  useEffect(() => {
    if (section) countdown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  if (loadError) return <div className="error-banner">{loadError}</div>;
  if (!section) return <p className="auth-loading">Loading listening section…</p>;

  return (
    <div className="listening-layout">
      <div className="timer">
        <span className={countdown.secondsLeft === 0 ? 'timer-expired' : ''}>
          {formatCountdown(countdown.secondsLeft)}
        </span>
      </div>
      <AudioScriptPlayer key={section.id} sectionId={section.id} />
      <div className="reading-questions-col">
        {section.questions.map((q, i) => (
          <div key={q.id} className="reading-question">
            <p className="reading-question-prompt">{i + 1}. {q.prompt}</p>
            <QuestionInput question={q} value={answers[q.id]} onChange={handleAnswerChange} />
          </div>
        ))}
        <button type="button" className="submit-btn" onClick={() => onSubmit(answers)} disabled={submitting}>
          {submitting ? 'Scoring…' : 'Submit & continue'}
        </button>
      </div>
    </div>
  );
}

function ReadingStep({ passageId, onSubmit, submitting }) {
  const [passage, setPassage] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [answers, setAnswers] = usePersistedState('full-test-reading:answers', {});
  const countdown = usePersistedCountdown('full-test-reading:timer', 60 * 60, () => onSubmit(answers));

  useEffect(() => {
    fetchReadingPassage(passageId).then(setPassage).catch((err) => setLoadError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passageId]);

  useEffect(() => {
    if (passage) countdown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passage]);

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  if (loadError) return <div className="error-banner">{loadError}</div>;
  if (!passage) return <p className="auth-loading">Loading reading passage…</p>;

  return (
    <div>
      <div className="timer">
        <span className={countdown.secondsLeft === 0 ? 'timer-expired' : ''}>
          {formatCountdown(countdown.secondsLeft)}
        </span>
      </div>
      <PassageViewer
        passage={passage}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onSubmit={() => onSubmit(answers)}
        submitting={submitting}
        showTimer={false}
      />
    </div>
  );
}

function SpeakingSteps({ topicId, step, setStep, onFinalSubmit, submitting }) {
  const [topic, setTopic] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [recordings, setRecordings] = usePersistedState('full-test-speaking:recordings', {});

  useEffect(() => {
    fetchSpeakingTopic(topicId).then(setTopic).catch((err) => setLoadError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  function handlePartComplete(key, data) {
    setRecordings((prev) => ({ ...prev, [key]: data }));
    if (key === 'part1') setStep('speaking-part2');
    else if (key === 'part2') setStep('speaking-part3');
    else setStep('speaking-review');
  }

  if (loadError) return <div className="error-banner">{loadError}</div>;
  if (!topic) return <p className="auth-loading">Loading speaking topic…</p>;

  return (
    <>
      {step === 'speaking-part1' && (
        <Part1Conversation questions={topic.part1.questions} onComplete={(data) => handlePartComplete('part1', data)} />
      )}
      {step === 'speaking-part2' && (
        <CueCardPart2 cueCard={topic.part2.cueCard} onComplete={(data) => handlePartComplete('part2', data)} />
      )}
      {step === 'speaking-part3' && (
        <PartRecorder
          partLabel="Part 3"
          title="Discussion"
          questions={topic.part3.questions}
          onComplete={(data) => handlePartComplete('part3', data)}
        />
      )}
      {step === 'speaking-review' && (
        <ReviewSubmit
          recordings={recordings}
          onReRecord={(key) => setStep(`speaking-${key}`)}
          onSubmit={() => onFinalSubmit(topicId, recordings)}
          submitting={submitting}
        />
      )}
    </>
  );
}

export default function FullTestPage() {
  useDocumentTitle('Full Test');
  const [step, setStep] = usePersistedState('full-test:step', 'intro');
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState(null);
  const [fullTestId, setFullTestId] = usePersistedState('full-test:fullTestId', null);
  const [assignment, setAssignment] = usePersistedState('full-test:assignment', null);

  const [sectionSubmitting, setSectionSubmitting] = useState(false);
  const [sectionError, setSectionError] = useState(null);

  const [listeningAttemptId, setListeningAttemptId] = usePersistedState('full-test:listeningAttemptId', null);
  const [readingAttemptId, setReadingAttemptId] = usePersistedState('full-test:readingAttemptId', null);
  const [writingTask1AttemptId, setWritingTask1AttemptId] = usePersistedState('full-test:writingTask1AttemptId', null);
  const [writingTask2AttemptId, setWritingTask2AttemptId] = usePersistedState('full-test:writingTask2AttemptId', null);
  const [speakingAttemptId, setSpeakingAttemptId] = usePersistedState('full-test:speakingAttemptId', null);

  const [finalizing, setFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState(null);
  const [resultsData, setResultsData] = usePersistedState('full-test:resultsData', null);

  async function handleStart() {
    setStarting(true);
    setStartError(null);
    try {
      const data = await startFullTest();
      FULL_TEST_KEYS.forEach(clearPersistedState);
      setFullTestId(data.fullTest.id);
      setAssignment(data.assignment);
      setStep('listening');
    } catch (err) {
      setStartError(err.message);
    } finally {
      setStarting(false);
    }
  }

  async function handleListeningSubmit(answers) {
    setSectionSubmitting(true);
    setSectionError(null);
    try {
      const data = await submitListeningAttempt(assignment.listeningSectionId, answers);
      setListeningAttemptId(data.attemptId);
      setStep('reading');
    } catch (err) {
      setSectionError(err.message);
    } finally {
      setSectionSubmitting(false);
    }
  }

  async function handleReadingSubmit(answers) {
    setSectionSubmitting(true);
    setSectionError(null);
    try {
      const data = await submitReadingAttempt(assignment.readingPassageId, answers);
      setReadingAttemptId(data.attemptId);
      setStep('writing-task1');
    } catch (err) {
      setSectionError(err.message);
    } finally {
      setSectionSubmitting(false);
    }
  }

  // Essay text is already persisted (FullTestEssayStep saves it on every
  // keystroke under this same key) — grading itself is deferred, so this
  // just advances to the next section, instantly, with nothing to fail.
  function handleTask1Submit() {
    setStep('writing-task2');
  }

  function handleTask2Submit() {
    setStep('speaking-part1');
  }

  async function handleSpeakingSubmit(topicId, recordings) {
    setSectionSubmitting(true);
    setSectionError(null);

    let task1Id = writingTask1AttemptId;
    let task2Id = writingTask2AttemptId;
    let speakingId = speakingAttemptId;

    // Read fresh at submit time, not at FullTestPage's mount time — this
    // component mounts before either essay is written, so a usePersistedState
    // snapshot taken at the top of the component would be stuck on the
    // initial empty string for the entire test.
    const task1Essay = getPersistedValue('full-test-writing-task1:essay', '');
    const task2Essay = getPersistedValue('full-test-writing-task2:essay', '');

    try {
      // Grade whichever of Task 1 / Task 2 / Speaking hasn't already
      // succeeded (on a retry after a partial failure, skip the ones that
      // already have an attempt id — no reason to burn quota re-grading a
      // section that already graded fine).
      const [task1Result, task2Result, speakingResult] = await Promise.allSettled([
        task1Id ? Promise.resolve(null) : gradeEssay({ essay: task1Essay, prompt: assignment.writingTask1Prompt.text, taskType: 'task1' }),
        task2Id ? Promise.resolve(null) : gradeEssay({ essay: task2Essay, prompt: assignment.writingTask2Prompt.text, taskType: 'task2' }),
        speakingId ? Promise.resolve(null) : submitSpeakingAttempt({ topicId, recordings }),
      ]);

      const failed = [];
      if (task1Result.status === 'fulfilled') {
        if (task1Result.value) {
          task1Id = task1Result.value.attemptId;
          setWritingTask1AttemptId(task1Id);
        }
      } else failed.push('Writing Task 1');

      if (task2Result.status === 'fulfilled') {
        if (task2Result.value) {
          task2Id = task2Result.value.attemptId;
          setWritingTask2AttemptId(task2Id);
        }
      } else failed.push('Writing Task 2');

      if (speakingResult.status === 'fulfilled') {
        if (speakingResult.value) {
          speakingId = speakingResult.value.attemptId;
          setSpeakingAttemptId(speakingId);
        }
      } else failed.push('Speaking');

      if (failed.length > 0) {
        throw new Error(
          `Grading failed for: ${failed.join(', ')}. Please try submitting again — sections that already graded successfully won't be repeated.`
        );
      }

      setFinalizing(true);
      const finalized = await finalizeFullTest(fullTestId, {
        listeningAttemptId,
        readingAttemptId,
        writingTask1AttemptId: task1Id,
        writingTask2AttemptId: task2Id,
        speakingAttemptId: speakingId,
      });

      const [listeningDetail, readingDetail, task1Detail, task2Detail, speakingDetail] = await Promise.all([
        fetchListeningAttemptDetail(listeningAttemptId),
        fetchReadingAttemptDetail(readingAttemptId),
        fetchEssayAttemptDetail(task1Id),
        fetchEssayAttemptDetail(task2Id),
        fetchAttemptDetail(speakingId),
      ]);

      setResultsData({ finalized, listeningDetail, readingDetail, task1Detail, task2Detail, speakingDetail });
      setStep('results');
    } catch (err) {
      setSectionError(err.message);
      setFinalizeError(err.message);
    } finally {
      setSectionSubmitting(false);
      setFinalizing(false);
    }
  }

  return (
    <div>
      <header className="app-header">
        <h1>Full Test</h1>
        <p className="app-subtitle">
          A single timed sitting across Listening, Reading, Writing, and Speaking — see how
          ready you are for the real IELTS test.
        </p>
      </header>

      {step !== 'results' && (
        <Link to="/practice" className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Practice
        </Link>
      )}

      {step === 'intro' && (
        <div className="hub-card">
          <p className="hub-card-description">
            This full test takes roughly 2.5 hours if you use the full time on every section:
            Listening (30 min), Reading (60 min), Writing (60 min across two tasks), and Speaking
            (~15 min). You can submit each section early — the timer is an upper limit, not a
            requirement. Once you start, content is assigned automatically, just like the real
            exam. If you navigate to another section mid-test, you can pick up right where you
            left off.
          </p>
          {startError && <div className="error-banner">{startError}</div>}
          <button type="button" className="submit-btn" onClick={handleStart} disabled={starting}>
            {starting ? 'Starting…' : 'Start Full Test'}
          </button>
        </div>
      )}

      {sectionError && <div className="error-banner">{sectionError}</div>}

      {step === 'listening' && assignment && (
        <ListeningStep sectionId={assignment.listeningSectionId} onSubmit={handleListeningSubmit} submitting={sectionSubmitting} />
      )}

      {step === 'reading' && assignment && (
        <ReadingStep passageId={assignment.readingPassageId} onSubmit={handleReadingSubmit} submitting={sectionSubmitting} />
      )}

      {step === 'writing-task1' && assignment && (
        <FullTestEssayStep
          persistKey="full-test-writing-task1"
          taskType="task1"
          taskLabel="Writing Task 1"
          prompt={assignment.writingTask1Prompt.text}
          minutes={20}
          onSubmit={handleTask1Submit}
          submitting={sectionSubmitting}
        />
      )}

      {step === 'writing-task2' && assignment && (
        <FullTestEssayStep
          persistKey="full-test-writing-task2"
          taskType="task2"
          taskLabel="Writing Task 2"
          prompt={assignment.writingTask2Prompt.text}
          minutes={40}
          onSubmit={handleTask2Submit}
          submitting={sectionSubmitting}
        />
      )}

      {['speaking-part1', 'speaking-part2', 'speaking-part3', 'speaking-review'].includes(step) && assignment && (
        <SpeakingSteps
          topicId={assignment.speakingTopicId}
          step={step}
          setStep={setStep}
          onFinalSubmit={handleSpeakingSubmit}
          submitting={sectionSubmitting || finalizing}
        />
      )}

      {finalizeError && step !== 'results' && <div className="error-banner">{finalizeError}</div>}

      {step === 'results' && resultsData && <FullTestResultsView {...resultsData} />}
    </div>
  );
}
