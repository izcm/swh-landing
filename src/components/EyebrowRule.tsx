// "01 ──────── EYEBROW" rule above a section
export default function EyebrowRule({
  index,
  label,
  maxIndex,
}: {
  index: number;
  label: string;
  maxIndex: number; //
}) {
  const part = (100 * index) / (maxIndex - 1);
  const indexStr = `0${index + 1}`; // out app always has index < 10

  return (
    <div className="flex items-center gap-6">
      <div className="relative horizontal-line bg-[var(--accent-deep)] rounded-full w-8">
        <div
          className="
              absolute top-1/2 size-1.5 -translate-x-1/2 
              -translate-y-1/2 rounded-full bg-[var(--accent-deep)] 
              accent-dot drop-shadow-[0_0_2px_var(--accent-deep)]"
          style={{ left: `${part}%` }}
        />
      </div>

      <div className="flex gap-3">
        <span className="eyebrow  text-[var(--accent-deep)]">{indexStr}</span>

        <span className="eyebrow text-[var(--color-fg-tinted)] opacity-80">
          /
        </span>

        <span className="eyebrow text-[var(--color-fg-tinted)] opacity-80">
          {label.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
