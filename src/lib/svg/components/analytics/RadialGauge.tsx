import { radialLayout } from "../../layouts/radialLayout";
import { arcPath, pointOnCircle, type Point } from "../../logic";

export function RadialGauge({
  x,
  y,
  value,
  values, // the segments
  fill,
  segmentOpacity = 1,
  radius,
  thickness,
}: Partial<Point> & {
  values: number[];
  value: number;
  fill: string;
  segmentOpacity: number;
  radius: number;
  thickness: number;
}) {
  const circle = {
    centerY: radius,
    centerX: radius,
    radius: radius - thickness * 0.5,
  };

  const startAngle = (Math.PI * 5) / 6;
  const endAngle = (Math.PI * 13) / 6;

  const segments = radialLayout({
    values,
    startAngle,
    endAngle,
  });

  const total = values.reduce((sum, value) => sum + value);

  const fillEnd = startAngle + (endAngle - startAngle) * (value / total);

  return (
    <>
      <g transform={`translate(${x}, ${y})`}>
        {segments.map((s, i) => (
          <path
            key={i}
            d={arcPath(circle, s.startAngle, s.endAngle)}
            fill="none"
            stroke={fill}
            opacity={segmentOpacity}
            strokeWidth={thickness}
          />
        ))}

        {/* the full part: bright, from the start up to value */}
        {value > 0 && (
          <path
            d={arcPath(circle, startAngle, fillEnd)}
            fill="none"
            stroke={fill}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        )}
        {/* the ticks: one where each segment starts, a bit inside the arc */}
        {segments.map((s, i) => {
          const outer = pointOnCircle({
            angle: s.startAngle,
            circle: { ...circle, radius: circle.radius - thickness * 2 },
          });
          const inner = pointOnCircle({
            angle: s.startAngle,
            circle: { ...circle, radius: circle.radius - thickness * 3 },
          });
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--accent-glow)"
              strokeWidth={1}
              opacity={0.25}
            />
          );
        })}
      </g>
    </>
  );
}
