import type { Point } from "@/lib/svg/helpers";

export function EaseOutSpiral({
  x,
  y,
  count,
  radius,
}: {
  x: number;
  y: number;
  count: number;
  radius: number;
}) {
  const unit = radius / 30;

  // 1) Generate spiral points
  const points: Point[] = [];
  const startRadius = radius * 0.5;

  for (let i = 0; i <= count; i++) {
    const t = i / count;

    const angle = t * Math.PI * 2;

    // Expands quickly, then follows the outer circle
    const growth = 1 - Math.pow(1 - t, 4);
    const r = startRadius + (radius - startRadius) * growth;

    points.push({
      x: Math.cos(angle) * r,
      y: -Math.sin(angle) * r,
    });
  }

  // 2) Points are already in SVG coordinates
  const svg = points;

  // 3) Old straight outer edge
  const edgeLine = svg
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // 4) Smooth outer edge with cubic Béziers
  let edgeSmooth = `M ${svg[0].x} ${svg[0].y}`;

  for (let i = 0; i < svg.length - 1; i++) {
    const p0 = svg[Math.max(0, i - 1)];
    const p1 = svg[i];
    const p2 = svg[i + 1];
    const p3 = svg[Math.min(svg.length - 1, i + 2)];

    const c1 = {
      x: p1.x + (p2.x - p0.x) / 6,
      y: p1.y + (p2.y - p0.y) / 6,
    };

    const c2 = {
      x: p2.x - (p3.x - p1.x) / 6,
      y: p2.y - (p3.y - p1.y) / 6,
    };

    edgeSmooth += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }

  return (
    <svg
      viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
      width="100%"
      overflow="visible"
    >
      <g transform={`translate(${x}, ${y})`}>
        {/* spokes */}
        {svg.map((p, i) => (
          <line
            key={i}
            x1={0}
            y1={0}
            x2={p.x}
            y2={p.y}
            stroke="var(--accent-faint)"
            strokeWidth={unit * 0.06}
          />
        ))}

        {/* straight shell */}
        {/* <path
          d={edgeLine}
          fill="none"
          stroke="var(--accent-faint)"
          strokeWidth={unit * 0.18}
          strokeLinejoin="round"
        /> */}

        {/* smooth shell */}
        {/* dashed like the hero connectors: dash 8× the width, gap 12× */}
        <path
          d={edgeSmooth}
          fill="none"
          stroke="var(--connector-color)"
          strokeWidth={unit * 0.09}
          strokeDasharray={`${unit * 0.09 * 8} ${unit * 0.09 * 12}`}
        />

        {/* origin */}
        <circle cx={0} cy={0} r={unit * 0.15} fill="var(--accent)" />

        {/* endpoint */}
        <circle
          cx={svg[svg.length - 1].x}
          cy={svg[svg.length - 1].y}
          r={unit * 0.24}
          fill="red"
        />
      </g>
    </svg>
  );
}
