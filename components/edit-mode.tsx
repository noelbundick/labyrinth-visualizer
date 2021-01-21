import Editor from "@monaco-editor/react";

// TODO
//   Dark mode
//   Wrap Editor inside of another component that does Redux dispatch on componentWillUnmount()
//   Save/Update/Analyze button button
//   Dirty buffer detection
//   YAML syntax highlighting
//   Instructions to user
//   Help pane
export default function EditMode() {
  return (
    <div>
      <h2>Edit Mode</h2>
      <Editor
        height="90vh"
        defaultLanguage="yaml"
        defaultValue="// some comment"
      />
    </div>
  );
}
