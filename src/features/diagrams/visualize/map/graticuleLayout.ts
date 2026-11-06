import { deg, pointOnCircle, type Point } from "@/lib/svg";

// a globe grid seen from above its pole: circles around the pole (latitude
// lines) and straight lines out from it (longitude lines). the closer the pole
// is to what's drawn, the more they bend. everything reaches `reach` from the
// pole, so the caller clips it to its frame
export function graticuleLayout({
  pole,
  ringGap,
  rayAngle,
  reach,
}: {
  pole: Point;
  ringGap: number; // distance between the circles
  rayAngle: number; // degrees between the lines out from the pole
  reach: number; // how far from the pole the circles and lines go
}) {
  const rings = Array.from(
    { length: Math.floor(reach / ringGap) },
    (_, i) => ringGap * (i + 1),
  );

  const reachCircle = { centerX: pole.x, centerY: pole.y, radius: reach };
  const rays = Array.from({ length: Math.floor(360 / rayAngle) }, (_, i) =>
    pointOnCircle({ angle: deg(i * rayAngle), circle: reachCircle }),
  );

  return { rings, rays };
}
