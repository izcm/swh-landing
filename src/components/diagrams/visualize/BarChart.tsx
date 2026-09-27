type BarChartProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  values: number[]; // each 0-1, normalized bar height — swap for animated values later
};

export function BarChart({ x, y, width, height, values }: BarChartProps) {
  const gap = width * 0.02;
  const rawBarWidth = (width - gap * (values.length - 1)) / values.length;
  const barWidth = rawBarWidth * 0.4; // thin bars, calmer than a packed block
  const slotWidth = rawBarWidth + gap;

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
            rx="1"
            fill="var(--accent)"
          />
        );
      })}
    </g>
  );
}
