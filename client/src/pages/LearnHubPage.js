import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchStudyPlan, generateStudyPlan } from '../api/studyPlan';
import OnboardingQuestionnaire from '../components/OnboardingQuestionnaire';
import StudyPlanView from '../components/StudyPlanView';

export default function LearnHubPage() {
  const { user } = useAuth();
  const isPro = user?.subscriptionTier === 'pro';

  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  useEffect(() => {
    if (!isPro) {
      setLoading(false);
      return;
    }
    fetchStudyPlan()
      .then(setStudyPlan)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [isPro]);

  async function handleSubmit(answers) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const saved = await generateStudyPlan(answers);
      setStudyPlan(saved);
      setShowQuestionnaire(false);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <header className="app-header">
        <h1>Learn</h1>
        <p className="app-subtitle">
          A personalized study plan based on your test date, target band, and where you need the
          most work.
        </p>
      </header>

      {!isPro && (
        <div className="locked-feedback">
          <Lock size={22} aria-hidden="true" />
          <h3>The study plan is a Pro feature</h3>
          <p>
            Answer a few questions about your test date and current level, and get a personalized
            weekly study plan pointing you to exactly the right practice.
          </p>
          <Link to="/pricing" className="submit-btn">Upgrade to Pro</Link>
        </div>
      )}

      {isPro && loading && <p className="auth-loading">Loading…</p>}
      {isPro && loadError && <div className="error-banner">{loadError}</div>}

      {isPro && !loading && !loadError && studyPlan && !showQuestionnaire && (
        <StudyPlanView studyPlan={studyPlan} onRetake={() => setShowQuestionnaire(true)} />
      )}

      {isPro && !loading && !loadError && (!studyPlan || showQuestionnaire) && (
        <>
          {submitError && <div className="error-banner">{submitError}</div>}
          <OnboardingQuestionnaire
            onSubmit={handleSubmit}
            submitting={submitting}
            initialValues={
              studyPlan
                ? {
                    testDate: studyPlan.testDate,
                    targetBand: studyPlan.targetBand,
                    currentBands: studyPlan.currentBands,
                    weeklyHours: studyPlan.weeklyHours,
                    weakestSkill: studyPlan.weakestSkill,
                  }
                : undefined
            }
          />
        </>
      )}
    </div>
  );
}
