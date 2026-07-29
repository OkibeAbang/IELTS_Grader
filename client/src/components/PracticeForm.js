import { useState } from 'react';
import PromptPicker from './PromptPicker';

const SECTION_LABELS = {
  introduction: 'Introduction',
  main_body: 'Main Body Paragraph',
  conclusion: 'Conclusion',
};

const TYPICAL_WORD_RANGE = {
  introduction: '40-60 words',
  main_body: '80-140 words',
  conclusion: '40-60 words',
};

function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function PracticeForm({ onSubmit, submitting }) {
  const [taskType, setTaskType] = useState('task2');
  const [section, setSection] = useState('introduction');
  const [prompt, setPrompt] = useState('');
  const [text, setText] = useState('');

  const wordCount = countWords(text);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ text, prompt, taskType, section });
  }

  return (
    <form className="essay-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <label>
          Task type
          <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
            <option value="task1">Task 1 (report/letter)</option>
            <option value="task2">Task 2 (essay)</option>
          </select>
        </label>

        <label>
          Section to practice
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="introduction">Introduction</option>
            <option value="main_body">Main Body Paragraph</option>
            <option value="conclusion">Conclusion</option>
          </select>
        </label>
      </div>

      <label>
        Task prompt
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste the exact IELTS question here..."
          rows={4}
          required
        />
      </label>

      <PromptPicker taskType={taskType} onSelect={setPrompt} />

      <label>
        Your {SECTION_LABELS[section].toLowerCase()}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Write just the ${SECTION_LABELS[section].toLowerCase()} here...`}
          rows={8}
          required
        />
      </label>

      <div className="word-count-row">
        <span>
          {wordCount} words (typical length for this section: {TYPICAL_WORD_RANGE[section]})
        </span>
      </div>

      <button type="submit" disabled={submitting} className="submit-btn">
        {submitting ? 'Grading...' : `Grade my ${SECTION_LABELS[section].toLowerCase()}`}
      </button>
    </form>
  );
}
