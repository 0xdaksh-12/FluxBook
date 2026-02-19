import { useEffect, useState } from "react";
import { flowService } from "../services/FlowService";
import { ResolvedShell } from "../../types/MessageProtocol";

export const useShellConfig = () => {
  const [shells, setShells] = useState<ResolvedShell[]>([]);
  const [selectedShell, setSelectedShell] = useState<ResolvedShell | null>(
    null,
  );

  useEffect(() => {
    const unsubscribe = flowService.subscribe((message: any) => {
      if (message.type === "shellList") {
        setShells(message.shells);
        if (message.shells.length > 0 && !selectedShell) {
          setSelectedShell(message.shells[0]);
        }
      }
    });

    flowService.getShellConfig();

    return () => {
      unsubscribe();
    };
  }, []);

  return { shells, selectedShell, setSelectedShell };
};
