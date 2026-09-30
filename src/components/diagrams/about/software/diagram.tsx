import {
  ISOCube,
  isoBottomCenter,
  isoCubeMetrics,
  isoTopCenter,
  standOn,
} from "@/lib/svg/ISOCube";
import { diagramLayout, type Point } from "@/lib/svg/helpers";
import { RoundedIsoCube } from "./RoundedIsoCube";

export function SoftwareDiagram() {
  const viewboxWidth = 500;
  const viewboxHeight = 400;

  // the default cube dims / metrics
  const cubeSize = viewboxWidth / 8;
  const cube = isoCubeMetrics(viewboxWidth / 8);

  const half = cube.size / 2;
  const { depth, edgeLength: rise } = isoCubeMetrics(cubeSize);

  const { contentX, contentY, contentWidth, contentHeight, unit } =
    diagramLayout(viewboxWidth, viewboxHeight, 0.5);

  const top = (() => {
    const positions = {
      x: contentX + contentWidth * 0.4,
      y: contentY,
    };
    // width = 2 cubes across. each cube's width is the long side of the
    // triangle you get by splitting its bottom diamond in half — that's cubeSize
    const groupWidth = cubeSize * 2;
    const groupHeight = cube.height * 2 - cube.depth / 2;

    // const { translateY, absoluteCenterY } = centerInParent(groupWidth, 180);

    return {
      //   translateY,
      //   absoluteCenterY,
      positions,
      cubeSize,
      groupWidth,
      groupHeight,
    };
  })();

  const bottomLeft = (() => {
    // one lg cube: width = size, height = top diamond + walls
    const bigCubeDim = {
      size: 160,
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
      positions: {
        x: contentX + 20,
        y: contentY + contentHeight - groupHeight - contentHeight * 0.08,
      },
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
      positions: {
        x: contentX + contentWidth - groupWidth,
        y: contentY + contentHeight - groupHeight,
      },
      platform,
      cubeOffsetX,
      platformY,
      cubeSize,
      cubeGroup,
      groupHeight,
      groupWidth,
    };
  })();

  // cubic bezier. c1 pulls the line out of `from`, c2 pulls it into `to`
  function connector(from: Point, to: Point, c1: Point, c2: Point) {
    return (
      <path
        d={`
          M ${from.x} ${from.y}
          C ${c1.x} ${c1.y}  ${c2.x} ${c2.y}  ${to.x} ${to.y}
          `}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1}
      />
    );
  }

  // all connectors ride one big ellipse, so together they read as one ring.
  // ringSquash = ellipse height / width. center + squash fitted so every
  // connector end sits roughly on the same ellipse
  const ringCenter = {
    x: contentX + contentWidth * 0.52,
    y: contentY + contentHeight * 0.54,
  };
  const ringSquash = 0.73;

  // curve that bends around ringCenter like a piece of the ellipse.
  // we stretch y by 1/ringSquash so the ellipse becomes a circle, do the
  // circle recipe there, then squash back.
  // circle recipe: each control point sticks out along the tangent at its end,
  // (4/3)·tan(angle/4)·radius long
  function arc(from: Point, to: Point) {
    const toCircle = (p: Point) => ({
      x: p.x - ringCenter.x,
      y: (p.y - ringCenter.y) / ringSquash,
    });
    const fromCircle = (p: Point) => ({
      x: ringCenter.x + p.x,
      y: ringCenter.y + p.y * ringSquash,
    });

    const a = toCircle(from);
    const b = toCircle(to);
    const angle = Math.abs(
      Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y),
    );
    const k = (4 / 3) * Math.tan(angle / 4);

    // tangent at p = radius turned 90°, flipped to face `towards`
    const handle = (p: Point, towards: Point) => {
      let t = { x: -p.y, y: p.x };
      if (t.x * (towards.x - p.x) + t.y * (towards.y - p.y) < 0) {
        t = { x: -t.x, y: -t.y };
      }
      return fromCircle({ x: p.x + t.x * k, y: p.y + t.y * k });
    };

    return connector(from, to, handle(a, b), handle(b, a));
  }

  // leaves the top group's side, halfway down
  const topExitY = top.positions.y + top.groupHeight * 0.5;

  // loop: bottom-right → bottom-left → top → bottom-right

  // halfway along bottom-right platform's front-left bottom edge
  const bottomRightOut = {
    x: bottomRight.positions.x + (bottomRight.platform.size / 2) * 0.5,
    y:
      bottomRight.positions.y +
      bottomRight.platformY +
      bottomRight.platform.depth * 1.4 +
      bottomRight.platform.thickness,
  };

  // halfway along bottom-left cube's front-right bottom edge
  const bottomLeftIn = {
    x: bottomLeft.positions.x + bottomLeft.bigCube.size * 0.75,
    y:
      bottomLeft.positions.y +
      bottomLeft.bigCube.height -
      bottomLeft.bigCube.depth / 2,
  };

  // halfway along bottom-left cube's back-left top edge
  const bottomLeftOut = {
    x: bottomLeft.positions.x + bottomLeft.groupWidth * 0.25,
    y: bottomLeft.positions.y + bottomLeft.bigCube.depth / 2,
  };

  // bows down under the gap between the two bottom groups
  const bottomRightToBottomLeft = arc(bottomRightOut, bottomLeftIn);

  // up out of bottom-left's top → into the top group's left side
  const bottomLeftToTop = arc(bottomLeftOut, {
    x: top.positions.x,
    y: topExitY,
  });

  // up from bottom-right, 80% across its top → into the top group's right side
  const bottomRightToTop = arc(
    {
      x: bottomRight.positions.x + bottomRight.groupWidth * 0.8,
      y: bottomRight.positions.y,
    },
    { x: top.positions.x + top.groupWidth, y: topExitY },
  );

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}>
      {bottomRightToBottomLeft}
      {bottomLeftToTop}
      {bottomRightToTop}

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
        <rect
          x={0}
          y={0}
          width={bottomLeft.groupWidth}
          height={bottomLeft.groupHeight}
          fill="none"
          stroke="yellow"
        />

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
        <rect
          x={0}
          y={0}
          width={bottomRight.groupWidth}
          height={bottomRight.groupHeight}
          fill="none"
          stroke="yellow"
        />

        <rect
          x={0}
          y={0}
          width={bottomRight.groupWidth}
          height={bottomRight.groupHeight}
          fill="none"
          stroke="yellow"
        />

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

      {/* BOTTOM RIGHT CONNECTOR OUT – connects to bottomleft */}
      <circle cx={bottomRightOut.x} cy={bottomRightOut.y} r={4} fill="lime" />

      {/* BOTTOM LEFT CONNECTOR  OUT – connects to top */}
      <circle cx={bottomLeftOut.x} cy={bottomLeftOut.y} r={4} fill="cyan" />

      {/* BOTTOM LEFT CONNECTOR  IN – from bottom-right */}
      <circle cx={bottomLeftIn.x} cy={bottomLeftIn.y} r={4} fill="magenta" />

      {/* TEMP: the ring the connectors ride — center dot + ellipse through the cyan dot */}
      {(() => {
        const rx = Math.hypot(
          bottomLeftOut.x - ringCenter.x,
          (bottomLeftOut.y - ringCenter.y) / ringSquash,
        );
        return (
          <g fill="none" stroke="orange" strokeDasharray="4 4">
            <ellipse
              cx={ringCenter.x}
              cy={ringCenter.y}
              rx={rx}
              ry={rx * ringSquash}
            />
            <circle cx={ringCenter.x} cy={ringCenter.y} r={4} fill="orange" />
          </g>
        );
      })()}
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
