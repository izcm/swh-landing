import { ArrowRight } from "lucide-react";
import { IconLink } from "@a2zb/react";
import Card from "./Card";

export default function Cta() {
  return (
    <section className="py-16">
      <Card className="flex flex-col gap-8 p-10 text-left md:flex-row md:items-center md:justify-between">
        <div>
          <span className="eyebrow">GET STARTED</span>
          <h2 className="mt-2 text-2xl text-fg">
            A more connected way
            <br />
            to work.
          </h2>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end md:text-right">
          <p className="max-w-xs text-sm text-subtle">
            Tell us about your setup and we'll explore what's possible.
          </p>
          <IconLink
            href="#contact"
            icon={<ArrowRight size={16} />}
            className="btn-primary"
          >
            Get in touch
          </IconLink>
        </div>
      </Card>
    </section>
  );
}
