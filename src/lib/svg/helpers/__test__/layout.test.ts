import { describe, expect, it } from "vitest";

import { alignCenter, spaceAround, spaceBetween, spaceEvenly } from "../layout";

// two 20-wide items on a 0 → 100 line
const two = { itemCount: 2, itemSize: 20, start: 0, end: 100 };

describe("spaceBetween", () => {
  it("puts the first item at start and the last item's end at end", () => {
    expect(spaceBetween({ ...two, index: 0 })).toBe(0);
    expect(spaceBetween({ ...two, index: 1 }) + 20).toBe(100);
  });

  it("returns start for a single item", () => {
    expect(
      spaceBetween({
        index: 0,
        itemCount: 1,
        itemSize: 20,
        start: 10,
        end: 100,
      }),
    ).toBe(10);
  });
});

describe("spaceEvenly", () => {
  it("leaves equal gaps before, between and after", () => {
    // free space 60 split into 3 gaps of 20
    expect(spaceEvenly({ ...two, index: 0 })).toBe(20);
    expect(spaceEvenly({ ...two, index: 1 })).toBe(60);
  });
});

describe("spaceAround", () => {
  it("gives each item an equal gap around it (half-gaps at the ends)", () => {
    // free space 60 → 30 per item, 15 on each side
    expect(spaceAround({ ...two, index: 0 })).toBe(15);
    expect(spaceAround({ ...two, index: 1 })).toBe(65);
  });
});

describe("alignCenter", () => {
  it("centers the item and reports its center in absolute coordinates", () => {
    expect(alignCenter(100, 40, 10)).toEqual({
      translateY: 30,
      relativeCenterY: 20,
      absoluteCenterY: 60,
    });
  });
});
