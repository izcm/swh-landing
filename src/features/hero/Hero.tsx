import { ArrowRight } from "lucide-react";

import { IconLink } from "@a2zb/react";

import { cn } from "@/lib/cn";
import { HeroDiagram } from "./diagram/Diagram";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-col items-center flex-1",
        "px-2 mt-12 text-center gap-3 xl:gap-6",
        "xl:flex-row xl:text-start xl:mt-0",
      )}
    >
      <div className="flex flex-col items-center gap-3 xl:items-start xl:gap-2 xl:ml-12">
        <h1 className="text-3xl md:text-4xl xl:text-5xl max-w-xl xl:min-w-md font-medium  leading-tight text-fg">
          Systems that work{" "}
          <span className="text-accent font-semibold">together.</span>
        </h1>

        <p className="text-fg-tinted font-medium md:text-lg xl:text-xl">
          Discover hidden value through{" "}
          <span className="xl:block">new connections.</span>
        </p>

        <IconLink
          href="#story-0"
          icon={<ArrowRight size={16} />}
          className="btn-menu gap-3 text-lg text-accent xl:px-0 font-light tracking-wide"
        >
          See how it works
        </IconLink>
      </div>

      <div className="w-full max-w-240 mx-auto">
        <HeroDiagram />
      </div>
    </section>
  );
}
