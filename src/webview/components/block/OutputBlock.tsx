import React, { useState, useRef, useCallback } from "react";
import { FlowBlock } from "../../../types/MessageProtocol";
import { flowService } from "../../services/FlowService";
import { StatusIcon } from "./StatusIcon";
import { ToolbarButton } from "./ToolbarButton";
import { ContextMenu } from "./ContextMenu";
import { BlockInput } from "./BlockInput";
import { SearchBar } from "./SearchBar";
import { OutputArea } from "./OutputArea";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function shortenPath(p: string): string {
  return p.replace(/\\/g, "/");
}

export interface OutputBlockProps {
  block: FlowBlock;
  onDelete: (id: string) => void;
  onReRun: (id: string) => void;
}

export const OutputBlock: React.FC<OutputBlockProps> = ({
  block,
  onDelete,
  onReRun,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isRunning = block.status === "running";

  const searchMatchCount = searchQuery
    ? block.output.filter((l) =>
        l.text.toLowerCase().includes(searchQuery.toLowerCase()),
      ).length
    : 0;

  const handleCopyOutput = useCallback(() => {
    const text = block.output.map((l) => l.text).join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    setShowMenu(false);
  }, [block.output]);

  const handleReRun = useCallback(() => {
    onReRun(block.id);
    setShowMenu(false);
  }, [block.id, onReRun]);

  const handleKill = useCallback(() => {
    flowService.killBlock(block.id);
    setShowMenu(false);
  }, [block.id]);

  const handleDelete = useCallback(() => {
    onDelete(block.id);
    setShowMenu(false);
  }, [block.id, onDelete]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    borderRadius: "6px",
    padding: "10px 12px",
    marginBottom: "2px",
    border: "1px solid transparent",
    backgroundColor: "transparent",
    transition: "background-color 0.15s",
  };

  const indent = isRunning ? "10px" : undefined;

  return (
    <div
      className="group"
      style={containerStyle}
      onMouseEnter={(e) => {
        if (!isRunning) {
          e.currentTarget.style.backgroundColor =
            "var(--vscode-list-hoverBackground)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isRunning) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {/* Running left accent stripe */}
      {isRunning && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "10px",
            bottom: "10px",
            width: "2px",
            borderRadius: "2px",
            backgroundColor: "var(--vscode-progressBar-background, #007acc)",
          }}
        />
      )}

      {/* Toolbar */}
      <div
        className="block-toolbar"
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          zIndex: 10,
          backgroundColor: "var(--vscode-editorWidget-background)",
          border: "1px solid var(--vscode-panel-border)",
          borderRadius: "4px",
          padding: "2px",
          opacity: isRunning ? 1 : 0,
        }}
      >
        <ToolbarButton
          icon="codicon-search"
          title="Search output"
          active={showSearch}
          onClick={() => setShowSearch((s) => !s)}
        />
        <ToolbarButton
          icon="codicon-refresh"
          title="Re-run"
          onClick={handleReRun}
        />
        <ToolbarButton
          icon="codicon-trash"
          title="Delete"
          onClick={handleDelete}
        />
        <div
          style={{
            width: "1px",
            height: "16px",
            backgroundColor: "var(--vscode-panel-border)",
            margin: "0 2px",
          }}
        />
        <div style={{ position: "relative" }}>
          <ToolbarButton
            ref={menuButtonRef}
            icon="codicon-ellipsis"
            title="More actions"
            active={showMenu}
            onClick={() => setShowMenu((m) => !m)}
          />
          {showMenu && (
            <ContextMenu
              block={block}
              onCopyOutput={handleCopyOutput}
              onReRun={handleReRun}
              onKill={handleKill}
              onDelete={handleDelete}
              onClose={() => setShowMenu(false)}
            />
          )}
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11px",
          color: "var(--vscode-descriptionForeground)",
          marginBottom: "6px",
          userSelect: "none",
          paddingLeft: indent,
        }}
      >
        <span style={{ fontWeight: "bold", opacity: 0.7 }}>#{block.seq}</span>
        <StatusIcon status={block.status} />
        {isRunning ? (
          <span
            style={{
              color: "var(--vscode-progressBar-background)",
              fontWeight: 600,
            }}
          >
            Running
          </span>
        ) : (
          <span>{formatDate(block.createdAt)}</span>
        )}
      </div>

      {/* Command row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "4px 8px",
          fontWeight: 500,
          paddingLeft: indent,
        }}
      >
        <span
          style={{
            color: "var(--vscode-button-background)",
            fontWeight: "bold",
          }}
        >
          [{block.shell?.label || "local"}]
        </span>
        {block.branch && (
          <>
            <span
              className="codicon codicon-git-branch"
              style={{ fontSize: "14px", opacity: 0.6 }}
            />
            <span style={{ color: "var(--vscode-descriptionForeground)" }}>
              {block.branch}
            </span>
          </>
        )}
        <span
          className="codicon codicon-folder-opened"
          style={{ fontSize: "14px", opacity: 0.6 }}
        />
        <span
          style={{ color: "var(--vscode-button-background)" }}
          title={block.cwd}
        >
          {shortenPath(block.cwd)}
        </span>
        <span
          style={{
            color: "var(--vscode-button-background)",
            fontWeight: "bold",
          }}
        >
          $
        </span>
        <span style={{ color: "var(--vscode-editor-foreground)" }}>
          {block.command}
        </span>
        {isRunning && (
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "14px",
              backgroundColor: "var(--vscode-editor-foreground)",
              opacity: 0.5,
              animation: "blink 1s step-start infinite",
            }}
          />
        )}
      </div>

      {/* Search bar */}
      {showSearch && (
        <div style={{ marginTop: "8px", paddingLeft: indent }}>
          <SearchBar
            query={searchQuery}
            matchCount={searchMatchCount}
            onChange={setSearchQuery}
            onClose={() => {
              setShowSearch(false);
              setSearchQuery("");
            }}
          />
        </div>
      )}

      {/* Output */}
      <div style={{ paddingLeft: indent }}>
        <OutputArea block={block} searchQuery={searchQuery} />
      </div>

      {/* Stdin input (running only) */}
      {isRunning && (
        <div style={{ paddingLeft: indent }}>
          <BlockInput blockId={block.id} />
        </div>
      )}

      {/* Execution metadata */}
      {!isRunning && (block.exitCode !== null || block.finalCwd || block.finalBranch) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "8px",
            paddingLeft: indent,
            fontSize: "10px",
            color: "var(--vscode-descriptionForeground)",
            opacity: 0.7,
            fontFamily: "var(--vscode-editor-font-family, 'JetBrains Mono', monospace)",
            userSelect: "none",
          }}
        >
          {block.exitCode !== null && (
            <span>Exit code: {block.exitCode}</span>
          )}
          {(block.finalCwd && block.finalCwd !== block.cwd) && (
            <span>CWD: {shortenPath(block.finalCwd)}</span>
          )}
          {(block.finalBranch && block.finalBranch !== block.branch) && (
            <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <span className="codicon codicon-git-branch" style={{ fontSize: "10px" }} />
              {block.finalBranch}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default OutputBlock;
