import type { Localized } from "@/lib/context/language";

export const copy: Localized<{
  subject: string;
  intro: {
    eyebrow: string;
    heading: string;
    text: string;
  };
  message: {
    label: string;
    placeholder: string;
    openInEmail: string;
    emailNote: string;
  };
  directContact: {
    title: string;
    copyButton: string;
    copied: string;
  };
  email: string;
  phone: string;
  modal: {
    label: string;
    close: string;
  };
}> = {
  en: {
    subject: "Website inquiry",
    intro: {
      eyebrow: "Contact",
      heading: "Hello.",
      text: "Have a project in mind, or just want to explore an idea? Feel free to get in touch.",
    },
    message: {
      label: "Message",
      placeholder: "Hi! I'm wondering about...",
      openInEmail: "Open in email",
      emailNote: "This opens your default email app.",
    },
    directContact: {
      title: "Direct contact",
      copyButton: "Copy",
      copied: "Copied",
    },
    email: "Email",
    phone: "Phone",
    modal: {
      label: "Contact",
      close: "Close",
    },
  },
  no: {
    subject: "Henvendelse via nettsiden",
    intro: {
      eyebrow: "Kontakt",
      heading: "Hallo.",
      text: "Har en idé eller et spørsmål? Ta kontakt da.",
    },
    message: {
      label: "Melding",
      placeholder: "Hei! Jeg lurer på...",
      openInEmail: "Åpne i e-post",
      emailNote: "Dette åpner standard e-postappen din.",
    },
    directContact: {
      title: "Direkte kontakt",
      copyButton: "Kopier",
      copied: "Kopiert",
    },
    email: "E-post",
    phone: "Telefon",
    modal: {
      label: "Kontakt",
      close: "Lukk",
    },
  },
};
