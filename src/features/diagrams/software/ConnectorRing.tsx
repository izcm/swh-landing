// the dashed ring between the three groups, with two dots riding it
export function ConnectorRing({
  arcConnector,
  motionPath,
}: {
  arcConnector: string;
  motionPath: string;
}) {
  // CSS wants the path wrapped as path("...")
  const cssPath = `path("${motionPath}")`;

  return (
    <>
      <path
        d={arcConnector}
        fill="none"
        stroke="var(--accent-dim)"
        strokeWidth={1}
        strokeDasharray="8 12"
      />

      {/* <circle
        r={5}
        fill="var(--accent-dim)"
        opacity={0.8}
        className="path-dot"
        style={{ offsetPath: cssPath }}
      /> */}

      {/* -6s = half of the 12s loop, so this dot runs half a lap ahead */}
      {/* <circle
        r={5}
        fill="var(--accent-dim)"
        opacity={0.8}
        className="path-dot"
        style={{ offsetPath: cssPath, animationDelay: "-6s" }}
      /> */}
    </>
  );
}
