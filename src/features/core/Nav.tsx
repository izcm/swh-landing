import { Link, NavLink, useNavigate } from "react-router";

import { cn } from "@/lib/cn";

type NavTab = {
  label: string;
  to: string;
};

export default function Nav({ tabs }: { tabs: NavTab[] }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-linear-to-r from-muted/25 via-muted/10 to-muted/25 ring-1 ring-inset ring-muted py-1.5 text-center text-xs font-semibold tracking-widest text-subtle">
        CURRENTLY UNDER DEVELOPMENT
      </div>

      <header
        className="
          sticky top-0 z-20
          flex items-center gap-6 px-6 py-3 sm:px-8
          backdrop-blur
        "
      >
        <Link to="/" className="text-xl font-light tracking-tight">
          SWH Studio
        </Link>

        <nav className="flex flex-1 justify-end gap-4">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded px-3 py-1.5 text-sm transition-colors",
                  isActive ? "text-fg" : "btn-ghost",
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn btn-secondary w-24 tracking-wide text-sm"
        >
          Contact
        </button>
      </header>
    </>
  );
}
