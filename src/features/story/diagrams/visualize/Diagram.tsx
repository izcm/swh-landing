export function VisualizeDiagram() {
  const viewboxWidth = 538;
  const viewboxHeight = 404;

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      // 615 units at up to 768px ≈ 1.25px per unit, close to Connect. centered

      className="block w-full max-w-2xl mx-auto"
    >
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
