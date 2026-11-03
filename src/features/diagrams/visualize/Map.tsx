import { DebugPoints, layoutUnit, polygonPath, type Point } from "@/lib/svg";
import { ScandinaviaOrthographic } from "../shared/maps/ScandinaviaOrthographic";
import { WindowHeader } from "../shared/WindowHeader";
import { CornerDecorator } from "./CornerDecorator";
import { mapLayout } from "./mapLayout";

// the map board's contents: its header, the background under it, the corner
// brackets and the map
export function Map({
  board,
  radius,
  unit,
  mapFill,
}: {
  board: { corners: Point[]; width: number; height: number; transform: string };
  radius: number;
  unit: number;
  mapFill: string;
}) {
  const [topLeft, topRight, bottomRight, bottomLeft] = board.corners;

  const headerHeight = board.height * 0.1;

  // the area under the header: the board's top edge moved down by headerHeight,
  // which is exactly where WindowHeader's line lands inside the board's transform
  const area = [
    { x: topLeft.x, y: topLeft.y + headerHeight },
    { x: topRight.x, y: topRight.y + headerHeight },
    bottomRight,
    bottomLeft,
  ];

  const { innerTrapezoid, cornerDecorators, map } = mapLayout({
    corners: area,
    unit,
    boardWidth: board.width,
    boardHeight: board.height,
    top: headerHeight,
  });

  return (
    <>
      {/* sharp top corners under the header, bottom corners rounded like the board */}
      <path
        d={polygonPath(area, [0, 0, radius, radius])}
        fill="var(--ground)"
        opacity={0.75}
      />

      <g transform={board.transform}>
        <WindowHeader
          width={board.width}
          height={headerHeight}
          itemHeight={headerHeight * 0.2}
          contentX={layoutUnit(headerHeight) * 4}
        />
      </g>

      {cornerDecorators.map((arms, i) => (
        <CornerDecorator
          key={i}
          {...arms}
          stroke="var(--accent)"
          strokeWidth={1.5}
          radius={3}
        />
      ))}

      <DebugPoints points={innerTrapezoid} radius={3} color="#aab4e6" />

      <g transform={board.transform}>
        <ScandinaviaOrthographic
          x={map.x}
          y={map.y}
          height={map.height}
          fills={{
            norway: mapFill,
            sweden: mapFill,
            denmark: mapFill,
            finland: mapFill,
          }}
          transform={`rotate(${map.rotation}, ${map.width * 0.5}, ${map.height * 0.5})`}
          stroke="var(--accent)"
          strokeWidth={0.75}
        />
      </g>
    </>
  );
}
