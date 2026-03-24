import * as vscode from "vscode";
import { FluxTermDocument } from "../../types/MessageProtocol";

/**
 * Represents the in-memory state of a .ftx document.
 */
export class FluxTermCustomDocument implements vscode.CustomDocument {
  private _isDisposed = false;

  constructor(
    private readonly _uri: vscode.Uri,
    private _documentData: FluxTermDocument,
  ) {}

  public get uri(): vscode.Uri {
    return this._uri;
  }

  public get documentData(): FluxTermDocument {
    return this._documentData;
  }

  /**
   * Updates the in-memory document state (usually when the webview sends an "update").
   */
  public update(newData: FluxTermDocument) {
    this._documentData = newData;
  }

  public dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
  }
}
