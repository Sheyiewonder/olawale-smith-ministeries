import type { ReactNode } from "react";

import Navbar from "@/components/navigation/Navbar";
import ThemeProvider from "@/components/theme/ThemeProvider";
import Footer from "@/components/layout/Footer";

import {
  pageThemes,
  type PageTheme,
} from "@/lib/theme";

interface PageLayoutProps {
  children: ReactNode;
  theme?: PageTheme;
  className?: string;
}

export default function PageLayout({
  children,
  theme = "dark",
  className = "",
}: PageLayoutProps) {
  const config = pageThemes[theme];

  return (
    <ThemeProvider theme={theme}>
      <main
        data-theme={theme}
        className={[
          "min-h-screen",
          config.page.background,
          config.page.foreground,
          className,
        ].join(" ")}
      >
        <Navbar />

        {children}

        <Footer />
      </main>
    </ThemeProvider>
  );
}