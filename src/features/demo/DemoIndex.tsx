import { ArrowDownRight } from "lucide-react";

export type Demo = {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  situation: string;
  solution: string;
  services: string[];
};

export function DemoIndex({ demo, index }: { demo: Demo; index: number }) {
  return (
    <a
      href={`#${demo.id}`}
      className="group flex items-center gap-5 border-b border-line px-2 py-5 transition-colors hover:bg-faint/20"
    >
      <span className="self-start pt-1 font-mono text-xs text-accent">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex-1">
        <h3 className="text-xl text-fg transition-colors group-hover:text-accent">
          {demo.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{demo.subtitle}</p>
      </div>

      <span className="text-lg text-muted px-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1">
        <ArrowDownRight className="size-5" strokeWidth={1.6} />
      </span>
    </a>
  );
}
