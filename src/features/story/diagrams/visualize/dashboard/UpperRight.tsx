import { contentBoxLayout } from "@/lib/svg";

// what's on the upper-right dashboard: a header and two rows of equal size.
// fills exactly the width × height it's given (no padding around the
// outside). a plain <g> drawn from (0, 0); the diagram bends it onto the roof
export function UpperRight({
  width,
  height,
  radius,
  unit,
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
  // the whole width, split into rows: the header, then two rows of equal size
  const contentBox = contentBoxLayout({
    width,
    height,
    unit,
    paddingXUnits,
    paddingYUnits,
    rowShares: [0.025, 0.4875, 0.4875],
  });

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

      {/* debug: each row's area */}
      <g
        transform={`translate(${contentBox.translateX + contentBox.content.x}, ${contentBox.content.y})`}
      >
        {contentBox.rows.starts.map((start, i) => (
          <rect
            key={i}
            className="svg-debug"
            y={start}
            width={contentBox.content.width}
            height={contentBox.rows.sizes[i]}
            fill="none"
            stroke="#aab4e6" // lavender
            strokeWidth={0.75}
            strokeDasharray="6 4"
          />
        ))}
      </g>
    </g>
  );
}
