import { useLanguage } from "@/lib/context/language";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/links";
import { ContactPanel } from "./ContactPanel";
import { copy } from "./copy";

export function Contact() {
  const { lang } = useLanguage();
  const t = copy[lang];

  const links = [
    { label: t.email, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    {
      label: t.phone,
      value: CONTACT_PHONE,
      href: `tel:${CONTACT_PHONE.replaceAll(" ", "")}`,
    },
  ];

  return (
    <div className="tab-container max-w-md">
      <ContactPanel email={CONTACT_EMAIL} links={links} labels={t} />
    </div>
  );
}
