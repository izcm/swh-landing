import {
  BoxBody,
  paddedBox,
  platformStyle,
  pointOnLine,
  type Point,
} from "@/lib/svg";

export function VisualizeDiagram() {
  const viewboxWidth = 540;
  const viewboxHeight = 360;
  // same unit ThreeBoxDiagram handed out: 1/12 of the height
  const { unit } = paddedBox(viewboxWidth, viewboxHeight, 0);

  // the screens' fill: same ink fade as act's dashboard windows
  //   const screenInkId = useId();
  // cuts each screen's fill to its dashboard's rounded roof
  //   const screenClipId = useId();

  const screenRadius = 8;

  const thickness = unit * 0.25;

  const angleA = 60;
  const angleB = 11.25;
  const radA = (angleA * Math.PI) / 180;
  const radB = (angleB * Math.PI) / 180;

  // edge A: from the top of the box down to the right side
  const edgeA = (() => {
    const drop = viewboxHeight * 0.32; // how far it goes down
    const run = drop / Math.tan(radA); // how far it goes sideways
    const edgeLength = drop / Math.sin(radA);
    return { run, drop, edgeLength };
  })();
  //   const lengthB = viewboxWidth

  // edge B: from the left side up to the top, across the rest of the width
  const edgeB = (() => {
    const run = viewboxWidth - edgeA.run; // how far it goes sideways
    const rise = run * Math.tan(radB); // how far it goes up
    const edgeLength = Math.hypot(run, rise); // edge B's full length
    return { run, rise, edgeLength };
  })();

  //   const dashboardGap = unit / edgeB.edgeLength; // one unit of space between the two, as a part of edge B

  const dashboardGroupsGap = unit * 0.75;

  // two dashboards on edge B, three on a parallel line below
  const dashboards = (() => {
    const alongA = { x: edgeA.run, y: edgeA.drop };
    const gap = unit / edgeB.edgeLength; // one unit, as a part of edge B

    const upperLine = {
      left: { x: 0, y: edgeB.rise },
      top: { x: edgeB.run, y: 0 },
    };

    const missing = edgeA.run * Math.tan(radB);
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
      height?: number, // 0..1
    ) => {
      const left = pointOnLine(line.left, line.top, t0);
      const top = pointOnLine(line.left, line.top, t1);

      return {
        left,
        top,
        right: { x: top.x + alongA.x, y: top.y + alongA.y },
        bottom: { x: left.x + alongA.x, y: left.y + alongA.y },
      };
    };

    const splitUpper = 0.65;
    const splitLower = [0.35, 0.8] as const;

    return {
      upper: {
        left: between(upperLine, 0, splitUpper - gap),
        right: between(upperLine, splitUpper, 1),
      },
      lower: {
        left: between(lowerLine, 0, splitLower[0] - gap),
        middle: between(lowerLine, splitLower[0], splitLower[1] - gap),
        right: between(lowerLine, splitLower[1], 1),
      },
      lowerLine,
    };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      // 615 units at up to 768px ≈ 1.25px per unit, close to Connect. centered

      className="block w-full max-w-2xl mx-auto"
    >
      <defs>
        {/* act's window fill: ink at the top, fading out toward the bottom */}
        {/* <linearGradient id={screenInkId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-ink)" stopOpacity={0.9} />
          <stop offset="100%" stopColor="var(--accent-ink)" stopOpacity={0} />
        </linearGradient> */}
      </defs>

      {/* all five dashboards: dark ground + act's ink fade, Platform's edge gradient */}
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
            height={thickness}
            strokeWidth={1}
            fills={{
              //   roof: "none",
              roof: "var(--accent-ink)",
              right: "none",
              left: "none",
              floor: "oklch(from var(--accent) 0.22 0.08 h)",
              //   floor: "oklch(from var(--accent) 0.22 0.08 h)",
            }}
            radius={screenRadius}
            edgeOpacity={platformStyle.edgeOpacity}
            showFloor
          />
          {/* <path
            d={roundedPolygonPath(
              [roof.left, roof.top, roof.right, roof.bottom],
              screenRadius,
            )}
            fill={`url(#${screenInkId})`}
          /> */}
        </g>
      ))}

      {/* debug: upper dashboards */}
      <circle
        className="svg-debug-visualize"
        cx={viewboxWidth}
        cy={edgeA.drop}
        r={6}
        fill="#ffb547" // amber: edge A
        strokeWidth={0.75}
      />

      <circle
        className="svg-debug-visualize"
        cx={edgeB.run}
        cy={0}
        r={6}
        fill="#ffffff" // white: where edge A and edge B meet
        strokeWidth={0.75}
      />

      <circle
        className="svg-debug-visualize"
        cx={0}
        cy={edgeB.rise}
        r={6}
        fill="#ff4fa3" // pink: edge B
        strokeWidth={0.75}
      />

      <line
        className="svg-debug-visualize"
        x1={edgeB.run}
        y1={0}
        x2={0}
        y2={edgeB.rise}
        stroke="#ff4fa3" // pink: edge B
        strokeWidth={0.75}
      />

      <line
        className="svg-debug-visualize"
        x1={viewboxWidth - edgeA.run}
        y1={0}
        x2={viewboxWidth}
        y2={edgeA.drop}
        stroke="#ffb547" // amber: edge A
        strokeWidth={0.75}
      />

      {/* debug: lower dashboards */}
      <circle
        className="svg-debug-visualize"
        cx={0}
        cy={dashboards.lowerLine.left.y}
        r={6}
        fill="#ffffff" // white: where edge A and edge B meet
        strokeWidth={0.75}
      />

      <circle
        className="svg-debug-visualize"
        cx={dashboards.lowerLine.top.x}
        cy={dashboards.lowerLine.top.y}
        r={6}
        fill="#ffffff" // white: where edge A and edge B meet
        strokeWidth={0.75}
      />

      {/* the pink line moved down: same run and rise, from lowerLine.left to lowerLine.top */}
      <line
        className="svg-debug-visualize"
        x1={dashboards.lowerLine.left.x}
        y1={dashboards.lowerLine.left.y}
        x2={dashboards.lowerLine.top.x}
        y2={dashboards.lowerLine.top.y}
        stroke="#ff4fa3" // pink: edge B
        strokeWidth={0.75}
      />

      {/* debug: the box */}
      <rect
        className="svg-debug-visualize"
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
