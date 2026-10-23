import { chartSeparatorStyle, type Point } from "../../logic";

// the faint dashed guide lines behind a chart: `count` lines, evenly spaced
// between the top and the bottom, `insetX` in from the left and right edges.
// drawn from (x, y)
export function ChartGuides({
  x = 0,
  y = 0,
  width,
  height,
  count,
  insetX,
  color,
}: {
  width: number; // the chart's box
  height: number;
  count: number; // how many lines
  insetX: number; // from the box's left and right edges to the lines' ends
  color: string;
} & Partial<Point>) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {Array.from({ length: count }, (_, i) => {
        const lineY = (height * (i + 1)) / (count + 1);
        return (
          <line
            key={i}
            x1={insetX}
            y1={lineY}
            x2={width - insetX}
            y2={lineY}
            stroke={color}
            {...chartSeparatorStyle}
          />
        );
      })}
    </g>
  );
}
