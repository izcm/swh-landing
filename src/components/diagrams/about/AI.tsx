export function AISvg() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-auto">
      <CodeEditor />
    </svg>
  );
}

type CodeEditorProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export function CodeEditor({
  x = 0,
  y = 0,
  width = 300,
  height = 200,
}: CodeEditorProps) {
  const viewBoxWidth = 300;
  const viewBoxHeight = 200;

  const unit = viewBoxHeight / 12;

  // maybe this should be moved out of css and into
  // code instead since we need it for calculations
  const strokeWidth = 0.4;
  // strokes are centered on the edge, so pull the rect in by half on each side
  const inset = strokeWidth / 2;

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
    >
      {/* background */}
      <rect
        x={inset}
        y={inset}
        width={viewBoxWidth - inset * 2}
        height={viewBoxHeight - inset * 2}
        rx="var(--rx-node-md)"
        fill="var(--node-color)"
        strokeWidth={strokeWidth}
        stroke="var(--node-border-color)"
      />

      {/* fake code */}
      <rect x="20" y="30" width="100" height="6" rx="3" />
    </svg>
  );
}
