/**
 * Wraps raw 16-bit PCM chunks (as captured by pcm-worklet-processor.js) in a
 * WAV container. No decoding needed here (unlike mergeAudioBlobs.js) — the
 * chunks are already 16-bit PCM samples, which is exactly what a WAV file's
 * data section expects, so this just concatenates them behind a header.
 */
export function pcmChunksToWav(chunks, sampleRate = 16000, numChannels = 1) {
  const dataSize = chunks.reduce((sum, c) => sum + c.byteLength, 0);
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;

  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  return new Blob([header, ...chunks], { type: 'audio/wav' });
}
