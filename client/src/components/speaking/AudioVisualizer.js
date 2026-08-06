export default function AudioVisualizer({ level = 0 }) {
  const scale = 1 + Math.min(1, level) * 0.5;
  const glow = 8 + Math.min(1, level) * 40;

  return (
    <div className="audio-visualizer" aria-hidden="true">
      <div
        className="audio-visualizer-orb"
        style={{
          transform: `scale(${scale})`,
          boxShadow: `0 0 ${glow}px var(--green)`,
        }}
      />
    </div>
  );
}
