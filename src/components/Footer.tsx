import { cn } from "../lib/cn";

export default function Footer() {
  return (
    <footer
      className={cn(
        "flex flex-col items-center gap-4 border-t border-accent-muted/60 py-8",
        "text-sm text-subtle",
        "sm:flex-row sm:justify-between",
      )}
    >
      <span className="text-lg font-semibold tracking-wide text-fg">SWH</span>

      <nav className="flex items-center gap-6">
        <a href="#about" className="hover:text-fg">
          About
        </a>
        <a href="#contact" className="hover:text-fg">
          Get in touch
        </a>
      </nav>
    </footer>
  );
}
