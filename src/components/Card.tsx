import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

// Thin wrapper around the design system's `.card` surface so every boxed
// element (icon tiles, the CTA panel, …) shares one border/background/radius.
export default function Card({ children, className = "" }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>;
}
