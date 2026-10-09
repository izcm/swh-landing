import { ArrowRight } from "lucide-react";

import { IconLink } from "@a2zb/react";

import { cn } from "@/lib/cn";
import { HeroDiagram } from "./diagram/Diagram";

export default function Hero() {
  return (
    <section
      className={cn(
        // layout
        "flex flex-1 flex-col items-center justify-center gap-3",
        // spacing + text
        "px-2 text-center",
        // 2xl: side by side
        "2xl:flex-row 2xl:justify-start 2xl:gap-3",
        "2xl:mt-0 2xl:mx-auto 2xl:w-[90vw]",
        "2xl:text-start",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-3",
          "2xl:items-start 2xl:gap-2",
        )}
      >
        <h1
          className={cn(
            "max-w-xl",
            "text-3xl font-normal leading-tight text-fg",
            "md:text-4xl",
            "2xl:min-w-md 2xl:text-5xl",
          )}
        >
          Systems that work{" "}
          <span className="text-accent font-semibold">together.</span>
        </h1>

        <p
          className={cn(
            "font-light text-fg-tinted/80",
            "md:text-lg",
            "2xl:text-xl",
          )}
        >
          Discover hidden value through{" "}
          <span className="2xl:block">new connections.</span>
        </p>

        <IconLink
          href="#story-0"
          icon={<ArrowRight size={16} />}
          className={cn(
            "btn-menu gap-3",
            "text-lg font-light tracking-wide text-accent",
            "2xl:mt-3 2xl:px-0",
          )}
        >
          See how it works
        </IconLink>
      </div>

      <div className="w-full max-w-220 mx-auto">
        <HeroDiagram />
      </div>
    </section>
  );
}
