import {
  ArrowUpRight,
  Code,
  Database,
  ExternalLink,
  Eye,
  Layers,
  Link,
  Lock,
  Server,
  Shield,
} from "lucide-react";

import { IconLink } from "@a2zb/react";

import { cn } from "../../lib/cn";

const tools = [
  { icon: Code, title: "TypeScript", items: ["Next.js, React"] },
  { icon: Database, title: "PostgreSQL", items: ["Drizzle"] },
  {
    icon: Lock,
    title: "Authentication",
    items: ["OIDC, OAuth2", "Microsoft Entra ID"],
  },
  {
    icon: Link,
    title: "Integrations",
    items: ["REST APIs, Webhooks", "Background workers"],
  },
  {
    icon: Server,
    title: "Infrastructure",
    items: ["Vercel, Railway, Docker"],
  },
  {
    icon: Layers,
    title: "Architecture",
    items: ["Modular monorepo", "Reusable packages"],
  },
  {
    icon: Shield,
    title: "Testing & quality",
    items: ["Vitest, E2E tests", "Type-safe APIs"],
  },
  {
    icon: Eye,
    title: "Tooling",
    items: ["ESLint, Prettier", "pnpm, GitHub Actions"],
  },
];

// todo: real repo urls
const GITHUB_URL = "#";

const packages = [
  {
    name: "@swh/auth",
    description: "Authentication and session handling",
    href: GITHUB_URL,
  },
  {
    name: "@swh/db",
    description: "Database utilities and models",
    href: GITHUB_URL,
  },
  {
    name: "@swh/notifications",
    description: "Email and in-app notifications",
    href: GITHUB_URL,
  },
  {
    name: "@swh/react",
    description: "Shared UI components and patterns",
    href: GITHUB_URL,
  },
];

export function Toolbox({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <Tools />
      <Packages />
    </div>
  );
}

function Tools() {
  return (
    <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map(({ icon: Icon, title, items }) => (
        <li
          key={title}
          className="flex gap-4 rounded-lg border border-faint-accent bg-raised/40 p-4"
        >
          <Icon className="size-6 shrink-0 text-accent" strokeWidth={1.6} />

          <div className="flex flex-col gap-1">
            <h3 className="text-sm text-fg">{title}</h3>
            {items.map((item) => (
              <span key={item} className="text-sm text-subtle">
                {item}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Packages() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm text-subtle">
        I maintain a set of internal packages to make it easier to build and
        integrate systems. These are used across my own projects and client
        work.
      </p>

      <ul className="grid w-full gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map(({ name, description, href }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="
                group flex h-full flex-col gap-2 rounded-lg p-4
                border border-faint-accent bg-raised/40
                transition-colors hover:border-accent/60
              "
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-medium text-accent">{name}</span>
                <ExternalLink
                  className="size-4 shrink-0 text-subtle transition-colors group-hover:text-accent"
                  strokeWidth={1.6}
                />
              </div>
              <span className="text-sm text-subtle">{description}</span>
            </a>
          </li>
        ))}
      </ul>

      <IconLink
        href={GITHUB_URL}
        external
        className="btn-secondary rounded-lg gap-2"
        icon={<ArrowUpRight className="size-4" strokeWidth={1.6} />}
      >
        View packages on GitHub
      </IconLink>
    </div>
  );
}
