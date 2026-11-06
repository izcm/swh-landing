import {
  alignCenter,
  layoutUnit,
  paddedBox,
  splitWithGaps,
} from "@/lib/svg";
import {
  ScandinaviaMap,
  scandinaviaMapBounds,
} from "../../shared/maps/ScandinaviaMap";
import { ChartRow } from "./ChartRow";
import { List } from "./List";

// what's inside the dashboard window: charts on top, a list below.
// fills exactly the width × height it's given (the caller decides the padding
// around it). a plain <g> drawn from (0, 0)
export function DashboardContent({
  width,
  height,
  radius,
  drilldown,
}: {
  width: number; // the area to fill
  height: number;
  radius: number; // corner radius of the chart boxes and the list rows
  drilldown?: boolean; // consumer decides if dashboard displays highlighted areas on graphs for the "drilldown" look
}) {
  // the dashboard's own ruler for gaps and dot sizes, from its own height.
  // shared by the charts row and the list so their sizes match
  const unit = layoutUnit(height);

  const rowGap = unit * 0.5;
  const { sizes: rowSizes, starts: rowStarts } = splitWithGaps(
    height,
    [0.45, 0.55],
    rowGap,
  );

  const columnGap = unit * 0.75;

  // second row: two columns like the chart row, the list on the left and
  // the map on the right, shared 65 / 35 after the gap
  const bottomColumns = (() => {
    const { sizes, starts } = splitWithGaps(width, [0.65, 0.35], columnGap);
    return { sizes, starts };
  })();

  // right column: a box like the chart boxes, the whole row tall, with the
  // map in it: as tall as the box minus 1 unit top and bottom, centered across
  // the box
  const scandinaviaMap = (() => {
    const panelWidth = bottomColumns.sizes[1];
    const panelHeight = rowSizes[1];
    const box = paddedBox(panelWidth, panelHeight, 1, 1, unit); // knob: 1 unit

    const height = box.contentHeight;
    const width =
      (height * scandinaviaMapBounds.width) / scandinaviaMapBounds.height;

    const { offset: translateX } = alignCenter(panelWidth, width);
    const translateY = box.contentY;

    return { panelWidth, panelHeight, height, translateX, translateY };
  })();

  // what goes in each column of the second row, left to right
  const bottomContent = [
    <List
      width={bottomColumns.sizes[0]}
      height={rowSizes[1]}
      unit={unit}
      radius={radius}
      rowCount={4}
      rowGap={rowGap * 0.5}
      selectedIdx={drilldown ? 1 : undefined} // the picked row, or none without drilldown
    />,
    // the map in its box
    (() => {
      const {
        panelWidth,
        panelHeight,
        height: mapHeight,
        translateX,
        translateY,
      } = scandinaviaMap;
      return (
        <>
          <rect
            width={panelWidth}
            height={panelHeight}
            rx={radius}
            fill="var(--ground)"
            stroke="var(--accent-faint)"
            strokeWidth={1}
          />
          <ScandinaviaMap
            x={translateX}
            y={translateY}
            opacity={0.65} // knob
            height={mapHeight}
            fills={{
              norway: "none",
              sweden: "none",
              denmark: "none",
              finland: "none",
            }}
            stroke="var(--accent)"
            strokeWidth={0.5}
          />
        </>
      );
    })(),
  ];

  const rowContent = [
    <ChartRow
      width={width}
      height={rowSizes[0]}
      gap={columnGap}
      unit={unit}
      boxRadius={radius}
      boxStrokeWidth={1}
      drilldown={drilldown}
    />,
    <>
      {bottomColumns.starts.map((columnX, i) => (
        <g key={i} transform={`translate(${columnX}, 0)`}>
          {bottomContent[i]}
        </g>
      ))}
    </>,
  ];

  return (
    <g>
      {rowStarts.map((rowY, i) => (
        <g key={i} transform={`translate(0, ${rowY})`}>
          {/* debug: the row's box */}
          <rect
            className="svg-debug"
            x={0}
            y={0}
            width={width}
            height={rowSizes[i]}
            fill="none"
            stroke="#aab4e6" // lavender
            strokeWidth={0.75}
            strokeDasharray="6 4"
          />
          {rowContent[i]}
        </g>
      ))}
    </g>
  );
}
