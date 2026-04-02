---
description: Build a robust execution engine for running shell commands within Flow documents, including persistent shell sessions, linear execution, and context synchronization.
---

# 🚀 Execution Engine Implementation Plan

This workflow outlines the steps to build a production-grade execution engine for Flow. The engine features persistent shell sessions (preserving `cd`), linear command execution, output streaming, and context synchronization.

## 🎯 Architecture

**Core Principles:**

1.  **Linear Execution**: Only one block runs at a time (linear queue).
2.  **Persistent Shell**: A single shell instance per document session persists state (cwd, env).
3.  **Immutable Snapshots**: Block execution uses a snapshot of context at creation time.
4.  **Context Sync**: Global context (cwd, branch) updates _after_ block execution completes.
5.  **Cancellation**: Supports efficient cancellation via `SIGINT`.

**Flow:**

```
Input (Trigger Run) -> Enqueue Block -> Persistent Shell -> Stream Output -> Update Block Status -> Sync Context (cwd/branch)
```

---

## 📁 Files to Add/Modify

| File Path                                       | Action     | Description                                                                          |
| :---------------------------------------------- | :--------- | :----------------------------------------------------------------------------------- |
| `src/types/MessageProtocol.ts`                  | **Modify** | Add `BlockStatus`, `FlowBlock` structure, update `FlowDocument`.                     |
| `src/extension/services/PersistentShell.ts`     | **Create** | Implements the persistent shell wrapper (spawn process, handle streams).             |
| `src/extension/services/FlowDocumentSession.ts` | **Modify** | Integrate `PersistentShell`, manage execution queue, handle "run"/"cancel" messages. |
| `src/extension/services/FlowService.ts`         | **Modify** | Add `run` method to send messages to webview.                                        |
| `src/webview/App.tsx`                           | **Modify** | Handle run triggers and send messages to extension.                                  |
| `src/test/PersistentShell.test.ts`              | **Create** | Unit tests for shell persistence, cancellation, and execution order.                 |

---

## 🛠 Step-by-Step Implementation

### Phase 1: data Structures & Messaging

#### 1. Update Types (`src/types/MessageProtocol.ts`)

Define the data structures for blocks and execution status.

```typescript
export type BlockStatus =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "cancelled";

export interface FlowBlock {
  id: number;
  cmd: string;
  output: string;
  status: BlockStatus;
  createdAt: number;
  runtimeMs: number;
  snapshot: FlowContext; // Snapshot of context at start
}

export interface FlowDocument {
  shell?: string;
  cwd?: string;
  branch?: string;
  blocks?: FlowBlock[];
}
```

#### 2. Webview Run Trigger (`src/webview/App.tsx`)

Connect the UI run action to the extension.

```typescript
const handleRun = (cmd: string) => {
  flowService.run(cmd, displayContext);
};
```

#### 3. FlowService Update (`src/extension/services/FlowService.ts`)

Add the `run` method.

```typescript
public run(command: string, context: any) {
  this.vscode.postMessage({ type: "run", command, context });
}
```

---

### Phase 2: Core Engine Logic

#### 4. Create PersistentShell (`src/extension/services/PersistentShell.ts`)

Implement the class that wraps `spawn`, handles output buffering, converts streams to promises, and supports cancellation.

**Key Features:**

- Uses `spawn` with `stdio: "pipe"`.
- Appends `echo __FLOW_DONE__` to detect command completion.
- Resolves promise with captured output.
- `cancel()` functionality using `kill("SIGINT")`.
- `dispose()` for cleanup.

#### 5. Integrate FlowDocumentSession (`src/extension/services/FlowDocumentSession.ts`)

Update the session to manage the shell and execution queue.

- **State**: `shell: PersistentShell`, `executionQueue: Promise`, `isBusy`, `currentBlockId`.
- **Init**: Create `PersistentShell` instance on session start.
- **Run Handler**:
  - Parse document.
  - Create new Block (status: running).
  - Enqueue execution task.
- **Execution Task (`runBlock`)**:
  - Call `shell.run(command)`.
  - Update block payload (output, status, runtime).
  - Sync context (cwd, branch) from shell _after_ run.
- **Sync Context**: Run `pwd` and `git rev-parse` in shell to update document global context.
- **Cancellation**: Handle "cancel" message -> `shell.cancel()`.

---

### Phase 3: Testing & Validation

#### 6. Create Tests (`src/test/PersistentShell.test.ts`)

Write Mocha tests to verify:

- **Persistence**: `cd` followed by `pwd` works.
- **Sequence**: Commands run in order.
- **Cancellation**: Long running command can be stopped.

---

## ✅ Verification Checklist

- [ ] Blocks are created in the document JSON.
- [ ] `cd` commands persist to subsequent blocks.
- [ ] Context (cwd/branch) updates in the UI after block execution.
- [ ] Long-running commands can be cancelled via UI.
- [ ] Shell errors are captured gracefully.
- [ ] The system handles rapid-fire run requests via the queue.
