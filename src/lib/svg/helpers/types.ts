export type Point = { x: number; y: number };

// props most svg pieces take: where to draw it, and its edge + face colors
export type ShapeProps = Partial<Point> & {
  stroke?: string;
  fill?: string;
};

// anything iso-shaped (one cube or a group of them): width across, full height,
// and how far its top / bottom diamond drops. isoCubeMetrics returns this shape
export type IsoBox = { size: number; height: number; depth: number };

// stroke: edge color, defaults to the accent gradient.
// fill: face color, defaults to the dark glass fill
export type IsoCubeBaseProps = ShapeProps & {
  size?: number;
  // further back in the stack: faded, with a fainter glow
  ghost?: boolean;
  // face fill only — edges stay at full strength
  surfaceOpacity?: number;
  // edges meeting at the hidden back-bottom corner, seen through the faces
  showBackEdges?: boolean;
  // height of the vertical sides, in the same units as size. defaults to a true cube;
  // pass something small for a flat slab / platform
  thickness?: number;
  // slope of the top edges in degrees. 30 = true isometric
  // angle?: number;

  angleB?: number;
  angleA?: number;
  // the vertical edge where the left and right faces meet (topFront → bottomFront)
  showFrontEdge?: boolean;
};
