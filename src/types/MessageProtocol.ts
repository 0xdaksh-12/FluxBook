export interface FlowDocument {
  length: number;
}

export type ExtMessage =
  | {
      type: "init";
      document: FlowDocument;
    }
  | {
      type: "update";
      document: FlowDocument;
    };

export type WebviewMessage =
  | {
      type: "init";
    }
  | {
      type: "update";
      document: FlowDocument;
    }
  | {
      type: "increment";
    };
