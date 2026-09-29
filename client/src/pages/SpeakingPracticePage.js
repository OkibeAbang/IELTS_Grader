import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchSpeakingTopic, submitSpeakingAttempt, fetchLiveVoiceStatus } from '../api/speaking';
import { useAuth } from '../hooks/useAuth';
import usePersistedState, { clearPersistedState } from '../hooks/usePersistedState';
import useDelayedNotice from '../hooks/useDelayedNotice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import TopicPicker from '../components/speaking/TopicPicker';
import Part1Conversation from '../components/speaking/Part1Conversation';
import LiveSpeakingSession from '../components/speaking/LiveSpeakingSession';
import PartRecorder from '../components/speaking/PartRecorder';
import CueCardPart2 from '../components/speaking/CueCardPart2';
import ReviewSubmit from '../components/speaking/ReviewSubmit';
import SpeakingResultsView from '../components/SpeakingResultsView';

const TARGET_BAND_OPTIONS = [9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4];

const KEYS = [
  'speaking-practice:topicId',
  'speaking-practice:targetBand',
  'speaking-practice:step',
  'speaking-practice:recordings',
  'speaking-practice:result',
];

export default function SpeakingPracticePage() {
  useDocumentTitle('Speaking Practice');
  const { user, resendVerification } = useAuth();
  const [topicId, setTopicId] = usePersistedState('speaking-practice:topicId', null);
  const [topic, setTopic] = useState(null);
  const [targetBand, setTargetBand] = usePersistedState('speaking-practice:targetBand', '');
  // pick | live | part1 | part2 | part3 | review — a resumed session's step
  // can be further along than 'pick', so the topic-load effect below must
  // not blindly reset it back to 'live'/'part1' on every mount.
  const [step, setStep] = usePersistedState('speaking-practice:step', 'pick');
  const [recordings, setRecordings] = usePersistedState('speaking-practice:recordings', {});
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const showColdStartHint = useDelayedNotice(submitting, 6000);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);
  const [result, setResult] = usePersistedState('speaking-practice:result', null);
  const [liveVoiceAvailable, setLiveVoiceAvailable] = useState(false);
  const [useLiveVoice, setUseLiveVoice] = useState(false);

  useEffect(() => {
    fetchLiveVoiceStatus().then(setLiveVoiceAvailable).catch(() => setLiveVoiceAvailable(false));
  }, []);

  useEffect(() => {
    if (!topicId) return;
    setTopic(null);
    setLoadError(null);
    fetchSpeakingTopic(topicId)
      .then((t) => {
        setTopic(t);
        // Only move off 'pick' for a genuinely fresh topic selection — a
        // resumed session already sitting at 'part2'/'review'/etc. must not
        // be reset back to the start just because the topic re-fetched.
        setStep((prev) => (prev === 'pick' ? (useLiveVoice ? 'live' : 'part1') : prev));
      })
      .catch((err) => setLoadError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  function handleLiveComplete(liveRecordings) {
    setRecordings(liveRecordings);
    setStep('review');
  }

  function handleLiveFallback() {
    setUseLiveVoice(false);
    setStep('part1');
  }

  function handlePartComplete(key, data) {
    setRecordings((prev) => ({ ...prev, [key]: data }));
    if (key === 'part1') setStep('part2');
    else if (key === 'part2') setStep('part3');
    else setStep('review');
  }

  function handleReRecord(key) {
    setStep(key);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    setNeedsVerification(false);
    try {
      const data = await submitSpeakingAttempt({ topicId, recordings, targetBand });
      setResult(data);
    } catch (err) {
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true);
      } else {
        setSubmitError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    setResendStatus('sending');
    try {
      await resendVerification();
      setResendStatus('sent');
    } catch {
      setResendStatus('error');
    }
  }

  function handleChooseAnother() {
    KEYS.forEach(clearPersistedState);
    setTopicId(null);
    setTopic(null);
    setStep('pick');
    setRecordings({});
    setSubmitError(null);
    setNeedsVerification(false);
    setResendStatus(null);
    setResult(null);
    setUseLiveVoice(false);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Speaking Practice</h1>
        <p className="app-subtitle">
          Work through all 3 parts of an IELTS Speaking test and get feedback against the
          official speaking rubric.
        </p>
      </header>

      <div className="page-back-row">
        <Link to="/practice" className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Practice
        </Link>
        {topic && (
          <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
            Choose a different topic
          </button>
        )}
      </div>

      {user && !user.emailVerified && (
        <div className="precheck-warning">
          Your email isn't verified yet. You can browse and record freely, but you'll need to verify before
          submitting an attempt for grading.
        </div>
      )}

      {loadError && <div className="error-banner">{loadError}</div>}

      {step === 'pick' && (
        <>
          <label className="target-band-picker">
            Target band (optional)
            <select value={targetBand} onChange={(e) => setTargetBand(e.target.value)}>
              <option value="">No target</option>
              {TARGET_BAND_OPTIONS.map((b) => (
                <option key={b} value={b}>{b.toFixed(1)}</option>
              ))}
            </select>
          </label>
          {liveVoiceAvailable && (
            <label className="target-band-picker">
              <input
                type="checkbox"
                checked={useLiveVoice}
                onChange={(e) => setUseLiveVoice(e.target.checked)}
              />
              Try full live AI conversation (beta)
            </label>
          )}
          <TopicPicker onSelect={setTopicId} />
        </>
      )}

      {topic && step === 'live' && (
        <LiveSpeakingSession topic={topic} onComplete={handleLiveComplete} onFallback={handleLiveFallback} />
      )}

      {topic && step === 'part1' && (
        <Part1Conversation
          questions={topic.part1.questions}
          onComplete={(data) => handlePartComplete('part1', data)}
        />
      )}

      {topic && step === 'part2' && (
        <CueCardPart2
          cueCard={topic.part2.cueCard}
          onComplete={(data) => handlePartComplete('part2', data)}
        />
      )}

      {topic && step === 'part3' && (
        <PartRecorder
          partLabel="Part 3"
          title="Discussion"
          questions={topic.part3.questions}
          onComplete={(data) => handlePartComplete('part3', data)}
        />
      )}

      {topic && step === 'review' && !result && (
        <>
          <ReviewSubmit
            recordings={recordings}
            onReRecord={handleReRecord}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
          {submitError && <div className="error-banner">{submitError}</div>}
          {showColdStartHint && (
            <p className="cold-start-hint">
              Still working — grading audio takes longer than text, and if the server's been
              idle for a while this can take up to a couple of minutes. No need to resubmit,
              it's still processing.
            </p>
          )}
          {needsVerification && (
            <div className="error-banner">
              Verify your email before submitting for grading.{' '}
              {resendStatus === 'sent' ? (
                <strong>Verification email sent — check your inbox.</strong>
              ) : (
                <button type="button" className="btn-secondary" onClick={handleResendVerification} disabled={resendStatus === 'sending'}>
                  {resendStatus === 'sending' ? 'Sending…' : 'Resend verification email'}
                </button>
              )}
              {resendStatus === 'error' && <span> Couldn't send it — try again shortly.</span>}
            </div>
          )}
        </>
      )}

      {result && <SpeakingResultsView result={result} />}
    </div>
  );
}
