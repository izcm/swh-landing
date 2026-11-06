import { alignCenter } from "@/lib/svg";

export function FlowPlaceholder({ label }: { label: string }) {
  const viewboxWidth = 480;
  const viewboxHeight = 200;

  const leftBox = (() => {
    const width = 120;
    const height = 80;
    const x = 1;
    const { offset: y, absoluteCenter: centerY } = alignCenter(
      viewboxHeight,
      height,
    );
    return { x, y, width, height, centerY };
  })();

  const rightBox = (() => {
    const x = viewboxWidth - leftBox.width - leftBox.x;
    return { ...leftBox, x };
  })();

  const connector = (() => {
    const startX = leftBox.x + leftBox.width;
    const endX = rightBox.x;
    const y = leftBox.centerY;
    return { startX, endX, y, d: `M ${startX} ${y} L ${endX} ${y}` };
  })();

  // travels between the box edges, so its ends never poke into a box
  const pill = (() => {
    const width = 10;
    const height = 2;
    const startX = connector.startX + width * 0.5;
    const endX = connector.endX - width * 0.5;
    const cssPath = `path("M ${startX} ${connector.y} L ${endX} ${connector.y}")`;
    return { width, height, cssPath };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      className="w-full h-auto"
      role="img"
      aria-label={label}
    >
      {[leftBox, rightBox].map(({ x, y, width, height }) => (
        <rect
          key={x}
          x={x}
          y={y}
          width={width}
          height={height}
          rx={8}
          fill="none"
          stroke="var(--accent-muted)"
          strokeOpacity={0.3}
          strokeDasharray="6 6"
        />
      ))}

      <path
        d={connector.d}
        fill="none"
        stroke="var(--accent-dim)"
        strokeWidth={1}
        strokeDasharray="8 12"
      />

      {/* <rect
        x={-pill.width * 0.5}
        y={-pill.height * 0.5}
        width={pill.width}
        height={pill.height}
        rx={pill.height * 0.5}
        fill="var(--accent)"
        className="path-dot"
        // style={{ offsetPath: pill.cssPath, animationDuration: "0s" }}
      /> */}
    </svg>
  );
}
