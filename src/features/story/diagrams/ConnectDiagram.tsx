import {
  ISOCube,
  isoCubeMetrics,
  isoTopCenter,
  roundedPolygonPath,
  spaceBetween,
  standingSurfacePoints,
  ThreeBoxDiagram,
  type Box,
} from "@/lib/svg";

export function ConnectDiagram() {
  const nodes = ["Accounting", "HR", "Others"] as const;

  return (
    <ThreeBoxDiagram
      // viewbox
      viewboxWidth={620}
      viewboxHeight={250}
      // padding and gaps
      paddingUnits={0}
      gapUnits={1}
      // box ratios
      leftBoxSize={0.3}
      rightBoxSize={0.32}
      // boxs' contents
      left={({ width, height, unit }: Box) => {
        // -- CUBE · same numbers measure it and draw it -----------------
        const platform = (() => {
          const size = width;
          const thickness = unit * 0.28;
          const angles = { angleA: 10, angleB: 30 };
          const metrics = isoCubeMetrics(size, thickness, angles);

          return { size, thickness, angles, metrics };
        })();

        // -- PANEL · one shape, stood on every cube ---------------------
        const standingSurface = (() => {
          const size = platform.metrics.a.edgeLength; // knob: panel width
          const thickness = unit * 2.4; // knob: panel's vertical edge height
          const { depth, corners } = standingSurfacePoints({
            size,
            thickness,
            angle: platform.angles.angleA,
          });

          return { size, thickness, depth, corners };
        })();

        // https://claude.ai/artifact/J4CDXe1aHvn32wsqS1Aze9the
        const tRunB = 0.25;
        const tRunA = 0.125;

        const standingSurfaceStartPoint = (() => {
          const { a, b, depth } = platform.metrics;
          return {
            x: b.run * tRunB + a.run * tRunA,
            y: depth - tRunB * depth + depth * tRunA,
          };
        })();

        const sticksUp =
          standingSurface.thickness - standingSurfaceStartPoint.y;
        const itemHeight = platform.metrics.height + sticksUp;

        // -- NODES · a cube + panel each, top to bottom -----------------
        return nodes.map((_, i) => {
          const itemY = spaceBetween({
            index: i,
            itemCount: nodes.length,
            itemSize: itemHeight, // how tall one cube is on screen
            start: 0,
            end: height,
          });

          return (
            <g key={i} transform={`translate(${0}, ${itemY + sticksUp})`}>
              <rect
                className="svg-debug"
                x={0}
                y={0}
                width={platform.metrics.size}
                height={platform.metrics.height}
                fill="none"
                stroke="#e8a0a8" // dusty rose
                strokeWidth={0.75}
                strokeDasharray="6 4"
              />

              {(() => {
                const { size, angles, thickness } = platform;

                return (
                  <ISOCube
                    x={0}
                    y={0}
                    gridDivisions={{ across: 4, along: 8 }}
                    size={size}
                    thickness={thickness}
                    {...angles}
                    radius={2}
                  />
                );
              })()}

              {/* panel: its bottom-left stands on the top face's middle */}
              {(() => {
                const { thickness, corners } = standingSurface;

                return (
                  <path
                    transform={`
                        translate(${standingSurfaceStartPoint.x}, ${standingSurfaceStartPoint.y - thickness})
                      `}
                    d={roundedPolygonPath(
                      [
                        corners.topLeft,
                        corners.topRight,
                        corners.bottomRight,
                        corners.bottomLeft,
                      ],
                      10, // radius standing panel
                    )}
                    fill="var(--accent-ink)"
                    stroke="var(--accent)"
                    strokeWidth={0.4}
                  />
                );
              })()}

              <circle
                className="svg-debug"
                cx={standingSurfaceStartPoint.x}
                cy={standingSurfaceStartPoint.y}
                r={2}
                fill="yellow"
              />
            </g>
          );
        });
      }}
      centerpiece={(box) => (
        <circle
          cx={box.width / 2}
          cy={box.height / 2}
          r={box.unit * 3}
          fill="var(--accent-dim)"
        />
      )}
      right={(box) => (
        <circle
          cx={box.width / 2}
          cy={box.height / 2}
          r={box.unit * 2}
          fill="var(--accent-faint)"
        />
      )}
    />
  );
}
