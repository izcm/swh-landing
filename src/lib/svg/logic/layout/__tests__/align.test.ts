import { describe, expect, it } from "vitest";

import { alignCenter, placeItemCenter } from "../align";

describe("alignCenter", () => {
  it("centers the item and reports its center in absolute coordinates", () => {
    expect(alignCenter(100, 40, 10)).toEqual({
      offset: 30,
      relativeCenter: 20,
      absoluteCenter: 60,
    });
  });
});

describe("placeItemCenter", () => {
  it("centers a smaller item on both axes", () => {
    expect(
      placeItemCenter({
        parentWidth: 100,
        parentHeight: 60,
        itemWidth: 40,
        itemHeight: 20,
      }),
    ).toEqual({ offsetX: 30, offsetY: 20 });
  });

  it("gives 0, 0 for an item as big as its parent", () => {
    expect(
      placeItemCenter({
        parentWidth: 50,
        parentHeight: 50,
        itemWidth: 50,
        itemHeight: 50,
      }),
    ).toEqual({ offsetX: 0, offsetY: 0 });
  });

  it("goes negative for a bigger item, so it sticks out equally on each side", () => {
    expect(
      placeItemCenter({
        parentWidth: 10,
        parentHeight: 10,
        itemWidth: 20,
        itemHeight: 30,
      }),
    ).toEqual({ offsetX: -5, offsetY: -10 });
  });
});
