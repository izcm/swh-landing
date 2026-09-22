const steps = [
  {
    n: "01",
    title: "Connect",
    body: "Bring together and transform data from your existing systems.",
  },
  {
    n: "02",
    title: "Visualize",
    body: "Display that information in a clear and interactive way.",
  },
  {
    n: "03",
    title: "Act",
    body: "Make data actionable by defining rules and workflows.",
  },
  {
    n: "04",
    title: "Automate",
    body: "Let predictable processes run in the background.",
  },
];

export default function Steps() {
  return (
    <section className="grid grid-cols-2 gap-4 text-left md:grid-cols-4 p-4">
      {steps.map((step) => (
        <div
          key={step.n}
          className="rounded-lg border border-accent-muted/20 bg-raised/40 p-4"
        >
          <span className="eyebrow font-semibold">{step.n}</span>
          <h3 className="mt-2 text-xl text-fg">{step.title}</h3>
          {step.body.split("\n").map((item) => (
            <p className="mt-1 text-subtle">
              <>
                {item} <br />
              </>
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
