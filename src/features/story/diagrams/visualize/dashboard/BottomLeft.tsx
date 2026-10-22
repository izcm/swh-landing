import { alignEnd, contentBoxLayout, WindowDots } from "@/lib/svg";
import type { ChartData } from "../data";
import { CardBackground } from "./CardBackground";
import { TitleTube } from "./header-elements";

// what's on the lower-left dashboard: a header, then one card filling the
// rest. fills exactly the width × height it's given (no padding around the
// outside). a plain <g> drawn from (0, 0); the diagram bends it onto the roof
export function BottomLeft({
  width,
  height,
  radius,
  unit,
  strokeWidth,
  paddingXUnits,
  paddingYUnits,
}: {
  width: number; // the area to fill
  height: number;
  radius: number; // corner radius of the boxes inside
  unit: number; // the diagram's ruler, shared by all five dashboards
  strokeWidth: number; // the boxes' border thickness
  paddingXUnits: number; // around the content, left and right, in units
  paddingYUnits: number; // around the content, top and bottom, in units
  colorSelection: string[]; // colors to pick from, in order
  chartData: ChartData; // what the charts draw
}) {
  // the whole width, split into rows: the header, then the card
  const contentBox = contentBoxLayout({
    width,
    height,
    unit,
    paddingXUnits,
    paddingYUnits,
    rowShares: [0.025, 0.975],
  });

  const { content, rows } = contentBox;

  return (
    <g>
      {/* debug: the area to fill */}
      <rect
        className="svg-debug"
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />

      {/* the content box: the header, then the card */}
      <g
        transform={`translate(${contentBox.translateX + content.x}, ${content.y})`}
      >
        {[
          <Header width={content.width} height={rows.sizes[0]} />,
          <CardBackground
            width={content.width}
            height={rows.sizes[1]}
            radius={radius}
            strokeWidth={strokeWidth * 0.5}
          />,
        ].map((group, i) => (
          <g key={i} transform={`translate(0, ${rows.starts[i]})`}>
            {group}
          </g>
        ))}
      </g>
    </g>
  );
}

// the header: a title on the left, as tall as the header row, and the window
// dots on the right, a bit bigger than the row. drawn from (0, 0)
function Header({
  width,
  height,
}: {
  width: number; // the header row's width
  height: number; // the header row's height
}) {
  const titleWidth = width * 0.25;

  // the window dots: 1.5 × as tall as the row, so they stick out the same
  // amount above and below it. two radii apart, flush right
  const dots = (() => {
    const scale = 1.5; // the dots' height against the row's
    const radius = (height / 2) * scale;
    const gap = radius * 2;
    const dotsWidth = radius * 2 * 3 + gap * 2; // WindowDots draws three
    const { offset: translateX } = alignEnd(width, dotsWidth);

    return { radius, gap, translateX };
  })();

  return (
    <g>
      <TitleTube width={titleWidth} height={height} />
      <g transform={`translate(${dots.translateX}, 0)`}>
        <WindowDots height={height} radius={dots.radius} gap={dots.gap} />
      </g>
    </g>
  );
}
