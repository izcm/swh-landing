import { deg } from "./geometry";
import type { IsoBox, Point } from "./types";

// angle = how steep the roof edges slope from horizontal, in radians.
// deg(30) is true isometric; smaller = flatter roof, bigger = steeper roof
export const isoCubeMetrics = (
  size: number,
  thickness?: number,
  // left / right roof-edge slopes. angleB defaults to angleA (a true iso cube)
  {
    angleA = deg(30),
    angleB = angleA,
  }: { angleA?: number; angleB?: number } = {},
) => {
  const depth = size / (1 / Math.tan(angleA) + 1 / Math.tan(angleB)); // see DEPTH.png

  const runA = depth / Math.tan(angleA);
  const runB = depth / Math.tan(angleB);

  // const depth = half * Math.tan(angleA); // how far a roof edge drops (opposite side)
  // const edgeLength = half / Math.cos(angleA); // the roof edge itself (hypotenuse)
  const edgeLengthA = runA / Math.cos(angleA);
  const edgeLengthB = runB / Math.cos(angleB);

  const height = depth * 2 + (thickness ?? edgeLengthA); // roof diamond + walls

  // return for convenience
  const finalThickness = thickness ?? size;

  return {
    size,
    depth,
    height,
    thickness: finalThickness,
    // each roof edge: how far it goes sideways (run) and how long it is
    a: { run: runA, edgeLength: edgeLengthA, angle: angleA },
    b: { run: runB, edgeLength: edgeLengthB, angle: angleB },
    edgeLength: edgeLengthA, // existing code still reads this
  };
};

// centers of the roof and floor diamonds, measured from the box's top-left (its x/y)
export const isoRoofCenter = (box: IsoBox): Point => ({
  x: box.size / 2,
  y: box.depth,
});

export const isoFloorCenter = (box: IsoBox): Point => ({
  x: box.size / 2,
  y: box.height - box.depth,
});

// the x/y to give `box` so its floor center stands on `point`
export const standOn = (point: Point, box: IsoBox): Point => {
  const floor = isoFloorCenter(box);
  return { x: point.x - floor.x, y: point.y - floor.y };
};
