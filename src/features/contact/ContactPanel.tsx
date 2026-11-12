import { useId, useState, type ReactNode } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/cn";

export type ContactLink = { label: string; value: string; href: string };

export type ContactPanelLabels = {
  subject: string;
  intro: { eyebrow: string; heading: string; text: string };
  message: {
    label: string;
    placeholder: string;
    openInEmail: string;
    emailNote: string;
  };
  directContact: { title: string; copyButton: string; copied: string };
};

export function ContactPanel({
  email,
  links,
  labels,
}: {
  email: string;
  links: ContactLink[];
  labels: ContactPanelLabels;
}) {
  const { intro, message: messageLabels, directContact } = labels;

  const [message, setMessage] = useState("");
  const messageId = useId();
  const mailto = `mailto:${email}?subject=${encodeURIComponent(labels.subject)}&body=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col">
      <span className="eyebrow text-xs">{intro.eyebrow}</span>
      <h2 className="mt-3 text-5xl">{intro.heading}</h2>
      <p className="mt-4 text-subtle text-sm">{intro.text}</p>

      <label htmlFor={messageId} className="eyebrow text-xs mt-6">
        {messageLabels.label}
      </label>
      <textarea
        id={messageId}
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={messageLabels.placeholder}
        className="mt-2 w-full resize-y rounded border border-line p-3 text-sm"
      />

      <div className="mt-4">
        <a
          href={mailto}
          className={cn(
            "btn btn-primary min-h-10 px-6",
            // "text-ground font-medium",
          )}
        >
          {messageLabels.openInEmail}
        </a>
      </div>

      <div className="mt-6 border-t border-line pt-3">
        <span className="eyebrow text-xs">{directContact.title}</span>
        <div className="mt-1">
          {links.map(({ label, value, href }) => (
            <div
              key={value}
              className="flex items-center gap-6 border-b border-faint/60 py-1.5 text-sm"
            >
              <span className="w-16 text-subtle">{label}</span>
              <a href={href} className="flex-1 underline underline-offset-4">
                {value}
              </a>
              <CopyButton value={value} copied={directContact.copied}>
                <Copy className="size-3.5" /> {directContact.copyButton}
              </CopyButton>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs italic text-muted">
        {messageLabels.emailNote}
      </p>
    </div>
  );
}

function CopyButton({
  value,
  copied,
  children,
}: {
  value: string;
  copied: string;
  children: ReactNode;
}) {
  async function copy() {
    await navigator.clipboard.writeText(value);
    toast.success(copied, { description: value });
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="btn btn-ghost inline-flex items-center gap-2 text-xs"
    >
      {children}
    </button>
  );
}
