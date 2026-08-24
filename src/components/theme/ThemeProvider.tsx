"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import {
  pageThemes,
  type PageTheme,
  type ThemeConfig,
} from "@/lib/theme";

interface ThemeContextValue {
  theme: PageTheme;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

interface ThemeProviderProps {
  theme: PageTheme;
  children: ReactNode;
}

export default function ThemeProvider({
  theme,
  children,
}: ThemeProviderProps) {
  const config = pageThemes[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        config,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function usePageTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "usePageTheme must be used inside a ThemeProvider"
    );
  }

  return context;
}