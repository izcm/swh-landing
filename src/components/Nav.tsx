export default function Nav() {
  return (
    <header className="flex items-center justify-between gap-8">
      <span className="flex-1 text-lg font-semibold tracking-wide text-fg">
        SWH
      </span>

      <nav className="items-center gap-8 text-sm text-subtle flex">
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
