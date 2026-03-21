"use client";

import * as React from "react";

type DeveloperTerminalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const DeveloperTerminalContext = React.createContext<DeveloperTerminalContextValue | null>(null);

export function DeveloperTerminalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  const toggle = React.useCallback(() => setOpen((o) => !o), []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
        return;
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const value = React.useMemo(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  );

  return (
    <DeveloperTerminalContext.Provider value={value}>
      {children}
    </DeveloperTerminalContext.Provider>
  );
}

export function useDeveloperTerminal() {
  const ctx = React.useContext(DeveloperTerminalContext);
  if (!ctx) {
    throw new Error("useDeveloperTerminal must be used within DeveloperTerminalProvider");
  }
  return ctx;
}
