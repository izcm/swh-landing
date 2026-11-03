import { Fragment, useId } from "react";
import {
  DebugPoints,
  layoutUnit,
  polygonPath,
  recessedFills,
  type Point,
} from "@/lib/svg";
import {
  ScandinaviaOrthographic,
  scandinaviaOrthographicBounds,
} from "../shared/maps/ScandinaviaOrthographic";
import { WindowHeader } from "../shared/WindowHeader";
import { CornerDecorator } from "./CornerDecorator";
import { cities } from "./data";
import { graticuleLayout } from "./graticuleLayout";
import { mapLayout } from "./mapLayout";

// blur: the circle's feGaussianBlur stdDeviation. not blurred if left out
type Ring = { radius: number; opacity: number; blur?: number };

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
  const blurId = useId();
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

  const everyCountry = (fill: string) => ({
    norway: fill,
    sweden: fill,
    denmark: fill,
    finland: fill,
  });

  const placement = {
    x: map.x,
    y: map.y,
    height: map.height,
    transform: `rotate(${map.rotation}, ${map.width * 0.5}, ${map.height * 0.5})`,
  };

  const countryFills = [
    ...recessedFills,
    { fill: "oklch(from var(--accent) 0.08 0.02 h)", opacity: 0.18 },
  ];

  // the outlines' coordinates, scaled to the size the map is drawn at
  const toDrawnMap = ({ x, y }: Point) => {
    const { x: boundsX, y: boundsY, height } = scandinaviaOrthographicBounds;
    const scale = map.height / height;
    return { x: (x - boundsX) * scale, y: (y - boundsY) * scale };
  };

  // the map's spot and rotation, for things drawn on it with toDrawnMap
  const mapTransform = `translate(${placement.x}, ${placement.y}) ${placement.transform}`;

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

  // the cities' x, y are in the map's own coordinates, so they're scaled to the
  // size it's drawn at
  const cityDots = (() => {
    const radius = unit * 0.07;

    // flat see-through circles stacked under the dot, the biggest the faintest
    const rings: Ring[] = [
      { radius: radius * 2, opacity: 0.12 },
      { radius: radius * 1.4, opacity: 0.25 },
      { radius, opacity: 1 },
    ];

    // the busy cities: a bigger sharp dot over one big blurred circle
    const busyRings: Ring[] = [
      { radius: radius * 3.5, opacity: 0.6, blur: radius * 1.4 },
      { radius: radius * 1.4, opacity: 1 },
    ];

    const veryBusyRings: Ring[] = [
      { radius: radius * 6, opacity: 0.6, blur: radius * 2.4 },
      { radius: radius * 1.8, opacity: 1 },
    ];

    const points = Object.values(cities)
      .flat()
      .map(({ x, y, busy, veryBusy }) => ({
        ...toDrawnMap({ x, y }),
        rings: veryBusy ? veryBusyRings : busy ? busyRings : rings,
      }));

    return { points };
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
        {countryFills.map(({ fill, opacity }, i) => (
          <ScandinaviaOrthographic
            key={i}
            {...placement}
            fills={everyCountry(fill)}
            fillOpacity={opacity}
            stroke="none"
            strokeWidth={0}
          />
        ))}
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

      <g transform={board.transform}>
        <ScandinaviaOrthographic
          {...placement}
          fills={everyCountry("none")}
          stroke="var(--accent)"
          strokeWidth={0.75}
        />
        {/* city dots */}
        <g transform={mapTransform}>
          {cityDots.points.map(({ x, y, rings }, i) => (
            <g key={i}>
              {rings.map(({ radius, opacity, blur }, j) => {
                const filterId = `${blurId}-${i}-${j}`;
                return (
                  <Fragment key={j}>
                    {/* room for the blur: it reaches ~3× its stdDeviation past the circle */}
                    {blur !== undefined && (
                      <filter
                        id={filterId}
                        x="-100%"
                        y="-100%"
                        width="300%"
                        height="300%"
                      >
                        <feGaussianBlur stdDeviation={blur} />
                      </filter>
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill="color-mix(in oklch, var(--accent-electric), var(--accent-glow))"
                      fillOpacity={opacity}
                      filter={
                        blur !== undefined ? `url(#${filterId})` : undefined
                      }
                    />
                  </Fragment>
                );
              })}
            </g>
          ))}
        </g>
      </g>
    </>
  );
}
