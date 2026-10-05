// gradients the hero diagram's shapes point at by id
export function HeroDefs() {
  return (
    <defs>
      {/* center cube glass: lighter front/top, darker sides */}
      <linearGradient id="cubeSide" x1="0" y1="0" x2="1" y2="1">
        {/* saturated blue glass: same hue as --accent, more chroma so it
            doesn't wash out grey over the dark background */}
        <stop
          offset="0%"
          stopColor="oklch(from var(--accent) 0.55 0.18 h)"
          stopOpacity="0.35"
        />
        <stop
          offset="100%"
          stopColor="oklch(from var(--accent) 0.35 0.16 h)"
          stopOpacity="0.3"
        />
      </linearGradient>
      {/* <linearGradient id="cubeSide" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
        <stop
          offset="100%"
          stopColor="var(--accent-deep)"
          stopOpacity="0.15"
        />
      </linearGradient> */}
      {/* icon colors, same as Map.tsx. 0–24 = lucide's own icon box */}
      <linearGradient
        id="hero-cloud-gradient"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="24"
        y2="24"
      >
        <stop offset="0%" stopColor="#67D4FF" />
        <stop offset="100%" stopColor="#269BFF" />
      </linearGradient>
      <linearGradient
        id="hero-settings-gradient"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="24"
        y2="24"
      >
        <stop offset="0%" stopColor="#A7A1FF" />
        <stop offset="100%" stopColor="#747BFF" />
      </linearGradient>
      <linearGradient
        id="hero-document-gradient"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="24"
        y2="24"
      >
        <stop offset="0%" stopColor="#EDF7FF" />
        <stop offset="100%" stopColor="#A9CBE8" />
      </linearGradient>
      <linearGradient
        id="hero-sheet-gradient"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="24"
        y2="24"
      >
        <stop offset="0%" stopColor="#8AF0D4" />
        <stop offset="100%" stopColor="#42D6AC" />
      </linearGradient>
    </defs>
  );
}
