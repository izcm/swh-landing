import { describe, expect, it } from "vitest";

import { boxCorners } from "../../layouts/3d/box/boxCorners";
import { deg } from "../geometry";
import { isoCubeEdgeVectors, isoCubeMetrics } from "../iso";
import { addVector } from "../vector";

describe("isoCubeEdgeVectors", () => {
  // different angles, so a mixed-up a / b shows
  const cube = isoCubeMetrics(100, undefined, {
    angleA: deg(25),
    angleB: deg(35),
  });
  const { edgeA, edgeB } = isoCubeEdgeVectors(cube);

  const { roof } = boxCorners({
    lengthA: cube.a.edgeLength,
    lengthB: cube.b.edgeLength,
    angleA: cube.a.angle,
    angleB: cube.b.angle,
    thickness: cube.thickness,
  });

  // decimals that must match
  const precision = 10;

  it("edgeA goes from roof.left to roof.bottom", () => {
    const end = addVector(roof.left, edgeA);
    expect(end.x).toBeCloseTo(roof.bottom.x, precision);
    expect(end.y).toBeCloseTo(roof.bottom.y, precision);
  });

  it("edgeB goes from roof.bottom to roof.right", () => {
    const end = addVector(roof.bottom, edgeB);
    expect(end.x).toBeCloseTo(roof.right.x, precision);
    expect(end.y).toBeCloseTo(roof.right.y, precision);
  });

  it("edgeA then edgeB spans the cube's width, back at the same height", () => {
    const end = addVector(edgeA, edgeB);
    expect(end.x).toBeCloseTo(cube.size, precision);
    expect(end.y).toBeCloseTo(0, precision);
  });
});
