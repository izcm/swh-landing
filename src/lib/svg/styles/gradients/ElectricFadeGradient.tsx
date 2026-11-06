// an electric fade: --accent-electric at the top,
// fading to nothing at the bottom
export function ElectricFadeGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="var(--accent-electric)" stopOpacity={0.15} />
      <stop offset="100%" stopColor="transparent" stopOpacity={0} />
    </linearGradient>
  );
}
