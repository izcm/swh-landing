import { Database, Zap, ArrowRight } from "lucide-react";
import Card from "../Card";

export default function BuildOnExisting() {
  return (
    <section
      id="how-it-works"
      className="border-t border-accent-muted/60 py-16 text-center"
    >
      <span className="eyebrow">BUILD ON WHAT YOU ALREADY HAVE</span>
      <h2 className="mt-2 text-2xl text-fg md:text-3xl">
        Get more from your existing systems.
      </h2>

      <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-4 text-subtle">
        <p>
          Most businesses already use several systems to run their day-to-day
          operations — accounting software, industry-specific tools,
          spreadsheets, cloud services and internal systems. Each one may work
          perfectly well on its own.
        </p>
        <p>
          The problems tend to appear between those systems. Information stays
          in silos, employees fill the gaps manually, and important
          opportunities for automation are lost.
        </p>
        <p>
          We connect to your existing software, automate the work around it and
          add only what is missing.
        </p>
      </div>

      <div className="mt-12 flex items-center justify-center gap-3">
        <Card className="flex-center h-20 w-28 flex-col gap-1 text-center">
          <Database className="h-5 w-5 text-muted" strokeWidth={1.6} />
          <span className="text-xs text-muted">
            Your data
            <br />
            in their systems
          </span>
        </Card>

        <ArrowRight className="h-4 w-4 shrink-0 text-faint" />

        <Card className="flex-center h-20 w-20 border-accent/40 text-fg">
          SWH
        </Card>

        <ArrowRight className="h-4 w-4 shrink-0 text-faint" />

        <Card className="flex-center h-20 w-28 flex-col gap-1 text-center">
          <Zap className="h-5 w-5 text-muted" strokeWidth={1.6} />
          <span className="text-xs text-muted">
            New capabilities
            <br />
            for your business
          </span>
        </Card>
      </div>
    </section>
  );
}
