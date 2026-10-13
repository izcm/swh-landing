type BarChartProps = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  values: number[]; // each 0-1, normalized bar height — swap for animated values later
  colors?: string[]; // one fill per bar. all var(--accent) if left out
};

export function BarChart({
  x = 0,
  y = 0,
  width,
  height,
  values,
  colors,
}: BarChartProps) {
  const rawBarWidth = width / values.length;
  const barWidth = rawBarWidth * 0.5; // thin bars, calmer than a packed block
  const slotWidth = rawBarWidth;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {values.map((value, i) => {
        const barHeight = height * value;

        return (
          <rect
            key={i}
            x={i * slotWidth + (rawBarWidth - barWidth) / 2}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx="3"
            fill={colors?.[i] ?? "var(--accent)"}
          />
        );
      })}
    </g>
  );
}
