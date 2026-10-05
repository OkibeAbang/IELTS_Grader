// Renders a diagram from structured shape data rather than raw SVG markup
// or an uploaded image — there's no image-upload/storage pipeline in this
// app, and this avoids dangerouslySetInnerHTML for content that, while
// server-authored today, there's no reason to treat as trusted HTML rather
// than data. `stroke`/`fill` are always currentColor rather than a fixed
// color so the diagram follows the app's light/dark theme automatically
// instead of carrying its own hardcoded palette.
//
// `path`, dashed `line`s, and `compass` exist specifically to close the gap
// between this and a real exam diagram's visual complexity (organic lake/
// garden shapes, dashed walking routes between numbered points, a compass
// rose for orientation) without giving up the precision a labeling
// question's scoring key depends on — every shape is still exact, code-
// authored data, not a generated image that might render a label
// illegibly or in the wrong place.
export default function DiagramView({ diagram }) {
  return (
    <svg viewBox={diagram.viewBox} className="diagram-svg" role="img" aria-label="Diagram to label">
      {diagram.shapes.map((s, i) => {
        if (s.type === 'rect') {
          return (
            <rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.width}
              height={s.height}
              rx={s.rx ?? 4}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          );
        }
        if (s.type === 'circle') {
          return (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill={s.fill ? 'currentColor' : 'none'}
              fillOpacity={s.fill ? 0.08 : undefined}
              stroke="currentColor"
              strokeWidth="1.5"
            />
          );
        }
        if (s.type === 'line') {
          return (
            <line
              key={i}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray={s.dashed ? '5 4' : undefined}
            />
          );
        }
        if (s.type === 'text') {
          return (
            <text
              key={i}
              x={s.x}
              y={s.y}
              fill="currentColor"
              fontSize={s.fontSize ?? 12}
              fontWeight={s.bold ? 'bold' : 'normal'}
              textAnchor={s.anchor}
            >
              {s.text}
            </text>
          );
        }
        // Freeform outline for organic shapes a lake, pond, or garden bed
        // needs — any standard SVG path `d` string (lines + curves). `fill`
        // works the same as circle's: a faint currentColor wash so water/
        // planted areas read as distinct from open ground without needing
        // a second hardcoded color.
        if (s.type === 'path') {
          return (
            <path
              key={i}
              d={s.d}
              fill={s.fill ? 'currentColor' : 'none'}
              fillOpacity={s.fill ? 0.08 : undefined}
              stroke="currentColor"
              strokeWidth="1.5"
            />
          );
        }
        // A small N/E/S/W compass rose, centered at (x, y) with arms of
        // length `size` — one shape entry instead of needing 6 hand-placed
        // primitives (2 lines + 4 labels) every time a diagram needs one.
        if (s.type === 'compass') {
          const r = s.size ?? 20;
          return (
            <g key={i}>
              <line x1={s.x} y1={s.y - r} x2={s.x} y2={s.y + r} stroke="currentColor" strokeWidth="1" />
              <line x1={s.x - r} y1={s.y} x2={s.x + r} y2={s.y} stroke="currentColor" strokeWidth="1" />
              <text x={s.x} y={s.y - r - 6} fill="currentColor" fontSize="10" textAnchor="middle">
                N
              </text>
              <text x={s.x} y={s.y + r + 14} fill="currentColor" fontSize="10" textAnchor="middle">
                S
              </text>
              <text x={s.x - r - 10} y={s.y + 4} fill="currentColor" fontSize="10" textAnchor="middle">
                W
              </text>
              <text x={s.x + r + 10} y={s.y + 4} fill="currentColor" fontSize="10" textAnchor="middle">
                E
              </text>
            </g>
          );
        }
        // A small tree icon (round canopy + trunk), centered at (x, y) —
        // one data entry per tree, scattered a few at a time to fill empty
        // ground the same way a real exam map uses repeated tree symbols
        // rather than leaving open space bare.
        if (s.type === 'tree') {
          const r = s.size ?? 8;
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y - r * 0.6} r={r} fill="none" stroke="currentColor" strokeWidth="1" />
              <line x1={s.x} y1={s.y + r * 0.3} x2={s.x} y2={s.y + r * 1.4} stroke="currentColor" strokeWidth="1" />
            </g>
          );
        }
        // A short wavy line suggesting water ripple texture, centered at
        // (x, y) — a few of these inside a lake/pond shape is what makes it
        // read as water rather than just an empty outline.
        if (s.type === 'ripple') {
          const w = s.width ?? 20;
          const h = s.height ?? 6;
          const d = `M ${s.x - w / 2} ${s.y} Q ${s.x - w / 4} ${s.y - h}, ${s.x} ${s.y} T ${s.x + w / 2} ${s.y}`;
          return <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="1" />;
        }
        return null;
      })}
    </svg>
  );
}
