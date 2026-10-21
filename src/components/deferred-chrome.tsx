"use client";

import * as React from "react";
import { useDeveloperTerminal } from "@/components/developer-terminal/developer-terminal-context";

type Chrome = {
  Terminal: React.ComponentType;
  Chat: React.ComponentType;
};

export function DeferredChrome() {
  const { open } = useDeveloperTerminal();
  const [chrome, setChrome] = React.useState<Chrome | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = () => {
      void Promise.all([
        import("@/components/developer-terminal/developer-terminal"),
        import("@/components/chatbot"),
      ]).then(([terminal, chat]) => {
        if (cancelled) return;
        setChrome({ Terminal: terminal.DeveloperTerminal, Chat: chat.Chatbot });
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

  if (!chrome) return null;
  const { Terminal, Chat } = chrome;
  return (
    <>
      <Terminal />
      <Chat />
    </>
  );
}
