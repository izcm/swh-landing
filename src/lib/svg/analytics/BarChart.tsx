import { chartSeparatorStyle } from "../logic";

type BarChartProps = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  values: number[]; // each 0-1, normalized bar height — swap for animated values later
  colors?: string[]; // one fill per bar. all var(--accent) if left out
  // how much of its slot each bar fills, 0-1 (each bar gets width / values.length)
  barRatio: number;
};

export function BarChart({
  x = 0,
  y = 0,
  width,
  height,
  values,
  colors,
  barRatio,
}: BarChartProps) {
  const slotWidth = width / values.length;
  const barWidth = slotWidth * barRatio;

  // same faint dashed lines as LineChart, behind the bars
  const separatorCount = 3;
  const separators = Array.from({ length: separatorCount }).map((_, i) => ({
    x1: width * 0.04,
    x2: width * 0.96,
    // evenly spaced: 1/4, 2/4, 3/4 of the height
    y: (height * (i + 1)) / (separatorCount + 1),
  }));

  return (
    <g transform={`translate(${x}, ${y})`}>
      {separators.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y}
          x2={s.x2}
          y2={s.y}
          stroke="var(--accent)"
          {...chartSeparatorStyle}
        />
      ))}

      {values.map((value, i) => {
        const barHeight = height * value;

        return (
          <rect
            key={i}
            x={i * slotWidth + (slotWidth - barWidth) / 2}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx="2"
            fill={colors?.[i] ?? "var(--accent)"}
          />
        );
      })}
    </g>
  );
}
