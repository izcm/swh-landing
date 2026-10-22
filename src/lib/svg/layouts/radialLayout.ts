// My pick: radialLayout, with startAngle and endAngle so you can create full circles, semicircles, or partial arcs.
export function radialLayout({
  startAngle,
  endAngle,
  values,
}: {
  startAngle: number;
  endAngle: number;
  values: number[];
}) {
  const total = values.reduce((sum, value) => sum + value, 0);
  const span = endAngle - startAngle;

  let angle = startAngle;

  return values.map((value) => {
    // start where previous one ends, or at initial angle if no previous
    const segmentStart = angle;
    const segmentEnd = segmentStart + (span / total) * value;

    // start next segment where this one ended
    angle = segmentEnd;

    return {
      startAngle: segmentStart,
      endAngle: segmentEnd,
      midAngle: (segmentStart + segmentEnd) / 2,
    };
  });
}
