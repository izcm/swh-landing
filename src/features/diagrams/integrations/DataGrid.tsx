import { layoutUnit, placeItemCenter, stackWithGaps, Tube } from "@/lib/svg";
import type { IntegrationsLayout } from "./layout";

// the right box: two tilted windows, the front one holding a table of pills.
// the windows' stack and position come from integrationsLayout
export function DataGrid({ layout }: { layout: IntegrationsLayout["dataGrid"] }) {
  const { translateX, translateY, stackLayout } = layout;

  const { item } = stackLayout;
  // 1/12 of a window's height: the table's ruler
  const unit = layoutUnit(item.height);

  const columnCount = 3;
  // the table: as wide as the window minus one unit each side
  const tableWidth = item.width - unit * 2; // knob
  const columnSize = tableWidth / columnCount;

  const columns = stackWithGaps(
    Array.from({ length: columnCount }, () => columnSize),
    0,
  );

  const rowCount = 7;
  const pillHeight = unit * 0.45;
  const rowGap = unit;
  const rows = stackWithGaps(
    Array.from({ length: rowCount }, () => pillHeight),
    rowGap,
  );

  // the table's height: from the first row's top to the last row's bottom
  const tableHeight = rows.starts[rowCount - 1] + pillHeight;

  // the table, centered in the front window
  const { offsetX, offsetY } = placeItemCenter({
    parentWidth: item.width,
    parentHeight: item.height,
    itemWidth: tableWidth,
    itemHeight: tableHeight,
  });

  // space between a column's left edge and its pills
  const pillInset = unit * 0.25;
  const pillMaxWidth = columnSize - pillInset * 2;
  // how wide each pill is (0..1 of pillMaxWidth), one array per column
  const pillWidths = [
    [0.6, 0.8, 0.55, 0.7, 0.8, 0.6, 0.75],
    [0.65, 0.65, 0.8, 0.6, 0.8, 0.6, 0.7],
    [0.6, 0.8, 0.6, 0.65, 0.8, 0.6, 0.8],
  ];
  const pillColors = [
    "var(--muted)",
    "var(--accent)",
    "var(--accent-bright)",
    "var(--accent-glow)",
  ];
  // which pillColors color each pill gets, one array per column
  const pillShades = [
    [0, 1, 0, 0, 2, 0, 0],
    [0, 0, 3, 0, 0, 1, 0],
    [2, 0, 0, 1, 0, 0, 3],
  ];

  // drawn inside the front window
  const frontContent = (
    <>
      <g transform={`translate(${offsetX}, ${offsetY})`}>
        {columns.starts.map((start, i) => {
          return (
            <rect
              key={i}
              className="svg-debug"
              x={start}
              y={0}
              width={columnSize}
              height={tableHeight}
              fill="none"
              stroke="purple" // lavender
              strokeWidth={0.75}
              strokeDasharray="6 4"
            />
          );
        })}

        {/* row borders, in the middle of the gaps (none after the last row) */}
        {rows.dividers.map((y, i) => (
          <line
            key={i}
            x1={0}
            y1={y}
            x2={tableWidth}
            y2={y}
            stroke="var(--accent-faint)"
            opacity={0.2}
            strokeWidth={1}
          />
        ))}

        {/* column borders, between the columns (none on the outer edges) */}
        {columns.dividers.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={0}
            x2={x}
            y2={tableHeight}
            stroke="var(--accent-faint)"
            opacity={0.2}
            strokeWidth={1}
          />
        ))}

        {/* pills: x from the column, y from the row */}
        {columns.starts.map((columnX, c) =>
          rows.starts.map((rowY, r) => (
            <Tube
              key={`${c}-${r}`}
              x={columnX + pillInset}
              y={rowY}
              width={pillMaxWidth}
              height={pillHeight}
              level={pillWidths[c][r]}
              fill={pillColors[pillShades[c][r]]}
              fillOpacity={0.8}
            />
          )),
        )}
      </g>
    </>
  );

  return (
    // the windows, back to front, fading from 0.6 at the back
    <g
      transform={`translate(${translateX}, ${translateY}) ${stackLayout.transform}`}
    >
      {stackLayout.items.map((win, i) => (
        <g
          key={i}
          transform={`translate(${win.x}, ${win.y})`}
          // opacity={0.6 + win.depth * 0.4}
          opacity={1}
        >
          <rect
            width={win.width}
            height={win.height}
            rx={3}
            fill="var(--pane-fill)"
            stroke="var(--accent-ink)"
            strokeWidth={0.8}
          />
          {win.isFront && frontContent}
        </g>
      ))}
    </g>
  );
}
