/**
 * Combines several separately-recorded audio blobs (e.g. one per Part 1
 * question) into a single playable WAV blob. Naively concatenating the raw
 * bytes of separate MediaRecorder sessions doesn't produce a valid file
 * (each has its own container headers), so this decodes each to PCM via the
 * Web Audio API, concatenates the samples, and re-encodes as WAV — which the
 * server already transcodes on upload regardless of source format.
 */
export async function mergeAudioBlobs(blobs) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextClass();

  try {
    const buffers = [];
    for (const blob of blobs) {
      const arrayBuffer = await blob.arrayBuffer();
      buffers.push(await audioContext.decodeAudioData(arrayBuffer));
    }

    const numChannels = Math.max(...buffers.map((b) => b.numberOfChannels));
    const sampleRate = audioContext.sampleRate;
    const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);

    const channelData = [];
    for (let ch = 0; ch < numChannels; ch++) {
      channelData.push(new Float32Array(totalLength));
    }

    let offset = 0;
    for (const buffer of buffers) {
      for (let ch = 0; ch < numChannels; ch++) {
        const source = ch < buffer.numberOfChannels ? buffer.getChannelData(ch) : buffer.getChannelData(0);
        channelData[ch].set(source, offset);
      }
      offset += buffer.length;
    }

    return encodeWav(channelData, sampleRate);
  } finally {
    audioContext.close();
  }
}

function encodeWav(channelData, sampleRate) {
  const numChannels = channelData.length;
  const numFrames = channelData[0].length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}
