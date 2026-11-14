import type { Localized } from "@/lib/context/language";
import { IntegrationsDiagram, Nodes } from "../../../diagrams/integrations";
import type { Service } from ".";

const shared = {
  id: "integrations",
  diagrams: {
    card: (
      <Nodes
        width="100%"
        height="100%"
        viewboxWidth={320}
        viewboxHeight={240}
        strokeWidth={1}
        shares={{ nodes: 1 / 3, connectors: 1 / 3, cube: 1 / 3 }}
      />
    ),
    hero: <IntegrationsDiagram />,
  },
  example: { part: "connecting-systems" },
};

export const integrations: Localized<Service> = {
  en: {
    ...shared,
    eyebrow: "INT",
    title: "Integrations",
    short: "Discover new capabilities through connections.",
    overview: {
      title: "Connecting systems, making data accessible",
      paragraphs: [
        "Businesses often rely on several software systems for their daily operations. An accounting system, collaboration tools, and internal spreadsheets may all contain information needed across the business.",
        "When these systems operate independently, valuable information becomes isolated in what we call information silos. Integrations allow data to move between systems, reducing manual work and making information more accessible.",
        "SWH develops and maintains these connections, allowing existing systems to work together and support new capabilities.",
      ],
    },
    contact: {
      description: "Have systems you'd like to connect?",
      cta: "Get in touch",
    },
    relatedServices: {
      description:
        "Integrations often provide the foundation for extending existing systems.",
      groups: [
        {
          label: "User-facing",
          description: "Explore data and perform actions through a browser.",
          serviceIds: ["visualization", "interactive-tools"],
        },
        {
          label: "Background processes",
          description: "Handle tasks and updates automatically.",
          serviceIds: ["automation"],
        },
      ],
    },
  },
  no: {
    ...shared,
    eyebrow: "INT",
    title: "Integrasjoner",
    short: "Lag koblingene som skaper nye muligheter.",
    overview: {
      title: "Nye muligheter gjennom forbedret dataflyt.",
      paragraphs: [
        "De fleste bedrifter bruker flere ulike systemer for daglig drift. Når data ikke flyter mellom disse systemene, blir informasjon liggende isolert i det vi kaller informasjonssiloer. Ved å koble sammen systemene kan data utveksles, bearbeides og kombineres på ulike måter.",
        "Integrasjoner er ofte et naturlig første steg for bedrifter som ønsker å ta i bruk skreddersydd programvare for å forbedre sine arbeidsprosesser. De legger grunnlaget for flere av tjenestene vi tilbyr, blant annet visualisering, automatisering og interaktive verktøy.",
        "SWH utvikler og vedlikeholder slike koblinger.",
      ],
    },
    contact: {
      description: "Trenger du en ny kobling?",
      cta: "Ta kontakt",
    },
    relatedServices: {
      description:
        "Integrasjoner legger ofte grunnlaget for å utvide funksjonaliteten i eksisterende systemer.",
      groups: [
        {
          label: "Brukerrettede løsninger",
          description:
            "Utforsk data og utfør handlinger direkte i nettleseren.",
          serviceIds: ["visualization", "interactive-tools"],
        },
        {
          label: "Bakgrunnsprosesser",
          description: "La oppgaver og oppdateringer skje automatisk.",
          serviceIds: ["automation"],
        },
      ],
    },
  },
};
