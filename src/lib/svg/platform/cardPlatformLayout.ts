import { boundingBox, pointOnLine } from "../logic";
import { platformCorners } from "./Platform";

const rad = (deg: number) => (deg * Math.PI) / 180;

// a platform with a card standing upright on its center: all the math.
// everything is measured from the bounding box's top-left once you
// translate by (originX, originY)
export function cardPlatformLayout({
  size,
  angleA, // left to bottom corner (bottom corner is top.front)
  angleB,
  thickness,
  cardSize,
  spanBToARatio = 1,
}: {
  size: number; // the platform's side edge (lengthA)
  angleA: number; // the side edges' angle
  angleB: number; // the front edge's angle
  thickness: number; // the platform's thickness
  cardSize: { width: number; height: number }; // the card, as parts of the side edge
  spanBToARatio?: number; // edge B's x-width ÷ edge A's x-width. 1 = front tip halfway across
}) {
  // the platform: side edge first, then a front edge whose x-width is a part of the side edge's
  const platform = (() => {
    const lengthA = size;
    // how far the side edge goes in x
    const sideX = lengthA * Math.cos(rad(angleA));
    // how far the front edge should go in x
    const frontX = sideX * spanBToARatio;
    // make the front edge long enough to go that far in x
    const lengthB = frontX / Math.cos(rad(angleB));

    return { lengthA, lengthB, angleA, angleB, thickness };
  })();
  const corners = platformCorners(platform);
  const center = pointOnLine(corners.top.left, corners.top.right, 0.5);

  // the card: standing on the center, slanted along the side edge (angleA)
  const card = (() => {
    const angle = platform.angleA;
    const slope = Math.tan(rad(angle));
    const width = platform.lengthA * cardSize.width * Math.cos(rad(angle));
    const height = platform.lengthA * cardSize.height;

    // its top-left, so that its bottom middle (after skewY) lands on the center
    const x = center.x - width / 2;
    const y = center.y - (height + (width / 2) * slope);

    // its 4 corners after skewY, in the platform's coordinates
    const outline = [
      { x, y },
      { x: x + width, y: y + width * slope },
      { x: x + width, y: y + width * slope + height },
      { x, y: y + height },
    ];

    return { x, y, width, height, angle, outline };
  })();

  // the real box around platform + card (a soft shadow stays outside it)
  const bounds = boundingBox([
    ...Object.values(corners.top),
    ...Object.values(corners.bottom),
    ...card.outline,
  ]);

  return {
    groupWidth: bounds.width,
    groupHeight: bounds.height,
    // shifts the content so the bounding box's top-left is (0, 0)
    originX: -bounds.x,
    originY: -bounds.y,
    platform,
    corners,
    center,
    card,
  };
}
