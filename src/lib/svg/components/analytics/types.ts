import type { LegendItem } from "./Legend";

// one piece of a ring chart: a legend item (color, label) plus its value, so the
// same array goes to the chart and Legend
export type Slice = LegendItem & {
  value: number; // any size: the slice is value / total of the ring
};
