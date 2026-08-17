import { useState } from 'react';

const WIDTH = 640;
const HEIGHT = 220;
const PAD_LEFT = 30;
const PAD_RIGHT = 20;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;
const BAND_MIN = 1;
const BAND_MAX = 9;

function formatDate(sqliteDatetime) {
  return new Date(sqliteDatetime.replace(' ', 'T') + 'Z').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function BandTrendChart({ attempts }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const points = [...attempts]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((a) => ({ ...a, band: Number(a.overallBand) }));

  if (points.length < 2) return null;

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const xFor = (i) => PAD_LEFT + (points.length === 1 ? plotWidth / 2 : (i / (points.length - 1)) * plotWidth);
  const yFor = (band) => PAD_TOP + (1 - (band - BAND_MIN) / (BAND_MAX - BAND_MIN)) * plotHeight;

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(p.band)}`).join(' ');
  const showXLabels = points.length <= 6;
  const gridBands = [1, 3, 5, 7, 9];
  const last = points[points.length - 1];
  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="band-trend-chart">
      <h2>Band Trend</h2>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Overall band score across past speaking attempts">
        {gridBands.map((band) => (
          <g key={band}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={yFor(band)}
              y2={yFor(band)}
              stroke="var(--brown-line)"
              strokeWidth="1"
            />
            <text x={PAD_LEFT - 8} y={yFor(band)} textAnchor="end" dominantBaseline="middle" className="chart-axis-label">
              {band}
            </text>
          </g>
        ))}

        {showXLabels &&
          points.map((p, i) => (
            <text key={i} x={xFor(i)} y={HEIGHT - 6} textAnchor="middle" className="chart-axis-label">
              {formatDate(p.createdAt)}
            </text>
          ))}

        <path d={linePath} fill="none" stroke="var(--green)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={xFor(i)} cy={yFor(p.band)} r="5" fill="var(--green)" stroke="var(--cream-deep)" strokeWidth="2" />
            <circle
              cx={xFor(i)}
              cy={yFor(p.band)}
              r="14"
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              onFocus={() => setHoverIndex(i)}
              onBlur={() => setHoverIndex(null)}
              tabIndex={0}
              role="img"
              aria-label={`${formatDate(p.createdAt)}: band ${p.band}, ${p.topicLabel}`}
            />
          </g>
        ))}

        <g transform={`translate(${xFor(points.length - 1)}, ${yFor(last.band)})`}>
          <rect x={8} y={-11} width={30} height={22} rx={11} fill="var(--green)" />
          <text x={23} y={0} textAnchor="middle" dominantBaseline="middle" className="chart-end-label">
            {last.band}
          </text>
        </g>
      </svg>

      {hovered && (
        <div className="chart-tooltip">
          <strong>{hovered.band}</strong> — {hovered.topicLabel} ({formatDate(hovered.createdAt)})
        </div>
      )}
    </div>
  );
}
