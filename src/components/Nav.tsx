type NavTab = {
  label: string;
  hash: string;
};

export default function Nav({ tabs }: { tabs: NavTab[] }) {
  return (
    <>
      <div className="bg-warning py-1.5 text-center text-xs font-semibold tracking-widest text-ground">
        CURRENTLY UNDER DEVELOPMENT
      </div>

      <header className="flex items-center justify-between gap-8 my-3 px-8">
        <span className="flex-1">
          <a href="#" className="text-lg font-semibold tracking-wide text-fg">
            SWH
          </a>
        </span>

        {tabs.map((tab) => (
          <a
            key={tab.hash}
            href={`#${tab.hash}`}
            className="btn btn-menu text-fg text-sm"
          >
            {tab.label}
          </a>
        ))}

        <a href="#demo" className="btn btn-menu text-fg text-sm">
          Live Demo
        </a>

        <a
          href="#contact"
          className="btn btn-menu border border-accent/40 text-sm"
        >
          Get in touch
        </a>
      </header>
    </>
  );
}
