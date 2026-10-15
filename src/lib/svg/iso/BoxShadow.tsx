import type { Point } from "../logic";

// soft shadow under a box: its bottom outline, moved `drop` lower and blurred.
// stays put while the box bobs (float-bob), and shrinks + fades in step with it
// when given the same duration / delay.
// corners: the box's bottom corners, in order around the outline.
// scale: when the corners are in a smaller box than they're drawn at
// (ISOCube's 100-wide box); 1 = real units
export function BoxShadow({
  x = 0,
  y = 0,
  corners,
  scale = 1,
  drop,
  duration,
  delay,
  still = false, // true = a still shadow that doesn't bob with a float-bob box
}: Partial<Point> & {
  corners: Point[];
  scale?: number;
  drop: number; // how far below the box the shadow sits
  duration?: string; // match the box's --float-duration
  delay?: string; // match the box's --float-delay
  still?: boolean;
}) {
  const points = corners
    .map((p) => `${x + p.x * scale},${y + p.y * scale + drop}`)
    .join(" ");

  return (
    <polygon
      className={still ? undefined : "float-shadow"}
      points={points}
      fill="black"
      fillOpacity={0.4}
      style={{
        filter: "blur(4px)",
        animationDuration: duration,
        animationDelay: delay,
      }}
    />
  );
}
