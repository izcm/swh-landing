import { describe, expect, it } from "vitest";

import {
  centerInParent,
  spaceAround,
  spaceBetween,
  spaceEvenly,
} from "../layout";

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
