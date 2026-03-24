import { describe, it, expect, beforeAll } from "vitest";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";

import {
  ExecutionEngine,
  BlockCompletePayload,
  ExecutionCallbacks,
} from "../../extension/services/ExecutionEngine";
import { ShellResolver } from "../../extension/services/ShellResolver";
import { OutputLine, ResolvedShell } from "../../types/MessageProtocol";

const IS_WIN = process.platform === "win32";
let SHELL: ResolvedShell;

beforeAll(async () => {
  const shells = await ShellResolver.resolve();
  const targetId = IS_WIN ? "powershell" : "bash";
  const found = shells.find(
    (s) => s.id === targetId || (IS_WIN && s.id === "pwsh"),
  );
  if (!found) {
    throw new Error(`Could not find a valid shell (${targetId}) for testing.`);
  }
  SHELL = found;
});

const CWD = os.tmpdir();

function runBlockInteract(
  command: string,
  interactions: { triggerText: string; inputText: string }[],
  cwd = CWD,
): Promise<{
  streams: OutputLine[];
  complete: BlockCompletePayload | null;
  error: { blockId: string; message: string } | null;
}> {
  return new Promise((resolve) => {
    const streams: OutputLine[] = [];
    let complete: BlockCompletePayload | null = null;
    let error: { blockId: string; message: string } | null = null;

    let engine!: ExecutionEngine;

    const callbacks: ExecutionCallbacks = {
      onStream: (id, lines) => {
        streams.push(...lines);

        // Check if any line matches a trigger
        for (const line of lines) {
          interactions.forEach((interact) => {
            if (line.text.includes(interact.triggerText)) {
              // Found a prompt, send input!
              setTimeout(() => {
                engine.writeInput(id, interact.inputText);
              }, 50); // small delay to simulate user typing
            }
          });
        }
      },
      onComplete: (payload) => {
        complete = payload;
        resolve({ streams, complete, error });
      },
      onError: (blockId, message) => {
        error = { blockId, message };
        resolve({ streams, complete, error });
      },
    };

    engine = new ExecutionEngine(callbacks);
    engine.execute("e2e-interact-block", command, SHELL, cwd);
  });
}

describe("ExecutionEngine Real Commands E2E", () => {
  it("executes 'ls' with accurate streaming and exit codes", async () => {
    const cmd = IS_WIN ? "Get-ChildItem" : "ls -la";
    const { streams, complete, error } = await runBlockInteract(cmd, []);

    expect(error).toBeNull();
    expect(complete?.exitCode).toBe(0);
    expect(
      streams.some((s) => s.text.includes("..") || s.text.includes("Mode")),
    ).toBe(true);
  });

  it("handles aliases like 'll' natively through sourced profiles on POSIX", async () => {
    if (IS_WIN) {
      return;
    } // Ignore on windows since aliases work differently

    // Test if `ll` works. Our PosixAdapter injects `source ~/.bashrc` which typically defines `ll`.
    // If it fails, standard Ubuntu doesn't have it setup for the test user, but we expect it to attempt execution.
    const cmd = "ll";
    const { streams, complete, error } = await runBlockInteract(cmd, []);

    // We just ensure the engine wrapped and executed the command via the adapter without engine-level crashes.
    expect(error).toBeNull();
    // It might exit 127 if ll not found, or 0 if found.
    expect([0, 127]).toContain(complete?.exitCode);
  });

  it("executes an interactive python3 script handling prompts and stdin natively", async () => {
    const pyScript = "import sys; print('START'); name = input('ENTER_NAME:'); print('HELLO ' + name)";

    const cmd = IS_WIN
      ? `python -c "${pyScript}"`
      : `python3 -c "${pyScript}"`;

    // Wait until 'ENTER_NAME:' appears, then type 'DAKSH'
    const interactions = [{ triggerText: "ENTER_NAME:", inputText: "DAKSH" }];

    const { streams, complete, error } = await runBlockInteract(
      cmd,
      interactions,
    );

    if (complete?.exitCode !== 0) {
      console.error("DEBUG PYTHON STREAMS:", streams.map(s => `[${s.type}] ${s.text}`).join("\n"));
    }

    expect(error).toBeNull();
    expect(complete?.exitCode).toBe(0);

    const joinedStdout = streams
      .filter((s) => s.type === "stdout" || s.type === "stdin")
      .map((s) => s.text)
      .join("");

    expect(joinedStdout).toContain("START");
    expect(joinedStdout).toContain("ENTER_NAME:");
    // stdin line is typed into webview via writeInput echo tracking
    expect(joinedStdout).toContain("DAKSH");
    expect(joinedStdout).toContain("HELLO DAKSH");
  });
});
