// soft accent glow. colour: the accent's own hue, kept saturated (oklch chroma 0.12) at mid lightness.
// plain --accent is light enough that a soft halo of it reads as white-ish mist on the dark background
export const accentGlow = (blur: number, strength: number) =>
  `drop-shadow(0 0 ${blur}px oklch(from var(--accent) 0.55 0.12 h / ${strength}%))`;

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
  (color) => `oklch(from ${color} calc(l - 0.12) calc(c + 0.025) h)`,
);

// `count` shades of --accent-deep for things in a row (bars):
// a bit more colorful than deep itself, darker on the left, lighter to the right
export const deepShades = (count: number) =>
  Array.from(
    { length: count },
    (_, i) =>
      `oklch(from var(--accent-deep) calc(l - 0.12 + ${i * 0.03}) calc(c + 0.03) h)`,
  );

// Lucide icons are drawn on a fixed 0 0 24 24 viewBox; the `size` prop
// scales that whole box (and strokeWidth along with it) up to the
// rendered size. Dividing by 24/size undoes that stretch in advance, so
// `weight` is the visual thickness you actually see, at any icon size.
// `box` is the width the shape is drawn in before scaling (24 for Lucide,
// 100 for ISOCube)
export function glyphStroke(size: number, weight = 1, box = 24) {
  return weight * (box / size);
}

// instead of setting default to 24 in glyphstroke
// callers should use this helper when its lucide icons
export function glyphStrokeLucide(size: number, weight = 1) {
  return glyphStroke(size, weight, 24);
}
