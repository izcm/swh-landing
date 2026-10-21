import {
  alignEnd,
  contentBoxLayout,
  stackWithGaps,
  WindowDots,
} from "@/lib/svg";
import { CardBackground } from "./CardBackground";
import { TitleTube } from "./header-elements";

// what's on the lower-middle dashboard: a header, then a row of two cards (2/3
// and 1/3 wide), then one card across the whole width. fills exactly the
// width × height it's given (no padding around the outside). a plain <g>
// drawn from (0, 0); the diagram bends it onto the roof
export function BottomCenter({
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
}) {
  // the whole width, split into rows: the header, then two card rows of the
  // same height
  const contentBox = contentBoxLayout({
    width,
    height,
    unit,
    paddingXUnits,
    paddingYUnits,
    rowShares: [0.025, 0.4875, 0.4875],
  });

  const { content, rows, paddingX } = contentBox;

  // the top card row: two columns, paddingX apart. the left one gets 2/3 of
  // the width left after the gap, the right one 1/3
  const topRow = (() => {
    const gap = paddingX; // between the two columns
    const space = content.width - gap;
    const sizes = [space * (2 / 3), space * (1 / 3)];
    const { starts } = stackWithGaps(sizes, gap);

    return { sizes, starts };
  })();

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

      {/* the content box: the header, the top row of two cards, the wide card */}
      <g
        transform={`translate(${contentBox.translateX + content.x}, ${content.y})`}
      >
        {[
          <Header width={content.width} height={rows.sizes[0]} />,
          topRow.starts.map((x, i) => (
            <g key={i} transform={`translate(${x}, 0)`}>
              <CardBackground
                width={topRow.sizes[i]}
                height={rows.sizes[1]}
                radius={radius}
                strokeWidth={strokeWidth * 0.5}
              />
            </g>
          )),
          <CardBackground
            width={content.width}
            height={rows.sizes[2]}
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
