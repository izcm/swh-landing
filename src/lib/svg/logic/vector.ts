import type { Point } from "./types";

// a vector times a number: the same line, `factor` times as long.
// -1 flips it to point the other way
export const scaleVector = (v: Point, factor: number): Point => ({
  x: v.x * factor,
  y: v.y * factor,
});

// a point moved by a vector
export const addVector = (p: Point, v: Point): Point => ({
  x: p.x + v.x,
  y: p.y + v.y,
});
