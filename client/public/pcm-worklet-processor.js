/**
 * AudioWorklet processor: captures mic audio at the browser's native sample
 * rate and converts it to the 16-bit PCM / 16kHz mono format the Gemini Live
 * API requires. Runs in a separate audio-rendering thread, loaded via
 * audioContext.audioWorklet.addModule('/pcm-worklet-processor.js') — must be
 * served as-is (no bundling/transpilation), which is why this lives in
 * public/ rather than src/.
 *
 * Downsampling here is naive decimation (pick every Nth sample), not a true
 * bandlimited resample. That's a real quality tradeoff, but it's standard
 * practice for this exact use case (speech input to a model, not music) and
 * keeps this processor dependency-free.
 */
class PCMWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetSampleRate = 16000;
    this.ratio = sampleRate / this.targetSampleRate;
  }

  process(inputs) {
    const channelData = inputs[0]?.[0];
    if (!channelData || channelData.length === 0) {
      return true;
    }

    const outLength = Math.max(1, Math.floor(channelData.length / this.ratio));
    const pcm16 = new Int16Array(outLength);
    for (let i = 0; i < outLength; i++) {
      const sample = channelData[Math.floor(i * this.ratio)] || 0;
      const clamped = Math.max(-1, Math.min(1, sample));
      pcm16[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    }

    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    return true;
  }
}

registerProcessor('pcm-worklet-processor', PCMWorkletProcessor);
