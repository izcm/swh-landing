import { useId, type ReactNode } from "react";
import { accentGlow, glyphStroke, type ShapeProps } from "../../logic";
import { AccentBarGradient } from "../../styles";

// fill: background color, defaults to the dark ink (or the ghost tint).
// stroke: border color, defaults to the accent gradient
export type AppWindowProps = WindowStyle & {
  width: number;
  height: number;
  // the inside's own size: what children are drawn in
  viewboxWidth: number;
  viewboxHeight: number;
  children?: ReactNode;
};

// one window's own style. every field is optional
export type WindowStyle = ShapeProps & {
  width?: number;
  height?: number;
  // border thickness, in parent units. defaults to 1
  strokeWidth?: number;
  // corner radius, in viewbox units. defaults to --rx-node-md
  radius?: number;
  // see-through, slightly lighter "glass" pane for editors in the background
  ghost?: boolean;
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
  fill,
  stroke,
  radius,
  strokeWidth: strokeWidthProp = 1,
  children,
}: AppWindowProps) {
  const gradientId = useId();

  // strokeWidthProp parent units thick at any window size
  // (same as that strokeWidth outside)
  const strokeWidth = glyphStroke(width, strokeWidthProp, viewboxWidth);
  // strokes are centered on the edge, so pull the rect in by half
  const inset = strokeWidth / 2;

  const nodeStyle = {
    // ghost: tinted toward the accent and mostly transparent, so what's behind shows through
    fill:
      fill ??
      (ghost ? "oklch(from var(--accent) 0.18 0.06 h)" : "var(--accent-ink)"),
    fillOpacity: ghost ? 0.3 : 1,
    stroke: stroke ?? `url(#${gradientId})`,
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
        rx={radius}
        // filter="url(#tinyGlow)"
        {...nodeStyle}
      />

      {children}
    </svg>
  );
}

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
  const dotGradientId = useId();

  return (
    <>
      <defs>
        <AccentBarGradient id={dotGradientId} />
      </defs>

      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={radius + i * (radius * 2 + gap)}
          cy={height / 2}
          r={radius}
          fill={`url(#${dotGradientId})`}
          // the old accent gradient, faded less than before
          // (1, 0.8, 0.6 instead of 0.8, 0.6, 0.4) so it doesn't look grey
          opacity={1 - i * 0.2}
          style={{ filter: accentGlow(2, 12) }}
          // filter="drop-shadow(0 0 1px color-mix(in oklab, var(--accent) 35%, transparent))"
        />
      ))}
    </>
  );
}
