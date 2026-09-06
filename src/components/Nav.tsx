export default function Nav() {
  return (
    <header className="flex items-center justify-between py-6">
      <span className="text-lg font-semibold tracking-wide text-fg">SWH</span>

      <nav className="hidden items-center gap-8 text-sm text-subtle md:flex">
        <a href="#services" className="hover:text-fg">
          Services
        </a>
        <a href="#integrations" className="hover:text-fg">
          Integrations
        </a>
        <a href="#about" className="hover:text-fg">
          About
        </a>
      </nav>

      <a href="#contact" className="btn btn-secondary text-sm">
        Get in touch
      </a>
    </header>
  );
}
