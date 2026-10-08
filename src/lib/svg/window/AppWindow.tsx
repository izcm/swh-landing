import { useId, type ReactNode } from "react";
import { accentGlow, glyphStroke } from "@/lib/svg/helpers";
import { AccentBarGradient } from "./AccentBarGradient";

export type AppWindowProps = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  // the inside's own size: what children are drawn in
  viewboxWidth: number;
  viewboxHeight: number;
  // see-through, slightly lighter "glass" pane for editors in the background
  ghost?: boolean;
  children?: ReactNode;
};

// window frame: background and border. add <WindowDots /> as a child for the header dots.
// takes width × height in the parent; children are drawn in viewboxWidth × viewboxHeight
export function AppWindow({
  x = 0,
  y = 0,
  width,
  height,
  viewboxWidth,
  viewboxHeight,
  ghost = false,
  children,
}: AppWindowProps) {
  const gradientId = useId();

  // 1 parent unit thick at any window size (same as a strokeWidth={1} outside)
  const strokeWidth = glyphStroke(width, 1, viewboxWidth);
  // strokes are centered on the edge, so pull the rect in by half
  const inset = strokeWidth / 2;

  const nodeStyle = {
    // ghost: tinted toward the accent and mostly transparent, so what's behind shows through
    fill: ghost
      ? "oklch(from var(--accent) 0.18 0.06 h)"
      : "var(--node-color-deep)",
    fillOpacity: ghost ? 0.3 : 1,
    stroke: `url(#${gradientId})`,
    strokeWidth,
  };

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      overflow="visible"
    >
      <defs>
        <filter id="tinyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop
            offset="55%"
            style={{
              stopColor: "color-mix(in oklab, var(--accent) 70%, #1d4ed8)",
            }}
            stopOpacity="1"
          />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* background */}
      <rect
        x={inset}
        y={inset}
        width={viewboxWidth - inset * 2}
        height={viewboxHeight - inset * 2}
        rx="var(--rx-node-md)"
        // filter="url(#tinyGlow)"
        {...nodeStyle}
      />

      {children}
    </svg>
  );
}

// the three header dots, centered in a header strip `headerHeight` tall.
// put inside an <AppWindow>
export function WindowDots({ headerHeight }: { headerHeight: number }) {
  const dotGradientId = useId();

  return (
    <>
      <defs>
        <AccentBarGradient id={dotGradientId} />
      </defs>

      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={12 + i * 14}
          cy={headerHeight / 2}
          r={3.2}
          fill={`url(#${dotGradientId})`}
          opacity={1 - (i * 0.2 + 0.2)}
          style={{ filter: accentGlow(2, 12) }}
          // filter="drop-shadow(0 0 1px color-mix(in oklab, var(--accent) 35%, transparent))"
        />
      ))}
    </>
  );
}
