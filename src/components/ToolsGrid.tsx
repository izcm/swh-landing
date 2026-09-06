import {
  Cloud,
  FileText,
  Database,
  ChartNoAxesColumnIncreasing,
  Settings,
  Plus,
} from "lucide-react";
import Card from "./Card";

const tools = [
  { icon: Cloud, tint: "text-accent" },
  { icon: FileText, tint: "text-fg" },
  { icon: Database, tint: "text-accent" },
  { icon: ChartNoAxesColumnIncreasing, tint: "text-accent" },
  { icon: Settings, tint: "text-[#8f8bff]" },
  { icon: Plus, tint: "text-faint" },
];

export default function ToolsGrid() {
  return (
    <section className="grid gap-10 border-t border-line py-16 text-left md:grid-cols-2 md:items-center">
      <div>
        <h2 className="text-2xl text-fg">
          Built around
          <br />
          your tools.
        </h2>
        <p className="mt-4 max-w-sm text-subtle">
          We integrate with the systems you already use — and build the
          missing connections.
        </p>
        <a
          href="#integrations"
          className="token-action mt-6 inline-flex items-center gap-1 text-sm"
        >
          View integrations <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {tools.map(({ icon: Icon, tint }, i) => (
          <Card key={i} className={`flex-center aspect-square ${tint}`}>
            <Icon strokeWidth={1.6} className="h-6 w-6" />
          </Card>
        ))}
      </div>
    </section>
  );
}
