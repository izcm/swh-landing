import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type IconLinkProps = {
  href: string;
  icon: LucideIcon;
  iconPosition?: "leading" | "trailing";
  children: ReactNode;
  className?: string;
};

// A text link paired with an icon that's purely decorative — the link text
// already says what it does, so the icon is always aria-hidden here. If an
// icon-only link ever needs this, it shouldn't use this component — it
// needs its own aria-label instead, since there'd be no text to fall back on.
export default function IconLink({
  href,
  icon: Icon,
  iconPosition = "trailing",
  children,
  className,
}: IconLinkProps) {
  const icon = <Icon size={16} aria-hidden="true" />;

  return (
    <a href={href} className={cn("inline-flex items-center gap-1", className)}>
      {iconPosition === "leading" && icon}
      {children}
      {iconPosition === "trailing" && icon}
    </a>
  );
}
