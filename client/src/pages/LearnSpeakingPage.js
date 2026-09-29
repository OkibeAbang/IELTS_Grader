import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchSpeakingTopic, submitSpeakingDrill } from '../api/speaking';
import { useAuth } from '../hooks/useAuth';
import usePersistedState, { clearPersistedState } from '../hooks/usePersistedState';
import useDelayedNotice from '../hooks/useDelayedNotice';
import QuestionTypePicker from '../components/QuestionTypePicker';
import TopicPicker from '../components/speaking/TopicPicker';
import Part1Conversation from '../components/speaking/Part1Conversation';
import CueCardPart2 from '../components/speaking/CueCardPart2';
import PartRecorder from '../components/speaking/PartRecorder';
import SpeakingSectionResultsView from '../components/SpeakingSectionResultsView';

const PART_OPTIONS = [
  { value: 'part1', label: 'Part 1', description: 'Short interview' },
  { value: 'part2', label: 'Part 2', description: 'Long turn (cue card)' },
  { value: 'part3', label: 'Part 3', description: 'Discussion' },
];

const KEYS = ['speaking-drill:topicId', 'speaking-drill:part', 'speaking-drill:result'];

export default function LearnSpeakingPage() {
  const { user } = useAuth();
  const [topicId, setTopicId] = usePersistedState('speaking-drill:topicId', null);
  const [topic, setTopic] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [part, setPart] = usePersistedState('speaking-drill:part', null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = usePersistedState('speaking-drill:result', null);
  const showColdStartHint = useDelayedNotice(submitting, 6000);

  useEffect(() => {
    if (!topicId) return;
    setTopic(null);
    setLoadError(null);
    fetchSpeakingTopic(topicId)
      .then(setTopic)
      .catch((err) => setLoadError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  async function handleRecordingComplete({ audioBlob, durationSec }) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitSpeakingDrill({ topicId, part, audioBlob, durationSec });
      setResult(data);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChooseAnother() {
    KEYS.forEach(clearPersistedState);
    setTopicId(null);
    setTopic(null);
    setPart(null);
    setSubmitError(null);
    setResult(null);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Speaking Drill</h1>
        <p className="app-subtitle">
          Drill a single part at a time, without the full 3-part test wrapper.
        </p>
      </header>

      <div className="page-back-row">
        <Link to="/practice#drill-mode" className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Drill Mode
        </Link>
        {topicId && (
          <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
            Choose a different topic
          </button>
        )}
      </div>

      {user && !user.emailVerified && (
        <div className="precheck-warning">
          Your email isn't verified yet. You can browse and record freely, but you'll need to verify before
          submitting a drill for grading.
        </div>
      )}

      {loadError && <div className="error-banner">{loadError}</div>}

      {!topicId && !result && <TopicPicker onSelect={setTopicId} />}

      {topic && !part && !result && (
        <QuestionTypePicker
          types={PART_OPTIONS}
          onSelect={setPart}
          title="Choose a part to drill"
          subtitle={`Practicing "${topic.topic}"`}
        />
      )}

      {topic && part === 'part1' && !result && (
        <Part1Conversation questions={topic.part1.questions} onComplete={handleRecordingComplete} />
      )}
      {topic && part === 'part2' && !result && (
        <CueCardPart2 cueCard={topic.part2.cueCard} onComplete={handleRecordingComplete} />
      )}
      {topic && part === 'part3' && !result && (
        <PartRecorder partLabel="Part 3" title="Discussion" questions={topic.part3.questions} onComplete={handleRecordingComplete} />
      )}

      {submitting && <p className="app-subtitle">Scoring your recording…</p>}
      {showColdStartHint && (
        <p className="cold-start-hint">
          Still working — grading audio takes longer than text, and if the server's been idle
          for a while this can take up to a couple of minutes. No need to resubmit, it's still
          processing.
        </p>
      )}
      {submitError && <div className="error-banner">{submitError}</div>}
      {result && <SpeakingSectionResultsView result={result} />}
    </div>
  );
}
