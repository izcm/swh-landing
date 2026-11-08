import { Fragment, useId } from "react";
import { type Point } from "@/lib/svg";
import {
  ScandinaviaOrthographic,
  scandinaviaOrthographicBounds,
} from "./ScandinaviaOrthographic";
import { cities } from "./scandinaviaCities";

// blur: the circle's feGaussianBlur stdDeviation. not blurred if left out
type Ring = { radius: number; opacity: number; blur?: number };

const bluerAccent = "oklch(from var(--accent) calc(l - 0.2) c h)";
const whiterAccent = "oklch(from var(--accent) calc(l + 0.2) c h)";

// scandinavia's land, its coastline and the cities as glowing dots. `height`
// tall, its top-left at (x, y), turned `rotation` degrees around its middle
export function CityMap({
  x,
  y,
  height,
  rotation = 0,
  dotRadius,
}: {
  x: number;
  y: number;
  height: number;
  rotation?: number;
  dotRadius: number;
}) {
  const blurId = useId();

  const width =
    (height * scandinaviaOrthographicBounds.width) /
    scandinaviaOrthographicBounds.height;

  const everyCountry = (fill: string) => ({
    norway: fill,
    sweden: fill,
    denmark: fill,
    finland: fill,
  });

  const placement = {
    x,
    y,
    height,
    transform: `rotate(${rotation}, ${width * 0.5}, ${height * 0.5})`,
  };

  const countryFills = [
    { fill: "oklch(from var(--accent-dim) l c h)", opacity: 1 },
  ];

  // the outlines' coordinates, scaled to the size the map is drawn at
  const toDrawnMap = ({ x, y }: Point) => {
    const {
      x: boundsX,
      y: boundsY,
      height: boundsHeight,
    } = scandinaviaOrthographicBounds;
    const scale = height / boundsHeight;
    return { x: (x - boundsX) * scale, y: (y - boundsY) * scale };
  };

  // the map's spot and rotation, for things drawn on it with toDrawnMap
  const mapTransform = `translate(${placement.x}, ${placement.y}) ${placement.transform}`;

  // the cities' x, y are in the map's own coordinates, so they're scaled to the
  // size it's drawn at
  const cityDots = (() => {
    // flat see-through circles stacked under the dot, the biggest the faintest
    const rings: Ring[] = [
      { radius: dotRadius * 2, opacity: 0.12 },
      { radius: dotRadius * 1.4, opacity: 0.25 },
      { radius: dotRadius, opacity: 1 },
    ];

    // the busy cities: a bigger sharp dot over one big blurred circle
    const busyRings: Ring[] = [
      { radius: dotRadius * 4, opacity: 0.6, blur: dotRadius * 1.5 },
      { radius: dotRadius * 1.4, opacity: 1 },
    ];

    const veryBusyRings: Ring[] = [
      { radius: dotRadius * 6, opacity: 0.6, blur: dotRadius * 2 },
      { radius: dotRadius * 1.8, opacity: 1 },
    ];

    const mostBusyRings: Ring[] = [
      { radius: dotRadius * 6.5, opacity: 0.6, blur: dotRadius * 3 },
      { radius: dotRadius * 2.2, opacity: 1 },
    ];

    const points = Object.values(cities)
      .flat()
      .map(({ x, y, busy, veryBusy, mostBusy }) => ({
        ...toDrawnMap({ x, y }),
        rings: mostBusy
          ? mostBusyRings
          : veryBusy
            ? veryBusyRings
            : busy
              ? busyRings
              : rings,
      }));

    return { points };
  })();

  const landId = useId();

  return (
    <>
      <defs>
        <radialGradient id={landId} cx={0.5} cy={0} r={1}>
          <stop
            offset={0}
            stopColor="oklch(from var(--ground) l c h)"
            stopOpacity={1}
          />
          <stop
            offset={1}
            stopColor="oklch(from var(--accent-dim) l c h)"
            stopOpacity={1}
          />
        </radialGradient>
      </defs>

      {countryFills.map(({ fill, opacity }, i) => (
        <ScandinaviaOrthographic
          key={i}
          {...placement}
          fills={everyCountry(fill)}
          fillOpacity={1}
          stroke="none"
          strokeWidth={0}
        />
      ))}

      <ScandinaviaOrthographic
        {...placement}
        fills={everyCountry("none")}
        stroke="var(--accent-glow)"
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
                    fill="color-mix(in oklch, var(--accent), var(--accent-glow))"
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
    </>
  );
}
