// the country outlines, copied from
// notes/diagrams/new_story_diagrams/visualize/scandinavia-map.svg, in that
// file's coordinates. denmark is two pieces in one path: jutland, then zealand
const outlines = {
  norway:
    "M600.9 179.1 L564.7 193.5 L547.5 196.9 L556.5 171.6 L529.2 157.2 L496.1 169.4 L485.7 195.9 L465.4 211.9 L442.5 203.1 L414.7 204.9 L391.1 185.8 L378.3 195.4 L365.1 196.9 L362 220.6 L321.8 214.8 L316.2 234.9 L295.7 234.8 L281.7 260.5 L260.4 300.5 L227.3 351.2 L235.1 363.6 L227.7 377.9 L206.6 377.3 L192.7 411.1 L194 459 L207.6 477.3 L200.6 519.7 L182.9 544.5 L173.5 565.3 L159.2 543.1 L117.2 584.9 L88.8 593.3 L59.3 575 L51.7 536.2 L45 452.9 L64.6 429.7 L120.8 399.4 L162.9 362.1 L201.8 311.8 L253 242.1 L288.7 215 L347.2 169.7 L393.9 153.9 L428.9 155.8 L461.3 125.9 L500.2 127.5 L538.4 120.3 L605 146.7 L577.6 156.4 L600.9 179.1 Z",
  sweden:
    "M173.5 565.3 L182.9 544.5 L200.6 519.7 L207.6 477.3 L194 459 L192.7 411.1 L206.6 377.3 L227.7 377.9 L235.1 363.6 L227.3 351.2 L260.4 300.5 L281.7 260.5 L295.7 234.8 L316.2 234.9 L321.8 214.8 L362 220.6 L365.1 196.9 L378.3 195.4 L406.7 213 L439.9 237.6 L440.5 293.2 L447.7 307.2 L411 317.4 L390.4 342.6 L393.7 364.7 L359.8 393.7 L318.7 424.8 L303.2 475.6 L318.4 501 L338.7 521 L319.2 561.8 L297 570.2 L288.9 630.8 L276.8 664.6 L251 661.1 L238.9 689.7 L214.3 691.4 L207.5 657.3 L189.7 616.3 L173.5 565.3 Z",
  denmark:
    "M150 705 L136.3 710.5 L120.2 705.8 L111.6 685.8 L111 648.9 L114.5 639.1 L120.6 628.3 L139.4 626.1 L146.8 616.1 L164 605.9 L163.3 624.5 L157 636.2 L159.5 646.3 L171 651.8 L165.8 665.4 L159.5 661.5 L144.2 687.5 L150 705 Z M202.1 664.3 L208.9 682.4 L196.1 711.7 L173.8 691.3 L170.9 676.3 L202.1 664.3 Z",
};

// the box around all three outlines, in the same coordinates. the caller can
// use it for the map's width: height · width / height
export const scandinaviaMapBounds = {
  x: 45,
  y: 120.3,
  width: 560,
  height: 591.4,
};

// norway, sweden and denmark, each filled with its own color and outlined in
// `stroke`. `height` tall, and as wide as the map's shape makes it. drawn from
// (0, 0): the top-left of scandinaviaMapBounds
export function ScandinaviaMap({
  height,
  fills,
  stroke,
  strokeWidth,
}: {
  height: number; // how tall the map is drawn
  fills: { norway: string; sweden: string; denmark: string };
  stroke: string; // the outline around each country
  strokeWidth: number; // the outline's thickness, at the size it's drawn
}) {
  const { x, y } = scandinaviaMapBounds;
  const scale = height / scandinaviaMapBounds.height;

  return (
    <g
      transform={`scale(${scale}) translate(${-x}, ${-y})`}
      stroke={stroke}
      // the scale would thin the outline too, so undo it
      strokeWidth={strokeWidth / scale}
      strokeLinejoin="round"
    >
      <path d={outlines.norway} fill={fills.norway} />
      <path d={outlines.sweden} fill={fills.sweden} />
      <path d={outlines.denmark} fill={fills.denmark} />
    </g>
  );
}
