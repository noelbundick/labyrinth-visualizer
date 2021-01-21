import Editor from "@monaco-editor/react";

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
