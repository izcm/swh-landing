import {
  arcPath,
  cascadeLayout,
  deg,
  isoTrapezoidCorners,
  pointOnCircle,
  pointOnLine,
} from "@/lib/svg";
import { radialLayout } from "@/lib/svg/layouts/arrange/radialLayout";

export function AutomateDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 350;

  const teethCount = 8;

  // === WHEEL MEASUREMENTS INCLUDING TEETH ===
  const wheel = (() => {
    const radius = viewboxHeight * 0.22;

    // how far the teeth stick out past the rim
    const toothHeight = (2 * radius) / teethCount;
    // how far each tooth's sides lean in, away from straight out
    const toothLean = deg(15); // knob
    const holeRadius = radius * 0.5;

    // the whole gear, teeth included
    const size = 2 * (radius + toothHeight);
    const centerX = size / 2;
    const centerY = size / 2;

    return {
      radius,
      toothHeight,
      toothLean,
      holeRadius,
      size,
      centerX,
      centerY,
    };
  })();

  const segments = radialLayout({
    values: Array.from({ length: teethCount }, () => 1),
  });

  const startTooth = (s: (typeof segments)[number]) =>
    s.midAngle + (s.startAngle - s.midAngle) / 2;

  const endTooth = (s: (typeof segments)[number]) =>
    s.midAngle + (s.endAngle - s.midAngle) / 2;

  // a path fillRule counts the shape inside one path d's
  // "evenodd" draws every other shape
  // one shape is everything from one M to the next, called a "subpath"
  const gear = (() => {
    const { radius } = wheel;
    const rimTo = (angle: number) => {
      const p = pointOnCircle({ angle, circle: wheel });
      return `A ${radius} ${radius} 0 0 1 ${p.x} ${p.y}`;
    };

    const outline = segments.map((s) => {
      const rim = pointOnCircle({ angle: startTooth(s), circle: wheel });
      const rimEnd = pointOnCircle({ angle: endTooth(s), circle: wheel });

      const corners = isoTrapezoidCorners({
        bottomCenter: pointOnLine(rim, rimEnd, 0.5),
        lengthA: Math.hypot(rimEnd.x - rim.x, rimEnd.y - rim.y),
        lengthB: wheel.toothHeight,
        angleA: s.midAngle + Math.PI / 2, // along the rim
        angleB: s.midAngle + wheel.toothLean, // out from the wheel, leaning in
      });

      return [
        rimTo(startTooth(s)),
        ...[corners[3], corners[2], corners[1]].map((p) => `L ${p.x} ${p.y}`),
        // corners.map((p) => `L ${p.x} ${p.y}`),
        rimTo(s.endAngle),
      ].join(" ");
    });

    const start = pointOnCircle({
      angle: segments[0].startAngle,
      circle: wheel,
    });
    const hole = arcPath(
      { ...wheel, radius: wheel.holeRadius },
      0,
      2 * Math.PI,
    );

    return {
      d: `M ${start.x} ${start.y} ${outline.join(" ")} Z ${hole}`,
    };
  })();

  // one wheel group, front side and back creating 3D look
  const layers = (() => {
    const count = 2; // knob
    const gap = 15; // knob
    return cascadeLayout({
      groupWidth: wheel.size + gap * (count - 1),
      heightToWidthRatio: 1,
      angle: deg(-15),
      // angle: deg(0),
      count,
      gapX: gap,
      gapY: gap,
      side: "left", // front copy is the lowest and furthest right
    });
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="block max-w-2xl w-full mx-auto"
    >
      {/* debug: the viewbox's edges */}
      <rect
        className="svg-debug"
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
      <g transform={layers.transform}>
        {layers.items.map((item, i) => (
          <path
            key={i}
            transform={`translate(${item.x}, ${item.y})`}
            d={gear.d}
            fillRule="evenodd"
            fill={item.isFront ? "var(--accent-ink)" : "var(--accent-dim)"}
            stroke="var(--accent)"
            strokeWidth={1}
          />
        ))}
      </g>
    </svg>
  );
}
