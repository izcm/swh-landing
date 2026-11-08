// stand-in for diagrams that haven't been drawn yet
export function SvgPlaceholder({
  label,
  width,
  height,
}: {
  label: string;
  width: number;
  height: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      role="img"
      aria-label={label}
    >
      <rect
        x="1"
        y="1"
        width={width - 2}
        height={height - 2}
        rx="8"
        fill="none"
        stroke="var(--accent-muted)"
        strokeOpacity="0.3"
        strokeDasharray="6 6"
      />
      <text
        x={width * 0.5}
        y={height * 0.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--subtle)"
        fontSize="12"
      >
        {label}
      </text>
    </svg>
  );
}
