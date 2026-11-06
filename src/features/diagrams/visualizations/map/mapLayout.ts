import {
  padVerticalSides,
  placeItemCenter,
  scaleVector,
  type Point,
} from "@/lib/svg";
import { scandinaviaOrthographicBounds } from "./ScandinaviaOrthographic";

// the map board's inner trapezoid, corner brackets and the map. `map` is
// measured inside the board's transform, the rest in picture coordinates
export function mapLayout({
  corners,
  unit,
  boardWidth,
  boardHeight,
  top,
}: {
  corners: Point[]; // the area under the header: top-left, top-right, bottom-right, bottom-left
  unit: number;
  boardWidth: number;
  boardHeight: number;
  top: number; // where the area starts, measured inside the board's transform
}) {
  const innerTrapezoid = padVerticalSides(corners, unit * 0.5);

  // decorator span this amount of inner trapezoid edges
  const bracketArmT = 0.075;

  const cornerDecorators = innerTrapezoid.map((corner, i, all) => {
    const next = all[(i + 1) % all.length];
    const prev = all[(i + all.length - 1) % all.length];

    return {
      start: corner,
      u: scaleVector(
        { x: next.x - corner.x, y: next.y - corner.y },
        bracketArmT,
      ),
      v: scaleVector(
        { x: prev.x - corner.x, y: prev.y - corner.y },
        bracketArmT,
      ),
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
      y: top + offsetY,
      width,
      height,
      rotation,
    };
  })();

  return { innerTrapezoid, cornerDecorators, map };
}
