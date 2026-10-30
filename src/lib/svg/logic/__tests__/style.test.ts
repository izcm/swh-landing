import { describe, expect, it } from "vitest";

import { accentGlow, glyphStroke } from "../style";

describe("glyphStroke", () => {
  it("returns weight unchanged at the native 24px size (lucide react icon)", () => {
    expect(glyphStroke(24, 1.5, 24)).toBe(1.5);
  });

  it("scales weight so the visible thickness stays the same at other sizes", () => {
    // the shape's box is stretched by size / box, and the stroke with it
    const box = 24;
    for (const size of [12, 48, 100]) {
      expect(glyphStroke(size, 2, box) * (size / box)).toBeCloseTo(2);
    }
  });
});

describe("accentGlow", () => {
  it("builds a drop-shadow in the accent hue", () => {
    expect(accentGlow(4, 12)).toBe(
      "drop-shadow(0 0 4px oklch(from var(--accent) 0.55 0.12 h / 12%))",
    );
  });
});
