import type { ReactNode } from "react";
import type { Localized } from "@/lib/context/language";

import { automation } from "./automation";
import { integrations } from "./integrations";
import { interactiveTools } from "./interactive-tools";
import { visualization } from "./visualization";

export type RelatedServicesData = {
  description: string;
  groups: {
    label?: string;
    description?: string;
    serviceIds: string[];
  }[];
};

export type Service = {
  id: string;
  eyebrow: string;
  title: string;
  short: string;

  diagrams: {
    card: ReactNode;
    hero: ReactNode;
  };

  overview: {
    title: string;
    paragraphs: string[];
  };

  example: {
    part: string;
  };

  contact: {
    description: string;
    cta: string;
  };

  relatedServices?: RelatedServicesData;
};

const list = [integrations, visualization, interactiveTools, automation];

export const services: Localized<Service[]> = {
  en: list.map((service) => service.en),
  no: list.map((service) => service.no),
};
