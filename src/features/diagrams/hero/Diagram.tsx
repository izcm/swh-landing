import { useId } from "react";

// shared svg helpers
import {
  alignCenter,
  boxCorners,
  deg,
  isoFloorCenter,
  paddedBox,
  type BoxRoof,
} from "@/lib/svg";

// the big glass cube with the small one inside, shared with connect
import { Centerpiece } from "@/features/diagrams/shared/Centerpiece";
import { centerpieceLayout } from "@/features/diagrams/shared/centerpieceLayout";

const heroAngle = deg(25);

// debug lines have className="svg-debug". show/hide them in diagram.css
export function HeroDiagram() {
  const viewboxWidth = 900;
  const viewboxHeight = 600;

  const { contentX, contentY, contentWidth, contentHeight, unit } = paddedBox(
    viewboxWidth,
    viewboxHeight,
    0, // 0 padding
  );

  // ids for the <defs> below
  const floorTileId = useId();

  // the centerpiece, in the middle of the content box
  const centerpiece = (() => {
    const size = unit * 7; // knob: same size in units as the old hero's
    const layout = centerpieceLayout({ size, angle: heroAngle });

    const { offset: x } = alignCenter(contentWidth, layout.cube.size);
    const { offset: y } = alignCenter(contentHeight, layout.cube.height);

    return { ...layout, x, y };
  })();

  // a diamond's path through its 4 corners
  const diamondD = ({ left, right, bottom, top }: BoxRoof) =>
    `M ${left.x} ${left.y} L ${bottom.x} ${bottom.y} L ${right.x} ${right.y} L ${top.x} ${top.y} Z`;

  // one floor tile: a diamond at the cube's angle
  const floorTile = (() => {
    const length = centerpiece.cube.edgeLength / 3; // knob: tiles per cube edge
    const { roof: corners } = boxCorners({
      lengthA: length,
      lengthB: length,
      angleA: heroAngle,
      angleB: heroAngle,
      thickness: 0,
    });
    const d = diamondD(corners);
    return { corners, d, length };
  })();

  // the floor: a big diamond of floor tiles, centered under the centerpiece
  const floor = (() => {
    const length = floorTile.length * 12; // knob: tiles per floor edge
    const { roof } = boxCorners({
      lengthA: length,
      lengthB: length,
      angleA: heroAngle,
      angleB: heroAngle,
      thickness: 0,
    });
    const { left, right, bottom } = roof;
    const d = diamondD(roof);

    // the floor's middle on the big cube's floor center
    const cubeFloor = isoFloorCenter(centerpiece.cube);
    const translateX = centerpiece.x + cubeFloor.x - right.x / 2;
    const translateY = centerpiece.y + cubeFloor.y - left.y;

    // a tile's left corner on the cube's floor left corner, so the cube's floor
    // edges sit on grid lines. in the floor's own coordinates
    const cubeFloorLeft = {
      x: centerpiece.x - translateX,
      y: centerpiece.y + cubeFloor.y - translateY,
    };
    const patternX = cubeFloorLeft.x;
    const patternY = cubeFloorLeft.y - floorTile.corners.left.y;

    // the fade: the circle that fits inside the floor, flattened like the floor.
    // it ends where the floor's edges are, so they never show
    const fade = {
      cx: right.x / 2,
      cy: left.y,
      r: right.x / 2 / Math.SQRT2,
      squash: Math.tan(heroAngle),
    };

    return {
      d,
      width: right.x,
      height: bottom.y,
      translateX,
      translateY,
      patternX,
      patternY,
      fade,
    };
  })();

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`} overflow="visible">
      <defs>
        {/* GRADIENTS */}
        {(() => {
          const { cx, cy, r, squash } = floor.fade;
          return (
            <radialGradient
              id="somethingxoxo"
              gradientUnits="userSpaceOnUse"
              cx={cx}
              cy={cy}
              r={r}
              // flattens the circle around its middle
              gradientTransform={`translate(${cx} ${cy}) scale(1 ${squash}) translate(${-cx} ${-cy})`}
            >
              <stop offset="0%" stopColor="white" stopOpacity={1} />
              <stop offset="50%" stopColor="white" stopOpacity={0.8} />
              <stop offset="100%" stopColor="white" stopOpacity={0} />
            </radialGradient>
          );
        })()}

        {/* MASKS */}
        <mask
          id={"somethingelsexoxo"}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={floor.width}
          height={floor.height}
        >
          <rect
            x={0}
            y={0}
            width={floor.width}
            height={floor.height}
            fill={`url(#somethingxoxo)`}
          />
        </mask>

        {/* PATTERNS */}
        <pattern
          id={floorTileId}
          patternUnits="userSpaceOnUse"
          x={floor.patternX}
          y={floor.patternY}
          width={floorTile.corners.right.x}
          height={floorTile.corners.bottom.y}
        >
          <path
            d={floorTile.d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1}
          />
        </pattern>
      </defs>

      {/* everything inside starts at the content box's top-left */}
      <g transform={`translate(${contentX}, ${contentY})`}>
        {/* the floor, under the centerpiece */}
        <g transform={`translate(${floor.translateX}, ${floor.translateY})`}>
          <path
            d={floor.d}
            fill={`url(#${floorTileId})`}
            opacity={0.15}
            mask="url(#somethingelsexoxo)"
          />
        </g>

        {/* debug: content box (inside the padding) */}
        <rect
          className="svg-debug"
          x={0}
          y={0}
          width={contentWidth}
          height={contentHeight}
          fill="none"
          stroke="#e8a0a8" // dusty rose
          strokeWidth={0.75}
          strokeDasharray="6 4"
        />

        {/* middle: the centerpiece */}
        <Centerpiece
          {...centerpiece}
          angle={heroAngle}
          cubeStrokeWeight={1} // knob
          innerCubeStrokeWeight={1} // knob
        />
      </g>
    </svg>
  );
}
