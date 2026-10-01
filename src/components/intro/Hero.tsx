import { ArrowRight } from "lucide-react";

import { IconLink } from "@a2zb/react";

import Map from "../../Map";
import { cn } from "@/lib/cn";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-col items-center flex-1",
        "px-8 py-3 mt-6 md:px-12",
        "text-center gap-6",
        "lg:flex-row lg:text-start",
      )}
    >
      <div className="flex flex-col items-center gap-3 lg:items-start lg:gap-2">
        <h1 className="text-3xl lg:text-5xl  max-w-xl font-medium leading-tight text-fg">
          Systems that work{" "}
          <span className="text-accent font-semibold">together.</span>
        </h1>

        <p className="text-subtle lg:text-lg">
          Discover hidden value through{" "}
          <span className="lg:block">new connections.</span>
        </p>

        <IconLink
          href="#story-0"
          icon={<ArrowRight size={16} />}
          className="btn-menu gap-3 text-base text-accent lg:px-0"
        >
          See how it works
        </IconLink>
      </div>

      <div className="w-full py-6 max-w-110 mx-auto">
        <Map />
      </div>
    </section>
  );
}
