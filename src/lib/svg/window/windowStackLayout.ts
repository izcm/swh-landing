import { dropAlongEdge } from "@/lib/svg/helpers";

// sizes + positions for WindowStack: `count` app windows stacked back to front,
// each one gapX right and gapY down from the last, all skewed by skewY(angle).
// angle > 0 tilts down to the right, angle < 0 up to the right.
// fills a groupWidth × height box: the skewed stack is centered in it vertically
export function windowStackLayout({
  groupWidth,
  heightToWidthRatio = 0.667,
  angle,
  count,
  gapX,
  gapY,
  side,
}: {
  groupWidth: number;
  groupHeight: number;
  heightToWidthRatio?: number;
  angle: number;
  count: number;
  gapX: number;
  gapY: number;
  // which side the back windows stick out on
  side: "left" | "right";
}) {
  // window i's x. "right": count backwards so the back window is furthest right
  const windowX = (i: number) => (side === "right" ? count - 1 - i : i) * gapX;

  // keep AppWindow's 300:200 aspect ratio
  const itemWidth = groupWidth - gapX * (count - 1);
  const itemHeight = itemWidth * heightToWidthRatio;

  // every window's corners after the skew: y + x · tan(angle)
  const skewedYs = Array.from({ length: count }).flatMap((_, i) => {
    const left = windowX(i);
    const top = i * gapY;
    return [left, left + itemWidth].flatMap((x) =>
      [top, top + itemHeight].map((y) => y + dropAlongEdge({ run: x, angle })),
    );
  });
  const highest = Math.min(...skewedYs);
  const lowest = Math.max(...skewedYs);
  const stackHeight = lowest - highest;

  // const { translateY } = alignCenter(groupHeight, stackHeight);

  return {
    angle,
    count,
    gapX,
    gapY,
    item: { width: itemWidth, height: itemHeight },
    // top-left of the front window, in the skewed group's coords
    front: { x: windowX(count - 1), y: (count - 1) * gapY },
    windowX,
    stackHeight,
    toTop: -highest,
  };
}
