import { CubeStackDiagram, SoftwareDiagram } from "../diagrams/software";

export function Work() {
  return (
    <div className="tab-container">
      <header>
        <span className="eyebrow tracking-[0.25em] font-normal">MY WORK</span>
        <h1 className="mt-3 text-5xl">Selected demos</h1>
      </header>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:min-w-lg max-w-2xl flex flex-col gap-4 text-subtle">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Recommended for Norwegian businesses:{" "}
            <a href="#" className="text-accent underline">
              Hubben
            </a>
          </p>
          <p>
            For those who want to explore my blockchain services, visit{" "}
            <a
              href="https://izblocks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              izblocks.com
            </a>
            , our sister company.
          </p>
        </div>
        <SoftwareDiagram className="hidden lg:block max-w-150 mx-auto min-w-0" />
        <CubeStackDiagram className="h-48 lg:hidden min-w-0 order-first md:order-0" />
      </div>
    </div>
  );
}
