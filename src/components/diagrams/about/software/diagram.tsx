import { ISOCube, isoCubeMetrics } from "@/lib/svg/ISOCube";
import { diagramLayout } from "@/lib/svg/helpers";
import { Platform } from "./Platform";

export function SoftwareDiagram() {
  const viewboxWidth = 700;
  const viewboxHeight = 500;

  const isoCube = {
    sm: isoCubeMetrics(60),
    md: isoCubeMetrics(80),
    lg: isoCubeMetrics(160),
  };

  // ISOSvgCube iso grid steps (md cubes)
  const cubeSize = isoCube.md.size;
  const half = cubeSize / 2;
  const { depth, edgeLength: rise } = isoCube.md;

  const { contentX, contentY, contentWidth, contentHeight, unit } =
    diagramLayout(viewboxWidth, viewboxHeight, 0.5);

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

  const bottomLeft = (() => {
    const thickness = 110;

    // one lg cube: width = size, height = top diamond + walls
    const groupWidth = isoCube.lg.size;
    const groupHeight = isoCube.lg.depth * 2 + thickness;

    return {
      positions: positions.bottomLeft,
      thickness,
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

    const platform = {
      thickness: unit / 2,
      size: cubeGroup.width * 1.5,
      height: isoCubeMetrics(cubeGroup.width * 1.5, unit / 2).height,
    };

    const groupWidth = platform.size;
    const groupHeight = platform.size;

    // in bottomRight, after `platform`
    const cubeOffsetX = (platform.size - cubeGroup.width) / 2;

    return {
      positions: positions.bottomRight,
      platform,
      cubeOffsetX,
      cubeSize,
      cubeGroup,
      groupHeight,
      groupWidth,
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
        <ISOCube size={cubeSize} x={half * 1.5} y={0} />
      </g>

      {/* bottom-left */}
      <g
        transform={`translate(${bottomLeft.positions.x}, ${bottomLeft.positions.y})`}
      >
        <rect
          x={0}
          y={0}
          width={bottomLeft.groupWidth}
          height={bottomLeft.groupHeight}
          fill="none"
          stroke="yellow"
        />
        <ISOCube
          size={isoCube.lg.size}
          surfaceOpacity={0.3}
          showBackEdges
          thickness={bottomLeft.thickness}
        />
        {/* <ISOCube size={isoCube.sm.size} /> */}
      </g>

      {/* bottom-right */}
      <g
        transform={`translate(${bottomRight.positions.x}, ${bottomRight.positions.y})`}
      >
        <rect
          x={0}
          y={0}
          width={bottomRight.groupWidth}
          height={bottomRight.cubeGroup.height}
          fill="none"
          stroke="yellow"
        />

        {/* PLATFORM */}
        <g
          transform={`translate(0, ${bottomRight.cubeGroup.height - (bottomRight.platform.height / 4) * 3})`}
        >
          <Platform
            size={bottomRight.platform.size}
            thickness={bottomRight.platform.thickness}
          />
        </g>

        {/* GROUP OF CUBES */}
        <g transform={`translate(${bottomRight.cubeOffsetX})`}>
          <CubeBase size={cubeSize} y={rise} />

          {/* TOP ROW — two cubes on the back cells */}
          <ISOCube size={cubeSize} x={half} y={0} />
          <ISOCube size={cubeSize} x={cubeSize} y={depth} />
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
      <ISOCube size={size} x={half} y={y} />
      <ISOCube size={size} x={0} y={y + depth} />
      <ISOCube size={size} x={size} y={y + depth} />
      <ISOCube size={size} x={half} y={y + depth * 2} />
    </>
  );
}
