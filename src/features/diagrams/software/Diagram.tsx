import { useId } from "react";

import {
  ISOCube,
  Platform,
  platformStyle,
  IsoCubeShadow,
  accentGlow,
  allFills,
  allStrokes,
  EdgeGradient,
  glassCube,
  glassEdgeOpacity,
  glassGlow,
  isoFloorCenter,
  isoCubeMetrics,
  isoRoofCenter,
  paddedBox,
  standOn,
  type BoxLook,
  type Point,
} from "@/lib/svg";

export function SoftwareDiagram() {
  const viewboxWidth = 500;
  const viewboxHeight = 400;

  // the default cube dims / metrics
  const cubeSize = viewboxWidth / 8;
  const cube = isoCubeMetrics(viewboxWidth / 8);

  const half = cube.size / 2;
  const { depth, edgeLength: rise } = isoCubeMetrics(cubeSize);

  // the glass cubes' halo, put on the <g> around each group of cubes
  const glassGlowFilter = accentGlow(glassGlow.blur, glassGlow.strength);

  const { contentX, contentY, contentWidth, contentHeight, unit } = paddedBox(
    viewboxWidth,
    viewboxHeight,
    0.5,
  );

  const top = (() => {
    const positions = {
      x: contentX + contentWidth * 0.4,
      y: contentY,
    };
    // width = 2 cubes across. each cube's width is the long side of the
    // triangle you get by splitting its floor diamond in half — that's cubeSize
    const groupWidth = cubeSize * 2;
    const groupHeight = cube.height * 2 - cube.depth / 2;

    return {
      positions,
      cubeSize,
      groupWidth,
      groupHeight,
    };
  })();

  const bottomLeft = (() => {
    // one lg cube: width = size, height = roof diamond + walls
    const bigCubeDim = {
      size: 160,
      thickness: 100,
    };

    const bigCube = isoCubeMetrics(bigCubeDim.size, bigCubeDim.thickness);

    const groupWidth = bigCubeDim.size;
    const groupHeight = bigCube.depth * 2 + bigCubeDim.thickness;

    // encapsulatedCube's offsetX
    const encapsulatedCubeSize = cube.size;

    const smallCube = isoCubeMetrics(encapsulatedCubeSize);
    // small cube stands in the middle of the big cube's floor
    const smallCubePos = standOn(isoFloorCenter(bigCube), smallCube);

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

    // cube group stands in the middle of the platform's roof. we keep the cubes at
    // y = 0 and shift the platform down instead, so the group box starts at the cubes
    const cubesOnPlatform = standOn(isoRoofCenter(platform), cubeGroup);
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
  // https://claude.ai/artifact/LQfSTqQXJPXoXUEaQqzVCb
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

    const c1 = handle(a, b);
    const c2 = handle(b, a);

    return `M ${from.x} ${from.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`;
    // return connector(from, to, handle(a, b), handle(b, a));
  }

  // loop: top → bottom-right → bottom-left → top

  // top group's sides, halfway down
  const topExitY = top.positions.y + top.groupHeight * 0.5;

  // 1. top → bottom-right

  // top group's right side
  const topOut = { x: top.positions.x + top.groupWidth, y: topExitY };

  // on the platform's top, 80% of the way from its center (s/2, d)
  // to the middle of its top-right edge (s*0.75, d/2)
  const bottomRightIn = {
    x: bottomRight.positions.x + bottomRight.platform.size * 0.7,
    y:
      bottomRight.positions.y +
      bottomRight.platformY +
      bottomRight.platform.depth * 0.6,
  };

  // out of the top group's right side → down onto bottom-right's platform
  const topToBottomRight = arc(topOut, bottomRightIn);

  // 2. bottom-right → bottom-left

  // halfway along bottom-right platform's floor.left → floor.bottom edge
  const bottomRightOut = {
    x: bottomRight.positions.x + (bottomRight.platform.size / 2) * 0.5,
    y:
      bottomRight.positions.y +
      bottomRight.platformY +
      bottomRight.platform.depth * 1.4 +
      bottomRight.platform.thickness,
  };

  // halfway along bottom-left cube's floor.bottom → floor.right edge
  const bottomLeftIn = {
    x: bottomLeft.positions.x + bottomLeft.bigCube.size * 0.75,
    y:
      bottomLeft.positions.y +
      bottomLeft.bigCube.height -
      bottomLeft.bigCube.depth / 2,
  };

  // bows down under the gap between the two bottom groups
  const bottomRightToBottomLeft = arc(bottomRightOut, bottomLeftIn);

  // 3. bottom-left → top

  // halfway along bottom-left cube's roof.left → roof.top edge
  const bottomLeftOut = {
    x: bottomLeft.positions.x + bottomLeft.groupWidth * 0.25,
    y: bottomLeft.positions.y + bottomLeft.bigCube.depth / 2,
  };

  // top group's left side
  const topIn = { x: top.positions.x, y: topExitY };

  // up out of bottom-left's top → into the top group's left side
  const bottomLeftToTop = arc(bottomLeftOut, topIn);

  // for smooth animations -> connect the ins and outs
  const bottomRightInBottomRightOut = arc(bottomRightIn, bottomRightOut);
  const bottomLeftInBottomLeftOut = arc(bottomLeftIn, bottomLeftOut);
  const topInTopOut = arc(topIn, topOut);

  // what you see: only the three connectors between groups
  const arcConnector = [
    topToBottomRight,
    bottomRightToBottomLeft,
    bottomLeftToTop,
  ].join(" ");

  // what the dot rides: also the hidden in → out pieces, so it never jumps
  const motionPath = [
    topToBottomRight,
    bottomRightInBottomRightOut,
    bottomRightToBottomLeft,
    bottomLeftInBottomLeftOut,
    bottomLeftToTop,
    topInTopOut,
  ].join(" ");

  // CSS wants the path wrapped as path("...")
  const cssPath = `path("${motionPath}")`;

  const glassEdgeId = useId();
  const glassEdge = `url(#${glassEdgeId})`;
  const glassStrokes = {
    roof: glassEdge,
    left: glassEdge,
    right: glassEdge,
    middle: glassEdge,
    floor: glassEdge,
  };

  const bigCubeEdgeId = useId();
  const bigCubeEdge = `url(#${bigCubeEdgeId})`;

  // was / 0.8 drawn twice; one layer at 0.96 looks the same
  const floatingCubeEdge = "oklch(from var(--accent) 0.85 0.12 h / 0.96)";

  return (
    <svg viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}>
      <defs>
        <EdgeGradient
          id={glassEdgeId}
          width={cubeSize}
          height={cube.height}
          opacity={glassEdgeOpacity}
        />
        <EdgeGradient
          id={bigCubeEdgeId}
          width={bottomLeft.bigCube.size}
          height={bottomLeft.bigCube.height}
          opacity={platformStyle.edgeOpacity}
        />
      </defs>

      <path
        d={arcConnector}
        fill="none"
        stroke="var(--connector-color)"
        strokeWidth={1}
        strokeDasharray="8 12"
      />

      <circle
        r={5}
        fill="var(--accent-deep)"
        opacity={0.8}
        className="path-dot"
        style={{ offsetPath: cssPath }}
      />

      {/* -6s = half of the 12s loop, so this dot runs half a lap ahead */}
      <circle
        r={5}
        fill="var(--accent)"
        opacity={0.8}
        className="path-dot"
        style={{ offsetPath: cssPath, animationDelay: "-6s" }}
      />

      {/* top */}
      <g transform={`translate(${top.positions.x}, ${top.positions.y})`}>
        <CubeBase
          size={cubeSize}
          y={cube.edgeLength - cube.depth / 2}
          strokes={glassStrokes}
        />

        {/* TOP CUBE — straddles the top seam, lifts a little off the base */}
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
          <g style={{ filter: glassGlowFilter }}>
            <ISOCube
              {...glassCube}
              strokes={glassStrokes}
              size={cubeSize}
              x={half * 1.5}
              y={0}
            />
          </g>
        </g>
      </g>

      {/* bottom-left */}
      <g
        transform={`translate(${bottomLeft.positions.x}, ${bottomLeft.positions.y})`}
      >
        <g
          opacity={1}
          style={{
            filter: accentGlow(
              platformStyle.glow.blur,
              platformStyle.glow.strength,
            ),
          }}
        >
          <ISOCube
            strokeWidth={platformStyle.strokeWidth}
            size={bottomLeft.bigCube.size}
            thickness={bottomLeft.bigCube.thickness}
            radius={4}
            fills={{
              ...allFills("oklch(from var(--accent) 0.15 0.06 h / 0.3)"),
              floor: "oklch(from var(--accent) 0.2 0.06 h)",
            }}
            strokes={{ ...allStrokes(bigCubeEdge), back: [] }}
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
          opacity={0.4}
          style={{ filter: "blur(4px)" }}
        />
        <g className="float-bob">
          <g style={{ filter: glassGlowFilter }}>
            <ISOCube
              {...glassCube}
              x={bottomLeft.smallCubePos.x}
              y={bottomLeft.smallCubePos.y - bottomLeft.floatLift}
              size={cube.size}
              fills={{
                ...allFills("oklch(from var(--accent) 0.4 0.12 h / 0.8)"),
                floor: [],
              }}
              strokes={allStrokes(floatingCubeEdge)}
            />
          </g>
        </g>
      </g>

      {/* bottom-right */}
      <g
        transform={`translate(${bottomRight.positions.x}, ${bottomRight.positions.y})`}
      >
        {/* shadow under the platform, in step with the bob below */}
        <IsoCubeShadow
          {...bottomRight.platform}
          y={bottomRight.platformY}
          drop={14}
          duration="6s"
          delay="-3s"
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
            <Platform
              lengthA={bottomRight.platform.a.edgeLength}
              lengthB={bottomRight.platform.b.edgeLength}
              angleA={bottomRight.platform.a.angle}
              angleB={bottomRight.platform.b.angle}
              thickness={bottomRight.platform.thickness}
              grid={{ across: 4, along: 4 }}
            />
          </g>

          {/* GROUP OF CUBES */}
          <g transform={`translate(${bottomRight.cubeOffsetX})`}>
            <CubeBase size={cubeSize} y={rise} strokes={glassStrokes} />

            {/* TOP ROW — two cubes on the top cells */}
            <g style={{ filter: glassGlowFilter }}>
              <ISOCube
                {...glassCube}
                strokes={glassStrokes}
                size={cubeSize}
                x={half}
                y={0}
              />
              <ISOCube
                {...glassCube}
                strokes={glassStrokes}
                size={cubeSize}
                x={cubeSize}
                y={depth}
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

// the shared 2x2 base, drawn top to bottom. y = where the top cube sits
function CubeBase({
  size,
  y = 0,
  strokes,
}: {
  size: number;
  y?: number;
  strokes: BoxLook["strokes"];
}) {
  const { depth } = isoCubeMetrics(size);
  const half = size / 2;

  return (
    <g style={{ filter: accentGlow(glassGlow.blur, glassGlow.strength) }}>
      <ISOCube
        {...glassCube}
        strokes={strokes}
        size={size}
        x={half}
        y={y}
        fills={{
          ...allFills("oklch(from var(--accent) 0.18 0.06 h)"),
          floor: [],
        }}
      />{" "}
      {/* hack to hide animation dot when behind cluster in top group */}
      <ISOCube
        {...glassCube}
        strokes={strokes}
        size={size}
        x={0}
        y={y + depth}
      />
      <ISOCube
        {...glassCube}
        strokes={strokes}
        size={size}
        x={size}
        y={y + depth}
      />
      <ISOCube
        {...glassCube}
        strokes={strokes}
        size={size}
        x={half}
        y={y + depth * 2}
      />
    </g>
  );
}
