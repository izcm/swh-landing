import {
  padVerticalSides,
  placeItemCenter,
  pointOnLine,
  roundCorner,
  scaleVector,
  type Point,
} from "@/lib/svg";
import { scandinaviaOrthographicBounds } from "../shared/maps/ScandinaviaOrthographic";

// everything on the map board: header line, area under it, corner brackets and
// the map. `map` is measured inside the board's transform, the rest in picture coordinates
export function mapLayout({
  boardCorners,
  boardWidth,
  boardHeight,
  radius,
  unit,
}: {
  boardCorners: Point[];
  boardWidth: number;
  boardHeight: number;
  radius: number;
  unit: number;
}) {
  const [topLeft, topRight, bottomRight, bottomLeft] = boardCorners;

  const header = (() => {
    const start = pointOnLine(topLeft, bottomLeft, 0.085);
    const end = pointOnLine(topRight, bottomRight, 0.085);
    const height = boardHeight * 0.1;

    return { start, end, height };
  })();

  // the board below the header line, with the board's own rounded bottom corners
  const underHeader = (() => {
    const { start, end } = header;
    const br = roundCorner(end, bottomRight, bottomLeft, radius);
    const bl = roundCorner(bottomRight, bottomLeft, start, radius);

    const d = [
      `M ${start.x} ${start.y}`,
      `L ${end.x} ${end.y}`,
      `L ${br.before.x} ${br.before.y}`,
      `Q ${bottomRight.x} ${bottomRight.y} ${br.after.x} ${br.after.y}`,
      `L ${bl.before.x} ${bl.before.y}`,
      `Q ${bottomLeft.x} ${bottomLeft.y} ${bl.after.x} ${bl.after.y}`,
      "Z",
    ].join(" ");

    return { d };
  })();

  const innerTrapezoid = (() => {
    const padding = unit * 0.5;
    const corners = padVerticalSides(
      [header.start, header.end, bottomRight, bottomLeft],
      padding,
    );

    return { corners };
  })();

  // decorator span this amount of inner trapezoid edges
  const bracketArmT = 0.075;

  const cornerDecorators = innerTrapezoid.corners.map((corner, i, all) => {
    const next = all[(i + 1) % all.length];
    const prev = all[(i + all.length - 1) % all.length];

    return {
      start: corner,
      u: scaleVector({ x: next.x - corner.x, y: next.y - corner.y }, bracketArmT),
      v: scaleVector({ x: prev.x - corner.x, y: prev.y - corner.y }, bracketArmT),
    };
  });

  // centered in the board's content box, below the header
  const map = (() => {
    const height = boardHeight * 0.95;
    const width =
      (height * scandinaviaOrthographicBounds.width) /
      scandinaviaOrthographicBounds.height;

    const { offsetX, offsetY } = placeItemCenter({
      parentWidth: boardWidth,
      parentHeight: boardHeight,
      itemWidth: width,
      itemHeight: height,
    });

    const rotation = 12;

    return {
      x: offsetX,
      y: header.height + offsetY,
      width,
      height,
      rotation,
    };
  })();

  return { header, underHeader, innerTrapezoid, cornerDecorators, map };
}
