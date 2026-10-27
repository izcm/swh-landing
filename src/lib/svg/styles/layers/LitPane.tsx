import { useId } from "react";
import { InkFadeGradient, LitEdgeGradient } from "../gradients";

// a lit pane: dark ground, the ink fade from the top, and a lit edge.
// everything inside starts at (0, 0) = the pane's top-left
export function LitPane({
  width,
  height,
  radius,
  edgeOpacity,
}: {
  width: number;
  height: number;
  radius: number; // corner radius
  edgeOpacity?: [number, number]; // the lit edge's top and bottom opacity, see LitEdgeGradient
}) {
  const inkId = useId();
  const edgeId = useId();

  return (
    <>
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
    </>
  );
}
