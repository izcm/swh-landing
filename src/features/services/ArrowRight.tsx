const headRatio = 0.3;

export function ArrowRight({
  color,
  size,
  strokeWidth,
  className,
}: {
  color: string;
  size: number;
  strokeWidth: number;
  className?: string;
}) {
  const shaft = (() => {
    const y = size * 0.5;
    const tipX = size - strokeWidth;

    return { y, tipX };
  })();

  const head = (() => {
    const reach = size * headRatio;

    return {
      backX: shaft.tipX - reach,
      topY: shaft.y - reach,
      bottomY: shaft.y + reach,
    };
  })();

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      className={className}
    >
      <path d={`M 0 ${shaft.y} H ${shaft.tipX}`} />
      <path
        d={`M ${head.backX} ${head.topY} L ${shaft.tipX} ${shaft.y} L ${head.backX} ${head.bottomY}`}
      />
    </svg>
  );
}
