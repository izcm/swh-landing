import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  Link,
  Workflow,
  Zap,
} from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Connect",
    body: "Bring together and transform data from your existing systems.",
    icon: <Link />,
  },
  {
    n: "02",
    title: "Visualize",
    body: "Display that information in a clear and interactive way.",
    icon: <ChartNoAxesColumnIncreasing />,
  },
  {
    n: "03",
    title: "Act",
    body: "Make data actionable by defining rules and workflows.",
    icon: <Workflow />,
  },
  {
    n: "04",
    title: "Automate",
    body: "Let predictable processes run in the background.",
    icon: <Zap />,
  },
];

export default function Steps() {
  return (
    <section
      className="
        grid grid-cols-2 gap-4 p-3
        lg:grid-cols-4 lg:p-6
        "
    >
      {steps.map((step, i) => (
        <div
          key={step.n}
          className="
              flex flex-col 
              gap-2 rounded-lg p-4
              border border-accent-muted/20 bg-raised/40
            "
        >
          <span
            className="
              eyebrow font-semibold 
              inline-flex items-center gap-6 
              [&_svg]:size-8 [&_svg]:[stroke-width:1.6]
            "
          >
            {step.icon}
            {step.n}
          </span>
          <h3 className="mt-2 text-xl text-fg">{step.title}</h3>
          {step.body.split("\n").map((item) => (
            <p className="mt-1 text-subtle flex-1">
              <>
                {item} <br />
              </>
            </p>
          ))}

          <a
            href={`#story-${i}`}
            aria-label={`Learn more about ${step.title}`}
            className="btn btn-menu self-start mt-3"
          >
            <ArrowRight />
          </a>
        </div>
      ))}
    </section>
  );
}
