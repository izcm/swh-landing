import { EditorCode } from "./EditorCode";
import { AppWindow, WindowDots, type AppWindowProps } from "@/lib/svg";

type CodeEditorProps = Omit<AppWindowProps, "children"> & {
  // header strip at the top: dots sit in it, code starts below it
  headerHeight: number;
};

// window + fake code
export function CodeEditor({ headerHeight, ...props }: CodeEditorProps) {
  const dots = (() => {
    const radius = headerHeight * 0.13;
    const gap = radius * 2.4;
    // first dot as far in from the left as from the top
    const translateX = headerHeight / 2 - radius;
    return { radius, gap, translateX };
  })();

  return (
    <AppWindow {...props}>
      <g transform={`translate(${dots.translateX}, 0)`}>
        <WindowDots
          height={headerHeight}
          radius={dots.radius}
          gap={dots.gap}
        />
      </g>
      <EditorCode
        width={props.viewboxWidth}
        height={props.viewboxHeight}
        headerHeight={headerHeight}
      />
    </AppWindow>
  );
}
