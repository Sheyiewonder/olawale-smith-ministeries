import type { ReactNode } from "react";

import {
  pageThemes,
  type PageTheme,
  type SectionTheme,
} from "@/lib/theme";

import { SectionThemeProvider } from "./SectionTheme";

interface SectionProps {
  children: ReactNode;
  theme?: SectionTheme;
  pageTheme?: PageTheme;
  className?: string;
  id?: string;
}

export default function Section({
  children,
  theme = "inherit",
  pageTheme = "dark",
  className = "",
  id,
}: SectionProps) {
  const resolvedTheme: PageTheme =
    theme === "inherit" ? pageTheme : theme;

  const config = pageThemes[resolvedTheme];

  return (
    <SectionThemeProvider theme={resolvedTheme}>
      <section
        id={id}
        data-section-theme={resolvedTheme}
        className={[
          "relative overflow-hidden",
          config.page.background,
          config.page.foreground,
          "transition-colors duration-500",
          className,
        ].join(" ")}
      >
        {children}
      </section>
    </SectionThemeProvider>
  );
}