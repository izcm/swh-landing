import { dropAlongEdge, toDegrees } from "../../logic";

// a cascade: `count` items stepping back one behind the other, each one gapX
// right and gapY down from the last, all skewed by skewY(angle).
// angle > 0 tilts down to the right, angle < 0 up to the right.
// draw it as: <g transform={transform}> one <g> per entry in `items` </g>
export function cascadeLayout({
  groupWidth,
  heightToWidthRatio = 0.667,
  angle,
  count,
  gapX,
  gapY,
  side,
}: {
  groupWidth: number;
  heightToWidthRatio?: number;
  angle: number;
  count: number;
  gapX: number;
  gapY: number;
  // which side the back items stick out on
  side: "left" | "right";
}) {
  // item i's x. "right": count backwards so the back item is furthest right
  const windowX = (i: number) => (side === "right" ? count - 1 - i : i) * gapX;

  // keep AppWindow's 300:200 aspect ratio
  const itemWidth = groupWidth - gapX * (count - 1);
  const itemHeight = itemWidth * heightToWidthRatio;

  // every item's corners after the skew: y + x · tan(angle)
  const skewedYs = Array.from({ length: count }).flatMap((_, i) => {
    const leftX = windowX(i); // left X coordinates
    const topY = i * gapY;
    return [leftX, leftX + itemWidth].flatMap((x) =>
      [topY, topY + itemHeight].map(
        (y) => y + dropAlongEdge({ run: x, angle }),
      ),
    );
  });
  const highest = Math.min(...skewedYs);
  const lowest = Math.max(...skewedYs);
  const stackHeight = lowest - highest;
  const toTop = -highest;

  // every item, back to front: where it goes (in the skewed group's coords),
  // its size, and how far toward the front it is (0 = back, 1 = front)
  const items = Array.from({ length: count }).map((_, i) => ({
    x: windowX(i),
    y: i * gapY,
    width: itemWidth,
    height: itemHeight,
    depth: count > 1 ? i / (count - 1) : 1,
    isFront: i === count - 1,
  }));

  return {
    angle,
    count,
    gapX,
    gapY,
    item: { width: itemWidth, height: itemHeight },
    // top-left of the front item, in the skewed group's coords
    front: { x: windowX(count - 1), y: (count - 1) * gapY },
    windowX,
    stackHeight,
    toTop,
    // the whole cascade's slant, lifted so its highest corner is at y = 0
    transform: `skewY(${toDegrees(angle)}) translate(0, ${toTop})`,
    items,
  };
}
