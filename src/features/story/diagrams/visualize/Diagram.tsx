import { useId } from "react";

import {
  BoxBody,
  deepShades,
  deg,
  LitEdgeGradient,
  paddedBox,
  parallelogramMatrix,
  pointOnLine,
  roundedPolygonPath,
  type Point,
} from "@/lib/svg";
import { BottomCenter } from "./dashboard/BottomCenter";
import { BottomLeft } from "./dashboard/BottomLeft";
import { BottomRight } from "./dashboard/BottomRight";
import { UpperLeft } from "./dashboard/UpperLeft";
import { UpperRight } from "./dashboard/UpperRight";
import { chartData } from "./data";

export function VisualizeDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 350;
  // same unit as Connect: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);

  // the dashboards' border: same as act's windows, bright at the top and fading down
  const paneEdgeId = useId();

  const screenRadius = 3;

  // colors the dashboards pick from, in order: three deep accent shades, darkest first
  const colorSelection = deepShades(3);

  const angleA = deg(60);
  const angleB = deg(11.5);

  // edge A: from the top of the box down to the right side
  const edgeA = (() => {
    const drop = viewboxHeight * 0.325; // how far it goes down
    const run = drop / Math.tan(angleA); // how far it goes sideways
    const edgeLength = drop / Math.sin(angleA);
    return { run, drop, edgeLength };
  })();

  // edge B: from the left side up to the top, across the rest of the width
  const edgeB = (() => {
    const run = viewboxWidth - edgeA.run; // how far it goes sideways
    const rise = run * Math.tan(angleB); // how far it goes up
    const edgeLength = Math.hypot(run, rise); // edge B's full length
    return { run, rise, edgeLength };
  })();

  // two dashboards on edge B, three on a parallel line below
  const dashboards = (() => {
    const thickness = unit * 0.15; // how tall each dashboard's sides are
    const dashboardGroupsGap = unit * 0.75; // between the upper and the lower row

    const alongA = { x: edgeA.run, y: edgeA.drop };
    const gap = unit / edgeB.edgeLength; // one unit, as a part of edge B

    const upperLine = {
      left: { x: 0, y: edgeB.rise },
      top: { x: edgeB.run, y: 0 },
    };

    const missing = edgeA.run * Math.tan(angleB);
    const lowerLeft = {
      x: 0,
      y: edgeB.rise + edgeA.drop + missing + dashboardGroupsGap + thickness,
    };
    const lowerLine = {
      left: lowerLeft,
      top: { x: edgeB.run, y: lowerLeft.y - edgeB.rise },
    };

    // 0 = line.left, 1 = line.top
    const between = (
      line: { left: Point; top: Point },
      t0: number,
      t1: number,
      dropAlongA: number = 0, // for lower middle dashboard
      spanA: number = 1, // 0..1
    ) => {
      const k = dropAlongA / alongA.y;

      const drop = (p: Point) => ({
        x: p.x + alongA.x * k,
        y: p.y + alongA.y * k,
      });
      const left = drop(pointOnLine(line.left, line.top, t0));
      const top = drop(pointOnLine(line.left, line.top, t1));

      const sideA = {
        x: alongA.x * spanA,
        y: alongA.y * spanA,
      };

      return {
        left,
        top,
        right: {
          x: top.x + sideA.x,
          y: top.y + sideA.y,
        },
        bottom: {
          x: left.x + sideA.x,
          y: left.y + sideA.y,
        },
      };
    };

    const splitUpper = 0.65;
    const splitLower = [0.35, 0.78] as const;

    return {
      upper: {
        left: between(upperLine, 0, splitUpper - gap),
        right: between(upperLine, splitUpper, 1),
      },
      lower: {
        left: between(lowerLine, 0, splitLower[0] - gap, 0, 0.75),
        middle: between(lowerLine, splitLower[0], splitLower[1] - gap, 12),
        right: between(lowerLine, splitLower[1], 1, 0, 0.65),
      },
      upperLine,
      lowerLine,
      thickness,
    };
  })();

  // what's drawn on each dashboard, in the same order as the list below.
  // null = empty for now
  const dashboardContents = [
    UpperLeft,
    UpperRight,
    BottomLeft,
    BottomCenter,
    BottomRight,
  ];

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      // 615 units at up to 768px ≈ 1.25px per unit, close to Connect. centered

      className="block w-full max-w-2xl mx-auto"
    >
      <defs>
        {/* act's window border: electric, bright at the top and fading down */}
        <LitEdgeGradient id={paneEdgeId} />
      </defs>

      {/* all five dashboards: dark ground + act's ink fade, act's border */}
      {[
        dashboards.upper.left,
        dashboards.upper.right,
        dashboards.lower.left,
        dashboards.lower.middle,
        dashboards.lower.right,
      ].map((roof, i) => (
        <g key={i}>
          <BoxBody
            roof={roof}
            height={dashboards.thickness}
            strokeWidth={1}
            fills={{
              //   roof: "none",
              roof: "var(--accent-ink)",
              right: "var(--platform-wall-fill)",
              left: "var(--platform-wall-fill)",
              floor: "oklch(from var(--accent) 0.22 0.08 h)",
              //   floor: "oklch(from var(--accent) 0.22 0.08 h)",
            }}
            radius={screenRadius}
            edgeOpacity={[0.2, 0.35, 0.1]}
            showFloor
          />
          {/* lit edge: one outline around the roof, like act's window rect */}
          <path
            d={roundedPolygonPath(
              [roof.left, roof.top, roof.right, roof.bottom],
              screenRadius,
            )}
            fill="none"
            stroke={`url(#${paneEdgeId})`}
            strokeWidth={1}
          />
          {/* the content, bent onto the roof */}
          {(() => {
            const Content = dashboardContents[i];
            if (!Content) return null;
            const { transform, width, height } = parallelogramMatrix({
              origin: roof.left,
              xEnd: roof.top,
              yEnd: roof.bottom,
            });
            return (
              <g transform={transform}>
                <Content
                  width={width}
                  height={height}
                  radius={screenRadius}
                  unit={unit}
                  strokeWidth={1}
                  paddingXUnits={0.3}
                  paddingYUnits={0.25}
                  colorSelection={colorSelection}
                  chartData={chartData}
                />
              </g>
            );
          })()}
        </g>
      ))}

      {/* debug: the upper and the lower line the dashboards sit on, from
          line.left to line.top */}
      {[dashboards.upperLine, dashboards.lowerLine].map((line, i) => (
        <line
          key={i}
          className="svg-debug"
          x1={line.left.x}
          y1={line.left.y}
          x2={line.top.x}
          y2={line.top.y}
          stroke="#ff4fa3" // pink: edge B's direction
          strokeWidth={0.75}
        />
      ))}

      {/* debug: the whole box. inset by half the stroke, so the whole line
          shows inside the viewBox */}
      <rect
        className="svg-debug"
        x={0.375}
        y={0.375}
        width={viewboxWidth - 0.75}
        height={viewboxHeight - 0.75}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
    </svg>
  );
}
