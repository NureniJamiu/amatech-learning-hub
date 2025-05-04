"use client";

import type React from "react";

import { createContext, useContext, useState } from "react";

type SidebarContextType = {
  selectedItem: {
    section: string;
    title: string;
  } | null;
  setSelectedItem: (item: { section: string; title: string } | null) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedItem, setSelectedItem] = useState<{
    section: string;
    title: string;
  } | null>({
    section: "Platform",
    title: "Playground",
  });

  return (
    <SidebarContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarContext must be used within a SidebarContextProvider"
    );
  }
  return context;
}
