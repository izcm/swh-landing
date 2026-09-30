import { EditorCode } from "./EditorCode";
import { EditorWindow, type EditorWindowProps } from "./EditorWindow";

type CodeEditorProps = Omit<EditorWindowProps, "children">;

// window + fake code
export function CodeEditor(props: CodeEditorProps) {
  return (
    <EditorWindow {...props}>
      <EditorCode />
    </EditorWindow>
  );
}
