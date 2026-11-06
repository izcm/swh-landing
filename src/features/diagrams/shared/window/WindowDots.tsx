import { accentGlow } from "@/lib/svg";

// three dots in a row, centered in a strip `height` tall.
// the first dot starts at x = 0; move it sideways with a <g transform>
export function WindowDots({
  height,
  radius,
  gap,
}: {
  height: number; // the strip the dots are centered in
  radius: number; // each dot's radius
  gap: number; // space between two dots
}) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={radius + i * (radius * 2 + gap)}
          cy={height / 2}
          r={radius}
          fill="var(--accent-bright)"
          opacity={1 - i * 0.2}
          style={{ filter: accentGlow(2, 12) }}
          // filter="drop-shadow(0 0 1px color-mix(in oklab, var(--accent) 35%, transparent))"
        />
      ))}
    </>
  );
}
