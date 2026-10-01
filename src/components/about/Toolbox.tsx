import type { LucideIcon } from "lucide-react";
import { ArrowRight, Layers, Package } from "lucide-react";

import { IconLink } from "@a2zb/react";

import { Section } from "../Section";

const technologies = [
  "TypeScript",
  "React / Next.js",
  "Node.js",
  "PostgreSQL",
  "Drizzle",
  "Mongo",
  "Docker",
  "Vercel / Railway",
  "OIDC Auth",
  "OAuth2",
];

// todo: real repo urls
const GITHUB_URL = "#";

const packages = [
  "@a2zb/auth",
  "@a2zb/db",
  "@a2zb/notifications",
  "@a2zb/react",
];

export function Toolbox() {
  return (
    <Section index={2} maxIndex={3} eyebrow="Toolbox">
      <h2 className="text-3xl text-fg">What I build with</h2>
      <p className="mt-5 max-w-xl  text-subtle">
        My toolbox combines the technologies I work with most often with
        reusable libraries and components I've built across projects.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Panel icon={Layers} title="Core technologies">
          {technologies.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </Panel>

        <Panel icon={Package} title="My packages (@swh)">
          {packages.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
          <IconLink
            href={GITHUB_URL}
            external
            // chip-sized for mouse users; touch keeps .btn's min-h-10 tap target
            className="btn btn-secondary text-accent bg-transparent gap-2 px-3 py-1.5 text-xs pointer-fine:min-h-0"
            icon={<ArrowRight className="size-4" strokeWidth={1.6} />}
          >
            View on GitHub
          </IconLink>
        </Panel>
      </div>
    </Section>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-faint-accent bg-raised/40 p-5">
      <div className="flex items-center gap-3">
        <Icon className="size-6 text-accent" strokeWidth={1.4} />
        <h3 className="text-fg">{title}</h3>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-faint-accent px-3 py-1.5 text-xs text-subtle">
      {children}
    </span>
  );
}
