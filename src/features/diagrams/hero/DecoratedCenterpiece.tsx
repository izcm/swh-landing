import {
  accentGlow,
  addVector,
  boxCorners,
  isoCubeEdgeVectors,
  scaleVector,
} from "@/lib/svg";

import { Centerpiece } from "../shared/centerpiece/Centerpiece";
import { centerpieceLayout } from "../shared/centerpiece/centerpieceLayout";

// the centerpiece with the dashed lines and dots around its base
export function DecoratedCenterpiece({
  x,
  y,
  size,
  angle,
  className,
}: {
  x: number;
  y: number;
  size: number;
  angle: number;
  className?: string;
}) {
  const drawingSize = 375;
  const layout = centerpieceLayout({ size: drawingSize, angle });
  const { cube } = layout;

  const cubeCorners = boxCorners({
    lengthA: cube.a.edgeLength,
    lengthB: cube.b.edgeLength,
    angleA: cube.a.angle,
    angleB: cube.b.angle,
    thickness: cube.thickness,
  });

  const centerpieceDecorators = (() => {
    const { floor: cubeFloor } = cubeCorners;

    const { edgeA, edgeB } = isoCubeEdgeVectors(cube);

    const start = addVector(cubeFloor.top, {
      x: 0,
      y: -cube.thickness * 0.1,
    });

    const lineScale = 1.2; // knob: each line's length, in cube edges

    const end1 = addVector(start, scaleVector(edgeA, lineScale));
    const end2 = addVector(start, scaleVector(edgeB, -lineScale)); // same line as now: right → bottom

    const verticalLine = (() => {
      const lineStart = addVector(start, scaleVector(edgeA, 0.2));
      const lineEnd = addVector(lineStart, {
        x: 0,
        y: -cube.thickness * lineScale,
      });
      return { start: lineStart, end: lineEnd };
    })();

    const dashArray = "12 6"; // knob: dash length, gap length
    const dotRadius = 2; // knob: the tiny circles at the lines' ends

    const drawing = (
      <g>
        {[verticalLine, { start, end: end1 }, { start, end: end2 }].map(
          (line, i) => (
            <line
              key={i}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke="var(--accent)"
              strokeWidth={1}
              strokeDasharray={dashArray}
            />
          ),
        )}

        {/* tiny circles at the lines' ends */}
        <g style={{ filter: accentGlow(4, 25) }}>
          {[verticalLine.start, verticalLine.end, end1, end2].map(
            (point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={dotRadius}
                fill="var(--accent-glow)"
              />
            ),
          )}
        </g>
      </g>
    );

    return { drawing };
  })();

  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size * (cube.height / cube.size)}
      viewBox={`0 0 ${cube.size} ${cube.height}`}
      overflow="visible"
      className={className}
    >
      {/* around the centerpiece */}
      {centerpieceDecorators.drawing}

      {/* the centerpiece */}
      <Centerpiece {...layout} x={0} y={0} angle={angle} strokeWeight={1} />
    </svg>
  );
}
