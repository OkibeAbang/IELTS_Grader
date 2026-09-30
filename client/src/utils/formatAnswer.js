// userAnswer is a string for every question type except multiple_select,
// where it's an array of chosen option keys. `value || '—'` breaks for
// arrays either way: an empty array is truthy in JS (so a blank answer
// wouldn't fall back to the placeholder), and React renders a multi-item
// array with no separator between entries.
export default function formatUserAnswer(value) {
  // Sorted for display (not storage) so it reads in option order — A, C —
  // rather than the order the options happened to be clicked in.
  if (Array.isArray(value)) return value.length ? [...value].sort().join(', ') : '—';
  return value || '—';
}
