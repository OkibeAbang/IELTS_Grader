import { useEffect, useState } from 'react';
import { fetchPromptBank, generatePrompt } from '../api/writing';

const SUBTYPE_LABELS = {
  opinion: 'Opinion',
  discussion: 'Discussion',
  problem_solution: 'Problem/Solution',
  advantage_disadvantage: 'Advantage/Disadvantage',
  two_part_question: 'Two-part question',
  line_graph: 'Line graph',
  bar_chart: 'Bar chart',
  pie_chart: 'Pie chart',
  process: 'Process diagram',
  map: 'Map',
  table: 'Table',
  letter: 'Letter',
};

function truncate(text, max = 90) {
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

export default function PromptPicker({ taskType, onSelect }) {
  const [mode, setMode] = useState('bank');
  const [bank, setBank] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedId('');
    setGenerated(null);
    setError(null);
    fetchPromptBank(taskType)
      .then(setBank)
      .catch((err) => setError(err.message));
  }, [taskType]);

  function handleBankChange(e) {
    const id = e.target.value;
    setSelectedId(id);
    const picked = bank.find((p) => p.id === id);
    if (picked) onSelect(picked.text);
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const result = await generatePrompt({ taskType, topic });
      setGenerated(result);
      onSelect(result.prompt_text);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="prompt-picker">
      <div className="prompt-picker-tabs">
        <button
          type="button"
          className={mode === 'bank' ? 'prompt-tab active' : 'prompt-tab'}
          onClick={() => setMode('bank')}
        >
          Choose a practice question
        </button>
        <button
          type="button"
          className={mode === 'generate' ? 'prompt-tab active' : 'prompt-tab'}
          onClick={() => setMode('generate')}
        >
          Generate one with AI
        </button>
      </div>

      {mode === 'bank' && (
        <select value={selectedId} onChange={handleBankChange}>
          <option value="">Select a practice question...</option>
          {bank.map((p) => (
            <option key={p.id} value={p.id}>
              [{SUBTYPE_LABELS[p.subtype] || p.subtype}] {truncate(p.text)}
            </option>
          ))}
        </select>
      )}

      {mode === 'generate' && (
        <div className="prompt-generate-row">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Optional topic (e.g. technology, environment)"
          />
          <button type="button" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Generating...' : 'Generate a question'}
          </button>
        </div>
      )}

      {mode === 'generate' && generated && (
        <p className="prompt-generated-preview">
          [{SUBTYPE_LABELS[generated.subtype] || generated.subtype}] {generated.prompt_text}
        </p>
      )}

      {error && <p className="word-count-low">{error}</p>}
    </div>
  );
}
