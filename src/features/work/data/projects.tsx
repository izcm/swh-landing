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
      subtitle: "The hub",
      client: "A mid-sized vehicle rental company.",
      situation:
        "Vehicle, contract, and employee information is spread across multiple systems. Following up on inspections requires significant manual work.",
      solution:
        "An application that brings this information into one dashboard, automates notifications and inspection result processing, and simplifies the management of upcoming inspections.",
      technicalParts: [
        {
          label: "Integrations",
          approach: [
            "Connect the four systems used in daily operations. Retrieve and transform their data into a consistent format.",
            "Create an API that makes this information accessible to other parts of the application.",
          ],
          result: [
            "A backend application that retrieves and transforms data from all four systems, then stores it in a centralized database. The information is made available to the rest of the application through an API.",
          ],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Visualization",
          approach: [
            "Build a web interface that retrieves data through the API and presents it in an interactive dashboard.",
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
            "The integrations allow each inspection record to have an assigned employee as its contact person. Add functionality for users to change this assignment and manually send notifications for selected records.",
            "Incorporate these actions directly into the dashboard so users can act on the information they see.",
          ],
          result: [
            "Users can update contact persons and send notifications for one or multiple inspection records directly from the dashboard.",
          ],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Automation",
          approach: [
            "Set up three workers:",
            "1. Read incoming workshop emails and update the corresponding inspection attempts.",
            "2. Detect changes to inspection attempts and notify the responsible employee by email.",
            "3. Check overdue inspections against the Norwegian Public Roads Administration and create new inspection records when a new deadline is available.",
          ],
          result: [
            "Three background processes that automatically handle workshop results, notifications, and inspection follow-up.",
          ],
          note: "In this demo, the hypothetical client receives inspection results from their workshop by email, using a predefined format created for the example.",
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
      subtitle: "Et knutepunkt",
      client: "Et mellomstort bilutleiefirma",
      situation:
        "Informasjon om kjøretøy, kontrakter og ansatte er fordelt på flere systemer. Oppfølging av EU-kontroller krever mye manuelt arbeid.",
      solution:
        "En applikasjon som samler informasjonen i ett dashboard, automatiserer varsling og behandling av verkstedresultater, og gjør det enklere å administrere kommende EU-kontroller.",
      technicalParts: [
        {
          label: "Integrasjoner",
          approach: [
            "Koble sammen de fire systemene bedriften bruker i den daglige driften. Hent ut dataene og tilpass dem til et felles format før de lagres i en egen database.",
            "Lag et API som gjør dataene tilgjengelige for resten av applikasjonen.",
          ],
          result: [
            "En backend-applikasjon som henter inn data, tilpasser formatet og lagrer dem i en felles database. Dataene er deretter tilgjengelige for resten av applikasjonen via API-et.",
          ],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Visualisering",
          approach: [
            "Bygg et webgrensesnitt som henter informasjon fra API-et og presenterer den i et interaktivt dashboard.",
            "Organiser informasjonen i grafer og tabeller med filtrering og mulighet for å åpne detaljer om enkeltoppføringer.",
          ],
          result: [
            "Et interaktivt dashboard med oversikt over kjøretøy og EU-kontroller. Brukeren kan filtrere informasjonen og åpne detaljer om enkeltoppføringer.",
          ],
          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Interaktive verktøy",
          approach: [
            "Integrasjonene gjør det mulig å knytte en ansatt til hver EU-kontroll som kontaktperson. Legg til funksjoner for å endre kontaktperson og sende varsler manuelt for utvalgte oppføringer.",
            "Bygg handlingene inn i dashboardet, slik at brukeren kan utføre dem direkte fra oversikten.",
          ],
          result: [
            "Brukeren kan endre kontaktperson og sende varsler for én eller flere EU-kontroller direkte fra dashboardet.",
          ],

          diagram: <SvgPlaceholder label="Diagram" width={450} height={200} />,
        },
        {
          label: "Automatisering",
          approach: [
            "Sett opp tre workers som:",
            "1. Leser innkommende e-post fra verksteder og oppdaterer tilhørende kontrollforsøk.",
            "2. Oppdager endringer i kontrollforsøk og varsler ansvarlig ansatt på e-post.",
            "3. Sjekker utløpte kontrollfrister mot Statens vegvesen og oppretter nye EU-kontroller når en ny frist er registrert.",
          ],
          result: [
            "Tre bakgrunnsprosesser som håndterer verkstedresultater, varsling og oppfølging av kontrollfrister automatisk.",
          ],
          note: "I demoen sender det hypotetiske verkstedet kontrollresultater på e-post i et forhåndsdefinert format.",
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
