"use client";

import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import MobileMenu from "./MobileMenu";
import {
  pageThemes,
  type PageTheme,
} from "@/lib/theme";
import { usePageTheme } from "@/components/theme/ThemeProvider";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Resources", href: "/resources" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
  { label: "Invite", href: "/invite" },
  { label: "Partner With Us", href: "/partner" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /*
   * Page-level theme acts as our fallback.
   *
   * Example:
   *
   * <PageLayout theme="light">
   *
   * If a page has no themed sections, the navbar
   * remains light.
   */
  const { theme: pageTheme } = usePageTheme();

  const [sectionTheme, setSectionTheme] =
    useState<PageTheme>(pageTheme);

  /*
   * Detect the section currently underneath
   * the navbar.
   */
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-section-theme]"
      )
    );

    if (sections.length === 0) {
      setSectionTheme(pageTheme);
      return;
    }

    const updateSectionTheme = () => {
      /*
      * Position slightly below the floating navbar.
      * This gives us a reliable "theme detection line".
      */
      const detectionPoint = 100;

      /*
      * Find the section that currently occupies
      * the detection point.
      */
      let activeSection: HTMLElement | null = null;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (
          rect.top <= detectionPoint &&
          rect.bottom > detectionPoint
        ) {
          activeSection = section;
          break;
        }
      }

      /*
      * If no section is directly underneath the
      * detection point, find the closest section
      * above it.
      *
      * This prevents the navbar from jumping back
      * to the previous theme during small gaps.
      */
      if (!activeSection) {
        const sectionsAbove = sections
          .filter(
            (section) =>
              section.getBoundingClientRect().top <=
              detectionPoint
          )
          .sort(
            (a, b) =>
              b.getBoundingClientRect().top -
              a.getBoundingClientRect().top
          );

        activeSection = sectionsAbove[0] ?? null;
      }

      if (!activeSection) {
        setSectionTheme(pageTheme);
        return;
      }

      const theme =
        activeSection.getAttribute(
          "data-section-theme"
        );

      if (theme === "light" || theme === "dark") {
        setSectionTheme(theme);
      }
    };

    /*
    * Check immediately.
    */
    updateSectionTheme();

    /*
    * Recalculate while scrolling.
    */
    window.addEventListener(
      "scroll",
      updateSectionTheme,
      { passive: true }
    );

    /*
    * Also recalculate when the viewport changes.
    */
    window.addEventListener(
      "resize",
      updateSectionTheme
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateSectionTheme
      );

      window.removeEventListener(
        "resize",
        updateSectionTheme
      );
    };
  }, [pathname, pageTheme]);

  /*
   * Scroll behaviour:
   *
   * At the top:
   * Navbar is visible and has no heavy shadow.
   *
   * Scrolling down:
   * Navbar disappears.
   *
   * Scrolling up:
   * Navbar returns.
   */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest < 80) {
      setHidden(false);
      setScrolled(false);
      return;
    }

    setScrolled(true);

    if (latest > previous && latest > 120) {
      setHidden(true);
    }

    if (latest < previous) {
      setHidden(false);
    }
  });

  /*
   * Get the configuration for the currently
   * visible section.
   */
  const config = pageThemes[sectionTheme];
  const navbar = config.navbar;
  const accent = config.accent;

  /*
   * Active navigation item.
   */
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  /*
   * Explore button styling.
   */
  const exploreButton = [
    "border px-4 py-2.5",
    "text-[10px] font-semibold uppercase",
    "tracking-[0.13em]",
    "transition-all duration-300",

    navbar.border,
    accent.text,
    accent.hoverBackground,
    accent.hoverText,
    accent.hoverBorder,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: hidden ? -120 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <nav
          className={[
            "relative flex items-center justify-between",
            "border px-3 py-2.5",
            "transition-all duration-500 ease-out",

            navbar.border,

            scrolled
              ? navbar.background
                  .replace("/40", "/90")
                  .replace("/75", "/90")
              : navbar.background,

            scrolled ? "shadow-2xl" : "",

            "backdrop-blur-2xl",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* =====================================================
              BRAND
          ====================================================== */}

          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 pl-1"
          >
            {/* OS Logo */}
            <div
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center",
                "rounded-full border",
                "text-[10px] font-semibold tracking-tight",
                "transition-all duration-300",

                accent.text,
                navbar.border,

                accent.hoverBackground,
                accent.hoverText,
                accent.hoverBorder,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              OS
            </div>

            {/* Ministry Name */}
            <div className="block">
              <p
                className={[
                  "text-[9px] font-semibold tracking-[0.12em]",
                  "sm:text-[11px] sm:tracking-[0.16em]",
                  navbar.text,
                  "transition-colors duration-300",
                ].join(" ")}
              >
                OLAWALE SMITH
              </p>

              <p
                className={[
                  "text-[7px] uppercase tracking-[0.22em]",
                  "sm:text-[8px] sm:tracking-[0.28em]",
                  navbar.accent,
                  "transition-colors duration-300",
                ].join(" ")}
              >
                Ministries
              </p>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <div className="hidden items-center gap-0.5 lg:flex">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    active ? "page" : undefined
                  }
                  className={[
                    "px-3 py-2",
                    "text-[9px] font-medium uppercase",
                    "tracking-[0.11em]",
                    "transition-all duration-300",
                    "xl:px-3.5 xl:text-[10px]",

                    active
                      ? `${navbar.activeBackground} ${navbar.activeText}`
                      : [
                          navbar.mutedText,
                          navbar.accentHover,
                          "hover:bg-black/5",
                        ].join(" "),
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* =====================================================
              ACTIONS
          ====================================================== */}

          <div className="flex items-center gap-2">
            {/* Explore */}
            <Link
              href="/resources"
              className={[
                "hidden lg:block",
                exploreButton,
              ].join(" ")}
            >
              Explore
            </Link>

            {/* Mobile / Tablet Menu */}
            <MobileMenu theme={sectionTheme} />
          </div>
        </nav>
      </div>
    </motion.header>
  );
}