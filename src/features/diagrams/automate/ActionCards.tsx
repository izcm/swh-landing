import { CircleCheck, FileText, Mail, type LucideIcon } from "lucide-react";

import {
  accentGlow,
  alignCenter,
  glyphStrokeLucide,
  stackWithGaps,
  type cascadeLayout,
} from "@/lib/svg";

import { CascadeBoards } from "../shared/CascadeBoards";

// one card per action: its icon and its label
const actions: { icon: LucideIcon; label: string }[] = [
  { icon: FileText, label: "Update record" },
  { icon: Mail, label: "Send notification" },
  { icon: CircleCheck, label: "Create task" },
];

// the automate diagram's actions: one small cascade of cards per action,
// stacked down to fill `height`. the front card shows the icon, the label
// and a glowing dot. drawn with the group's top-left at (0, 0)
export function ActionCards({
  layout,
  height,
  radius,
}: {
  layout: ReturnType<typeof cascadeLayout>; // one action's cascade
  height: number; // the group's height, the actions are spread over it
  radius: number; // the cards' corner radius
}) {
  const { front, item } = layout;

  // the actions, stacked down the group, `gap` apart
  const stack = (() => {
    const count = actions.length;
    // count actions + (count - 1) gaps fill the group's height
    const gap = (height - layout.stackHeight * count) / (count - 1);
    const { starts } = stackWithGaps(
      Array.from({ length: count }, () => layout.stackHeight),
      gap,
    );
    return { starts };
  })();

  // inside the front card, left to right: the icon, the label `gap` after it,
  // the dot at the end
  const card = (() => {
    const h = item.height;
    const insetX = h * 0.3; // knob: from the card's sides to the icon and to the dot
    const iconSize = h * 0.45; // knob
    const gap = h * 0.3; // knob: icon → label
    const fontSize = h * 0.28; // knob
    const dotRadius = h * 0.07; // knob

    const icon = {
      x: insetX,
      y: alignCenter(h, iconSize).offset,
      size: iconSize,
    };
    const text = { x: insetX + iconSize + gap, y: h / 2, fontSize };
    const dot = {
      cx: item.width - insetX - dotRadius,
      cy: h / 2,
      radius: dotRadius,
    };
    return { icon, text, dot };
  })();

  return (
    <>
      {actions.map(({ icon: Icon, label }, i) => {
        const { icon, text, dot } = card;
        return (
          <g key={i} transform={`translate(0, ${stack.starts[i]})`}>
            <g transform={layout.transform}>
              {/* the cards, back to front. the back one fades a bit */}
              <CascadeBoards layout={layout} radius={radius} backOpacity={0.6} />

              {/* the front card's content */}
              <g transform={`translate(${front.x}, ${front.y})`}>
                {/* icon */}
                <Icon
                  x={icon.x}
                  y={icon.y}
                  size={icon.size}
                  stroke="var(--accent-electric)"
                  strokeWidth={glyphStrokeLucide(icon.size, 1)}
                />
                {/* label */}
                <text
                  x={text.x}
                  y={text.y}
                  dominantBaseline="central"
                  fontSize={text.fontSize}
                  fill="var(--accent-glow)"
                  fillOpacity={0.8}
                >
                  {label}
                </text>
                {/* glowing accent dot at the end */}
                <circle
                  cx={dot.cx}
                  cy={dot.cy}
                  r={dot.radius}
                  fill="var(--accent)"
                  style={{ filter: accentGlow(4, 65) }} // knob
                />
              </g>
            </g>
          </g>
        );
      })}
    </>
  );
}
