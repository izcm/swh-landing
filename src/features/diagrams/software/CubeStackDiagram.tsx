import { useId } from "react";

import { cn } from "@/lib/cn";
import { Floor } from "../shared/floor/Floor";
import { EdgeGradient } from "../shared/gradients";
import { CubeStack, cubeStackLayout } from "./cubes/CubeStack";
import { softwareFloorLayout, softwareFloorLook } from "./floor";
import { glassEdgeOpacity } from "./glass";

// the software diagram's small version: only the cube stack
export function CubeStackDiagram({ className }: { className?: string }) {
  const cubeSize = 62.5;
  const { cube, groupWidth, groupHeight, floorCenter } =
    cubeStackLayout(cubeSize);

  const viewboxWidth = groupWidth;
  const viewboxHeight = groupHeight;

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
    const drawing = () => (
      <CubeStack
        x={0}
        y={0}
        size={cubeSize}
        strokes={glassStrokes}
        bob={{ dist: "-4px", duration: "5s", delay: "-1.5s" }}
      />
    );

    return { drawing };
  })();

  const floor = (() => {
    const layout = softwareFloorLayout({
      center: floorCenter,
      cubeSize: cubeSize,
      tilesPerEdge: 7,
    });

    const drawing = () => <Floor layout={layout} {...softwareFloorLook} />;

    return { drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      width="100%"
      height="100%"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
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
      {cubeStack.drawing()}
    </svg>
  );
}
