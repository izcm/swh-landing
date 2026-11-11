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
    subject: "Project inquiry",
    intro: {
      eyebrow: "Contact",
      heading: "Let's talk.",
      text: "Have a project in mind, or just want to explore an idea? Feel free to get in touch.",
    },
    message: {
      label: "Message",
      placeholder: "I'd like to get in touch about a project...",
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
    subject: "Lorem ipsum",
    intro: {
      eyebrow: "Kontakt",
      heading: "Lorem ipsum",
      text: "Lorem ipsum",
    },
    message: {
      label: "Lorem ipsum",
      placeholder: "Lorem ipsum",
      openInEmail: "Lorem ipsum",
      emailNote: "Lorem ipsum",
    },
    directContact: {
      title: "Lorem ipsum",
      copyButton: "Lorem ipsum",
      copied: "Lorem ipsum",
    },
    email: "Lorem ipsum",
    phone: "Lorem ipsum",
    modal: {
      label: "Kontakt",
      close: "Lorem ipsum",
    },
  },
};
