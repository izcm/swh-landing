// bright at the start, fading out to the right — used by the window dots and the code bars
export function AccentBarGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop
        offset="0%"
        style={{
          stopColor: "color-mix(in oklab, var(--accent) 50%, #1d4ed8)",
        }}
      />

      <stop
        offset="100%"
        style={{
          stopColor: "color-mix(in oklab, var(--accent) 75%, #1d4ed8)",
        }}
      />
    </linearGradient>
  );
}
