export interface FlowDocument {
  length: number;
}

export type ShellProfile = {
  id: string;
  label: string;
  command: string;
  args: string[];
  ignorePath?: string[];
};

export type ResolvedShell = {
  id: string;
  label: string;
  path: string;
};

export type ExtMessage =
  | {
      type: "init";
      document: FlowDocument;
    }
  | {
      type: "update";
      document: FlowDocument;
    }
  | {
      type: "shellList";
      shells: ResolvedShell[];
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
    }
  | {
      type: "shellConfig";
    };
