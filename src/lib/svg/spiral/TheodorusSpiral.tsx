import type { Point } from "@/lib/svg/helpers";

export function TheodorusSpiral({
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
  const viewBoxSize = radius * 2;
  const unit = radius / Math.sqrt(count + 1);

  // 1) Generate Theodorus spiral points
  const points: Point[] = [{ x: 1, y: 0 }];

  for (let i = 1; i <= count; i++) {
    const p = points[i - 1];
    const length = Math.hypot(p.x, p.y);

    points.push({
      x: p.x - p.y / length,
      y: p.y + p.x / length,
    });
  }

  // 2) Convert math coords -> SVG coords
  const svg = points.map((p) => ({
    x: p.x * unit,
    y: -p.y * unit,
  }));

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
    // origo in the middle
    <svg
      viewBox={`${-viewBoxSize / 2} ${-viewBoxSize / 2} ${viewBoxSize} ${viewBoxSize}`}
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

        {/* old straight shell */}
        <path
          d={edgeLine}
          fill="none"
          stroke="var(--accent-faint)"
          strokeWidth={unit * 0.18}
          strokeLinejoin="round"
        />

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

        {/* debug: the last corner (points[points.length - 1]) */}
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
