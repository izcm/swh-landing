import { useState } from "react";
import { Link, NavLink } from "react-router";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/context/language";
import { ContactModal } from "../contact";
import { copy } from "./copy";

export default function Nav() {
  const [contactOpen, setContactOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = copy[lang];

  const tabs = [
    { label: t.home, to: "/" },
    { label: t.services, to: "/services" },
    { label: t.work, to: "/work" },
  ];

  return (
    <>
      <div className="bg-linear-to-r from-muted/25 via-muted/10 to-muted/25 ring-1 ring-inset ring-muted py-1.5 text-center text-xs font-semibold tracking-widest text-subtle">
        {t.underDevelopment}
      </div>

      <header
        className="
          sticky top-0 z-20
          flex items-center gap-6 px-4 py-3
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
          onClick={() => setLang(lang === "no" ? "en" : "no")}
          className="btn btn-ghost text-sm tracking-wide"
        >
          <span className={lang === "no" ? "text-fg" : "text-muted"}>NO</span>
          {" / "}
          <span className={lang === "en" ? "text-fg" : "text-muted"}>EN</span>
        </button>

        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="btn btn-secondary w-24 tracking-wide text-sm"
        >
          {t.contact}
        </button>
        <ContactModal
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
        />
      </header>
    </>
  );
}
