import { Box, FileText, Users, type LucideIcon } from "lucide-react";

export type ConnectNode = { label: string; icon: LucideIcon; color: string };

// one card per node, top to bottom
export const connectNodes: ConnectNode[] = [
  { label: "Accounting", icon: FileText, color: "var(--accent-teal)" },
  { label: "HR", icon: Users, color: "var(--accent-lavender)" },
  { label: "Others", icon: Box, color: "var(--accent-cyan)" },
];
