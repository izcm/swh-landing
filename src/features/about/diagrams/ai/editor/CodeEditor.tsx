import { EditorCode } from "./EditorCode";
import {
  AppWindow,
  WindowDots,
  type AppWindowProps,
} from "@/lib/svg/window/AppWindow";

type CodeEditorProps = Omit<AppWindowProps, "children"> & {
  // header strip at the top: dots sit in it, code starts below it
  headerHeight: number;
};

// window + fake code
export function CodeEditor({ headerHeight, ...props }: CodeEditorProps) {
  return (
    <AppWindow {...props}>
      <WindowDots headerHeight={headerHeight} />
      <EditorCode
        viewboxWidth={props.viewboxWidth}
        viewboxHeight={props.viewboxHeight}
        headerHeight={headerHeight}
      />
    </AppWindow>
  );
}
