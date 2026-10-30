// soft accent glow. colour: the accent's own hue, kept saturated (oklch chroma 0.12) at mid lightness.
// plain --accent is light enough that a soft halo of it reads as white-ish mist on the dark background
export const accentGlow = (blur: number, strength: number) =>
  `drop-shadow(0 0 ${blur}px oklch(from var(--accent) 0.55 0.12 h / ${strength}%))`;

// faint dashed guide lines behind charts (LineChart, BarChart)
export const chartSeparatorStyle = {
  strokeWidth: 1,
  strokeOpacity: 0.06,
  strokeDasharray: "6 4",
};

// accent colors for things drawn in a row (bars, tubes, chart series).
// pick with series[i % series.length] so it starts over after the last
export const accentSeries = [
  "var(--accent-dim)",
  "var(--accent-lavender)",
  "var(--accent)",
  "var(--accent-teal)",
];

// accentSeries, each color darker and more colorful (oklch: l down, c up)
export const deepAccentSeries = accentSeries.map(
  (color) => `oklch(from ${color} l calc(c + 0.05) h)`,
);

// `count` shades of --accent-deep for things in a row (bars):
// a bit more colorful than deep itself, darker on the left, lighter to the right.
// start: which step to begin on (0 = darkest), to skip the darkest ones
export const deepShades = (count: number, start = 0) =>
  Array.from(
    { length: count },
    (_, i) =>
      `oklch(from var(--accent) calc(l - 0.12 + ${(start + i) * 0.03}) calc(c + 0.03) h)`,
  );

// the strokeWidth to set on a shape drawn in a `box`-wide box and stretched to
// `size`, so it shows up `weight` thick. e.g. box 24, size 96, weight 2 → 0.5,
// which the 4× stretch turns into 2. for Lucide icons use glyphStrokeLucide
export function glyphStroke(size: number, weight: number, box: number) {
  return weight * (box / size);
}

// instead of setting default to 24 in glyphstroke
// callers should use this helper when its lucide icons
export function glyphStrokeLucide(size: number, weight = 1) {
  return glyphStroke(size, weight, 24);
}
