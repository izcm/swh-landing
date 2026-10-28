import type { LucideIcon } from "lucide-react";
import { glyphStrokeLucide } from "@/lib/svg";

// a menu board's header: an icon and a title next to it, centered in the
// header's height. drawn from (0, 0)
export function MenuBoardHeader({
  height,
  icon: Icon,
  title,
}: {
  height: number; // the header row's height, everything is sized from it
  icon: LucideIcon;
  title: string;
}) {
  const header = (() => {
    const iconSize = height * 0.6; // knob
    const gap = height * 0.25; // knob: icon → title
    const fontSize = height * 0.45; // knob
    return {
      iconSize,
      fontSize,
      icon: { x: 0, y: (height - iconSize) / 2 },
      title: { x: iconSize + gap, y: height / 2 },
    };
  })();

  return (
    <>
      <Icon
        x={header.icon.x}
        y={header.icon.y}
        size={header.iconSize}
        stroke="var(--accent-electric)"
        strokeWidth={glyphStrokeLucide(header.iconSize, 0.9)}
      />
      <text
        x={header.title.x}
        y={header.title.y}
        dominantBaseline="central"
        fontSize={header.fontSize}
        fontWeight={500}
        fill="var(--accent-glow)"
        fillOpacity={0.9}
      >
        {title}
      </text>
    </>
  );
}
