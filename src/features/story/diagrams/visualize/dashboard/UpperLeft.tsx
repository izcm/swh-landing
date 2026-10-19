import { LineChart, RecessedPanel } from "@/lib/svg";

// what's on the upper-left dashboard: a side panel on the left, a line chart on
// the right. fills exactly the width × height it's given (no padding around the
// outside). a plain <g> drawn from (0, 0); the diagram bends it onto the roof
export function UpperLeft({
  width,
  height,
  radius,
  unit,
  strokeWidth,
  paddingX,
  paddingY,
}: {
  width: number; // the area to fill
  height: number;
  radius: number; // corner radius of the boxes inside
  unit: number; // the diagram's ruler, shared by all five dashboards
  strokeWidth: number; // the boxes' border thickness
  paddingX: number; // around the chart box, left and right
  paddingY: number; // around the chart box, top and bottom
}) {
  // left: the side panel, flush with the edges, filled with the ground colour.
  // only its left corners are rounded: they sit on the dashboard's own rounded
  // corners. its right side meets the rest of the dashboard, so it stays sharp
  const sidePanel = (() => {
    const groupWidth = width * 0.25;
    const groupHeight = height;
    const r = radius;
    // clockwise from the top edge, the same curve as roundedPolygonPath's corners
    const outlinePath = `M ${r} 0 H ${groupWidth} V ${groupHeight} H ${r} Q 0 ${groupHeight} 0 ${groupHeight - r} V ${r} Q 0 0 ${r} 0 Z`;

    return { groupWidth, groupHeight, outlinePath };
  })();

  // right: the rest of the width. the chart box sits paddingX / paddingY in
  // from its edges, with ChartRow's box background and the line chart filling it
  const chartBox = (() => {
    const groupWidth = width - sidePanel.groupWidth;
    const groupHeight = height;
    const translateX = sidePanel.groupWidth; // right after the side panel

    // the padded area: the box and the line chart both fill it
    const content = {
      x: paddingX,
      y: paddingY,
      width: groupWidth - paddingX * 2,
      height: (groupHeight - paddingY * 2) * 0.6,
    };

    return { groupWidth, groupHeight, translateX, content };
  })();

  // the line chart: same look as act's ChartRow, its own curve, nothing selected
  const lineChart = (() => {
    const { content } = chartBox;
    // the curve: a steady climb with three round waves that grow a little from
    // left to right, so they aren't all the same. stays between about 0.2 and 0.8
    const climb = (x: number) =>
      0.18 + 0.55 * x + 0.1 * (0.7 + 0.6 * x) * Math.sin(6 * Math.PI * x + 0.4);
    const values = Array.from({ length: 85 }, (_, i) => climb(i / 84));

    return (
      <LineChart
        width={content.width}
        height={content.height}
        values={values}
        color="var(--accent-deep)"
        dotRadius={unit * 0.035}
        areaOpacity={0.06}
        areaRadius={radius} // same corners as the box
      />
    );
  })();

  return (
    <g>
      {/* the side panel: a deeper tint of the dashboard's ink (--accent-ink is
          0.17 lightness), and a faint electric line where it meets the rest */}
      <path
        d={sidePanel.outlinePath}
        fill="oklch(from var(--accent) 0.15 0.04 h)"
      />
      <line
        x1={sidePanel.groupWidth}
        y1={0}
        x2={sidePanel.groupWidth}
        y2={sidePanel.groupHeight}
        stroke="var(--accent-electric)"
        strokeOpacity={0.2}
        strokeWidth={strokeWidth}
      />

      {/* debug: the area to fill */}
      <rect
        className="svg-debug-visualize"
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
      {/* debug: the side panel's area */}
      <rect
        className="svg-debug-visualize"
        width={sidePanel.groupWidth}
        height={sidePanel.groupHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />

      {/* the chart box: padded in from its edges, ChartRow's background, the
          line chart filling it */}
      <g
        transform={`translate(${chartBox.translateX + chartBox.content.x}, ${chartBox.content.y})`}
      >
        <RecessedPanel
          width={chartBox.content.width}
          height={chartBox.content.height}
          radius={radius}
          strokeWidth={strokeWidth}
        />
        {lineChart}
      </g>
    </g>
  );
}
