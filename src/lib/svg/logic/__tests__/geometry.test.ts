import { describe, expect, it } from "vitest";

import { donutArcs, pointOnLine } from "../geometry";

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

describe("donutArcs", () => {
  it("gives each value its share of a full turn", () => {
    const [a, b] = donutArcs([1, 1]);
    expect(a.endAngle - a.startAngle).toBeCloseTo(Math.PI);
    expect(b.endAngle - b.startAngle).toBeCloseTo(Math.PI);
  });

  it("starts each slice where the previous one ends", () => {
    const [a, b, c] = donutArcs([5, 3, 2]);
    expect(b.startAngle).toBeCloseTo(a.endAngle);
    expect(c.startAngle).toBeCloseTo(b.endAngle);
    expect(c.endAngle).toBeCloseTo(2 * Math.PI);
  });

  it("shifts everything by startAngle", () => {
    const [a] = donutArcs([1, 1], -Math.PI / 2);
    expect(a.startAngle).toBeCloseTo(-Math.PI / 2);
    expect(a.endAngle).toBeCloseTo(Math.PI / 2);
  });

  it("leaves gapAngle between slices and still fits in one turn", () => {
    const [a, b] = donutArcs([1, 1], 0, 0.2);
    expect(b.startAngle - a.endAngle).toBeCloseTo(0.2);
    expect(b.endAngle + 0.2).toBeCloseTo(2 * Math.PI);
  });
});

describe("roundedPolygonPath", () => {
  it.todo("square: starts at M, one Q per corner, ends with Z");
  it.todo(
    "slanted shape: before/after points are exactly radius from each corner",
  );
});
