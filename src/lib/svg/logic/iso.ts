import { deg } from "./geometry";
import type { IsoBox, Point } from "./types";

// angle = how steep the roof edges slope from horizontal, in radians.
// deg(30) is true isometric; smaller = flatter roof, bigger = steeper roof
export const isoCubeMetrics = (
  size: number,
  thickness?: number,
  // left / right roof-edge slopes. angleB defaults to angleA (a true iso cube)
  { angleA = deg(30), angleB = angleA }: { angleA?: number; angleB?: number } = {},
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

  const roofTop = { x: b.run, y: 0 };
  const roofLeft = { x: 0, y: depth };
  const roofRight = { x: 100, y: depth };
  const roofBottom = { x: a.run, y: depth * 2 };

  const down = (p: Point) => ({ x: p.x, y: p.y + verticalHeight });

  return {
    scale,
    depth,
    verticalHeight,
    roofTop,
    roofLeft,
    roofRight,
    roofBottom,
    // floorTop is straight below roofTop
    floorTop: down(roofTop),
    floorLeft: down(roofLeft),
    floorRight: down(roofRight),
    floorBottom: down(roofBottom),
  };
}

// a flat panel standing on its left edge, its top edge sloping down at `angle`.
// thickness = how tall its vertical edges are; the right side sits `depth`
// lower, so the whole panel is thickness + depth tall. corners measured from
// its top-left
export function panelPoints({
  size,
  thickness,
  angle,
}: {
  size: number;
  thickness: number;
  angle: number;
}) {
  // tan(angle) = depth / size -> depth = tan(angle) * size
  const depth = Math.tan(angle) * size;

  return {
    // how much lower the right side is than the left. one number for the whole panel
    depth,
    corners: {
      topLeft: { x: 0, y: 0 } as Point,
      topRight: { x: size, y: depth } as Point,
      bottomRight: { x: size, y: thickness + depth } as Point,
      bottomLeft: { x: 0, y: thickness } as Point,
    },
  };
}
