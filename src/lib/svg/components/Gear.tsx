import { useId } from "react";

import { accentGlow } from "../logic";
import type { gearLayout } from "../layouts";

const wallGray = "oklch(from var(--accent) 0.38 0.03 h)";

// a gear: a dark front face with a bright outline and a ring around the hole,
// gray walls and back face lit from above, and a soft glow.
// drawn from the layout's top-left
export function Gear({
  layout,
  frontFill,
}: {
  layout: ReturnType<typeof gearLayout>;
  frontFill: string;
}) {
  const { transform, items, faceD, walls, center, radius, holeRingRadius } =
    layout;
  const lightId = useId();
  const light = `url(#${lightId})`;

  return (
    <g transform={transform}>
      <defs>
        <radialGradient
          id={lightId}
          gradientUnits="userSpaceOnUse"
          cx={center.x}
          cy={center.y - radius * 1.2}
          r={radius * 2.6}
        >
          <stop offset="0%" stopColor="var(--accent-glow)" stopOpacity={0.8} />
          <stop
            offset="50%"
            stopColor="var(--accent-glow)"
            stopOpacity={0.65}
          />
          <stop
            offset="100%"
            stopColor="var(--accent-glow)"
            stopOpacity={0.45}
          />
        </radialGradient>
      </defs>

      {/* soft blue halo around the whole gear */}
      <g style={{ filter: accentGlow(4, 16) }}>
        {items.map((item, i) => (
          <g key={i} transform={`translate(${item.x}, ${item.y})`}>
            {/* side walls back to the copy behind (the back copy has none) */}
            {i > 0 &&
              walls.map((d, j) => (
                <g key={j}>
                  <path d={d} fill={wallGray} />
                  <path
                    d={d}
                    fill={light}
                    stroke="oklch(from var(--accent-ink) l c h / 0.35)"
                    strokeWidth={1}
                  />
                </g>
              ))}
            {!item.isFront && (
              <path d={faceD} fillRule="evenodd" fill={wallGray} />
            )}
            {/* the front face gets the bright outline, the back one the faint edge */}
            <path
              d={faceD}
              fillRule="evenodd"
              fill={item.isFront ? frontFill : light}
              stroke={"var(--accent-glow)"}
              strokeWidth={item.isFront ? 1.25 : 1}
            />
            {/* decorative ring around the hole, on the front face */}
            {item.isFront && (
              <circle
                cx={center.x}
                cy={center.y}
                r={holeRingRadius}
                fill="none"
                // stroke="var(--accent-bright)"
                strokeWidth={1}
              />
            )}
          </g>
        ))}
      </g>
    </g>
  );
}
