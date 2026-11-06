import {
  addVector,
  DebugLines,
  DebugPoints,
  padVerticalSides,
  pointOnLine,
  splitWithGaps,
  type Point,
} from "@/lib/svg";
import { RecessedPolygon } from "./RecessedPolygon";
import { RegionSelect } from "./RegionSelect";
import { KPIsCard } from "./KPIsCard";
import { GaugeCard } from "./GaugeCard";

// the dashboard board's contents: three recessed panels, the KPI rows in the
// middle one and the gauge in the bottom one
export function Dashboard({
  board,
  unit,
}: {
  board: { corners: Point[] };
  unit: number;
}) {
  const innerTrapezoid = padVerticalSides(board.corners, unit * 0.4);

  const v = {
    x: innerTrapezoid[3].x - innerTrapezoid[0].x,
    y: innerTrapezoid[3].y - innerTrapezoid[0].y,
  };

  const height = innerTrapezoid[3].y - innerTrapezoid[0].y;

  const { sizes, starts } = splitWithGaps(height, [0.1, 0.6, 0.3], unit * 0.3);

  const [topLeft, topRight, bottomRight, bottomLeft] = innerTrapezoid;

  const corners = (i: number) => {
    const top = starts[i] / height;
    const bottom = (starts[i] + sizes[i]) / height;

    return [
      pointOnLine(topLeft, bottomLeft, top),
      pointOnLine(topRight, bottomRight, top),
      pointOnLine(topRight, bottomRight, bottom),
      pointOnLine(topLeft, bottomLeft, bottom),
    ];
  };

  return (
    <>
      {sizes.map((_, i) => (
        <>
          <RecessedPolygon
            points={corners(i)}
            radii={[6, 6, 6, 6]}
            strokeWidth={1}
            fillOpacity={0.15}
          />
        </>
      ))}
      {/* REGION SELECT */}
      <RegionSelect panel={corners(0)} unit={unit} />
      {/* KPIS */}
      <KPIsCard panel={corners(1)} unit={unit} />
      {/* GAUGE CARD */}
      <GaugeCard panel={corners(2)} unit={unit} />
      <DebugPoints
        points={starts.map((start) => ({
          x: innerTrapezoid[0].x,
          y: innerTrapezoid[0].y + start,
        }))}
        color="white"
      />
      <DebugLines
        lines={[[innerTrapezoid[0], addVector(innerTrapezoid[0], v)]]}
        color="#e0457b"
      />
      <DebugPoints points={innerTrapezoid} color={"white"} />
      <DebugPoints points={board.corners} color={"white"} />
      <rect />;
    </>
  );
}
