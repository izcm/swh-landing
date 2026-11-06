import { useId } from "react";
import { Eye, Plus, User, Zap } from "lucide-react";

import {
  alignCenter,
  alignEnd,
  cascadeLayout,
  deg,
  paddedBox,
} from "@/lib/svg";
import { MenuBoard, type MenuBoardRow } from "../shared/menu-board/MenuBoard";
import { MenuBoardHeader } from "../shared/menu-board/Header";

// the menu board's rows: one per action
const actions: MenuBoardRow[] = [
  { icon: Plus, lines: ["Create task"] },
  { icon: User, lines: ["Assign to"] },
  { icon: Eye, lines: ["Track item"] },
];

export function ActDiagram() {}
