import { useId } from "react";

import { cn } from "@/lib/cn";
import {
  addVector,
  boxCorners,
  isoFloorCenter,
  isoCubeMetrics,
  isoRoofCenter,
  paddedBox,
  scaleVector,
  standOn,
  type Point,
} from "@/lib/svg";
import { Floor } from "../shared/floor/Floor";
import { EdgeGradient } from "../shared/gradients";
import { BoxedCube } from "./BoxedCube";
import { ConnectorRing } from "./ConnectorRing";
import { CubeStack, cubeStackLayout } from "./CubeStack";
import { softwareFloorLayout, softwareFloorLook } from "./floor";
import { glassEdgeOpacity } from "./glass";
import { PlatformCubes } from "./PlatformCubes";

export function SoftwareDiagram({ className }: { className?: string }) {
  const viewboxWidth = 500;
  const viewboxHeight = 400;

  // the default cube dims / metrics
  const cubeSize = viewboxWidth / 8;
  const cube = isoCubeMetrics(viewboxWidth / 8);

  const { contentX, contentY, contentWidth, contentHeight, unit } = paddedBox(
    viewboxWidth,
    viewboxHeight,
    0.5,
  );

  const glassEdgeId = useId();
  const glassEdge = `url(#${glassEdgeId})`;
  const glassStrokes = {
    roof: glassEdge,
    left: glassEdge,
    right: glassEdge,
    middle: glassEdge,
    floor: glassEdge,
  };

  const cubeStack = (() => {
    const positions = {
      x: contentX + contentWidth * 0.4,
      y: contentY,
    };
    const { groupWidth, groupHeight } = cubeStackLayout(cubeSize);

    const drawing = () => (
      <CubeStack
        x={positions.x}
        y={positions.y}
        size={cubeSize}
        strokes={glassStrokes}
        bob={{ dist: "-4px", duration: "5s", delay: "-1.5s" }}
      />
    );

    return {
      positions,
      cubeSize,
      groupWidth,
      groupHeight,
      drawing,
    };
  })();

  const boxedCube = (() => {
    // one lg cube: width = size, height = roof diamond + walls
    const bigCubeDim = {
      size: 160,
      thickness: 100,
    };

    const bigCube = isoCubeMetrics(bigCubeDim.size, bigCubeDim.thickness);
    const { roof: bigCubeRoof } = boxCorners({
      lengthA: bigCube.a.edgeLength,
      lengthB: bigCube.b.edgeLength,
      angleA: bigCube.a.angle,
      angleB: bigCube.b.angle,
      thickness: bigCube.thickness,
    });

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

    const positions = {
      x: contentX + 20,
      y: contentY + contentHeight - groupHeight - contentHeight * 0.08,
    };
    // how far the small cube floats above the floor
    const floatLift = 12;

    const drawing = () => (
      <BoxedCube
        x={positions.x}
        y={positions.y}
        bigCube={bigCube}
        bigCubeRoof={bigCubeRoof}
        smallCube={smallCube}
        smallCubePos={smallCubePos}
        floatLift={floatLift}
      />
    );

    return {
      positions,
      bigCube,
      bigCubeRoof,
      groupWidth,
      groupHeight,

      smallCube,
      smallCubePos,
      floatLift,
      drawing,
    };
  })();

  const platformCubes = (() => {
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

    const positions = {
      x: contentX + contentWidth - groupWidth,
      y: contentY + contentHeight - groupHeight,
    };

    const drawing = () => (
      <PlatformCubes
        x={positions.x}
        y={positions.y}
        platform={platform}
        platformY={platformY}
        cubeOffsetX={cubeOffsetX}
        cubeSize={cubeSize}
        strokes={glassStrokes}
        grid={{ across: 4, along: 4 }}
        bob={{ dist: "-3px", duration: "6s", delay: "-3s" }}
        shadowDrop={14}
      />
    );

    return {
      positions,
      platform,
      cubeOffsetX,
      platformY,
      cubeSize,
      cubeGroup,
      groupHeight,
      groupWidth,
      drawing,
    };
  })();

  const connectorRing = (() => {
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
          t = scaleVector(t, -1);
        }
        return fromCircle(addVector(p, scaleVector(t, k)));
      };

      const c1 = handle(a, b);
      const c2 = handle(b, a);

      return `M ${from.x} ${from.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`;
      // return connector(from, to, handle(a, b), handle(b, a));
    }

    // loop: cube stack → platform cubes → boxed cube → cube stack

    // the cube stack's sides, halfway down
    const cubeStackExitY = cubeStack.positions.y + cubeStack.groupHeight * 0.5;

    // 1. cube stack → platform cubes

    // the cube stack's right side
    const cubeStackOut = {
      x: cubeStack.positions.x + cubeStack.groupWidth,
      y: cubeStackExitY,
    };

    // on the platform's top, 80% of the way from its center (s/2, d)
    // to the middle of its top-right edge (s*0.75, d/2)
    const platformCubesIn = {
      x: platformCubes.positions.x + platformCubes.platform.size * 0.7,
      y:
        platformCubes.positions.y +
        platformCubes.platformY +
        platformCubes.platform.depth * 0.6,
    };

    // out of the cube stack's right side → down onto the platform cubes' platform
    const cubeStackToPlatformCubes = arc(cubeStackOut, platformCubesIn);

    // 2. platform cubes → boxed cube

    // halfway along the platform cubes' platform's floor.left → floor.bottom edge
    const platformCubesOut = {
      x: platformCubes.positions.x + (platformCubes.platform.size / 2) * 0.5,
      y:
        platformCubes.positions.y +
        platformCubes.platformY +
        platformCubes.platform.depth * 1.4 +
        platformCubes.platform.thickness,
    };

    // halfway along the boxed cube's floor.bottom → floor.right edge
    const boxedCubeIn = {
      x: boxedCube.positions.x + boxedCube.bigCube.size * 0.75,
      y:
        boxedCube.positions.y +
        boxedCube.bigCube.height -
        boxedCube.bigCube.depth / 2,
    };

    // bows down under the gap between the platform cubes and the boxed cube
    const platformCubesToBoxedCube = arc(platformCubesOut, boxedCubeIn);

    // 3. boxed cube → cube stack

    // halfway along the boxed cube's roof.left → roof.top edge
    const boxedCubeOut = {
      x: boxedCube.positions.x + boxedCube.groupWidth * 0.25,
      y: boxedCube.positions.y + boxedCube.bigCube.depth / 2,
    };

    // the cube stack's left side
    const cubeStackIn = { x: cubeStack.positions.x, y: cubeStackExitY };

    // up out of the boxed cube's top → into the cube stack's left side
    const boxedCubeToCubeStack = arc(boxedCubeOut, cubeStackIn);

    // for smooth animations -> connect the ins and outs
    const platformCubesInToOut = arc(platformCubesIn, platformCubesOut);
    const boxedCubeInToOut = arc(boxedCubeIn, boxedCubeOut);
    const cubeStackInToOut = arc(cubeStackIn, cubeStackOut);

    // what you see: only the three connectors between groups
    const arcConnector = [
      cubeStackToPlatformCubes,
      platformCubesToBoxedCube,
      boxedCubeToCubeStack,
    ].join(" ");

    // what the dot rides: also the hidden in → out pieces, so it never jumps
    const motionPath = [
      cubeStackToPlatformCubes,
      platformCubesInToOut,
      platformCubesToBoxedCube,
      boxedCubeInToOut,
      boxedCubeToCubeStack,
      cubeStackInToOut,
    ].join(" ");

    const drawing = () => (
      <ConnectorRing arcConnector={arcConnector} motionPath={motionPath} />
    );

    return { arcConnector, motionPath, drawing };
  })();

  const floor = (() => {
    const layout = softwareFloorLayout({
      center: { x: viewboxWidth * 0.5, y: viewboxHeight * 0.6 },
      cubeSize,
      tilesPerEdge: 11,
    });

    const drawing = () => <Floor layout={layout} {...softwareFloorLook} />;

    return { drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      overflow="visible"
      className={cn(className)}
    >
      <defs>
        <EdgeGradient
          id={glassEdgeId}
          width={cubeSize}
          height={cube.height}
          opacity={glassEdgeOpacity}
        />
      </defs>

      {floor.drawing()}
      {connectorRing.drawing()}
      {cubeStack.drawing()}
      {boxedCube.drawing()}
      {platformCubes.drawing()}
    </svg>
  );
}
