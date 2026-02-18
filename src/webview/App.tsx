import { useFlowDocument } from "./hooks/useFlowDocument";

export default function App() {
  const { document, increment } = useFlowDocument();

  return (
    <div
      className="h-screen flex flex-col font-mono text-sm antialiased overflow-hidden"
      style={{
        background: "var(--vscode-editor-background)",
        color: "var(--vscode-editor-foreground)",
      }}
    >
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          className="flex flex-col items-center justify-center h-full"
          style={{
            color: "var(--vscode-descriptionForeground)",
          }}
        >
          <div className="text-xl mb-2">Welcome to Flow</div>
          <div className="text-sm mb-4">Document Length: {document.length}</div>

          <button
            className="p-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={increment}
            style={{
              backgroundColor: "var(--vscode-button-background)",
              color: "var(--vscode-button-foreground)",
            }}
          >
            <i className="codicon codicon-add" />
            Plus One
          </button>
        </div>
      </main>
    </div>
  );
}
