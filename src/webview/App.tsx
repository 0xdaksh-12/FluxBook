import { Web } from "../utils/logger";
import { useFlowDocument } from "./hooks/useFlowDocument";
import { useShellConfig } from "./hooks/useShellConfig";

export default function App() {
  const { document, increment } = useFlowDocument();
  const { shells, selectedShell, setSelectedShell } = useShellConfig();

  Web.info(`${JSON.stringify(shells)}`);

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

          <div className="mb-4 flex flex-col gap-2 items-center">
            <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Shell
            </label>
            <select
              className="p-2 border rounded outline-none focus:ring-1 focus:ring-blue-500"
              style={{
                background: "var(--vscode-dropdown-background)",
                color: "var(--vscode-dropdown-foreground)",
                borderColor: "var(--vscode-dropdown-border)",
              }}
              value={selectedShell?.path || ""}
              onChange={(e) => {
                const shell = shells.find((s) => s.path === e.target.value);
                if (shell) setSelectedShell(shell);
              }}
            >
              {shells.length === 0 && <option>Loading shells...</option>}
              {shells.map((shell) => (
                <option key={shell.path} value={shell.path}>
                  {shell.label || shell.id}
                </option>
              ))}
            </select>
            {selectedShell && (
              <div
                className="text-xs opacity-50 mt-1"
                style={{ fontFamily: "monospace" }}
              >
                {selectedShell.path}
              </div>
            )}
          </div>

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
