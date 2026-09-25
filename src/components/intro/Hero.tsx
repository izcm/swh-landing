import { ArrowRight } from "lucide-react";

import { IconLink } from "@a2zb/react";

import Map from "../../Map";
import { cn } from "../../lib/cn";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-col items-center",
        "px-8 py-6 md:px-12",
        "text-center gap-6",
      )}
    >
      <div className="flex max-w-2xl flex-col items-center">
        <h1 className="text-3xl leading-tight text-fg">
          Systems that work <span className="text-accent">together.</span>
        </h1>

        <p className="mt-4 tracking-lg text-subtle">
          Discover hidden value through new connections.
        </p>

        <IconLink
          href="#story-connect"
          icon={<ArrowRight size={16} />}
          className="btn-menu mt-3 gap-3 px-0 text-base text-accent"
        >
          See how it works
        </IconLink>
      </div>

      <div className="w-full py-6 max-w-[460px]">
        <Map />
      </div>
    </section>
  );
}
