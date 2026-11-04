import { cn } from "@/lib/cn";

type NavTab = {
  label: string;
  hash: string;
};

// same as following a #demo link, but also scrolls when the hash is
// already #demo (no hashchange fires then)
function goToDemo() {
  if (location.hash === "#demo") {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  } else {
    location.hash = "demo";
  }
}

export default function Nav({
  tabs,
  current,
}: {
  tabs: NavTab[];
  current: string;
}) {
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
        <a href="#" className="text-xl font-light tracking-tight">
          SWH Studio
        </a>

        <nav className="flex flex-1 justify-end gap-4">
          {tabs.map((tab) => {
            const active = (tab.hash || "story") === current;

            return (
              <a
                key={tab.hash}
                href={`#${tab.hash}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded px-3 py-1.5 text-sm transition-colors",
                  active ? "text-fg" : "btn-ghost",
                )}
              >
                {tab.label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={goToDemo}
          className="btn btn-secondary w-24 tracking-wide text-sm"
        >
          Contact
        </button>
      </header>
    </>
  );
}
