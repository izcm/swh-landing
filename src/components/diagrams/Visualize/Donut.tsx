type DonutProps = {
  x: number;
  y: number;
  size: number;
  split?: number; // 0-1, portion that's the accent color
};

export function Donut({ x, y, size, split = 0.5 }: DonutProps) {
  const r = size / 2;
  const strokeW = size * 0.16;
  const radius = r - strokeW / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <g transform={`translate(${x + r}, ${y + r}) rotate(-90)`}>
      <circle
        r={radius}
        fill="none"
        stroke="var(--node-border-color)"
        strokeWidth={strokeW}
        strokeDasharray={`${circumference * (1 - split)} ${circumference}`}
        strokeDashoffset={-circumference * split}
      />
      <circle
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={strokeW}
        strokeDasharray={`${circumference * split} ${circumference}`}
      />
    </g>
  );
}
