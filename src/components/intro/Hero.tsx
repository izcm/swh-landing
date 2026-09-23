import { ArrowRight } from "lucide-react";

import { IconLink } from "@a2zb/react";

import Map from "../../Map";
import { cn } from "../../lib/cn";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-col items-center",
        "px-8 py-12 md:px-12 md:py-12",
        "text-center",
      )}
    >
      <div className="flex max-w-2xl flex-col items-center">
        <h1 className="text-3xl leading-tight text-fg md:text-4xl">
          Systems that work <span className="text-accent">together.</span>
        </h1>

        <p className="mt-4 text-base tracking-lg text-subtle lg:text-lg">
          Discover hidden value through new connections.
        </p>

        <IconLink
          href="#story-connect"
          icon={<ArrowRight size={16} />}
          className="btn-menu mt-3 gap-3 px-0 text-lg text-accent"
        >
          See how it works
        </IconLink>
      </div>

      <div className="mt-10 w-full max-w-[460px] md:mt-12 md:max-w-[500px]">
        <Map />
      </div>
    </section>
  );
}
