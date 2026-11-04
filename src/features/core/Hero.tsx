import { ArrowRight } from "lucide-react";

import { IconLink } from "@a2zb/react";

import { cn } from "@/lib/cn";
import { HeroDiagram } from "@/features/diagrams/hero/Diagram";

export default function Hero() {
  return (
    <section
      className={cn(
        "flex flex-1 flex-col justify-center gap-8",
        "w-full px-4 mt-8 sm:px-8",
        "xl:mx-auto xl:w-[94vw] xl:flex-row xl:items-center",
        "xl:gap-10 xl:px-0 xl:py-0",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start gap-5 text-start",
          "w-full max-w-4xl",
          "xl:mx-0 xl:basis-2/5 xl:shrink-0 xl:gap-6",
        )}
      >
        <h1
          className={cn(
            "text-4xl font-normal leading-tight text-fg",
            "sm:text-6xl",
          )}
        >
          SWH <span className="font-semibold text-accent">Studio.</span>
        </h1>

        <div
          className={cn(
            "flex flex-col gap-4",
            "text-base leading-relaxed font-light",
            "sm:text-lg",
          )}
        >
          <p>
            Welcome to SWH Studio, an independent software studio focused on
            helping Norwegian businesses modernize their technology and
            operations.
          </p>

          <p>
            With technology evolving faster than ever, my mission is to make it
            easier for small and medium-sized companies to explore and adopt new
            solutions, including AI.
          </p>
        </div>

        <IconLink
          href="#story-connect"
          icon={<ArrowRight size={16} />}
          className={cn(
            "btn gap-3 px-0 hover:text-fg",
            "text-lg font-light text-accent",
          )}
        >
          See what we do
        </IconLink>
      </div>

      <div
        className={cn(
          "w-full max-w-3xl mx-auto",
          "xl:min-w-0 xl:max-w-4xl xl:flex-1",
        )}
      >
        <HeroDiagram />
      </div>
    </section>
  );
}
