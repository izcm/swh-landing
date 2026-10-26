import { describe, expect, it } from "vitest";
import { radialLayout } from "../radialLayout";

describe("radialLayout", () => {
  it("sizes segments equally for equal values", () => {
    const segments = radialLayout({ values: [1, 1, 1, 1] });

    expect(segments.map((s) => s.endAngle - s.startAngle)).toEqual(
      Array.from({ length: 4 }, () => Math.PI / 2),
    );
  });

  it("sizes segments correctly when values are not equal", () => {
    const segments = radialLayout({ values: [1, 3, 2] });

    const expected = [
      { startAngle: 0, midAngle: Math.PI / 6, endAngle: Math.PI / 3 },
      {
        startAngle: Math.PI / 3,
        midAngle: (5 * Math.PI) / 6,
        endAngle: (4 * Math.PI) / 3,
      },
      {
        startAngle: (4 * Math.PI) / 3,
        midAngle: (5 * Math.PI) / 3,
        endAngle: 2 * Math.PI,
      },
    ];

    segments.forEach((s, i) => {
      expect(s.startAngle).toBeCloseTo(expected[i].startAngle);
      expect(s.midAngle).toBeCloseTo(expected[i].midAngle);
      expect(s.endAngle).toBeCloseTo(expected[i].endAngle);
    });
  });

  // handles correctly when passing values for startAngle / endAngle
  it("uses the given start and end angles", () => {
    // only measure half an arc
    // starting at 0 -> pi radians
    const segments = radialLayout({
      values: [1, 1, 1, 1],
      startAngle: 0,
      endAngle: Math.PI,
    });

    expect(segments.map((s) => s.endAngle - s.startAngle)).toEqual(
      Array.from({ length: 4 }, () => Math.PI / 4),
    );
  });
});
