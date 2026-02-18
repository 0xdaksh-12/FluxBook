import { useEffect } from "react";
import { Web } from "../../utils/logger";

/**
 * Hook to handle messages from the extension
 * Routes messages to appropriate handlers
 */
export function useExtension() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case "init":
          Web.info("Extension initialized", message);
          break;
        default:
          Web.info("Unknown message type:", message.type, message);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
}
