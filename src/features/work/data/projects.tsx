import { SvgPlaceholder } from "@/components/SvgPlaceholder";
import type { Localized } from "@/lib/context/language";
import type { MediaItem } from "../Showcase";
import type { TechnicalPart } from "../TechnicalView";

export type ProjectData = {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  situation: string;
  solution: string;
  services: string[];
  technicalParts: TechnicalPart[];
  mediaItems: MediaItem[];
};

const hubben = {
  id: "hubben",
  title: "Hubben",
  services: [
    "integrations",
    "visualization",
    "interactive-tools",
    "automation",
  ],
};

export const projects: Localized<ProjectData[]> = {
  en: [
    {
      ...hubben,
      subtitle: "Business operations · Live demo",
      client: "A medium sized vehicle rental operations.",
      situation:
        "Manual processes and fragmented information made inspections and follow-up time consuming and hard to scale.",
      solution:
        "A custom solution that brings inspections, data and operations together in one place, with integrations, clear visualization and automation.",
      technicalParts: [
        {
          label: "Integrations",
          approach: [
            "Integrate the four systems containing the data the company currently relies on for its daily operations. Transform the data into a consistent format.",
            "Create a way for other parts of the application to access the data. This is called an API.",
          ],
          result: [
            "A backend application that periodically fetches the data, transforms it, and stores the result in a centralized datastore containing information from all four systems, ready for use by the rest of the application.",
          ],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Visualization",
          approach: [
            "Build a web interface that presents data from the datastore in an interactive dashboard.",
            "Organize the information into meaningful charts and summaries, with filters and drill-down views that let users explore individual records.",
          ],
          result: [
            "An interactive, filterable dashboard that provides a clear overview of all relevant data.",
            "Users can drill down into detailed lists and inspect individual records.",
          ],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Interactive Tools",
          approach: [
            "Extend the dashboard's detailed list view with tools for assigning employees responsible for vehicles and sending email notifications.",
            "Allow users to select multiple records and perform these actions in batches.",
          ],
          result: [
            "Users can manually update records and trigger email notifications directly from the application.",
          ],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Automation",
          approach: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          ],
          result: ["Ut enim ad minim veniam, quis nostrud exercitation."],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
      ],
      mediaItems: Array.from({ length: 3 }).map((_, i) => ({
        type: "image" as const,
        src: `/hubben/hubben_${i + 1}.png`,
        alt: "temporary alt",
        title: "Inspection overview",
      })),
    },
  ],
  no: [
    {
      ...hubben,
      subtitle: "En typisk første webapp",
      client: "Et medium-sized bilutleiefirma",
      situation:
        "Manuelle prosesser på tvers av flere plattformer førte til krevende oppfølgning av mandatory EU inspeksjoner. Den hypotetiske bedriften ønsker informatsjon om utleide bilers kontrakt, resulteter fra workshops, tidslinje og annen relevant info og actions, samlet i en løsning, med automatisering der man fant regelsett.",
      solution: "Lorem ipsum",
      technicalParts: [
        {
          label: "Integrasjoner",
          approach: [
            "Integrer de fire systemene, transformer dataen slik at vå får den på det formatet som passer applikasjonens behov. Lagre deretter dataene til en separat database vi har kontroll over.",
            "Gjør det mulig å hente ut dataen for bruk i de andre delene av applikasjonen, en slik portal (idk what to say portalworks but ???) kalles et API.",
          ],
          result: [
            "En backend applikasjon som periodesvis henter ut data, får dem på rett format, og lagrer dem på et sentralisert med mulighet for å hente ut.",
          ],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Visualisering",
          approach: ["Lorem ipsum", "Lorem ipsum"],
          result: ["Lorem ipsum", "Lorem ipsum"],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Interaktive verktøy",
          approach: ["Lorem ipsum", "Lorem ipsum"],
          result: ["Lorem ipsum"],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Automatisering",
          approach: ["Lorem ipsum"],
          result: ["Lorem ipsum"],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
      ],
      mediaItems: Array.from({ length: 3 }).map((_, i) => ({
        type: "image" as const,
        src: `/hubben/hubben_${i + 1}.png`,
        alt: "Lorem ipsum",
        title: "Lorem ipsum",
      })),
    },
  ],
};
