import { useEffect, useState } from "react";
import { produce } from "immer";
import { flowService } from "../services/FlowService";
import { FlowDocument } from "../../types/MessageProtocol";
import { defaultDoc } from "../../utils/constant";

export const useFlowDocument = () => {
  const [document, setDocument] = useState<FlowDocument>(defaultDoc);

  useEffect(() => {
    // Subscribe to messages
    const unsubscribe = flowService.subscribe((message: any) => {
      // Handle messages from extension
      if (message.type === "init" || message.type === "update") {
        setDocument(message.document);
      }
    });

    // Initialize the service to get initial state
    flowService.init();

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Update the document using immer producer
   * This updates local state and sends update to extension
   */
  const updateDocument = (producer: (draft: FlowDocument) => void) => {
    // Produce next state using immer
    const nextState = produce(document, producer);

    // Update local state and backend
    setDocument(nextState);
    flowService.update(nextState);
  };

  /**
   * Specifically trigger the increment (plus one) event on the extension
   */
  const increment = () => {
    flowService.increment();
  };

  return {
    document,
    updateDocument,
    increment,
  };
};
