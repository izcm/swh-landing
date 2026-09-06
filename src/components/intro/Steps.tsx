const steps = [
  {
    n: "01",
    title: "Map",
    body: "Break a manual process into clear steps.",
  },
  {
    n: "02",
    title: "Identify",
    body: "Identify the systems and data involved.",
  },
  {
    n: "03",
    title: "Connect",
    body: "Collect the relevant data to build new capabilities.",
  },
  {
    n: "04",
    title: "Extend",
    body: "Make those capabilities visible, configurable, and actionable in one place.",
  },
];

export default function Steps() {
  return (
    <section className="border-t border-line py-12 px-6">
      <div className="grid grid-cols-2 gap-8 text-left md:grid-cols-4">
        {steps.map((step) => (
          <div key={step.n}>
            <span className="eyebrow">{step.n}</span>
            <h3 className="mt-2 text-fg">{step.title}</h3>
            <p className="mt-1 text-subtle">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
