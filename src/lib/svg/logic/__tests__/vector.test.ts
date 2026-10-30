import { describe, expect, it } from "vitest";

import { addVector, scaleVector } from "../vector";

describe("scaleVector", () => {
  const v = { x: 3, y: -4 };

  it("makes it factor times as long", () => {
    expect(scaleVector(v, 2)).toEqual({ x: 6, y: -8 });
  });

  it("flips it to point the other way at -1", () => {
    expect(scaleVector(v, -1)).toEqual({ x: -3, y: 4 });
  });

  it("leaves it as it is at 1", () => {
    expect(scaleVector(v, 1)).toEqual(v);
  });
});

describe("addVector", () => {
  const p = { x: 10, y: 20 };

  it("moves the point by the vector", () => {
    expect(addVector(p, { x: 5, y: -15 })).toEqual({ x: 15, y: 5 });
  });

  it("leaves the point where it is with a zero vector", () => {
    expect(addVector(p, { x: 0, y: 0 })).toEqual(p);
  });

  it("comes back to the start after adding the flipped vector", () => {
    const v = { x: 7, y: 3 };
    expect(addVector(addVector(p, v), scaleVector(v, -1))).toEqual(p);
  });
});
