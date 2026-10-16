import { useMemo } from 'react';

// Deterministic PRNG so the skyline is identical on every render.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function buildLayer({ x0, x1, base, minH, maxH, minW, maxW, seed, windows, towers = [] }) {
  const r = rng(seed);
  const buildings = [];
  let x = x0;
  while (x < x1) {
    const w = minW + r() * (maxW - minW);
    const h = minH + r() ** 1.6 * (maxH - minH);
    buildings.push({ x, w, h, spire: r() > 0.86 });
    x += w + r() * 3;
  }
  towers.forEach((t) => buildings.push({ ...t, spire: true }));
  const lights = [];
  if (windows) {
    buildings.forEach((b) => {
      const cols = Math.max(1, Math.floor((b.w - 4) / 7));
      const rows = Math.floor((b.h - 8) / 9);
      for (let cx = 0; cx < cols; cx++)
        for (let ry = 0; ry < rows; ry++) {
          if (r() > windows) continue;
          lights.push({
            x: b.x + 3 + cx * 7,
            y: base - b.h + 6 + ry * 9,
            warm: r() > 0.3,
            o: 0.35 + r() * 0.6,
          });
        }
    });
  }
  return { buildings, lights };
}

export default function City({ x0 = 0, x1 = 1536, base = 560, scale = 1, seed = 7 }) {
  const layers = useMemo(
    () => [
      { fill: '#3b2d7c', opacity: 0.75, ...buildLayer({ x0, x1, base, minH: 60 * scale, maxH: 170 * scale, minW: 18, maxW: 46, seed, windows: 0 }) },
      {
        fill: '#231a5c',
        opacity: 1,
        ...buildLayer({
          x0,
          x1,
          base,
          minH: 50 * scale,
          maxH: 230 * scale,
          minW: 22,
          maxW: 60,
          seed: seed + 11,
          windows: 0.22,
          towers: [
            { x: x0 + (x1 - x0) * 0.16, w: 54, h: 360 * scale },
            { x: x0 + (x1 - x0) * 0.27, w: 40, h: 300 * scale },
            { x: x0 + (x1 - x0) * 0.78, w: 48, h: 330 * scale },
          ],
        }),
      },
      { fill: '#120e36', opacity: 1, ...buildLayer({ x0, x1, base, minH: 30 * scale, maxH: 120 * scale, minW: 26, maxW: 70, seed: seed + 23, windows: 0.3 }) },
    ],
    [x0, x1, base, scale, seed],
  );

  return (
    <g>
      {layers.map((layer, li) => (
        <g key={li} opacity={layer.opacity}>
          {layer.buildings.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={base - b.h} width={b.w} height={b.h + 2} fill={layer.fill} />
              {b.spire && (
                <>
                  <rect x={b.x + b.w / 2 - 1} y={base - b.h - 18} width="2" height="18" fill={layer.fill} />
                  <circle cx={b.x + b.w / 2} cy={base - b.h - 19} r="1.8" fill="#ff7a9a" className="twinkle" />
                </>
              )}
            </g>
          ))}
          {layer.lights.map((l, i) => (
            <rect key={i} x={l.x} y={l.y} width="3.2" height="4.2" fill={l.warm ? '#ffcf7a' : '#a5c8ff'} opacity={l.o} />
          ))}
        </g>
      ))}
    </g>
  );
}

export function Stars({ x0, x1, y0, y1, count = 70, seed = 3 }) {
  const stars = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, () => ({
      x: x0 + r() * (x1 - x0),
      y: y0 + r() ** 1.5 * (y1 - y0),
      r: 0.5 + r() * 1.3,
      d: r() * 4,
    }));
  }, [x0, x1, y0, y1, count, seed]);
  return (
    <g>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e9e7ff" className={i % 3 === 0 ? 'twinkle' : undefined} style={{ animationDelay: `${s.d}s` }} opacity={0.75} />
      ))}
    </g>
  );
}

export function Plant({ x, y, scale = 1, flip = false, leaves = 9, seed = 1, pot = true }) {
  const parts = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: leaves }, (_, i) => {
      const spread = -70 + (140 * i) / Math.max(1, leaves - 1) + (r() - 0.5) * 18;
      return { angle: spread, len: 55 + r() * 45, width: 14 + r() * 10, shade: r() };
    });
  }, [leaves, seed]);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {parts.map((l, i) => (
        <g key={i} transform={`rotate(${l.angle})`}>
          <path
            d={`M0 0 C ${l.width} ${-l.len * 0.35}, ${l.width * 0.6} ${-l.len * 0.8}, 0 ${-l.len} C ${-l.width * 0.6} ${-l.len * 0.8}, ${-l.width} ${-l.len * 0.35}, 0 0 Z`}
            fill={l.shade > 0.5 ? '#1f5a3e' : '#174a33'}
            stroke="rgb(167 139 250 / 0.35)"
            strokeWidth="0.8"
          />
          <path d={`M0 0 L0 ${-l.len * 0.92}`} stroke="#0e2c1f" strokeWidth="0.9" />
        </g>
      ))}
      {pot && (
        <path d="M-26 0 L26 0 L20 38 Q0 44 -20 38 Z" fill="#2a2152" stroke="rgb(196 181 253 / 0.35)" strokeWidth="1" />
      )}
    </g>
  );
}

export function GlobeLamp({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 4.2} fill="url(#lampHalo)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#lampBulb)" />
      <rect x={cx - r * 0.45} y={cy + r * 0.85} width={r * 0.9} height={r * 0.35} rx="2" fill="#2a2152" />
    </g>
  );
}
