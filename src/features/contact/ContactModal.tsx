import { Modal } from "@a2zb/react";
import { X } from "lucide-react";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/context/language";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/links";
import { ContactPanel } from "./ContactPanel";
import { copy } from "./copy";

export function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCancelBtn
      ariaLabel={t.modal.label}
      overlayClassName="bg-black/40 backdrop-blur-sm"
      className={cn(
        "relative w-full max-w-lg mx-2 max-h-[90dvh] overflow-y-auto p-8",
        "rounded border border-line bg-raised shadow-panel",
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t.modal.close}
        className="btn btn-ghost absolute top-4 right-4"
      >
        <X />
      </button>
      <ContactPanel email={CONTACT_EMAIL} links={links} labels={t} />
    </Modal>
  );
}
