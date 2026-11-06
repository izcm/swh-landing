import { boxCorners, diamondPath, type Point } from "@/lib/svg";

// a diamond floor of diamond tiles, its middle at `center`
export function floorLayout({
  center,
  tileLength,
  tilesPerEdge,
  angle,
}: {
  center: Point;
  tileLength: number;
  tilesPerEdge: number;
  angle: number;
}) {
  const tile = (() => {
    const { roof: corners } = boxCorners({
      lengthA: tileLength,
      lengthB: tileLength,
      angleA: angle,
      angleB: angle,
      thickness: 0,
    });
    const d = diamondPath(corners);

    return { corners, d };
  })();

  const floorEdgeLength = tileLength * tilesPerEdge;
  const { roof: floorCorners } = boxCorners({
    lengthA: floorEdgeLength,
    lengthB: floorEdgeLength,
    angleA: angle,
    angleB: angle,
    thickness: 0,
  });
  const d = diamondPath(floorCorners);

  const floorWidth = floorCorners.right.x;
  const floorHeight = floorCorners.bottom.y;
  const floorMiddle = { x: floorWidth * 0.5, y: floorCorners.left.y };

  const translateX = center.x - floorMiddle.x;
  const translateY = center.y - floorMiddle.y;

  // a tile corner on the floor's left corner, so the tiles fill the floor exactly
  const patternX = floorCorners.left.x;
  const patternY = floorCorners.left.y - tile.corners.left.y;

  // the circle that fits inside the floor, flattened like it
  const fade = {
    cx: floorMiddle.x,
    cy: floorMiddle.y,
    r: floorMiddle.x / Math.SQRT2,
    squash: Math.tan(angle),
  };

  return {
    tile,
    d,
    width: floorWidth,
    height: floorHeight,
    translateX,
    translateY,
    patternX,
    patternY,
    fade,
  };
}
