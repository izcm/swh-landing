import { arcPath, pointOnCircle, pointOnLine, type Point } from "../../logic";
import { cascadeLayout } from "../arrange/cascadeLayout";
import { radialLayout } from "../arrange/radialLayout";
import { isoTrapezoidCorners } from "../shapes/isoTrapezoidCorners";

// a 3D gear: a front face, a back face `depth` up and to the left of it, the
// side walls between them, all tilted by skewY(tilt). measured from the gear's
// own top-left. draw it with <Gear>
export function gearLayout({
  radius,
  teethCount,
  toothHeight,
  toothShare,
  toothLean,
  holeRadius,
  holeRingRadius,
  depth,
  tilt,
}: {
  radius: number; // the rim, without the teeth
  teethCount: number;
  toothHeight: number; // how far the teeth stick out past the rim
  toothShare: number; // how much of its segment each tooth covers (0.5 = half)
  toothLean: number; // how far each tooth's sides lean in, away from straight out
  holeRadius: number;
  holeRingRadius: number; // the decorative ring around the hole
  depth: number; // how far the back face sits to the left and up
  tilt: number; // the whole gear's skewY angle
}) {
  // one face, measured inside its own square (teeth included)
  const wheel = (() => {
    const size = 2 * (radius + toothHeight);
    return { radius, size, centerX: size / 2, centerY: size / 2 };
  })();

  const segments = radialLayout({
    values: Array.from({ length: teethCount }, () => 1),
  });

  const startTooth = (s: (typeof segments)[number]) =>
    s.midAngle + (s.startAngle - s.midAngle) * toothShare;

  const endTooth = (s: (typeof segments)[number]) =>
    s.midAngle + (s.endAngle - s.midAngle) * toothShare;

  // each tooth's 4 corners, one entry per segment
  const teeth = segments.map((s) => {
    const rim = pointOnCircle({ angle: startTooth(s), circle: wheel });
    const rimEnd = pointOnCircle({ angle: endTooth(s), circle: wheel });
    return isoTrapezoidCorners({
      bottomCenter: pointOnLine(rim, rimEnd, 0.5),
      lengthA: Math.hypot(rimEnd.x - rim.x, rimEnd.y - rim.y),
      lengthB: toothHeight,
      angleA: s.midAngle + Math.PI / 2, // along the rim
      angleB: s.midAngle + toothLean, // out from the wheel, leaning in
    });
  });

  // the rim between each tooth and the next: from where it ends to where the
  // next one starts (the last one wraps round to the first tooth)
  const gaps = segments.map((s, i) => {
    const isLast = i === segments.length - 1;
    const next = segments[isLast ? 0 : i + 1];
    return {
      from: endTooth(s),
      to: startTooth(next) + (isLast ? 2 * Math.PI : 0),
    };
  });

  // a path fillRule counts the shapes inside one path d's
  // one shape is everything from one M to the next, called a "subpath"
  // "evenodd" fills every other shape
  const face = (() => {
    const rimTo = (angle: number) => {
      const p = pointOnCircle({ angle, circle: wheel });
      return `A ${radius} ${radius} 0 0 1 ${p.x} ${p.y}`;
    };

    // per tooth: out, across, back in at the rim, then along the gap to the next tooth
    const outline = teeth.map((corners, i) =>
      [
        ...[corners[3], corners[2], corners[1]].map((p) => `L ${p.x} ${p.y}`),
        rimTo(gaps[i].to),
      ].join(" "),
    );

    // where the first tooth meets the rim
    const start = teeth[0][0];
    const hole = arcPath({ ...wheel, radius: holeRadius }, 0, 2 * Math.PI);

    return { d: `M ${start.x} ${start.y} ${outline.join(" ")} Z ${hole}` };
  })();

  // the front and the back face, front creating the 3D look
  const layers = cascadeLayout({
    groupWidth: wheel.size + depth,
    heightToWidthRatio: 1,
    angle: tilt,
    count: 2, // front and back
    gapX: depth,
    gapY: depth,
    side: "left", // front copy is the lowest and furthest right
  });

  // from the front face to the back one: side "left" puts the front gapX
  // right and gapY down from the back
  const offset = { x: -layers.gapX, y: -layers.gapY };

  // the side walls from the front face to the back one: one per straight
  // tooth edge and one per gap, each joining the piece on the front to the
  // same piece on the back
  const walls = (() => {
    const behind = (p: Point) => ({ x: p.x + offset.x, y: p.y + offset.y });
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

    // per tooth: its 3 straight edges, then the gap to the next tooth
    return teeth.flatMap(([c0, c1, c2, c3], i) => [
      flat(c0, c3),
      flat(c3, c2),
      flat(c2, c1),
      curved(gaps[i].from, gaps[i].to),
    ]);
  })();

  return {
    // the whole gear's box, before the tilt
    groupWidth: wheel.size + depth,
    groupHeight: layers.stackHeight,

    // ready to draw
    transform: layers.transform,
    items: layers.items, // the back face, then the front face
    faceD: face.d,
    walls,

    // the pieces the drawing is made from, for anything else that needs them
    center: { x: wheel.centerX, y: wheel.centerY },
    radius,
    holeRadius,
    holeRingRadius,
    teeth, // each tooth's 4 corners
    gaps, // the rim between teeth, as { from, to } angles
    offset, // from the front face to the back one
  };
}
