import { describe, expect, it } from "vitest";

import { paddedBox } from "../pad";

describe("paddedBox", () => {
  it("measures padding in 1/12 of its height by default", () => {
    const box = paddedBox(200, 120, 1, 2); // unit = 120 / 12 = 10
    expect(box.unit).toBe(10);
    expect(box.paddingX).toBe(10);
    expect(box.paddingY).toBe(20);
    expect(box.contentWidth).toBe(180);
    expect(box.contentHeight).toBe(80);
  });

  it("measures padding in the unit passed in", () => {
    const box = paddedBox(200, 120, 1, 2, 5);
    expect(box.unit).toBe(5);
    expect(box.paddingX).toBe(5);
    expect(box.paddingY).toBe(10);
    expect(box.contentWidth).toBe(190);
    expect(box.contentHeight).toBe(100);
  });
});
