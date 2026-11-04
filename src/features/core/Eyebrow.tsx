// "01 / EYEBROW" label above a section
export default function Eyebrow({
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
    <div className="">
      {/* <div className="relative horizontal-line bg-accent-deep rounded-full w-8">
        <div
          className="
              absolute top-1/2 size-1.5 -translate-x-1/2 
              -translate-y-1/2 rounded-full bg-accent-deep 
              accent-dot drop-shadow-[0_0_2px_var(--accent-deep)]"
          style={{ left: `${part}%` }}
        />
      </div> */}

      <div className="flex gap-2 font-light text-accent tracking-wider text-[14px] max-sm:text-[13px]">
        {indexStr}

        <span className="opacity-80">/</span>

        <span className="opacity-80">{label.toUpperCase()}</span>
      </div>
    </div>
  );
}
