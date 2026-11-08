import { Link } from "react-router";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./ArrowRight";

export function ExampleBox({ examplePart }: { examplePart: string }) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 mx-auto",
        "my-6 p-4",
        "bg-raised/80 border border-line rounded",
      )}
    >
      <h4 className="eyebrow text-xs">EXAMPLE – INTEGRATIONS</h4>
      <h3 className="font-semibold text-xl">
        Connecting multiple data sources
      </h3>
      <span className="text-subtle">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore. Ut enim ad minim veniam.{" "}
      </span>

      <div className="horizontal-line my-3" />

      <Link
        to={`/work#${examplePart}`}
        className="btn btn-ghost flex justify-between items-center pr-2"
      >
        <div className="flex flex-col gap-1">
          <span className="font-normal">Explore the full customer case</span>
          <span className="text-subtle font-light text-sm">
            See how four parts of a solution work together
          </span>
        </div>
        <ArrowRight color="var(--fg)" size={24} strokeWidth={1} />
      </Link>
    </section>
  );
}
