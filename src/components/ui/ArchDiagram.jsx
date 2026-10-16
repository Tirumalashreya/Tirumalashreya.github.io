const COL_X = (c) => 14 + c * 88;
const ROW_Y = (r) => 12 + r * 38;
const W = 76;
const H = 24;

export default function ArchDiagram({ architecture, id, name }) {
  const byId = Object.fromEntries(architecture.nodes.map((n) => [n.id, n]));
  const flow = architecture.edges.map(([a, b]) => `${byId[a]?.label} → ${byId[b]?.label}`).join(', ');

  return (
    <figure className="rounded-lg border border-line bg-ink/50 p-2">
      <svg viewBox="0 0 354 112" className="h-auto w-full" role="img" aria-label={`${name} architecture: ${flow}`}>
        <defs>
          <marker id={`arrow-${id}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#c4b5fd" />
          </marker>
        </defs>
        {architecture.edges.map(([a, b], i) => {
          const from = byId[a];
          const to = byId[b];
          if (!from || !to) return null;
          let d;
          if (from.col === to.col) {
            const x = COL_X(from.col) + W / 2;
            const down = to.row > from.row;
            const y1 = ROW_Y(from.row) + (down ? H : 0);
            const y2 = ROW_Y(to.row) + (down ? -2 : H + 2);
            d = `M${x},${y1} L${x},${y2}`;
          } else {
            const x1 = COL_X(from.col) + W;
            const y1 = ROW_Y(from.row) + H / 2;
            const x2 = COL_X(to.col);
            const y2 = ROW_Y(to.row) + H / 2;
            const mx = (x1 + x2) / 2;
            d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2 - 2},${y2}`;
          }
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="#352d70" strokeWidth="1.5" markerEnd={`url(#arrow-${id})`} />
              <path d={d} fill="none" stroke="#c4b5fd" strokeWidth="1.5" className="flow-edge" opacity="0.9" />
            </g>
          );
        })}
        {architecture.nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={COL_X(n.col)}
              y={ROW_Y(n.row)}
              width={W}
              height={H}
              rx="6"
              fill="#1a1645"
              stroke={n.label.includes('orchestrator') ? '#a78bfa' : '#3d3580'}
            />
            <text
              x={COL_X(n.col) + W / 2}
              y={ROW_Y(n.row) + H / 2 + 3.5}
              textAnchor="middle"
              fontSize="10"
              fill="#e6e9f5"
              fontFamily="JetBrains Mono Variable, monospace"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="sr-only">Message flow: {flow}</figcaption>
    </figure>
  );
}
