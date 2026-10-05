import type { IsoBox, Point } from "./types";

// angle = how steep the top edges slope from horizontal, in degrees.
// 30 is true isometric; smaller = flatter top, bigger = steeper top
export const isoCubeMetrics = (
  size: number,
  thickness?: number,
  // left / right top-edge slopes. angleB defaults to angleA (a true iso cube)
  { angleA = 30, angleB = angleA }: { angleA?: number; angleB?: number } = {},
) => {
  const radA = (angleA * Math.PI) / 180;
  const radB = (angleB * Math.PI) / 180;

  const depth = size / (1 / Math.tan(radA) + 1 / Math.tan(radB));

  const runA = depth / Math.tan(radA);
  const runB = depth / Math.tan(radB);

  // const depth = half * Math.tan(radA); // how far a top edge drops (opposite side)
  // const edgeLength = half / Math.cos(radA); // the top edge itself (hypotenuse)
  const edgeLengthA = runA / Math.cos(radA);
  const edgeLengthB = runB / Math.cos(radB);

  const height = depth * 2 + (thickness ?? edgeLengthA); // top diamond + walls

  // return for convenience
  const finalThickness = thickness ?? size;

  return {
    size,
    depth,
    height,
    thickness: finalThickness,
    // each top edge: how far it goes sideways (run) and how long it is
    a: { run: runA, edgeLength: edgeLengthA },
    b: { run: runB, edgeLength: edgeLengthB },
    edgeLength: edgeLengthA, // existing code still reads this
  };
};

// centers of the top and bottom diamonds, measured from the box's top-left (its x/y)
export const isoTopCenter = (box: IsoBox): Point => ({
  x: box.size / 2,
  y: box.depth,
});

export const isoBottomCenter = (box: IsoBox): Point => ({
  x: box.size / 2,
  y: box.height - box.depth,
});

// the x/y to give `box` so its bottom center stands on `point`
export const standOn = (point: Point, box: IsoBox): Point => {
  const bottom = isoBottomCenter(box);
  return { x: point.x - bottom.x, y: point.y - bottom.y };
};

// the 8 corners of an iso box, in the 100-wide box it's drawn in (scaled to size afterwards)
export function isoCubePoints(
  size: number,
  thickness: number | undefined,
  angleA: number,
  angleB: number = angleA,
) {
  const scale = size / 100;
  const { depth, edgeLength, a, b } = isoCubeMetrics(100, undefined, {
    angleA,
    angleB,
  });

  // undo the scale so thickness stays in real units; default = true cube
  const verticalHeight =
    thickness !== undefined ? thickness / scale : edgeLength;

  const topBack = { x: b.run, y: 0 };
  const topLeft = { x: 0, y: depth };
  const topRight = { x: 100, y: depth };
  const topFront = { x: a.run, y: depth * 2 };

  const down = (p: Point) => ({ x: p.x, y: p.y + verticalHeight });

  return {
    scale,
    depth,
    verticalHeight,
    topBack,
    topLeft,
    topRight,
    topFront,
    // bottomBack is the hidden corner, straight below topBack
    bottomBack: down(topBack),
    bottomLeft: down(topLeft),
    bottomRight: down(topRight),
    bottomFront: down(topFront),
  };
}
