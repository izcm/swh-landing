import type { ReactNode } from "react";

import type { LegendItem } from "./Legend";

// one piece of a ring chart: a legend item (color, label) plus its value, so the
// same array goes to the chart and Legend
export type Slice = LegendItem & {
  value: number; // any size: the slice is value / total of the ring
};

export type Series<T> = {
  key: string;
  label?: ReactNode; // so users can pass a fileld tube looking label also
  color?: string;
};
