import { useId, useState, type ReactNode } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/cn";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/links";

const subject = "Project inquiry";

const directContact = [
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  {
    label: "Phone",
    value: CONTACT_PHONE,
    href: `tel:${CONTACT_PHONE.replaceAll(" ", "")}`,
  },
];

export function ContactContent() {
  const [message, setMessage] = useState("");
  const messageId = useId();
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col">
      <span className="eyebrow text-xs">CONTACT</span>
      <h2 className="mt-3 text-5xl">Let's talk.</h2>
      <p className="mt-4 text-subtle text-sm">
        Have a project in mind, or just want to explore an idea? Feel free to
        get in touch.
      </p>

      <label htmlFor={messageId} className="eyebrow text-xs mt-6">
        MESSAGE
      </label>
      <textarea
        id={messageId}
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="I'd like to get in touch about a project..."
        className="mt-2 w-full resize-y rounded border border-line p-3 text-sm"
      />

      <div className="mt-4">
        <a
          href={mailto}
          className={cn(
            "btn btn-secondary min-h-10 px-6",
            "bg-accent/80 hover:bg-accent text-ground font-medium",
          )}
        >
          Open in email
        </a>
      </div>

      <div className="mt-6 border-t border-line pt-3">
        <span className="eyebrow text-xs">DIRECT CONTACT</span>
        <div className="mt-1">
          {directContact.map(({ label, value, href }) => (
            <div
              key={label}
              className="flex items-center gap-6 border-b border-faint/60 py-1.5 text-sm"
            >
              <span className="w-16 text-subtle">{label}</span>
              <a href={href} className="flex-1 underline underline-offset-4">
                {value}
              </a>
              <CopyButton value={value}>
                <Copy className="size-3.5" /> Copy
              </CopyButton>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs italic text-muted">
        This opens your default email app.
      </p>
    </div>
  );
}

function CopyButton({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  async function copy() {
    await navigator.clipboard.writeText(value);
    toast.success("Copied", { description: value });
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
