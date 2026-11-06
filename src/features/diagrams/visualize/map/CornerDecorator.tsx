import type { SVGProps } from "react";
import {
  addVector,
  roundedCornerPath,
  type Point,
  type Vector,
} from "@/lib/svg";

export function CornerDecorator({
  start,
  u,
  v,
  radius = 0,
  ...pathProps
}: Omit<SVGProps<SVGPathElement>, "d"> & {
  start: Point;
  u: Vector;
  v: Vector;
  radius?: number;
}) {
  return (
    <path
      {...pathProps}
      d={roundedCornerPath(
        addVector(start, u),
        start,
        addVector(start, v),
        radius,
      )}
      fill="none"
    />
  );
}
