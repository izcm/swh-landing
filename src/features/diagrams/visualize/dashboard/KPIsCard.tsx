import {
  alignEnd,
  LineChart,
  splitWithGaps,
  stackWithGaps,
  toDegrees,
  type Point,
} from "@/lib/svg";
import { skewAtT } from "./skewAtT";

// the KPI rows: a number per row and a line between rows, each slanted like
// the panel at its height
export function KPIsCard({ panel, unit }: { panel: Point[]; unit: number }) {
  const panelWidth = panel[1].x - panel[0].x;
  const panelHeight = panel[3].y - panel[0].y;
  const paddingX = unit * 0.35;
  const count = 3;
  const { sizes, starts, dividers } = splitWithGaps(
    panelHeight,
    Array.from({ length: count }, () => 1 / count),
    unit * 0,
  );
  const itemHeight = sizes[0];
  const contentWidth = panelWidth - paddingX * 2;

  // one row, measured from its middle line: the title over the value, the
  // trend after the value, and the line chart at the row's right end
  const row = (() => {
    const titleSize = itemHeight * 0.18;
    const valueSize = itemHeight * 0.4;
    const { starts: lineStarts } = stackWithGaps(
      [titleSize, valueSize],
      itemHeight * 0.08,
    );
    const top = -(lineStarts[1] + valueSize) * 0.5;

    const chart = (() => {
      const width = contentWidth * 0.3;
      const height = itemHeight * 0.4;
      const { offset } = alignEnd(contentWidth, width);
      return { x: paddingX + offset, y: -height * 0.5, width, height };
    })();

    return {
      title: { y: top + lineStarts[0] + titleSize * 0.5, fontSize: titleSize },
      value: { y: top + lineStarts[1] + valueSize * 0.5, fontSize: valueSize },
      trend: { dx: valueSize * 0.3, fontSize: titleSize },
      chart,
    };
  })();

  const kpis = [
    {
      title: "Active areas",
      value: "28",
      trend: "▲ +12%",
      chart: [0.2, 0.35, 0.3, 0.5, 0.45, 0.7, 0.65, 0.9],
    },
    {
      title: "Transactions",
      value: "1,284",
      trend: "▲ +8%",
      chart: [0.3, 0.25, 0.45, 0.4, 0.6, 0.55, 0.75, 0.8],
    },
    {
      title: "Pending",
      value: "97",
      trend: "▼ -4%",
      chart: [0.4, 0.55, 0.45, 0.6, 0.5, 0.65, 0.6, 0.7],
    },
  ];

  const rowTransform = (y: number) =>
    `translate(0, ${y}) skewY(${toDegrees(skewAtT(panel, y / panelHeight))})`;

  return (
    <g transform={`translate(${panel[0].x}, ${panel[0].y})`}>
      {starts.map((start, i) => {
        const { title, value, trend, chart } = row;
        const kpi = kpis[i];
        return (
          <g key={i} transform={rowTransform(start + itemHeight * 0.5)}>
            {/* title */}
            <text
              x={paddingX}
              y={title.y}
              fill="var(--fg)"
              fillOpacity={0.6}
              dominantBaseline="central"
              fontSize={title.fontSize}
            >
              {kpi.title}
            </text>
            {/* value, then its trend */}
            <text
              x={paddingX}
              y={value.y}
              fill="var(--fg)"
              dominantBaseline="central"
              fontSize={value.fontSize}
              fontWeight={300}
            >
              {kpi.value}
              <tspan
                dx={trend.dx}
                fontSize={trend.fontSize}
                fill="var(--accent-electric)"
              >
                {kpi.trend}
              </tspan>
            </text>
            {/* line chart */}
            <LineChart
              {...chart}
              values={kpi.chart}
              color="var(--accent-electric)"
              strokeWidth={1.2}
            />
          </g>
        );
      })}
      {/* separators */}
      {dividers.map((y, i) => (
        <g key={i} transform={rowTransform(y)}>
          <line
            x1={paddingX}
            x2={panelWidth - paddingX}
            stroke="var(--accent)"
            strokeOpacity={0.4}
            strokeWidth={0.75}
          />
        </g>
      ))}
    </g>
  );
}
