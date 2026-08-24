export type PageTheme = "dark" | "light";

export type SectionTheme = "inherit" | "dark" | "light";

export interface ThemeConfig {
  page: {
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    accentHover: string;
    border: string;
  };

  accent: {
    text: string;
    background: string;
    hoverBackground: string;
    hoverText: string;
    hoverBorder: string;
  };

  navbar: {
    background: string;
    border: string;
    text: string;
    mutedText: string;
    accent: string;
    accentHover: string;
    activeBackground: string;
    activeText: string;
  };
}

export const pageThemes: Record<PageTheme, ThemeConfig> = {
  /* =========================================================
     DARK
  ========================================================= */

  dark: {
    page: {
      background: "bg-charcoal",
      foreground: "text-ivory",
      muted: "text-ivory/65",

      accent: "text-gold",
      accentHover: "hover:text-gold",

      border: "border-ivory/10",
    },

    accent: {
      text: "text-gold",
      background: "bg-gold",
      hoverBackground: "hover:bg-gold",
      hoverText: "hover:text-charcoal",
      hoverBorder: "hover:border-gold",
    },

    navbar: {
      background: "bg-charcoal/75",
      border: "border-ivory/10",

      text: "text-ivory",
      mutedText: "text-ivory/65",

      accent: "text-gold",
      accentHover: "hover:text-gold",

      activeBackground: "bg-gold",
      activeText: "text-charcoal",
    },
  },

  /* =========================================================
     LIGHT
  ========================================================= */

  light: {
    page: {
      background: "bg-ivory",
      foreground: "text-charcoal",
      muted: "text-charcoal/60",

      accent: "text-bronze",
      accentHover: "hover:text-bronze",

      border: "border-charcoal/10",
    },

    accent: {
      text: "text-bronze",
      background: "bg-bronze",
      hoverBackground: "hover:bg-bronze",
      hoverText: "hover:text-ivory",
      hoverBorder: "hover:border-bronze",
    },

    navbar: {
      background: "bg-ivory/75",
      border: "border-charcoal/10",

      text: "text-charcoal",
      mutedText: "text-charcoal/60",

      accent: "text-bronze",
      accentHover: "hover:text-bronze",

      activeBackground: "bg-bronze",
      activeText: "text-ivory",
    },
  },
};