import QuestionInput from './QuestionInput';

// Shared by PassageViewer, ContinuousListeningTest, and LearnListeningPage —
// previously each had its own copy-pasted `questions.map((q, i) => ...
// {startIndex + i + 1})` loop. Pulled out here specifically so matching
// questions (consecutive questions sharing a groupId, sharing one
// instructions/option-pool block rendered once above them) render
// identically everywhere rather than needing the same grouping logic
// written three times. Numbering stays one number per question object
// throughout, grouped or not — a matching group of 5 paragraphs is 5
// numbers, not a range, same as every other type today.
export default function QuestionList({ questions, questionGroups = [], answers, onAnswerChange, startIndex = 0 }) {
  const groupsById = new Map(questionGroups.map((g) => [g.id, g]));
  const blocks = [];
  let i = 0;

  while (i < questions.length) {
    const q = questions[i];
    const group = q.groupId ? groupsById.get(q.groupId) : null;

    if (!group) {
      const number = startIndex + i + 1;
      blocks.push(
        <div key={q.id} className="reading-question">
          <p className="reading-question-prompt">
            {number}. {q.prompt}
          </p>
          <QuestionInput question={q} value={answers[q.id]} onChange={onAnswerChange} />
        </div>
      );
      i += 1;
      continue;
    }

    const numberStart = startIndex + i + 1;
    const groupItems = [];
    while (i < questions.length && questions[i].groupId === group.id) {
      groupItems.push(questions[i]);
      i += 1;
    }

    // "Words from the text" summary completion has no word bank at all —
    // free recall, not a pick-from-a-list — so a group's optionPool is
    // genuinely optional, not just sometimes bare-keyed like matching
    // information's paragraph-letter pool.
    const optionPoolList = group.optionPool?.some((opt) => opt.text) && (
      <ul className="matching-option-pool">
        {group.optionPool.map((opt) => (
          <li key={opt.key}>
            <strong>{opt.key}.</strong> {opt.text}
          </li>
        ))}
      </ul>
    );

    if (group.layout === 'summary') {
      // Completion, "choose from a box" or "words from the text": blanks
      // sit inline inside a prose template instead of matching's stacked
      // prompt-then-input list. Numbers still come from each blank's
      // position in the flat `questions` array (same rule as everywhere
      // else), just looked up by id here since the template walks its own
      // segment order. Whether a blank renders a dropdown or a free-text
      // input depends on whether the group has a word bank at all — a
      // single summary is always entirely one or the other, never mixed,
      // same as the real exam.
      const numberById = new Map(groupItems.map((gq, gi) => [gq.id, numberStart + gi]));
      const questionById = new Map(groupItems.map((gq) => [gq.id, gq]));
      const hasWordBank = Boolean(group.optionPool);

      blocks.push(
        <div key={group.id} className="matching-group">
          <p className="matching-instructions">{group.instructions}</p>
          {optionPoolList}
          <p className="completion-summary">
            {group.template.map((segment, si) => {
              if (segment.text !== undefined) return <span key={si}>{segment.text}</span>;
              const gq = questionById.get(segment.blank);
              const number = numberById.get(segment.blank);
              if (hasWordBank) {
                return (
                  <span key={si} className="completion-blank">
                    <strong>({number})</strong>
                    <select
                      className="matching-select matching-select-inline"
                      value={answers[gq.id] ?? ''}
                      onChange={(e) => onAnswerChange(gq.id, e.target.value)}
                    >
                      <option value="">___</option>
                      {group.optionPool.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.key}. {opt.text}
                        </option>
                      ))}
                    </select>
                  </span>
                );
              }
              return (
                <span key={si} className="completion-blank">
                  <strong>({number})</strong>
                  <input
                    type="text"
                    className="completion-input-inline"
                    value={answers[gq.id] ?? ''}
                    onChange={(e) => onAnswerChange(gq.id, e.target.value)}
                  />
                </span>
              );
            })}
          </p>
        </div>
      );
      continue;
    }

    blocks.push(
      <div key={group.id} className="matching-group">
        <p className="matching-instructions">{group.instructions}</p>
        {optionPoolList}
        {groupItems.map((gq, gi) => (
          <div key={gq.id} className="reading-question">
            <p className="reading-question-prompt">
              {numberStart + gi}. {gq.prompt}
            </p>
            <QuestionInput
              question={{ ...gq, optionPool: group.optionPool }}
              value={answers[gq.id]}
              onChange={onAnswerChange}
            />
          </div>
        ))}
      </div>
    );
  }

  return blocks;
}
