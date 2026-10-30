import type { LucideIcon } from "lucide-react";
import { glyphStrokeLucide } from "@/lib/svg";

// a menu board's header: an icon and a title next to it, centered in the
// header's height. drawn from (0, 0)
export function MenuBoardHeader({
  height,
  fontSize,
  icon: Icon,
  title,
}: {
  height: number; // the header row's height, the gap is sized from it
  fontSize: number; // the title's text size
  icon: LucideIcon;
  title: string;
}) {
  const header = (() => {
    const iconSize = fontSize * 1.33; // knob
    const gap = height * 0.25; // knob: icon → title
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
        fontSize={fontSize}
        fontWeight={500}
        fill="var(--color-fg-tinted)"
        fillOpacity={1}
      >
        {title}
      </text>
    </>
  );
}
