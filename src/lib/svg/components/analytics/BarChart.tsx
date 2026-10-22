import { equalizerLayout } from "../../layouts";
import { chartSeparatorStyle } from "../../logic";

type BarChartProps = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  values: number[]; // each 0-1, normalized bar height — swap for animated values later
  color?: string; // every bar's fill; the picked bar is a brighter version of it. var(--accent) if left out
  opacity?: number; // every bar's opacity. 1 if left out
  selectedIdx?: number; // the picked bar: brighter, the others dimmed. none if left out
  // how much of its slot each bar fills, 0-1 (each bar gets width / values.length)
  barRatio: number;
};

export function BarChart({
  x = 0,
  y = 0,
  width,
  height,
  values,
  color = "var(--accent)",
  opacity = 1,
  selectedIdx,
  barRatio,
}: BarChartProps) {
  // where each bar goes
  const { columns: bars } = equalizerLayout({
    width,
    height,
    values,
    columnRatio: barRatio,
  });

  // the faint guide lines: evenly spaced, 1/4, 2/4, 3/4 of the height
  const separatorCount = 3;
  const separatorYs = Array.from(
    { length: separatorCount },
    (_, i) => (height * (i + 1)) / (separatorCount + 1),
  );

  // a bar's fill and opacity, all made from `color`: the picked one brighter
  // (more light, a bit more chroma) and fully opaque, the others dimmed while
  // one is picked, all the same when nothing is
  const barStyle = (i: number) => {
    if (selectedIdx === undefined) return { fill: color, fillOpacity: opacity };
    return i === selectedIdx
      ? {
          fill: `oklch(from ${color} calc(l + 0.1) calc(c + 0.05) h / 0.75)`,
          fillOpacity: 1,
        }
      : { fill: color, fillOpacity: opacity * 0.65 };
  };

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* same faint dashed lines as LineChart, behind the bars */}
      {separatorYs.map((separatorY, i) => (
        <line
          key={i}
          x1={width * 0.04}
          y1={separatorY}
          x2={width * 0.96}
          y2={separatorY}
          stroke="var(--accent)"
          {...chartSeparatorStyle}
        />
      ))}

      {bars.map((bar, i) => (
        <rect key={i} {...bar} rx="1" {...barStyle(i)} />
      ))}
    </g>
  );
}
