import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { cn } from "@/lib/cn";
import { HeroDiagram } from "@/features/diagrams/hero";
import { useLanguage } from "@/lib/context/language";
import { copy } from "./copy";

export default function Hero() {
  const { lang } = useLanguage();
  const t = copy[lang].hero;

  return (
    <section
      className={cn(
        "flex flex-1 flex-col justify-start gap-0",
        "w-full mt-12 px-4",

        // responsive
        "sm:px-8",
        "xl:mx-auto xl:w-[94vw] xl:flex-row xl:items-center",
        "xl:gap-0 xl:px-0 xl:py-0 xl:mt-0",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start gap-5 text-start",
          "w-full max-w-4xl",
          "xl:mx-0 xl:basis-2/5 xl:shrink-0 xl:gap-6",
        )}
      >
        <h1 className={cn("text-6xl leading-tight text-fg ", "sm:text-6xl")}>
          SWH <span className="text-accent pretty-text">Studio.</span>
        </h1>

        <div
          className={cn(
            "flex flex-col gap-4",
            "text-base leading-relaxed",
            "sm:text-lg",
          )}
        >
          {t.welcome.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <Link
          to="/services"
          className={cn(
            "flex btn justify-between no-underline gap-3 px-0 hover:text-fg",
            "text-lg font-light text-accent",
          )}
        >
          {t.cta}
          <span aria-hidden="true">
            <ArrowRight size={16} />
          </span>
        </Link>
      </div>

      <div
        className={cn(
          "w-full max-w-75 mt-16 mx-auto",
          "md:max-w-85",
          "xl:min-w-0 xl:max-w-90 xl:flex-1 xl:mt-0",
        )}
      >
        <HeroDiagram />
      </div>
    </section>
  );
}
