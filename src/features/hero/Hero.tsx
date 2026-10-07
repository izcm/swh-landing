import { ArrowRight } from "lucide-react";

import { IconLink } from "@a2zb/react";

import { cn } from "@/lib/cn";
import { HeroDiagram } from "./diagram/Diagram";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-col items-center flex-1",
        "px-2 mt-12 text-center gap-3 2xl:gap-3",
        "2xl:flex-row 2xl:text-start 2xl:mt-0 2xl:mx-auto 2xl:w-[90vw]",
      )}
    >
      <div className="flex flex-col items-center gap-3 2xl:items-start 2xl:gap-2">
        <h1 className="text-3xl md:text-4xl 2xl:text-5xl max-w-xl 2xl:min-w-md font-normal leading-tight text-fg">
          Systems that work{" "}
          <span className="text-accent font-semibold">together.</span>
        </h1>

        <p className="text-fg-tinted/80 font-light md:text-lg 2xl:text-xl">
          Discover hidden value through{" "}
          <span className="2xl:block">new connections.</span>
        </p>

        <IconLink
          href="#story-0"
          icon={<ArrowRight size={16} />}
          className="btn-menu gap-3 text-lg text-accent 2xl:px-0 font-light 2xl:mt-3 tracking-wide"
        >
          See how it works
        </IconLink>
      </div>

      <div className="w-full max-w-220 mx-auto 2xl:mt-0 mt-6">
        <HeroDiagram />
      </div>
    </section>
  );
}
