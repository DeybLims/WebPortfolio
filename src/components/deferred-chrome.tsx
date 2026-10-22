"use client";

import * as React from "react";
import { useDeveloperTerminal } from "@/components/developer-terminal/developer-terminal-context";

export function DeferredChrome() {
  const { open } = useDeveloperTerminal();
  const [Terminal, setTerminal] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = () => {
      void import("@/components/developer-terminal/developer-terminal").then((mod) => {
        if (!cancelled) setTerminal(() => mod.DeveloperTerminal);
      });
    };

    if (open) {
      load();
      return () => {
        cancelled = true;
      };
    }

    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(load, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(load, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open]);

  if (!Terminal) return null;
  return <Terminal />;
}
