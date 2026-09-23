import { ArrowRight } from "lucide-react";
import { IconLink } from "@a2zb/react";

import Map from "../../Map";

import { cn } from "../../lib/cn";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-col items-start gap-4 md:p-12 p-8 ext-left",
        "lg:flex-row items-center",
      )}
    >
      <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1 className="text-3xl md:text-4xl leading-tight text-fg line-clamp-2">
          Systems <br className="hidden lg:block" />
          that work <span className="text-accent">together.</span>
        </h1>
        <p className="mt-4 text-base lg:text-lg text-subtle tracking-lg">
          Discover hidden value through new connections.
          {/* Break down information silos by making your existing systems talk to
          eachother. */}
        </p>
        <IconLink
          href="#story-connect"
          icon={<ArrowRight size={16} />}
          className="mt-3 gap-3 px-0 text-lg btn-menu text-accent"
        >
          See how it works
        </IconLink>
      </div>

      <div className="w-full max-w-[450px] lg:max-w-[440px]">
        <Map />
      </div>
    </section>
  );
}
