const steps = [
  { n: "01", title: "Integrate", body: "Connect your tools and data." },
  {
    n: "02",
    title: "Automate",
    body: "Replace repetitive tasks with reliable flows.",
  },
  { n: "03", title: "Operate", body: "Keep everything in sync." },
  {
    n: "04",
    title: "Grow",
    body: "Less manual work. More time for what matters.",
  },
];

export default function Steps() {
  return (
    <section className="border-t border-line py-12">
      <div className="grid grid-cols-2 gap-8 text-left md:grid-cols-4">
        {steps.map((step) => (
          <div key={step.n}>
            <span className="tracking-lg text-xs font-medium text-accent">
              {step.n}
            </span>
            <h3 className="mt-2 text-fg">{step.title}</h3>
            <p className="mt-1 text-sm text-subtle">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
