import { roundCorner, type Point, type ShapeProps } from "./helpers";

type Props = ShapeProps & {
  // slope of the top edge in degrees. 30 = true isometric
  angle?: number;
  size?: number;
  points?: Point[];
};

export function StandingSurface({
  x = 0,
  y = 0,
  size = 30,
  angle = 30,
}: Props) {
  const radians = (angle * Math.PI) / 180;
  //   const edgeLength = size / Math.cos(radians);
  // tan(angle) = opp / adj | opp = depth && adj = size
  // tan(angle) = depth / size -> tan(angle) * size = depth
  const depth = Math.tan(radians) * size;

  const topLeft = { x: 0, y: 0 };
  const topRight = { x: size, y: depth };

  const bottomLeft = { x: 0, y: size };
  const bottomRight = { x: size, y: size + depth };

  const points = [topLeft, topRight, bottomRight, bottomLeft];
  const n = points.length;
  //   const corners = points ?? [];
  const corners = points.map((corner, i) =>
    roundCorner(points[(i - 1 + n) % n], corner, points[(i + 1) % n], 4),
  );
  //   const { before, corner, after } = roundCorner(start, { x: 0, y: 0 }, end, 4);

  const path =
    corners
      .map(
        ({ before, corner, after }, i) =>
          `${i === 0 ? "M" : "L"} ${before.x} ${before.y} Q ${corner.x} ${corner.y} ${after.x} ${after.y}`,
      )
      .join(" ") + " Z";

  console.log(path);
  return (
    // <path
    //     d={roundedPolygonPath([topLeft, topBack, topRight, topFront], radius)}
    //     fill={topFill}
    //     stroke={edgeStroke}
    //     strokeWidth={strokeWidth}
    //   />
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={
          corners
            .map(
              ({ before, corner, after }, i) =>
                `${i === 0 ? "M" : "L"} ${before.x} ${before.y} Q ${corner.x} ${corner.y} ${after.x} ${after.y}`,
            )
            .join(" ") + " Z"
        }
        fill="none"
        stroke="var(--accent)"
      />
    </g>
  );
}
