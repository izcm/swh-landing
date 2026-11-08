import { ConnectingSystems } from "../diagrams/demo";

const connectingSystems = (
  <ConnectingSystems
    width={500}
    height={250}
    shares={{ sources: 1 / 3, connectors: 1 / 3, target: 1 / 3 }}
    paddingUnits={0.6}
    rowGapUnits={0.5}
    sourceGapUnits={0.5}
    targetWidthShare={0.85}
    radius={6}
    iconSizeUnits={0.7}
    labelGapUnits={0.5}
    sourceFontSizeUnits={0.55}
    targetFontSizeUnits={0.72}
    arrowSizeUnits={0.4}
    strokeWidth={1.5}
  />
);

export const demo = {
  title: "lorem ipsum",
  situation: "lorem ipsum",
  wish: "lorem ipsum",
  parts: [
    {
      id: "connecting-systems",
      title: "Connecting systems",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      diagram: connectingSystems,
    },
    {
      id: "understanding-data",
      title: "Understanding data",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      diagram: connectingSystems,
    },
    {
      id: "working-with-records",
      title: "Working with records",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      diagram: connectingSystems,
    },
    {
      id: "automating-updates",
      title: "Automating updates",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      diagram: connectingSystems,
    },
  ],
};
