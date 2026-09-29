import { useId } from "react";
import { accentGlow, centerInParent } from "../../../lib/svg-helpers";

function diagramLayout(viewboxWidth: number, viewboxHeight: number) {
  const unit = viewboxHeight / 12;
  const outerPadding = unit / 2;

  const contentX = outerPadding;
  const contentY = outerPadding;
  const contentWidth = viewboxWidth - outerPadding * 2;
  const contentHeight = viewboxHeight - outerPadding * 2;

  return {
    unit,
    outerPadding,
    contentX,
    contentY,
    contentWidth,
    contentHeight,
  };
}

const isoCubeMetrics = (size: number) => {
  // Math.tan takes radians. in an isometric cube, each slanted (non-vertical) edge is tilted 30° from horizontal
  // 180 deg = pi radians -> divided on 6 = 30 deg in radians
  const depth = (size / 2) * Math.tan(Math.PI / 6); // in illustration -> half of the dashed line top polygon
  const edgeLength = depth * 2; // the whole dashed line

  // height from bottomFront to topBack (see illustration)
  const height = edgeLength * 2;

  return { size, depth, edgeLength, height };
};

export function SoftwareDiagram() {
  const viewboxWidth = 700;
  const viewboxHeight = 500;

  const isoCube = {
    sm: isoCubeMetrics(60),
    md: isoCubeMetrics(90),
    lg: isoCubeMetrics(180),
  };

  // ISOSvgCube iso grid steps (md cubes)
  const cubeSize = isoCube.md.size;
  const half = cubeSize / 2;
  const { depth, edgeLength: rise } = isoCube.md;

  const { contentX, contentY, contentWidth, contentHeight } = diagramLayout(
    viewboxWidth,
    viewboxHeight,
  );

  const groupSize = 180;
  const connectorGutter = 55;

  const positions = {
    top: {
      x: contentX + contentWidth * 0.4,
      y: contentY,
    },

    bottomLeft: {
      x: contentX + contentWidth * 0.1,
      y: contentY + contentHeight - groupSize - connectorGutter,
    },

    bottomRight: {
      x: contentX + contentWidth * 0.6,
      y: contentY + contentHeight - groupSize - connectorGutter,
    },
  };

  const top = (() => {
    // width = 2 cubes across. each cube's width is the long side of the
    // triangle you get by splitting its bottom diamond in half — that's cubeSize
    const groupWidth = cubeSize * 2;
    const groupHeight = isoCube.md.height * 2 - isoCube.md.depth / 2;

    // const { translateY, absoluteCenterY } = centerInParent(groupWidth, 180);

    return {
      //   translateY,
      //   absoluteCenterY,
      positions: positions.top,
      cubeSize,
      groupWidth,
      groupHeight,
    };
  })();

  const bottomRight = (() => {
    // will later add a second element that is why we separate cubeGroup to its own inner object
    const cubeGroup = {
      width: cubeSize * 2,
      height: isoCube.md.height * 2,
    };

    return {
      positions: positions.bottomRight,
      cubeSize,
      cubeGroup,
    };
  })();

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}>
      <rect
        x={0}
        y={0}
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="red"
      />

      <rect
        x={contentX}
        y={contentY}
        width={contentWidth}
        height={contentHeight}
        fill="none"
        stroke="green"
      />

      {/* top */}
      <g transform={`translate(${top.positions.x}, ${top.positions.y})`}>
        <rect
          x={0}
          y={0}
          width={top.groupWidth}
          height={top.groupHeight}
          fill="none"
          stroke="yellow"
        />
        <CubeBase
          size={cubeSize}
          y={isoCube.md.edgeLength - isoCube.md.depth / 2}
        />

        {/* TOP CUBE — straddles the back seam */}
        <ISOSvgCube size={cubeSize} x={half * 1.5} y={0} />
      </g>

      {/* bottom-left */}
      <g
        transform={`translate(${positions.bottomLeft.x}, ${positions.bottomLeft.y})`}
      >
        <rect
          x={0}
          y={0}
          width={groupSize}
          height={groupSize}
          fill="none"
          stroke="yellow"
        />
        <ISOSvgCube size={isoCube.lg.size} surfaceOpacity={0.3} showBackEdges />
        <ISOSvgCube size={isoCube.sm.size} />
      </g>

      {/* bottom-right */}
      <g
        transform={`translate(${bottomRight.positions.x}, ${bottomRight.positions.y})`}
      >
        {/* LATER ADD A SECOND GROUP THATS WHY GROUPS HAVE INNER GROUP */}

        {/* GROUP OF CUBES */}
        <g>
          <rect
            x={0}
            y={0}
            width={bottomRight.cubeGroup.width}
            height={bottomRight.cubeGroup.height}
            fill="none"
            stroke="yellow"
          />
          <CubeBase size={cubeSize} y={rise} />

          {/* TOP ROW — two cubes on the back cells */}
          <ISOSvgCube size={cubeSize} x={half} y={0} />
          <ISOSvgCube size={cubeSize} x={cubeSize} y={depth} />
        </g>

        {/* PLATFORM */}
        <g>
          <path />
        </g>
      </g>
    </svg>
  );
}

// the shared 2x2 base, drawn back to front. y = where the back cube sits
function CubeBase({ size, y = 0 }: { size: number; y?: number }) {
  const { depth } = isoCubeMetrics(size);
  const half = size / 2;

  return (
    <>
      <ISOSvgCube size={size} x={half} y={y} />
      <ISOSvgCube size={size} x={0} y={y + depth} />
      <ISOSvgCube size={size} x={size} y={y + depth} />
      <ISOSvgCube size={size} x={half} y={y + depth * 2} />
    </>
  );
}

type SVGCubeProps = {
  size?: number;
  x?: number;
  y?: number;
  frontRatio?: number;
};

type RotatedSVGCubeProps = Omit<SVGCubeProps, "frontRatio"> & {
  // further back in the stack: faded, with a fainter glow
  ghost?: boolean;
  // face fill only — edges stay at full strength
  surfaceOpacity?: number;
  // edges meeting at the hidden back-bottom corner, seen through the faces
  showBackEdges?: boolean;
};

export function ISOSvgCube({
  size = 100,
  x = 0,
  y = 0,
  ghost = false,
  surfaceOpacity = 0.8,
  showBackEdges = false,
}: RotatedSVGCubeProps = {}) {
  const edgeGradientId = useId();
  const scale = size / 100;

  /*
   * true isometric: top edges at 30°, all edges equal length.
   *   depth = 50 * tan(30°) ≈ 28.9
   *   vertical = depth * 2 ≈ 57.7
   *   total height ≈ 115.5 (width 100)
   */
  const depth = 50 * Math.tan(Math.PI / 6);

  const centerX = 50;

  const topBack = {
    x: centerX,
    y: 0,
  };

  const topLeft = {
    x: 0,
    y: depth,
  };

  const topRight = {
    x: 100,
    y: depth,
  };

  const topFront = {
    x: centerX,
    y: depth * 2,
  };

  const verticalHeight = depth * 2;

  const bottomLeft = {
    x: topLeft.x,
    y: topLeft.y + verticalHeight,
  };

  const bottomRight = {
    x: topRight.x,
    y: topRight.y + verticalHeight,
  };

  const bottomFront = {
    x: topFront.x,
    y: topFront.y + verticalHeight,
  };

  // hidden corner, straight below topBack
  const bottomBack = {
    x: topBack.x,
    y: topBack.y + verticalHeight,
  };

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

      <line
        x1={topFront.x}
        y1={topFront.y}
        x2={bottomFront.x}
        y2={bottomFront.y}
        {...edgeProps}
      />

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
