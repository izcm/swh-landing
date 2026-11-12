import { SvgPlaceholder } from "@/components/SvgPlaceholder";
import type { Localized } from "@/lib/context/language";
import type { Service } from ".";

const shared = {
  id: "interactive-tools",
  diagrams: {
    card: <SvgPlaceholder label="Interactive Tools" width={480} height={300} />,
    hero: <SvgPlaceholder label="Interactive Tools" width={480} height={300} />,
  },
  example: { part: "working-with-records" },
};

export const interactiveTools: Localized<Service> = {
  en: {
    ...shared,
    eyebrow: "TOOLS",
    title: "Interactive Tools",
    short: "Give users the right tools to explore, analyze, and act.",
    overview: {
      title: "Lorem ipsum dolor sit amet",
      paragraphs: [
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
      ],
    },
    contact: {
      description: "Lorem ipsum dolor sit amet.",
      cta: "Lorem ipsum",
    },
    relatedServices: {
      description:
        "Interactive Tools and Visualization often work best together. Combining actions with charts, filters, and detailed data views allows users to understand the information they're working with before making changes.",
      groups: [
        {
          serviceIds: ["visualization"],
        },
      ],
    },
  },
  no: {
    ...shared,
    eyebrow: "TOOLS",
    title: "Interaktive verktøy",
    short: "Gjør oppgaver med mange steg til én enkel handling.",
    overview: {
      title: "Lorem ipsum",
      paragraphs: ["Lorem ipsum", "Lorem ipsum"],
    },
    contact: { description: "Lorem ipsum", cta: "Lorem ipsum" },
    relatedServices: {
      description: "Lorem ipsum",
      groups: [{ serviceIds: ["visualization"] }],
    },
  },
};
