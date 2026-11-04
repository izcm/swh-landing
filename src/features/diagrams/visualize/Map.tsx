import { useId } from "react";
import { DebugPoints, layoutUnit, polygonPath, type Point } from "@/lib/svg";
import { CityMap } from "../shared/maps/CityMap";
import { WindowHeader } from "../shared/WindowHeader";
import { CornerDecorator } from "./CornerDecorator";
import { graticuleLayout } from "./graticuleLayout";
import { mapLayout } from "./mapLayout";

// the map board's contents: its header, the background under it, the corner
// brackets and the map
export function Map({
  board,
  radius,
  unit,
}: {
  board: { corners: Point[]; width: number; height: number; transform: string };
  radius: number;
  unit: number;
}) {
  const [topLeft, topRight, bottomRight, bottomLeft] = board.corners;
  const frameClipId = useId();

  const headerHeight = board.height * 0.1;
  const bracketRadius = 3;

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

  // the map's spot and rotation, for the grid drawn on it
  const mapTransform = `translate(${map.x}, ${map.y}) rotate(${map.rotation}, ${map.width * 0.5}, ${map.height * 0.5})`;

  // the grid's knobs. the closer the pole, the more the lines bend
  const graticule = (() => {
    const pole = { x: map.width * 0.5, y: -map.height * 0.4 };

    const reach =
      Math.hypot(pole.x, pole.y) + Math.hypot(board.width, board.height);

    const { rings, rays } = graticuleLayout({
      pole,
      ringGap: map.height * 0.25,
      rayAngle: 12,
      reach,
    });

    return { pole, rings, rays };
  })();

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

      {/* the frame under the corner brackets, its corners rounded like theirs */}
      <path
        d={polygonPath(
          innerTrapezoid,
          innerTrapezoid.map(() => bracketRadius),
        )}
        fill="var(--ground)"
        stroke="var(--accent)"
        strokeOpacity={0.2}
        strokeWidth={0.5}
      />

      {cornerDecorators.map((arms, i) => (
        <CornerDecorator
          key={i}
          {...arms}
          stroke="var(--accent)"
          strokeWidth={1.5}
          radius={bracketRadius}
        />
      ))}

      <DebugPoints points={innerTrapezoid} radius={3} color="#aab4e6" />

      <g transform={board.transform}>
        <CityMap
          x={map.x}
          y={map.y}
          height={map.height}
          rotation={map.rotation}
          dotRadius={unit * 0.07}
        />
      </g>

      <defs>
        <clipPath id={frameClipId}>
          <path d={polygonPath(innerTrapezoid, [0, 0, 0, 0])} />
        </clipPath>
      </defs>
      {/* graticule */}
      <g clipPath={`url(#${frameClipId})`}>
        <g transform={board.transform}>
          <g transform={mapTransform}>
            {(() => {
              const { pole, rings, rays } = graticule;
              return (
                <g
                  fill="none"
                  stroke="var(--accent)"
                  strokeOpacity={0.08}
                  strokeWidth={0.6}
                >
                  {rings.map((r, i) => (
                    <circle key={i} cx={pole.x} cy={pole.y} r={r} />
                  ))}
                  {rays.map((end, i) => (
                    <line
                      key={i}
                      x1={pole.x}
                      y1={pole.y}
                      x2={end.x}
                      y2={end.y}
                    />
                  ))}
                </g>
              );
            })()}
          </g>
        </g>
      </g>
    </>
  );
}
