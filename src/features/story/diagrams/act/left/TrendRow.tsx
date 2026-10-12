import { ArrowRight } from "lucide-react";

import { glyphStrokeLucide, stackWithGaps } from "@/lib/svg";

// two boxes side by side, filling a width × height row. the right one holds
// an arrow tilted by `angle` (e.g. trendAngle of a line chart)
export function TrendRow({
  width,
  height,
  gap,
  angle,
  fill,
  stroke,
  strokeWidth,
  radius,
}: {
  width: number;
  height: number;
  gap: number; // space between the two boxes
  angle: number; // arrow's tilt in degrees, 0 = pointing right
  fill: string; // the boxes' background
  stroke: string; // the boxes' border color
  strokeWidth: number; // the boxes' border thickness
  radius: number; // the boxes' corner radius
}) {
  const columns = (() => {
    const columnWidth = (width - gap) / 2;
    const { starts } = stackWithGaps([columnWidth, columnWidth], gap);

    return { columnWidth, starts };
  })();

  const arrow = (() => {
    // lucide icons are square, so fit the box's shorter side
    const size = Math.min(columns.columnWidth, height) * 0.65;
    // middle of the right box
    const centerX = columns.starts[1] + columns.columnWidth / 2;
    const centerY = height / 2;

    return { size, centerX, centerY };
  })();

  return (
    <>
      {columns.starts.map((columnX, i) => (
        <rect
          key={i}
          x={columnX}
          y={0}
          width={columns.columnWidth}
          height={height}
          rx={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}

      {columns.starts.map((columnX, i) => (
        <rect
          key={i}
          className="svg-debug"
          x={columnX}
          y={0}
          width={columns.columnWidth}
          height={height}
          fill="none"
          stroke="#aab4e6" // lavender
          strokeWidth={0.75}
          strokeDasharray="6 4"
          rx={radius}
        />
      ))}

      {/* arrow in the middle of the right box, tilted by angle */}
      <g
        transform={`translate(${arrow.centerX}, ${arrow.centerY}) rotate(${angle})`}
      >
        <ArrowRight
          x={-arrow.size / 2}
          y={-arrow.size / 2}
          size={arrow.size}
          strokeWidth={glyphStrokeLucide(arrow.size, 1.5)}
          stroke="var(--accent-electric)"
        />
      </g>
    </>
  );
}
