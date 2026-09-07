type NavTab = {
  label: string;
  hash: string;
};

export default function Nav({ tabs }: { tabs: NavTab[] }) {
  return (
    <header className="flex items-center justify-between gap-8">
      <span className="flex-1 text-lg font-semibold tracking-wide text-fg">
        SWH
      </span>

      <nav className="items-center gap-8 text-sm text-subtle flex">
        {tabs.map((tab) => (
          <a key={tab.hash} href={`#${tab.hash}`} className="hover:text-fg">
            {tab.label}
          </a>
        ))}
      </nav>

      <a href="#contact" className="btn btn-secondary text-sm">
        Get in touch
      </a>
    </header>
  );
}
