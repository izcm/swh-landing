export type Point = { x: number; y: number };

// props most svg pieces take: where to draw it, and its edge + face colors
export type ShapeProps = Partial<Point> & {
  stroke?: string;
  fill?: string;
};
