import { useId } from "react";
import { EdgeGradient } from "./EdgeGradient";
import {
  accentGlow,
  glyphStroke,
  isoCubePoints,
  type IsoCubeBaseProps,
} from "./helpers";

// the original sharp iso cube: every face outlined, edges drawn again on top.
// ISOCube (rounded, with the glassCube preset) replaced it in the diagrams
export function PlainISOCube({
  size = 100,
  x = 0,
  y = 0,
  ghost = false,
  surfaceOpacity = 0.8,
  showBackEdges = false,
  thickness,
  angleA = 30,
  angleB = angleA,
  // angle = 30,
  showFrontEdge = true,
  stroke,
  fill = "oklch(from var(--accent) 0.18 0.06 h)",
}: IsoCubeBaseProps = {}) {
  const edgeGradientId = useId();
  const edgeStroke = stroke ?? `url(#${edgeGradientId})`;

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
  } = isoCubePoints(size, thickness, angleA);

  // glass fill, same as the AI diagram's ghost editors
  const faceProps = {
    fill,
    fillOpacity: surfaceOpacity,
    stroke: edgeStroke,
    // same visible thickness at any cube size (the cube is drawn 100 wide, then scaled)
    strokeWidth: glyphStroke(size, 0.6, 100),
  };

  const edgeProps = {
    stroke: edgeStroke,
    strokeWidth: glyphStroke(size, 0.75, 100),
  };

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      opacity={ghost ? 0.6 : 1}
      style={{ filter: ghost ? accentGlow(2, 6) : accentGlow(4, 12) }}
    >
      <defs>
        <EdgeGradient
          id={edgeGradientId}
          width={100}
          height={depth * 2 + verticalHeight}
        />
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
