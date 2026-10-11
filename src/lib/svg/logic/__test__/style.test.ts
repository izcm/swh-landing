import { describe, expect, it } from "vitest";

import { accentGlow } from "../style";

describe("glyphStroke", () => {
  it.todo("returns weight unchanged at the native 24px size");
  it.todo(
    "scales weight so the visible thickness stays the same at other sizes",
  );
});

describe("accentGlow", () => {
  it("builds a drop-shadow in the accent hue", () => {
    expect(accentGlow(4, 12)).toBe(
      "drop-shadow(0 0 4px oklch(from var(--accent) 0.55 0.12 h / 12%))",
    );
  });
});
