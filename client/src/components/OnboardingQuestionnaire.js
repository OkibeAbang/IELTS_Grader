import { useState } from 'react';

const BAND_OPTIONS = [9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4];

const WEEKLY_HOURS_OPTIONS = [
  { value: '', label: 'Not sure' },
  { value: '1', label: 'Less than 2 hours' },
  { value: '3.5', label: '2–5 hours' },
  { value: '7.5', label: '5–10 hours' },
  { value: '12', label: 'More than 10 hours' },
];

const SKILL_OPTIONS = [
  { value: '', label: 'Not sure' },
  { value: 'listening', label: 'Listening' },
  { value: 'reading', label: 'Reading' },
  { value: 'writing', label: 'Writing' },
  { value: 'speaking', label: 'Speaking' },
];

export default function OnboardingQuestionnaire({ onSubmit, submitting, initialValues }) {
  const [testDate, setTestDate] = useState(initialValues?.testDate ?? '');
  const [targetBand, setTargetBand] = useState(initialValues?.targetBand ?? '7');
  const [currentBands, setCurrentBands] = useState({
    listening: initialValues?.currentBands?.listening ?? '',
    reading: initialValues?.currentBands?.reading ?? '',
    writing: initialValues?.currentBands?.writing ?? '',
    speaking: initialValues?.currentBands?.speaking ?? '',
  });
  const [weeklyHours, setWeeklyHours] = useState(initialValues?.weeklyHours ?? '');
  const [weakestSkill, setWeakestSkill] = useState(initialValues?.weakestSkill ?? '');

  function handleCurrentBandChange(skill, value) {
    setCurrentBands((prev) => ({ ...prev, [skill]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      testDate: testDate || null,
      targetBand: targetBand ? Number(targetBand) : null,
      currentBands: {
        listening: currentBands.listening ? Number(currentBands.listening) : null,
        reading: currentBands.reading ? Number(currentBands.reading) : null,
        writing: currentBands.writing ? Number(currentBands.writing) : null,
        speaking: currentBands.speaking ? Number(currentBands.speaking) : null,
      },
      weeklyHours: weeklyHours ? Number(weeklyHours) : null,
      weakestSkill: weakestSkill || null,
    });
  }

  return (
    <form className="essay-form" onSubmit={handleSubmit}>
      <label>
        When is your test? (optional)
        <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} />
      </label>

      <label>
        Target overall band
        <select value={targetBand} onChange={(e) => setTargetBand(e.target.value)}>
          {BAND_OPTIONS.map((b) => (
            <option key={b} value={b}>{b.toFixed(1)}</option>
          ))}
        </select>
      </label>

      <div className="field-row">
        {['listening', 'reading', 'writing', 'speaking'].map((skill) => (
          <label key={skill}>
            Current {skill} band
            <select value={currentBands[skill]} onChange={(e) => handleCurrentBandChange(skill, e.target.value)}>
              <option value="">Not sure</option>
              {BAND_OPTIONS.map((b) => (
                <option key={b} value={b}>{b.toFixed(1)}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <label>
        How much time can you study per week?
        <select value={weeklyHours} onChange={(e) => setWeeklyHours(e.target.value)}>
          {WEEKLY_HOURS_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>

      <label>
        Which skill feels weakest?
        <select value={weakestSkill} onChange={(e) => setWeakestSkill(e.target.value)}>
          {SKILL_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>

      <button type="submit" className="submit-btn" disabled={submitting}>
        {submitting ? 'Building your plan…' : 'Build my study plan'}
      </button>
    </form>
  );
}
