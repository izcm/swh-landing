import { useId, type ReactNode } from "react";
import { glyphStroke, type ShapeProps } from "@/lib/svg";
import { WindowDots } from "../../shared/window/WindowDots";
import { EditorCode } from "./EditorCode";

type CodeEditorProps = ShapeProps & {
  width: number;
  height: number;
  viewboxWidth: number;
  viewboxHeight: number;
  headerHeight: number;
  strokeWidth?: number;
  radius?: number;
  ghost?: boolean;
  children?: ReactNode;
};

export function CodeEditor({
  x = 0,
  y = 0,
  width,
  height,
  viewboxWidth,
  viewboxHeight,
  headerHeight,
  ghost = false,
  fill,
  stroke,
  radius,
  strokeWidth: strokeWidthProp = 1,
  children,
}: CodeEditorProps) {
  const gradientId = useId();

  const strokeWidth = glyphStroke(width, strokeWidthProp, viewboxWidth);
  const inset = strokeWidth / 2;

  const nodeStyle = {
    fill:
      fill ??
      (ghost ? "oklch(from var(--accent) 0.18 0.06 h)" : "var(--accent-ink)"),
    fillOpacity: ghost ? 0.3 : 1,
    stroke: stroke ?? `url(#${gradientId})`,
    strokeWidth,
  };

  const dots = (() => {
    const radius = headerHeight * 0.13;
    const gap = radius * 2.4;
    const translateX = headerHeight / 2 - radius;
    return { radius, gap, translateX };
  })();

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

      <rect
        x={inset}
        y={inset}
        width={viewboxWidth - inset * 2}
        height={viewboxHeight - inset * 2}
        rx={radius}
        {...nodeStyle}
      />

      {children}

      <g transform={`translate(${dots.translateX}, 0)`}>
        <WindowDots
          height={headerHeight}
          radius={dots.radius}
          gap={dots.gap}
        />
      </g>

      {!ghost && (
        <EditorCode
          width={viewboxWidth}
          height={viewboxHeight}
          headerHeight={headerHeight}
        />
      )}
    </svg>
  );
}
