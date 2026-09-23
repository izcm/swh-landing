import { ConnectDiagram } from "../diagrams/ConnectDiagram";

const sections = [
  {
    eyebrow: "CONNECT",
    title: "Extend, don’t replace",
    paragraphs: [
      "Most businesses use several robust systems to run their day-to-day operations — accounting software, industry-specific tools, spreadsheets etc. Each works perfectly well on its own.",
      "Where we bring value is in bridging the gaps between these systems and workflows.",
      "We collect and transform data from the services you already use, then extend it with new ways to manage, visualize, and automate your operations.",
    ],
    diagram: <ConnectDiagram />,
  },
  {
    eyebrow: "VISUALIZE",
    title: "From data to insight",
    paragraphs: [
      "Having access to data is one thing. Making sense of it is another.",
      "Spreadsheets are excellent tools, but understanding a larger operation can mean moving between several sheets, comparing numbers, and building a picture of what is happening in your head.",
      "We make that process easier by bringing relevant information together and presenting it through interactive dashboards.",
    ],
  },
  {
    eyebrow: "ACT",
    title: "Turn insight into action.",
    paragraphs: [
      "Visibility is most useful when it leads naturally to action.",
      "From there, we define how the information can be acted on — assigning records to specific employees, notifying the right parties through their preferred channels, flagging records when certain conditions are met, handling approvals, or triggering the next step in a process.",
      "If an action follows a predictable rule, it may not need to be performed manually at all.",
    ],
  },
];

export function Story() {
  return (
    <>
      {sections.map((section, i) => (
        <section
          className="
            flex flex-col gap-3 
            border-t border-faint-accent 
            px-3 lg:px-12 py-8 min-h-[480px]
          "
          key={`story-${i}`}
          id={`story-${i}`}
        >
          <div className="flex items-center gap-6 mb-3">
            <span className="eyebrow text-sm lg:text-base">0{i + 1}</span>
            <div className="horizontal-line bg-accent/40" />
            <span className="eyebrow text-sm lg:text-base">
              {section.eyebrow}
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl text-fg ">{section.title}</h2>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <div className="flex flex-col gap-6 text-subtle flex-1 min-w-0 max-w-xl min-w-lg">
              {section.paragraphs.map((p) => (
                <p>{p}</p>
              ))}
            </div>

            {/* THESE SIZES R GOOD MAKE FLEX-COL AT 1280 LATER */}
            <div
              className="
                lg:self-center lg:w-[640px]
                min-w-[560px] max-w-[720px]"
            >
              {section.diagram}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
