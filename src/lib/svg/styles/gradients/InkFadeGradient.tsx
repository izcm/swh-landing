// an ink fade: --accent-ink at the top, fading to nothing at the bottom. act's
// window fill. usage: const id = useId(); put <InkFadeGradient id={id} />
// inside <defs>, then fill={`url(#${id})`} on a shape drawn over a solid
// ground layer (the fade is see-through toward the bottom)
export function InkFadeGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="var(--accent-ink)" stopOpacity={0.9} />
      <stop offset="100%" stopColor="var(--accent-ink)" stopOpacity={0} />
    </linearGradient>
  );
}
