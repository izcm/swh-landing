import { Box, FileSpreadsheet, Mailbox, type LucideIcon } from "lucide-react";

export type ConnectNode = { label: string; icon: LucideIcon; color: string };

// one box per node, top to bottom
export const connectNodes: ConnectNode[] = [
  {
    label: "Accounting",
    icon: FileSpreadsheet,
    color: "var(--accent-electric)",
  },
  {
    label: "Mailbox",
    icon: Mailbox,
    color:
      "oklch(from var(--accent-electric) calc(l + 0.08) calc(c - 0.06) calc(h - 10))",
  },
  { label: "Others", icon: Box, color: "var(--accent-glow)" },
];
