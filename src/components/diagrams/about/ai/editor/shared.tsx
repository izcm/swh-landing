// shared layout for EditorWindow and EditorCode, in the window's own 300×200 viewBox
export const editor = (() => {
  const viewboxWidth = 300;
  const viewboxHeight = 200;

  const unit = viewboxHeight / 12;

  // maybe this should be moved out of css and into
  // code instead since we need it for calculations
  const strokeWidth = 0.4;

  // strokes are centered on the edge, so pull the rect in by half on each side
  const inset = strokeWidth / 2;

  const contentWidth = viewboxWidth - inset * 2;
  const contentHeight = viewboxHeight - inset * 2;

  const headerHeight = unit * 2;
  const bottomHeight = unit * 1.5;

  return {
    viewboxWidth,
    viewboxHeight,
    unit,
    strokeWidth,
    inset,
    contentWidth,
    contentHeight,
    headerHeight,
    bottomHeight,
  };
})();

// bright at the start, fading out to the right — used by the window dots and the code bars
export function AccentBarGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop
        offset="0%"
        style={{
          stopColor: "color-mix(in oklab, var(--accent) 50%, #1d4ed8)",
        }}
      />

      <stop
        offset="100%"
        style={{
          stopColor: "color-mix(in oklab, var(--accent) 75%, #1d4ed8)",
        }}
      />
    </linearGradient>
  );
}
