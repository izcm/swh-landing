import type { Point } from "@/lib/svg";
import { isAboveOrBelowCube } from "./connectors";
import type { heroLayout } from "./layout";

type Layout = ReturnType<typeof heroLayout>;
type RingCenter = { centerX: number; centerY: number };

// the snail's points: `startPoint` first, then one point per platform
// (its center, pushed out from or in toward the ring's center), then `endPoint`
export function heroSnailPoints(
  { orbit, centerpiece }: Layout,
  ringCenter: RingCenter,
  startPoint: Point,
  endPoint: Point,
): Point[] {
  const { depth } = orbit.platform;

  const platformPoints = orbit.platformCenterPoints.map((center) => {
    // the cube's middle y is the ring's center y, so this matches connectors.ts
    const isLower = center.y > ringCenter.centerY;
    const isAboveOrBelow = isAboveOrBelowCube(center, centerpiece);

    const radiusChange = isAboveOrBelow
      ? isLower
        ? -depth * 0.25
        : depth
      : isLower
        ? depth * 0.25
        : depth;

    // arrow from the ring's center to the platform center,
    // then made `radiusChange` longer along the same direction
    const toCenter = {
      x: center.x - ringCenter.centerX,
      y: center.y - ringCenter.centerY,
    };
    const distance = Math.hypot(toCenter.x, toCenter.y);
    const scale = (distance + radiusChange) / distance;

    return {
      x: ringCenter.centerX + toCenter.x * scale,
      y: ringCenter.centerY + toCenter.y * scale,
    };
  });

  // platforms come top → left → bottom; the snail goes the other way round
  return [startPoint, ...platformPoints.reverse(), endPoint];
}
