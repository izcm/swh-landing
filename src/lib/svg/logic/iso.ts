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

  const depth = size / (1 / Math.tan(radA) + 1 / Math.tan(radB)); // see DEPTH.png

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
    a: { run: runA, edgeLength: edgeLengthA, angle: angleA },
    b: { run: runB, edgeLength: edgeLengthB, angle: angleB },
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
  const depth = Math.tan((angle * Math.PI) / 180) * size;

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

// a platform with a panel standing on its top face. the panel stands
// `towardBack` along the left→back edge (which grid line), then `towardFront`
// along that grid line. positions are measured from the platform's top-left;
// `sticksUp` is how far the panel reaches above that, `height` is the whole card
export function platformCardMetrics({
  platformSize,
  platformThickness,
  angles,
  panelSize,
  panelThickness,
  side,
  towardBack,
  towardFront,
}: {
  platformSize: number;
  platformThickness: number;
  angles: { angleA: number; angleB: number };
  panelSize: number;
  panelThickness: number;
  // which edge direction the panel stands along:
  // "a" = slopes DOWN at angle A, "b" = slopes UP at angle B
  // side: "a" | "b";
  towardBack: number; // 0..1 along the left→back edge (which grid line)
  towardFront: number; // 0..1 along that grid line toward the front
}) {
  const platform = isoCubeMetrics(platformSize, platformThickness, angles);
  // the panel's slope. also the skew for anything drawn on it
  // const panelAngle = side === "a" ? angles.angleA : -angles.angleB;
  const panelAngle = angles.angleA;

  const panel = panelPoints({
    size: panelSize,
    thickness: panelThickness,
    angle: panelAngle,
  });

  // where the panel's bottom-left stands, from the platform's top-left
  const { depth, a, b } = platform;
  const panelStart = {
    x: b.run * towardBack + a.run * towardFront,
    y: depth - depth * towardBack + depth * towardFront,
  };

  // how far the panel reaches above the platform's top. if its top edge slopes
  // up (negative depth), its right side is the highest point, depth higher
  const sticksUp = panelThickness - panelStart.y - Math.min(0, panel.depth);
  // the whole card: platform + the part of the panel above it
  const height = platform.height + sticksUp;

  return {
    platform,
    panel,
    panelAngle,
    panelStart,
    panelThickness,
    angles,
    sticksUp,
    height,
  };
}
