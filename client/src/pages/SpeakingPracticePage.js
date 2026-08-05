import { useEffect, useState } from 'react';
import { fetchSpeakingTopic, submitSpeakingAttempt } from '../api/speaking';
import { useAuth } from '../hooks/useAuth';
import TopicPicker from '../components/speaking/TopicPicker';
import PartRecorder from '../components/speaking/PartRecorder';
import CueCardPart2 from '../components/speaking/CueCardPart2';
import ReviewSubmit from '../components/speaking/ReviewSubmit';
import SpeakingResultsView from '../components/SpeakingResultsView';

export default function SpeakingPracticePage() {
  const { user, resendVerification } = useAuth();
  const [topicId, setTopicId] = useState(null);
  const [topic, setTopic] = useState(null);
  const [step, setStep] = useState('pick'); // pick | part1 | part2 | part3 | review
  const [recordings, setRecordings] = useState({});
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!topicId) return;
    setTopic(null);
    setLoadError(null);
    fetchSpeakingTopic(topicId)
      .then((t) => {
        setTopic(t);
        setStep('part1');
      })
      .catch((err) => setLoadError(err.message));
  }, [topicId]);

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
      const data = await submitSpeakingAttempt({ topicId, recordings });
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
    setTopicId(null);
    setTopic(null);
    setStep('pick');
    setRecordings({});
    setSubmitError(null);
    setNeedsVerification(false);
    setResendStatus(null);
    setResult(null);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Speaking Practice</h1>
        <p className="app-subtitle">
          Work through all 3 parts of an IELTS Speaking test and get feedback against the
          official rubric.
        </p>
      </header>

      {user && !user.emailVerified && (
        <div className="precheck-warning">
          Your email isn't verified yet. You can browse and record freely, but you'll need to verify before
          submitting an attempt for grading.
        </div>
      )}

      {loadError && <div className="error-banner">{loadError}</div>}

      {step === 'pick' && <TopicPicker onSelect={setTopicId} />}

      {topic && step === 'part1' && (
        <PartRecorder
          partLabel="Part 1"
          title="Interview"
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

      {topic && (
        <button type="button" className="btn-secondary" onClick={handleChooseAnother}>
          Choose a different topic
        </button>
      )}
    </div>
  );
}
