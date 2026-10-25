import { arcPath, pointOnCircle } from "@/lib/svg";

// arrows chasing each other round a circle, like a refresh icon, spinning
// clockwise. drawn around (cx, cy), squashed top to bottom by `squash` so it
// can lie flat on a floor
export function SyncArrows({
  cx,
  cy,
  squash = 1,
  radius,
  count,
  thickness,
  gapAngle,
  headLength,
  headWidth,
  duration,
  color,
}: {
  cx: number;
  cy: number;
  squash?: number; // its height against its width. 1 = upright, facing us
  radius: number; // the circle the arrows run along
  count: number; // how many arrows share the circle
  thickness: number; // each arrow's line width
  gapAngle: number; // empty turn after each arrowhead, radians
  headLength: number; // the arrowhead, along the circle
  headWidth: number; // the arrowhead, across the circle
  duration: number; // seconds per full turn
  color: string;
}) {
  const circle = { centerX: 0, centerY: 0, radius };
  const slot = (2 * Math.PI) / count; // each arrow's share of the turn, its gap included
  const headSweep = headLength / radius; // the arrowhead's length as an angle

  // each arrow: a piece of the ring, then a triangle whose tip sits on the ring
  const arrows = Array.from({ length: count }, (_, i) => {
    const start = i * slot;
    const headBase = start + slot - gapAngle - headSweep;
    const tip = pointOnCircle({ angle: headBase + headSweep, circle });
    const outer = pointOnCircle({
      angle: headBase,
      circle: { ...circle, radius: radius + headWidth / 2 },
    });
    const inner = pointOnCircle({
      angle: headBase,
      circle: { ...circle, radius: radius - headWidth / 2 },
    });

    return {
      line: arcPath(circle, start, headBase),
      head: `M ${outer.x} ${outer.y} L ${tip.x} ${tip.y} L ${inner.x} ${inner.y} Z`,
    };
  });

  return (
    <g transform={`translate(${cx}, ${cy}) scale(1, ${squash})`}>
      <g className="spin" style={{ animationDuration: `${duration}s` }}>
        {arrows.map(({ line, head }, i) => (
          <g key={i}>
            <path d={line} fill="none" stroke={color} strokeWidth={thickness} />
            <path d={head} fill={color} />
          </g>
        ))}
      </g>
    </g>
  );
}
