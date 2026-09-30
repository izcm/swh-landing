import {
  ISOCube,
  isoBottomCenter,
  isoCubeMetrics,
  isoTopCenter,
  standOn,
} from "@/lib/svg/ISOCube";
import { diagramLayout } from "@/lib/svg/helpers";
import { RoundedIsoCube } from "./RoundedIsoCube";

export function SoftwareDiagram() {
  const viewboxWidth = 600;
  const viewboxHeight = 500;

  // the default cube dims / metrics
  const cubeSize = viewboxWidth / 8;
  const cube = isoCubeMetrics(viewboxWidth / 8);

  const half = cube.size / 2;
  const { depth, edgeLength: rise } = isoCubeMetrics(cubeSize);

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
    const groupHeight = cube.height * 2 - cube.depth / 2;

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
    // one lg cube: width = size, height = top diamond + walls
    const bigCubeDim = {
      size: 180,
      thickness: 100,
    };

    const bigCube = isoCubeMetrics(bigCubeDim.size, bigCubeDim.thickness);

    const groupWidth = bigCubeDim.size;
    const groupHeight = bigCube.depth * 2 + bigCubeDim.thickness;

    // encapsulatedCube's offsetX
    const encapsulatedCubeSize = 80;

    const smallCube = isoCubeMetrics(encapsulatedCubeSize);
    // small cube stands in the middle of the big cube's floor
    const smallCubePos = standOn(isoBottomCenter(bigCube), smallCube);

    // now we have to find teh point to place the encapsulated cube's top left corner
    // that is its container which is 90 size
    // and its confusing cuz this isnt hyst the corners in the cube

    return {
      positions: positions.bottomLeft,
      bigCube,
      groupWidth,
      groupHeight,

      smallCube,
      smallCubePos,
      // how far the small cube floats above the floor
      floatLift: 12,
    };
  })();

  const bottomRight = (() => {
    // will later add a second element that is why we separate cubeGroup to its own inner object
    const cubeGroup = {
      size: cubeSize * 2,
      height: cube.height * 2,
      depth: isoCubeMetrics(cubeSize * 2).depth,
    };

    const platform = isoCubeMetrics(cubeGroup.size * 1.5, unit / 2);

    // cube group stands in the middle of the platform's top. we keep the cubes at
    // y = 0 and shift the platform down instead, so the group box starts at the cubes
    const cubesOnPlatform = standOn(isoTopCenter(platform), cubeGroup);
    const cubeOffsetX = cubesOnPlatform.x;
    const platformY = -cubesOnPlatform.y;

    const groupWidth = platform.size;
    const groupHeight = platformY + platform.height;

    return {
      positions: positions.bottomRight,
      platform,
      cubeOffsetX,
      platformY,
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
        <CubeBase size={cubeSize} y={cube.edgeLength - cube.depth / 2} />

        {/* TOP CUBE — straddles the back seam, lifts a little off the base */}
        <g
          className="float-bob"
          style={
            {
              "--float-dist": "-4px",
              "--float-duration": "5s",
              "--float-delay": "-1.5s",
            } as React.CSSProperties
          }
        >
          <ISOCube size={cubeSize} x={half * 1.5} y={0} />
        </g>
      </g>

      {/* bottom-left */}
      <g
        transform={`translate(${bottomLeft.positions.x}, ${bottomLeft.positions.y})`}
      >
        <g opacity={0.8}>
          <RoundedIsoCube
            size={bottomLeft.bigCube.size}
            thickness={bottomLeft.bigCube.thickness}
            radius={4}
            topFill="oklch(from var(--accent) 0.15 0.06 h / 0.3)"
            wallFill="oklch(from var(--accent) 0.15 0.06 h / 0.3)"
            showFrontEdge
          />
        </g>
        {/* shadow on the floor, under the floating cube. iso-flattened ellipse */}
        <ellipse
          className="float-shadow"
          cx={bottomLeft.bigCube.size / 2}
          cy={bottomLeft.bigCube.thickness + bottomLeft.bigCube.depth}
          rx={bottomLeft.smallCube.size * 0.4}
          ry={bottomLeft.smallCube.size * 0.4 * Math.tan(Math.PI / 6)}
          fill="black"
          opacity={0.5}
          style={{ filter: "blur(4px)" }}
        />
        <g className="float-bob">
          <ISOCube
            x={bottomLeft.smallCubePos.x}
            y={bottomLeft.smallCubePos.y - bottomLeft.floatLift}
            size={cube.size}
            fill="oklch(from var(--accent) 0.4 0.12 h)"
            stroke="oklch(from var(--accent) 0.85 0.12 h / 0.8)"
            showBackEdges
          />
        </g>
      </g>

      {/* bottom-right */}
      <g
        transform={`translate(${bottomRight.positions.x}, ${bottomRight.positions.y})`}
      >
        {/* platform + its cubes drift together, slow and small */}
        <g
          className="float-bob"
          style={
            {
              "--float-dist": "-3px",
              "--float-duration": "6s",
              "--float-delay": "-3s",
            } as React.CSSProperties
          }
        >
          {/* PLATFORM */}
          <g transform={`translate(0, ${bottomRight.platformY})`}>
            <RoundedIsoCube
              size={bottomRight.platform.size}
              thickness={bottomRight.platform.thickness}
              showGrid
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
