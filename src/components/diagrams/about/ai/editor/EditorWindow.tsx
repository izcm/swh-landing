import { useId, type ReactNode } from "react";
import { accentGlow } from "@/lib/svg/helpers";
import { AccentBarGradient, editor } from "./shared";

export type EditorWindowProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // see-through, slightly lighter "glass" pane for editors in the background
  ghost?: boolean;
  children?: ReactNode;
};

// the editor frame: background, border and the three header dots.
// children are drawn inside it, in the same 300×200 viewBox
export function EditorWindow({
  x = 0,
  y = 0,
  width = 300,
  height = 200,
  ghost = false,
  children,
}: EditorWindowProps) {
  const gradientId = useId();
  const dotGradientId = `${gradientId}-dot`;

  const nodeStyle = {
    // ghost: tinted toward the accent and mostly transparent, so what's behind shows through
    fill: ghost
      ? "oklch(from var(--accent) 0.18 0.06 h)"
      : "var(--node-color-deep)",
    fillOpacity: ghost ? 0.3 : 1,
    stroke: `url(#${gradientId})`,
    strokeWidth: editor.strokeWidth,
  };

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`0 0 ${editor.viewboxWidth} ${editor.viewboxHeight}`}
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

        <AccentBarGradient id={dotGradientId} />
      </defs>

      {/* background */}
      <rect
        x={editor.inset}
        y={editor.inset}
        width={editor.contentWidth}
        height={editor.contentHeight}
        rx="var(--rx-node-md)"
        // filter="url(#tinyGlow)"
        {...nodeStyle}
      />

      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={12 + i * 14}
          cy={editor.contentHeight / 16}
          r={3}
          fill={`url(#${dotGradientId})`}
          opacity={1 - (i * 0.2 + 0.2)}
          style={{ filter: accentGlow(2, 45) }}
          // filter="drop-shadow(0 0 1px color-mix(in oklab, var(--accent) 35%, transparent))"
        />
      ))}

      {children}
    </svg>
  );
}
