import { Modal } from "@a2zb/react";
import { X } from "lucide-react";

import { cn } from "@/lib/cn";
import { ContactContent } from "./ContactContent";

export function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCancelBtn
      ariaLabel="Contact"
      overlayClassName="bg-black/40 backdrop-blur-sm"
      className={cn(
        "relative w-full max-w-lg mx-2 max-h-[90dvh] overflow-y-auto p-6",
        "rounded border border-line bg-raised shadow-panel",
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="btn btn-ghost absolute top-4 right-4"
      >
        <X />
      </button>
      <ContactContent />
    </Modal>
  );
}
