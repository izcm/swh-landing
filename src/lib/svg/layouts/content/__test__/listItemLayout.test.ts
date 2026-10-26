import { describe, expect, it } from "vitest";

import { listItemLayout } from "../listItemLayout";

describe("listItemLayout", () => {
  it("puts the text after the circle and centers both on the row", () => {
    const { leading, text } = listItemLayout({
      height: 20,
      leadingInset: 2,
      leadingRadius: 4,
      gap: 3,
      lineHeights: [2, 2],
      lineGap: 2,
    });
    expect(leading).toEqual({ cx: 6, cy: 10, radius: 4 });
    expect(text.x).toBe(13); // 2 + 4 + 4 + 3
    expect(text.y).toBe(7); // a 6-tall block centered in 20
    expect(text.lineStarts).toEqual([0, 4]);
  });
});
