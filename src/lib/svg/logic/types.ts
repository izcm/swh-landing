export type Point = { x: number; y: number };

// props most svg pieces take: where to draw it, and its edge + face colors
export type ShapeProps = Partial<Point> & {
  stroke?: string;
  fill?: string;
};

// anything iso-shaped (one cube or a group of them): width across, full height,
// and how far its roof / floor diamond drops. isoCubeMetrics returns this shape
export type IsoBox = { size: number; height: number; depth: number };
