import { describe, expect, it } from "vitest";

import {
  accentGlow,
  centerInParent,
  pointOnLine,
  spaceAround,
  spaceBetween,
  spaceEvenly,
} from "../svg/helpers";

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

describe("spaceBetween", () => {
  it("puts the first item at start and the last item's end at end", () => {
    expect(spaceBetween(0, 2, 20, 0, 100)).toBe(0);
    expect(spaceBetween(1, 2, 20, 0, 100) + 20).toBe(100);
  });

  it("returns start for a single item", () => {
    expect(spaceBetween(0, 1, 20, 10, 100)).toBe(10);
  });
});

describe("spaceEvenly", () => {
  it("leaves equal gaps before, between and after", () => {
    // free space 60 split into 3 gaps of 20
    expect(spaceEvenly(0, 2, 20, 0, 100)).toBe(20);
    expect(spaceEvenly(1, 2, 20, 0, 100)).toBe(60);
  });
});

describe("spaceAround", () => {
  it("gives each item an equal gap around it (half-gaps at the ends)", () => {
    // free space 60 → 30 per item, 15 on each side
    expect(spaceAround(0, 2, 20, 0, 100)).toBe(15);
    expect(spaceAround(1, 2, 20, 0, 100)).toBe(65);
  });
});

describe("centerInParent", () => {
  it("centers the item and reports its center in absolute coordinates", () => {
    expect(centerInParent(100, 40, 10)).toEqual({
      translateY: 30,
      relativeCenterY: 20,
      absoluteCenterY: 60,
    });
  });
});

describe("glyphStroke", () => {
  it.todo("returns weight unchanged at the native 24px size");
  it.todo("scales weight so the visible thickness stays the same at other sizes");
});

describe("accentGlow", () => {
  it("builds a drop-shadow in the accent hue", () => {
    expect(accentGlow(4, 12)).toBe(
      "drop-shadow(0 0 4px oklch(from var(--accent) 0.55 0.12 h / 12%))",
    );
  });
});
