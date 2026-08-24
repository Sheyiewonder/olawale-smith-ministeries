"use client";

import { createContext, useContext } from "react";

import type { PageTheme } from "@/lib/theme";

const SectionThemeContext =
  createContext<PageTheme>("dark");

interface SectionThemeProviderProps {
  theme: PageTheme;
  children: React.ReactNode;
}

export function SectionThemeProvider({
  theme,
  children,
}: SectionThemeProviderProps) {
  return (
    <SectionThemeContext.Provider value={theme}>
      {children}
    </SectionThemeContext.Provider>
  );
}

export function useSectionTheme() {
  return useContext(SectionThemeContext);
}