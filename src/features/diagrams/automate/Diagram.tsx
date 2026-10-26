import {
  accentGlow,
  arcPath,
  cascadeLayout,
  deg,
  isoTrapezoidCorners,
  pointOnCircle,
  pointOnLine,
  type Point,
} from "@/lib/svg";
import { radialLayout } from "@/lib/svg/layouts/arrange/radialLayout";

export function AutomateDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 350;

  const teethCount = 8;

  // === WHEEL MEASUREMENTS INCLUDING TEETH ===
  const wheel = (() => {
    const radius = viewboxHeight * 0.22;

    // how far the teeth stick out past the rim: a gear's "module", made taller
    const toothHeight = ((2 * radius) / teethCount) * 1.2; // knob
    // how much of its segment each tooth covers (0.5 = half)
    const toothShare = 0.6; // knob
    // how far each tooth's sides lean in, away from straight out
    const toothLean = deg(15); // knob
    const holeRadius = radius * 0.55;
    // the decorative ring around the hole
    const holeRingRadius = holeRadius * 1.2; // knob

    // the whole gear, teeth included
    const size = 2 * (radius + toothHeight);
    const centerX = size / 2;
    const centerY = size / 2;

    return {
      radius,
      toothHeight,
      toothShare,
      toothLean,
      holeRadius,
      holeRingRadius,
      size,
      centerX,
      centerY,
    };
  })();

  const segments = radialLayout({
    values: Array.from({ length: teethCount }, () => 1),
  });

  const startTooth = (s: (typeof segments)[number]) =>
    s.midAngle + (s.startAngle - s.midAngle) * wheel.toothShare;

  const endTooth = (s: (typeof segments)[number]) =>
    s.midAngle + (s.endAngle - s.midAngle) * wheel.toothShare;

  // each tooth's 4 corners, one entry per segment
  const teeth = segments.map((s) => {
    const rim = pointOnCircle({ angle: startTooth(s), circle: wheel });
    const rimEnd = pointOnCircle({ angle: endTooth(s), circle: wheel });
    return isoTrapezoidCorners({
      bottomCenter: pointOnLine(rim, rimEnd, 0.5),
      lengthA: Math.hypot(rimEnd.x - rim.x, rimEnd.y - rim.y),
      lengthB: wheel.toothHeight,
      angleA: s.midAngle + Math.PI / 2, // along the rim
      angleB: s.midAngle + wheel.toothLean, // out from the wheel, leaning in
    });
  });

  // a path fillRule counts the shapes inside one path d's
  // one shape is everything from one M to the next, called a "subpath"
  // "evenodd" fills every other shape
  const gear = (() => {
    const { radius } = wheel;
    const rimTo = (angle: number) => {
      const p = pointOnCircle({ angle, circle: wheel });
      return `A ${radius} ${radius} 0 0 1 ${p.x} ${p.y}`;
    };

    const outline = segments.map((s, i) => {
      const corners = teeth[i];

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

  // the side walls from a copy to the one behind it: one per straight tooth
  // edge and one per stretch of rim between two teeth, each joining the piece
  // on this copy to the same piece on the copy behind
  const walls = (() => {
    const { radius } = wheel;
    // side: "left" puts each copy gapX right and gapY down from the one behind
    const behind = (p: Point) => ({
      x: p.x - layers.gapX,
      y: p.y - layers.gapY,
    });
    const onRim = (angle: number) => pointOnCircle({ angle, circle: wheel });

    // a flat wall along the straight edge p → q
    const flat = (p: Point, q: Point) => {
      const [p2, q2] = [behind(p), behind(q)];
      return `M ${p.x} ${p.y} L ${q.x} ${q.y} L ${q2.x} ${q2.y} L ${p2.x} ${p2.y} Z`;
    };

    // a curved wall along the rim, clockwise from angle `from` to angle `to`
    const curved = (from: number, to: number) => {
      const [p, q] = [onRim(from), onRim(to)];
      const [p2, q2] = [behind(p), behind(q)];
      return [
        `M ${p.x} ${p.y}`,
        `A ${radius} ${radius} 0 0 1 ${q.x} ${q.y}`,
        `L ${q2.x} ${q2.y}`,
        `A ${radius} ${radius} 0 0 0 ${p2.x} ${p2.y}`,
        "Z",
      ].join(" ");
    };

    // per tooth: its 3 straight edges, then the rim from its end to the next
    // tooth's start as one wall (the last one wraps round to the first tooth)
    return segments.flatMap((s, i) => {
      const [c0, c1, c2, c3] = teeth[i];
      const isLast = i === segments.length - 1;
      const next = segments[isLast ? 0 : i + 1];
      const nextStart = startTooth(next) + (isLast ? 2 * Math.PI : 0);
      return [
        flat(c0, c3),
        flat(c3, c2),
        flat(c2, c1),
        curved(endTooth(s), nextStart),
      ];
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
        {/* soft blue halo around the whole gear */}
        <g style={{ filter: accentGlow(4, 24) }}>
          {layers.items.map((item, i) => (
            <g key={i} transform={`translate(${item.x}, ${item.y})`}>
              {/* side walls back to the copy behind (the back copy has none) */}
              {i > 0 &&
                walls.map((d, j) => (
                  <path
                    key={j}
                    d={d}
                    fill="oklch(from var(--accent) 0.18 0.07 h)"
                    stroke="oklch(from var(--accent-electric) l c h / 0.35)"
                    strokeWidth={1}
                  />
                ))}
              {/* the front face gets the bright outline, the back one the faint edge */}
              <path
                d={gear.d}
                fillRule="evenodd"
                fill={
                  item.isFront
                    ? "oklch(from var(--accent-ink) calc(l - 0.02) calc(c - 0.01) h)"
                    : "oklch(from var(--accent) 0.18 0.07 h)"
                }
                stroke={
                  item.isFront
                    ? "var(--accent-electric)"
                    : "oklch(from var(--accent-electric) l c h / 0.35)"
                }
                strokeWidth={item.isFront ? 1.25 : 1}
              />
              {/* decorative ring around the hole, on the front face */}
              {item.isFront && (
                <circle
                  cx={wheel.centerX}
                  cy={wheel.centerY}
                  r={wheel.holeRingRadius}
                  fill="none"
                  stroke="oklch(from var(--accent-electric) l c h / 0.25)"
                  strokeWidth={1}
                />
              )}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
