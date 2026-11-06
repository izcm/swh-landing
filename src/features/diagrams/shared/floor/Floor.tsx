import { useId } from "react";
import type { floorLayout } from "./floorLayout";

type TileCell = {
  tile: ReturnType<typeof floorLayout>["tile"];
  width: number; // the pattern cell
  height: number;
  fill: string; // tileFill
  glowId: string; // for the glow filter
};

const line = { fill: "none", stroke: "var(--accent)", strokeWidth: 1 };

export const tileStyles = {
  lines: ({ tile }: TileCell) => <path d={tile.d} {...line} />,

  twoTone: ({ tile, width, height, fill }: TileCell) => (
    <>
      <rect width={width} height={height} fill={fill} opacity={0.4} />
      <path d={tile.d} {...line} fill={fill} />
    </>
  ),

  filled: ({ tile, width, height, fill }: TileCell) => (
    <>
      <rect width={width} height={height} fill={fill} />
      <path d={tile.d} {...line} />
    </>
  ),

  checkerboard: ({ tile, fill }: TileCell) => (
    <path d={tile.d} {...line} fill={fill} />
  ),

  insetTiles: ({ tile, width, height, fill }: TileCell) => {
    const cx = tile.corners.top.x;
    const cy = tile.corners.left.y;

    return (
      <>
        {[
          [cx, cy],
          [0, 0],
          [width, 0],
          [0, height],
          [width, height],
        ].map(([x, y], i) => (
          <path
            key={i}
            d={tile.d}
            fill={fill}
            transform={`translate(${x} ${y}) scale(0.8) translate(${-cx} ${-cy})`}
          />
        ))}
      </>
    );
  },

  // cornerDots: ({ tile }: TileCell) => (
  //   <>
  //     <path d={tile.d} {...line} strokeWidth={0.75} />
  //     {Object.values(tile.corners).map((p, i) => (
  //       <circle key={i} cx={p.x} cy={p.y} r={2} fill="var(--accent)" />
  //     ))}
  //   </>
  // ),

  // glowLines: ({ tile, glowId }: TileCell) => (
  //   <>
  //     <path
  //       d={tile.d}
  //       {...line}
  //       strokeWidth={3}
  //       opacity={0.6}
  //       filter={`url(#${glowId})`}
  //     />
  //     <path d={tile.d} {...line} />
  //   </>
  // ),

  dashed: ({ tile }: TileCell) => (
    <path d={tile.d} {...line} strokeDasharray="4 3" />
  ),
};

export const tileStyleNames = Object.keys(
  tileStyles,
) as (keyof typeof tileStyles)[];

// the tiles from floorLayout, faded out toward the floor's edges
export function Floor({
  layout,
  tileOpacity,
  fadeStretchX,
  fadeStretchY = 1,
  fadeStart = 0,
  fadeMiddle,
  tileFill = "color-mix(in oklab, var(--accent) 15%, transparent)",
  tileStyle = "lines",
}: {
  layout: ReturnType<typeof floorLayout>;
  tileOpacity: number;
  fadeStretchX: number;
  fadeStretchY?: number;
  fadeStart?: number; // 0–1
  fadeMiddle: number; // the opacity halfway through the fade
  tileFill?: string;
  tileStyle?: keyof typeof tileStyles;
}) {
  const { tile, d, width, height, fade } = layout;

  const floorTileId = useId();
  const floorMaskId = useId();
  const floorFadeId = useId();
  const floorGlowId = useId();

  return (
    <>
      <defs>
        <filter id={floorGlowId}>
          <feGaussianBlur stdDeviation={1.5} />
        </filter>

        <radialGradient
          id={floorFadeId}
          gradientUnits="userSpaceOnUse"
          cx={fade.cx}
          cy={fade.cy}
          r={fade.r}
          gradientTransform={`translate(${fade.cx} ${fade.cy}) scale(${fadeStretchX} ${fade.squash * fadeStretchY}) translate(${-fade.cx} ${-fade.cy})`}
        >
          <stop offset={0} stopColor="white" stopOpacity={1} />
          <stop offset={fadeStart} stopColor="white" stopOpacity={1} />
          <stop
            offset={fadeStart + (1 - fadeStart) * 0.5}
            stopColor="white"
            stopOpacity={fadeMiddle}
          />
          <stop offset={1} stopColor="white" stopOpacity={0} />
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
          {tileStyles[tileStyle]({
            tile,
            width: tile.corners.right.x,
            height: tile.corners.bottom.y,
            fill: tileFill,
            glowId: floorGlowId,
          })}
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
