import { Settings } from "lucide-react";
import { WindowDots } from "@/lib/svg";
import { MenuBoardHeader } from "../shared/MenuBoardHeader";

// the automate rule board's header: gear icon + title on the left, the
// window dots at the right end. drawn in a width × height box from (0, 0)
export function AutomationRulesHeader({
  width,
  height,
  fontSize,
}: {
  width: number;
  height: number;
  fontSize: number; // the title's text size
}) {
  const dots = (() => {
    const radius = height * 0.0875; // knob
    const gap = radius * 2.4; // knob
    const dotsWidth = radius * 6 + gap * 2;
    return { radius, gap, x: width - dotsWidth }; // flush with the right edge
  })();

  return (
    <>
      <MenuBoardHeader
        height={height}
        fontSize={fontSize}
        icon={Settings}
        title="Automation Rules"
      />
      <g transform={`translate(${dots.x}, 0)`}>
        <WindowDots height={height} radius={dots.radius} gap={dots.gap} />
      </g>
    </>
  );
}
