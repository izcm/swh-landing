import { ArrowRight } from "lucide-react";
import Map from "../Map";
import { cn } from "../lib/cn";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-col items-start gap-10 py-16 px-4 text-left",
        "lg:flex-row items-center lg:justify-between",
      )}
    >
      <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1 className="text-4xl leading-tight text-fg line-clamp-2 lg:text-5xl ">
          Systems <br className="hidden lg:block" />
          that work <span className="text-accent">together.</span>
        </h1>
        <p className="mt-4 text-subtle tracking-lg">
          Break down information silos by making your existing systems talk to
          eachother.
        </p>
        <a
          href="#how-it-works"
          className="token-action mt-6 inline-flex items-center gap-1"
        >
          See how it works{" "}
          <span aria-hidden="true">
            <ArrowRight size={16} />
          </span>
        </a>
      </div>

      <div className="shrink-0">
        <Map />
      </div>
    </section>
  );
}
