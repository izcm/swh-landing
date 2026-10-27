import { accentGlow } from "../logic";
import type { gearLayout } from "../layouts";

// a gear: a dark front face with a bright outline and a ring
// around the hole, dark walls back to a dark back face, and a soft glow.
// drawn from the layout's top-left
export function Gear({ layout }: { layout: ReturnType<typeof gearLayout> }) {
  const { transform, items, faceD, walls, center, holeRingRadius } = layout;

  return (
    <g transform={transform}>
      {/* soft blue halo around the whole gear */}
      <g style={{ filter: accentGlow(4, 24) }}>
        {items.map((item, i) => (
          <g key={i} transform={`translate(${item.x}, ${item.y})`}>
            {/* side walls back to the copy behind (the back copy has none) */}
            {i > 0 &&
              walls.map((d, j) => (
                <path
                  key={j}
                  d={d}
                  fill="oklch(from var(--accent) 0.18 0.07 h)"
                  stroke="oklch(from var(--accent-electric) l c h / 0.35)"
                  strokeWidth={1}
                />
              ))}
            {/* the front face gets the bright outline, the back one the faint edge */}
            <path
              d={faceD}
              fillRule="evenodd"
              fill={
                item.isFront
                  ? "oklch(from var(--accent-ink) calc(l - 0.01) c h)"
                  : "oklch(from var(--accent) 0.18 0.07 h)"
              }
              stroke={
                item.isFront
                  ? "var(--accent-electric)"
                  : "oklch(from var(--accent-electric) l c h / 0.35)"
              }
              strokeWidth={item.isFront ? 1.25 : 1}
            />
            {/* decorative ring around the hole, on the front face */}
            {item.isFront && (
              <circle
                cx={center.x}
                cy={center.y}
                r={holeRingRadius}
                fill="none"
                stroke="oklch(from var(--accent-electric) l c h / 0.25)"
                strokeWidth={1}
              />
            )}
          </g>
        ))}
      </g>
    </g>
  );
}
