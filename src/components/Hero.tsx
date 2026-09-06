import { ArrowRight } from "lucide-react";
import Map from "../Map";
import { cn } from "../lib/cn";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-col items-start gap-10 py-12 text-left",
        "md:flex-row items-center md:justify-between",
      )}
    >
      <div className="md:ml-6">
        <h1 className="text-4xl leading-tight text-fg md:text-5xl text-center md:text-start">
          Systems <br className="hidden md:block" />
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

      <div>
        <Map />
      </div>
    </section>
  );
}
