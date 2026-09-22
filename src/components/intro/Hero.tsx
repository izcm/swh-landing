import { ArrowRight } from "lucide-react";
import { IconLink } from "@a2zb/react";

import Map from "../../Map";

import { cn } from "../../lib/cn";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-col items-start gap-10 py-24 px-8 text-left",
        "lg:flex-row items-center",
      )}
    >
      <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1 className="heading-1">
          Systems <br className="hidden lg:block" />
          that work <span className="text-accent">together.</span>
        </h1>
        <p className="mt-4 text-subtle tracking-lg">
          Discover hidden value through new connections.
          {/* Break down information silos by making your existing systems talk to
          eachother. */}
        </p>
        <IconLink
          href="#story-connect"
          icon={<ArrowRight size={16} />}
          className="mt-3 px-0 text-base btn-menu text-accent"
        >
          See how it works
        </IconLink>
      </div>

      <div className="mx-auto grid place-items-center flex-1">
        <Map />
      </div>
    </section>
  );
}
