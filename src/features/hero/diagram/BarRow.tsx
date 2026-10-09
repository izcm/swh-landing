import type { ComponentProps } from "react";
import { FilledTube } from "@/lib/svg/FilledTube";

// the tube's props, minus the ones BarRow works out from rowHeight / width
type TubeProps = Omit<
  ComponentProps<typeof FilledTube>,
  "x" | "y" | "width" | "height"
>;

// one row: a dot (pic) + a small box (label), then a tube filling the rest
// of the row. all sizes inside come from rowHeight
export function BarRow({
  rowHeight,
  width,
  ...tube
}: TubeProps & {
  rowHeight: number;
  width: number; // the whole row, dot to tube end
}) {
  const dotRadius = rowHeight * 0.35;
  const gap = rowHeight;

  const labelX = dotRadius * 2 + gap / 2;
  const labelWidth = rowHeight;
  const labelHeight = dotRadius;

  const tubeX = labelX + labelWidth + gap;

  return (
    <>
      <circle
        cx={dotRadius}
        cy={rowHeight / 2}
        r={dotRadius}
        fill="var(--accent-dim)"
      />
      <rect
        x={labelX}
        y={(rowHeight - labelHeight) / 2}
        width={labelWidth}
        height={labelHeight}
        rx={labelHeight * 0.5}
        fill="var(--accent-muted)"
        fillOpacity={0.3}
      />
      <FilledTube
        x={tubeX}
        y={0}
        width={width - tubeX}
        height={rowHeight}
        {...tube}
      />
    </>
  );
}
