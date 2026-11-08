import { useId } from "react";

import { cn } from "@/lib/cn";
import { EdgeGradient } from "../shared/gradients";
import { CubeStack, cubeStackLayout } from "./CubeStack";
import { glassEdgeOpacity } from "./glass";

// the software diagram's small version: only the cube stack
export function CubeStackDiagram({ className }: { className?: string }) {
  const cubeSize = 62.5;
  const { cube, groupWidth, groupHeight } = cubeStackLayout(cubeSize);

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

      {cubeStack.drawing()}
    </svg>
  );
}
