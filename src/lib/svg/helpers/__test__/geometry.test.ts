import { describe, expect, it } from "vitest";

import { pointOnLine } from "../geometry";

describe("pointOnLine", () => {
  const A = { x: 0, y: 28.9 };
  const B = { x: 50, y: 0 };

  it("returns A at t = 0", () => {
    expect(pointOnLine(A, B, 0)).toEqual(A);
  });

  it("returns B at t = 1", () => {
    expect(pointOnLine(A, B, 1)).toEqual(B);
  });

  it("returns the midpoint at t = 0.5", () => {
    const mid = pointOnLine(A, B, 0.5);
    expect(mid.x).toBeCloseTo(25);
    expect(mid.y).toBeCloseTo(14.45);
  });
});

describe("roundedPolygonPath", () => {
  it.todo("square: starts at M, one Q per corner, ends with Z");
  it.todo(
    "slanted shape: before/after points are exactly radius from each corner",
  );
});
