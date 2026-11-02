import { useId } from "react";
import type { floorLayout } from "./layout";

// the tiles from floorLayout, faded out toward the floor's edges
export function Floor({
  layout,
  tileOpacity,
  fadeStretchX,
}: {
  layout: ReturnType<typeof floorLayout>;
  tileOpacity: number;
  fadeStretchX: number;
}) {
  const { tile, d, width, height, fade } = layout;

  const floorTileId = useId();
  const floorMaskId = useId();
  const floorFadeId = useId();

  return (
    <>
      <defs>
        <radialGradient
          id={floorFadeId}
          gradientUnits="userSpaceOnUse"
          cx={fade.cx}
          cy={fade.cy}
          r={fade.r}
          gradientTransform={`translate(${fade.cx} ${fade.cy}) scale(${fadeStretchX} ${fade.squash}) translate(${-fade.cx} ${-fade.cy})`}
        >
          <stop offset="0%" stopColor="white" stopOpacity={1} />
          <stop offset="50%" stopColor="white" stopOpacity={0.75} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </radialGradient>

        <mask
          id={floorMaskId}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={width}
          height={height}
        >
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={`url(#${floorFadeId})`}
          />
        </mask>

        <pattern
          id={floorTileId}
          patternUnits="userSpaceOnUse"
          x={layout.patternX}
          y={layout.patternY}
          width={tile.corners.right.x}
          height={tile.corners.bottom.y}
        >
          <path d={tile.d} fill="none" stroke="var(--accent)" strokeWidth={1} />
        </pattern>
      </defs>

      <g transform={`translate(${layout.translateX}, ${layout.translateY})`}>
        <path
          d={d}
          fill={`url(#${floorTileId})`}
          opacity={tileOpacity}
          mask={`url(#${floorMaskId})`}
        />
      </g>
    </>
  );
}
