import { ConnectDiagram } from "../diagrams/ConnecDiagram";

const sections = [
  {
    id: "story-connect",
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
    id: "story-visualize",
    eyebrow: "VISUALIZE",
    title: "From data to action",
    paragraphs: [
      "Having access to data is one thing. Making sense of it is another.",
      "Spreadsheets are excellent tools, but understanding a larger operation can mean moving between several sheets, comparing numbers, and building a picture of what is happening in your head.",
      "We make that process easier by bringing relevant information together and presenting it through interactive dashboards.",
    ],
  },
  {
    id: "story-act",
    eyebrow: "ACT",
    title: "Define an action set",
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
        <section className={"rounded p-4"} key={section.id} id={section.id}>
          <div>
            <span className="eyebrow">{section.eyebrow}</span>
            <h2 className="mt-2 mb-6 text-2xl text-fg md:text-3xl">
              {section.title}
            </h2>

            <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
              <div className="flex flex-col gap-6 text-subtle max-w-xl">
                {section.paragraphs.map((p) => (
                  <p>{p}</p>
                ))}
              </div>

              <div className="min-w-[480px] max-w-[560px] flex-1 shrink-0 grid place-items-center h-full">
                {section.diagram}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
