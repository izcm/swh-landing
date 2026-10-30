import { useId } from "react";
import { InkFadeGradient, LitEdgeGradient } from "../gradients";

// a lit pane: dark ground, the ink fade from the top, and a lit edge.
// drawn with its top-left at (x, y)
export function LitPane({
  x = 0,
  y = 0,
  width,
  height,
  radius,
  opacity = 1,
  edgeOpacity,
}: {
  x?: number; // where the pane's top-left goes
  y?: number;
  width: number;
  height: number;
  radius: number; // corner radius
  opacity?: number; // the whole pane's opacity
  edgeOpacity?: [number, number]; // the lit edge's top and bottom opacity, see LitEdgeGradient
}) {
  const inkId = useId();
  const edgeId = useId();

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      <defs>
        <InkFadeGradient id={inkId} />
        <LitEdgeGradient id={edgeId} opacity={edgeOpacity} />
      </defs>
      <rect width={width} height={height} rx={radius} fill="var(--ground)" />
      {/* the ink fade, with the lit edge as its stroke */}
      <rect
        width={width}
        height={height}
        rx={radius}
        fill={`url(#${inkId})`}
        stroke={`url(#${edgeId})`}
        strokeWidth={1}
      />
    </g>
  );
}
