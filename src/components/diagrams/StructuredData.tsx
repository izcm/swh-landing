type StructuredDataProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  rowCount?: number;
};

export function StructuredData({
  x,
  y,
  width,
  height,
  rowCount = 3,
}: StructuredDataProps) {
  const paddingX = width * 0.08;
  const paddingY = height * 0.057;
  const rowHeight = (height - paddingY * 2) / rowCount;

  const avatarSize = rowHeight * 0.47;
  const barHeight = avatarSize * 0.25;
  const barGap = barHeight * (2 / 3); // gap from centerY to each bar's near edge
  // no * 2 here, see (*) below
  const contentX = x + paddingX + avatarSize + paddingX;

  return (
    <g>
      {/* outer container */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="var(--rx-node-sm)"
        fill="var(--node-color)"
        stroke="var(--node-border-color)"
        strokeWidth="var(--node-stroke-width)"
      />

      {/* rows */}
      {Array.from({ length: rowCount }).map((_, i) => {
        const rowY = y + paddingY + i * rowHeight;
        const centerY = rowY + rowHeight / 2;

        return (
          <g key={i}>
            {/* separators */}
            {i > 0 && (
              <line
                x1={x + paddingX}
                y1={rowY}
                x2={x + width - paddingX} // (*) other edge, padding again
                y2={rowY}
                stroke="var(--node-border-color)"
                strokeWidth="var(--node-stroke-width)"
                opacity={0.55}
              />
            )}

            {/* avatar */}
            <rect
              x={x + paddingX}
              y={centerY - avatarSize / 2}
              width={avatarSize}
              height={avatarSize}
              rx={avatarSize * 0.25}
              fill="var(--node-border-color)"
            />

            {/* primary */}
            <rect
              x={contentX}
              y={centerY - barGap - barHeight}
              width={width * (0.34 + i * 0.04)}
              height={barHeight}
              rx={barHeight / 2}
              fill="var(--node-border-color)"
            />

            {/* secondary */}
            <rect
              x={contentX}
              y={centerY + barGap}
              width={width * (0.5 - i * 0.04)}
              height={barHeight}
              rx={barHeight / 2}
              fill="var(--muted)"
            />
          </g>
        );
      })}
    </g>
  );
}
