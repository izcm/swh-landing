// stand-in for diagrams that haven't been drawn yet
export function SvgPlaceholder({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className="w-full h-auto"
      role="img"
      aria-label={label}
    >
      <rect
        x="1"
        y="1"
        width="478"
        height="298"
        rx="8"
        fill="none"
        stroke="var(--accent-muted)"
        strokeOpacity="0.3"
        strokeDasharray="6 6"
      />
      <text
        x="240"
        y="150"
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
