import { IconLink } from "@a2zb/react";
import { ExternalLink, FileText, Mail, Users } from "lucide-react";
import { cn } from "../../lib/cn";
import { Carosel } from "./Carosel";
import { LightBox } from "./LightBox";
import { useState } from "react";

const features = [
  {
    icon: FileText,
    text: "Reads employee data from a PowerOffice test environment",
  },
  {
    icon: Users,
    text: "Assigns responsibility of vehicles between employees",
  },
  {
    icon: Mail,
    text: "Parses results from workshop results sent to a company mailbox",
  },
];

export function Demo() {
  const [openLightBox, setOpenLightBox] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const mediaItems = Array.from({ length: 3 }).map((_, i) => ({
    type: "image" as const,
    src: `hubben_${i + 1}.png`,
    alt: "temporary alt",
  }));

  return (
    <section
      className={cn(
        "flex flex-col items-center gap-8",
        "border-t border-faint-accent",
        "px-4 py-8",
        "lg:px-12",
      )}
      id="demo"
    >
      <div className="flex w-full items-center gap-6 self-start">
        <span className="eyebrow text-sm lg:text-base">DEMO</span>
        <div className="horizontal-line bg-accent/40" />
      </div>

      <h2 className={cn("text-2xl text-fg", "lg:text-3xl")}>
        See it in <span className="text-accent">practice</span>
      </h2>

      <div className="max-w-2xl">
        <Carosel
          items={Array.from({ length: 3 }).map((_, i) => (
            <img
              src={`hubben_${i + 1}.png`}
              onClick={() => {
                setSlideIndex(i);
                setOpenLightBox(true);
              }}
            />
          ))}
          index={slideIndex}
          onChange={setSlideIndex}
        />
        <LightBox
          items={mediaItems}
          isOpen={openLightBox}
          index={slideIndex}
          onChange={setSlideIndex}
          onClose={() => setOpenLightBox(false)}
        />
      </div>

      <div className="flex gap-6 max-w-[600px] mx-auto p-3">
        {/* LEFT ACCENT BORDER */}
        <div className="vertical-line rounded w-0.5 bg-accent/75 mr-3" />
        {/* DEMO INFORMATION PARAGRAPH*/}
        <div className="flex flex-col py-1 gap-5">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl text-fg">EU inspection tracker</h3>
            <p className="text-subtle">
              A demo for a{" "}
              <strong className="font-medium text-fg/80">
                hypothetical fleet-owning business
              </strong>
              . It connects employee data from{" "}
              <strong className="font-medium text-fg/80">PowerOffice</strong>{" "}
              with vehicle responsibility and workshop results received through
              a company mailbox.
            </p>
          </div>

          <ul className="flex flex-col gap-3 text-sm text-subtle">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-faint-accent">
                  <Icon size={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="border-t border-faint-accent pt-5 text-sm text-subtle">
            The next step would be to add further automation. Background workers
            could notify key people before a due date or check if an employee
            has vacation scheduled and alert if it conflicts with upcoming
            inspections.
          </div>
        </div>
      </div>

      <div className="grid place-items-center gap-6">
        <p className="max-w-xs text-lg text-fg text-center">
          Usually, the data already exists. <br /> It just needs to{" "}
          <span className="text-accent font-medium">connect</span>.
        </p>

        <IconLink
          href="https://hubben.swh.no"
          external
          className="btn btn-primary rounded-lg gap-3"
          icon={<ExternalLink size={16} />}
        >
          Open the demo
        </IconLink>
      </div>
    </section>
  );
}
