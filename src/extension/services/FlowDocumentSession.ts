import * as vscode from "vscode";
import { FlowDocument } from "../../types/MessageProtocol";
import { defaultDoc } from "../../utils/constant";
import { Ext } from "../../utils/logger";
import { ShellResolver } from "./ShellResolver";

export class FlowDocumentSession {
  private isDisposed = false;
  private readonly disposables: vscode.Disposable[] = [];
  private isInitial = true;
  private isProcessing = false;
  private queue: Array<() => Promise<void>> = [];

  constructor(
    private readonly document: vscode.TextDocument,
    private readonly panel: vscode.WebviewPanel,
    private readonly context: vscode.ExtensionContext,
  ) {
    this.setupWebview();
  }

  /**
   * Setup the webview
   */
  private setupWebview() {
    this.panel.webview.onDidReceiveMessage(
      async (message: any) => {
        if (this.isDisposed) {
          return;
        }

        switch (message.type) {
          case "init":
            this.sendDocument(this.parseDocument(), this.isInitial);
            this.isInitial = false;
            Ext.info("Initialized flow document session");
            break;

          case "update":
            this.enqueue(async () => {
              await this.updateTextDocument(message.document);
            });
            break;

          case "increment":
            this.enqueue(async () => {
              const current = this.parseDocument();
              const updated = {
                ...current,
                length: current.length + 1,
              };

              await this.updateTextDocument(updated);
              this.sendDocument(updated, false);
            });
            break;
          case "shellConfig":
            this.enqueue(async () => {
              const shells = await ShellResolver.resolve();
              this.panel.webview.postMessage({
                type: "shellList",
                shells,
              });
            });
            break;

          case "log":
            Ext.info(message.message);
            break;

          default:
            break;
        }
      },
      null,
      this.disposables,
    );

    // Handle panel close
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  /**
   * Add a task to the queue and try to process it
   */
  private enqueue(task: () => Promise<void>) {
    this.queue.push(task);
    this.processQueue();
  }

  /**
   * Process the queue sequentially
   */
  private async processQueue() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      if (this.isDisposed) {
        break;
      }

      const task = this.queue.shift();
      if (task) {
        try {
          await task();
        } catch (e) {
          Ext.error("Error processing document update task", e);
        }
      }
    }

    this.isProcessing = false;
  }

  /**
   * Parse the document
   */
  private parseDocument(): FlowDocument {
    try {
      const text = this.document.getText();
      if (!text.trim()) {
        return { ...defaultDoc };
      }
      return JSON.parse(text) as FlowDocument;
    } catch {
      return { ...defaultDoc };
    }
  }

  /**
   * Send the document to the webview
   */
  private sendDocument(doc: FlowDocument, isInitial: boolean) {
    if (this.isDisposed) {
      return;
    }
    this.panel.webview.postMessage({
      type: isInitial ? "init" : "update",
      document: doc,
    });
  }

  /**
   * Update the text document with the given document
   */
  private async updateTextDocument(doc: FlowDocument) {
    const edit = new vscode.WorkspaceEdit();
    const json = JSON.stringify(doc, null, 2);

    const fullRange = new vscode.Range(
      this.document.positionAt(0),
      this.document.positionAt(this.document.getText().length),
    );

    edit.replace(this.document.uri, fullRange, json);
    await vscode.workspace.applyEdit(edit);
  }

  public dispose() {
    if (this.isDisposed) {
      return;
    }

    this.isDisposed = true;
    this.disposables.forEach((d) => d.dispose());
    this.disposables.length = 0;
  }
}
