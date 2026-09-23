type DataGridProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  rows?: number;
  cols?: number;
};

export function DataGrid({
  x,
  y,
  width,
  height,
  rows = 6,
  cols = 4,
}: DataGridProps) {
  const paddingX = width * 0.072;
  const paddingY = height * 0.072;

  const gapX = width * 0.035;
  const gapY = height * 0.04;

  const gridWidth = width - paddingX * 2;
  const gridHeight = height - paddingY * 2;

  const cellWidth = (gridWidth - gapX * (cols - 1)) / cols;
  const cellHeight = (gridHeight - gapY * (rows - 1)) / rows;

  const variation = (r: number, c: number) =>
    Math.abs((Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="var(--rx-node-xs)"
        fill="var(--node-color)"
        stroke="var(--node-border-color)"
        strokeWidth="var(--node-stroke-width)"
      />

      {/* faint grid lines, drawn once for the whole grid */}
      <g
        stroke="var(--node-border-color)"
        strokeWidth="var(--node-stroke-width)"
        opacity={0.12}
      >
        {Array.from({ length: cols - 1 }, (_, i) => {
          const c = i + 1;
          const lineX = x + paddingX + c * (cellWidth + gapX) - gapX / 2;
          return (
            <line
              key={`v-${c}`}
              x1={lineX}
              y1={y + paddingY}
              x2={lineX}
              y2={y + height - paddingY}
            />
          );
        })}
        {Array.from({ length: rows - 1 }, (_, i) => {
          const r = i + 1;
          const lineY = y + paddingY + r * (cellHeight + gapY) - gapY / 2;
          return (
            <line
              key={`h-${r}`}
              x1={x + paddingX}
              y1={lineY}
              x2={x + width - paddingX}
              y2={lineY}
            />
          );
        })}
      </g>

      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const cellX = x + paddingX + c * (cellWidth + gapX);
          const cellY = y + paddingY + r * (cellHeight + gapY);

          const value = variation(r, c);

          const markWidth = cellWidth * (0.4 + value * 0.5);

          // Chunkier like the reference
          const markHeight = cellHeight * 0.38;

          const markY = cellY + (cellHeight - markHeight) / 2;

          return (
            <rect
              key={`${r}-${c}`}
              x={cellX}
              y={markY}
              width={markWidth}
              height={markHeight}
              rx={markHeight / 2}
              fill="var(--node-border-color)"
              opacity={0.35 + value * 0.45}
            />
          );
        }),
      )}
    </g>
  );
}
