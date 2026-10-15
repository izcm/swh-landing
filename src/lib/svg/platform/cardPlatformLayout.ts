import { boundingBox, pointOnLine } from "../logic";
import { platformCorners } from "./Platform";

const rad = (deg: number) => (deg * Math.PI) / 180;

// a platform with a card standing upright on it: all the math.
// everything is measured from the bounding box's top-left once you
// translate by (originX, originY)
export function cardPlatformLayout({
  size,
  angleA, // left to bottom corner (bottom corner is top.front)
  angleB,
  thickness,
  cardSize,
  spanBToARatio = 1,
  cardAngle = angleA,
  cardAt = { alongA: 0.5, alongB: 0.5 },
}: {
  size: number; // the platform's side edge (lengthA)
  angleA: number; // the side edges' angle
  angleB: number; // the front edge's angle
  thickness: number; // the platform's thickness
  cardSize: { width: number; height: number }; // the card, as parts of the side edge
  spanBToARatio?: number; // edge B's x-width ÷ edge A's x-width. 1 = front tip halfway across
  cardAngle?: number; // the card's slant (its bottom edge's angle). angleA if left out = parallel to the A edge
  cardAt?: { alongA: number; alongB: number }; // where the card's bottom middle stands, 0..1 along each edge. the center if left out
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

  // the spot on the platform where the card's bottom middle goes.
  // vectors: u = top.front - top.left (edge A), v = top.back - top.left (edge B)
  // stand = top.left + alongA × u + alongB × v
  const stand = (() => {
    const { left, front, back } = corners.top;
    return {
      x:
        left.x +
        (front.x - left.x) * cardAt.alongA +
        (back.x - left.x) * cardAt.alongB,
      y:
        left.y +
        (front.y - left.y) * cardAt.alongA +
        (back.y - left.y) * cardAt.alongB,
    };
  })();

  // the card: standing on `stand`, slanted at cardAngle
  // drawing: https://claude.ai/artifact/PzmUzo7euSvvmfEJuYsFsM
  const card = (() => {
    const angle = cardAngle;
    const slope = Math.tan(rad(angle)); // units down per 1 across
    // how many x units from the card's left side to its right side:
    // the bottom edge's length × cos(angle)
    const width = platform.lengthA * cardSize.width * Math.cos(rad(angle));
    const height = platform.lengthA * cardSize.height;

    // the card's top-left corner (x, y), so its bottom middle lands on `stand`
    const x = stand.x - width / 2;
    const bottomLeftY = stand.y - (width / 2) * slope; // up to the bottom-left corner
    const y = bottomLeftY - height; // then up by the height

    // its 4 corners after skewY. width × slope = how much lower the right side is
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
