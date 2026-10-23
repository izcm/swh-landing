// everything the visualize diagram's charts draw, in one place so an animation
// can change it from the diagram. values are 0-1, like the charts expect, and
// the position in a list is the time step

// `count` values from f, with x going evenly from 0 to 1
const sample = (count: number, f: (x: number) => number) =>
  Array.from({ length: count }, (_, i) => f(i / (count - 1)));

export const chartData = {
  // UpperLeft's line chart: a steady climb with three round waves that grow a
  // little from left to right. stays between about 0.2 and 0.8
  trend: sample(
    85,
    (x) =>
      0.18 + 0.55 * x + 0.1 * (0.7 + 0.6 * x) * Math.sin(6 * Math.PI * x + 0.4),
  ),

  // UpperRight's trend chart, one line per series: strictly falling from 0.78
  // to 0.18, slowly at first and steeply at the end. the drop is 0.3·x (a
  // steady slope) plus 0.7·x⁴ (the steep end), with a small wobble too gentle
  // to ever turn it around (its slope, at most 0.25, stays under the steady 0.3)
  series: [
    {
      values: sample(
        60,
        (x) =>
          0.78 -
          0.6 *
            (0.3 * x +
              0.7 * x ** 4 +
              (0.25 * Math.sin(6 * Math.PI * x)) / (6 * Math.PI)),
      ),
    },
  ],

  // BottomCenter's bar chart: each bar's height
  bars: [0.42, 0.58, 0.47, 1, 0.66, 0.79, 0.6].map((v) => v * 0.65),

  // BottomCenter's donut: each slice's size and color
  donut: [
    { value: 5, color: "var(--accent)" },
    { value: 3, color: "var(--accent-electric)" },
    { value: 2, color: "oklch(from var(--accent-deep) l c h)" },
  ],

  // BottomRight's gauge: the segments (one tick where each starts) and how full it is, out of their total
  gauge: { values: [1, 1, 1, 1, 1, 1], value: 4 },
};

export type ChartData = typeof chartData;
