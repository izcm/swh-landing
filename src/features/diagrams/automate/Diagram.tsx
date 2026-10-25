import { arcPath, parallelogramCorners, pointOnCircle } from "@/lib/svg";
import { radialLayout } from "@/lib/svg/layouts/radialLayout";

export function AutomateDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 400;

  const teethCount = 8;

  // the wheel: a circle in the top-left corner
  const wheel = (() => {
    const radius = viewboxHeight * 0.25; // knob
    // how far the teeth stick out past the rim (a gear's "module")
    const toothHeight = (2 * radius) / teethCount;
    // in by radius + toothHeight, so no tooth goes past the top or left edge
    const centerX = radius + toothHeight;
    const centerY = radius + toothHeight;

    return { radius, toothHeight, centerX, centerY };
  })();

  const segments = radialLayout({
    values: Array.from({ length: teethCount }, () => 1),
  });

  const startTooth = (s: (typeof segments)[number]) =>
    s.midAngle + (s.startAngle - s.midAngle) / 2;

  const endTooth = (s: (typeof segments)[number]) =>
    s.midAngle + (s.endAngle - s.midAngle) / 2;

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="block max-w-xl w-full mx-auto"
    >
      {/* debug: the viewbox's edges */}
      <rect
        className="svg-debugg"
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
      <circle
        cx={wheel.centerX}
        cy={wheel.centerY}
        r={wheel.radius * 0.6}
        fill="none"
        stroke="var(--accent)"
      />

      {segments.map((s, i) => {
        const rim = pointOnCircle({ angle: startTooth(s), circle: wheel });
        const rimEnd = pointOnCircle({ angle: endTooth(s), circle: wheel });

        const tooth = {
          lengthA: Math.hypot(rimEnd.x - rim.x, rimEnd.y - rim.y),
          lengthB: wheel.toothHeight,
        };

        const corners = parallelogramCorners({
          origin: rim,
          ...tooth,
          angleA: s.midAngle + Math.PI / 2, // along the rim
          angleB: s.midAngle, // out from the wheel
        });

        return (
          <g key={i}>
            <path
              d={arcPath(wheel, s.startAngle, startTooth(s))}
              fill="none"
              stroke={"var(--accent)"}
              strokeWidth={1}
            />
            {/* the tooth's 3 outer sides, open where it sits on the rim */}
            <path
              d={[corners[1], corners[2], corners[3], corners[0]]
                .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                .join(" ")}
              fill="none"
              stroke={"var(--accent)"}
              strokeWidth={1}
            />
            <path
              d={arcPath(wheel, endTooth(s), s.endAngle)}
              fill="none"
              stroke={"var(--accent)"}
              strokeWidth={1}
            />
          </g>
        );
      })}
    </svg>
  );
}
