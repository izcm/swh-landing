import { useId } from "react";
import { accentGlow, type Point } from "./helpers";

// angle = how steep the top edges slope from horizontal, in degrees.
// 30 is true isometric; smaller = flatter top, bigger = steeper top
export const isoCubeMetrics = (size: number, thickness?: number, angle = 30) => {
  const half = size / 2;
  const radians = (angle * Math.PI) / 180;

  const depth = half * Math.tan(radians); // how far a top edge drops (opposite side)
  const edgeLength = half / Math.cos(radians); // the top edge itself (hypotenuse)
  const height = depth * 2 + (thickness ?? edgeLength); // top diamond + walls

  return { size, depth, edgeLength, height };
};

// the 8 corners of an iso box, in the 100-wide box it's drawn in (scaled to size afterwards)
export function isoCubePoints(
  size: number,
  thickness: number | undefined,
  angle: number,
) {
  const scale = size / 100;
  const { depth, edgeLength } = isoCubeMetrics(100, undefined, angle);

  // undo the scale so thickness stays in real units; default = true cube
  const verticalHeight =
    thickness !== undefined ? thickness / scale : edgeLength;

  const topBack = { x: 50, y: 0 };
  const topLeft = { x: 0, y: depth };
  const topRight = { x: 100, y: depth };
  const topFront = { x: 50, y: depth * 2 };
  const down = (p: Point) => ({ x: p.x, y: p.y + verticalHeight });

  return {
    scale,
    depth,
    verticalHeight,
    topBack,
    topLeft,
    topRight,
    topFront,
    // bottomBack is the hidden corner, straight below topBack
    bottomBack: down(topBack),
    bottomLeft: down(topLeft),
    bottomRight: down(topRight),
    bottomFront: down(topFront),
  };
}

export type ISOCubeProps = {
  size?: number;
  x?: number;
  y?: number;
  // further back in the stack: faded, with a fainter glow
  ghost?: boolean;
  // face fill only — edges stay at full strength
  surfaceOpacity?: number;
  // edges meeting at the hidden back-bottom corner, seen through the faces
  showBackEdges?: boolean;
  // height of the vertical sides, in the same units as size. defaults to a true cube;
  // pass something small for a flat slab / platform
  thickness?: number;
  // slope of the top edges in degrees. 30 = true isometric
  angle?: number;
  // the vertical edge where the left and right faces meet (topFront → bottomFront)
  showFrontEdge?: boolean;
};

export function ISOCube({
  size = 100,
  x = 0,
  y = 0,
  ghost = false,
  surfaceOpacity = 0.8,
  showBackEdges = false,
  thickness,
  angle = 30,
  showFrontEdge = true,
}: ISOCubeProps = {}) {
  const edgeGradientId = useId();

  const {
    scale,
    depth,
    verticalHeight,
    topBack,
    topLeft,
    topRight,
    topFront,
    bottomBack,
    bottomLeft,
    bottomRight,
    bottomFront,
  } = isoCubePoints(size, thickness, angle);

  // glass fill, same as the AI diagram's ghost editors
  const faceProps = {
    fill: "oklch(from var(--accent) 0.18 0.06 h)",
    fillOpacity: surfaceOpacity,
    stroke: `url(#${edgeGradientId})`,
    strokeWidth: 0.8,
  };

  const edgeProps = {
    stroke: `url(#${edgeGradientId})`,
    strokeWidth: 0.4,
  };

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      opacity={ghost ? 0.6 : 1}
      style={{ filter: ghost ? accentGlow(2, 6) : accentGlow(4, 12) }}
    >
      <defs>
        {/* EditorWindow's border gradient. userSpaceOnUse because straight
            vertical lines have a zero-width bounding box */}
        <linearGradient
          id={edgeGradientId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0}
          x2={100}
          y2={depth * 2 + verticalHeight}
        >
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop
            offset="55%"
            style={{
              stopColor: "color-mix(in oklab, var(--accent) 70%, #1d4ed8)",
            }}
            stopOpacity="1"
          />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* BACK EDGES — drawn first so the glass faces sit over them */}
      {showBackEdges && (
        <>
          <line
            x1={bottomBack.x}
            y1={bottomBack.y}
            x2={topBack.x}
            y2={topBack.y}
            {...edgeProps}
          />
          <line
            x1={bottomBack.x}
            y1={bottomBack.y}
            x2={bottomLeft.x}
            y2={bottomLeft.y}
            {...edgeProps}
          />
          <line
            x1={bottomBack.x}
            y1={bottomBack.y}
            x2={bottomRight.x}
            y2={bottomRight.y}
            {...edgeProps}
          />
        </>
      )}

      {/* TOP FACE */}
      <polygon
        points={`
          ${topBack.x},${topBack.y}
          ${topRight.x},${topRight.y}
          ${topFront.x},${topFront.y}
          ${topLeft.x},${topLeft.y}
        `}
        {...faceProps}
      />

      {/* LEFT FACE */}
      <polygon
        points={`
          ${topLeft.x},${topLeft.y}
          ${topFront.x},${topFront.y}
          ${bottomFront.x},${bottomFront.y}
          ${bottomLeft.x},${bottomLeft.y}
        `}
        {...faceProps}
      />

      {/* RIGHT FACE */}
      <polygon
        points={`
          ${topFront.x},${topFront.y}
          ${topRight.x},${topRight.y}
          ${bottomRight.x},${bottomRight.y}
          ${bottomFront.x},${bottomFront.y}
        `}
        {...faceProps}
      />

      {/* TOP EDGES */}

      <line
        x1={topBack.x}
        y1={topBack.y}
        x2={topLeft.x}
        y2={topLeft.y}
        {...edgeProps}
      />

      <line
        x1={topBack.x}
        y1={topBack.y}
        x2={topRight.x}
        y2={topRight.y}
        {...edgeProps}
      />

      <line
        x1={topLeft.x}
        y1={topLeft.y}
        x2={topFront.x}
        y2={topFront.y}
        {...edgeProps}
      />

      <line
        x1={topRight.x}
        y1={topRight.y}
        x2={topFront.x}
        y2={topFront.y}
        {...edgeProps}
      />

      {/* VERTICAL EDGES */}

      <line
        x1={topLeft.x}
        y1={topLeft.y}
        x2={bottomLeft.x}
        y2={bottomLeft.y}
        {...edgeProps}
      />

      {showFrontEdge && (
        <line
          x1={topFront.x}
          y1={topFront.y}
          x2={bottomFront.x}
          y2={bottomFront.y}
          {...edgeProps}
        />
      )}

      <line
        x1={topRight.x}
        y1={topRight.y}
        x2={bottomRight.x}
        y2={bottomRight.y}
        {...edgeProps}
      />

      {/* BOTTOM EDGES */}

      <line
        x1={bottomLeft.x}
        y1={bottomLeft.y}
        x2={bottomFront.x}
        y2={bottomFront.y}
        {...edgeProps}
      />

      <line
        x1={bottomFront.x}
        y1={bottomFront.y}
        x2={bottomRight.x}
        y2={bottomRight.y}
        {...edgeProps}
      />
    </g>
  );
}
