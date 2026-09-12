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
  { label: "Connect", href: "/connect" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /*
   * Page-level theme acts as our fallback.
   */
  const { theme: pageTheme } = usePageTheme();

  const [sectionTheme, setSectionTheme] =
    useState<PageTheme>(pageTheme);

  /*
   * Detect the section currently underneath
   * the floating navbar.
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
       * This acts as our theme detection line.
       */
      const detectionPoint = 100;

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
       * If no section occupies the detection point,
       * use the closest section above it.
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

    updateSectionTheme();

    window.addEventListener(
      "scroll",
      updateSectionTheme,
      { passive: true }
    );

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
   * Floating navbar scroll behaviour.
   *
   * At the top:
   * - visible
   * - transparent/light
   *
   * Scrolling down:
   * - hides
   *
   * Scrolling up:
   * - returns
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
   * Current section theme configuration.
   */
  const config = pageThemes[sectionTheme];
  const navbar = config.navbar;
  const accent = config.accent;

  const isLight = sectionTheme === "light";

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
   * Explore button.
   *
   * Gold/bronze remains the primary action.
   * Blue is introduced only as a subtle hover
   * counterpoint.
   */
  const exploreButton = [
    "border px-4 py-2.5",
    "text-[10px] font-semibold uppercase",
    "tracking-[0.13em]",
    "transition-all duration-300",

    navbar.border,
    accent.text,

    "hover:-translate-y-0.5",
    "hover:border-gold",
    "hover:bg-gold",
    "hover:text-charcoal",

    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue/30",
    "focus-visible:ring-offset-2",

    isLight
      ? "focus-visible:ring-offset-ivory"
      : "focus-visible:ring-offset-charcoal",
  ]
    .filter(Boolean)
    .join(" ");

  /*
   * Navbar theme foundation.
   */
  const navbarBackground = scrolled
    ? navbar.background
        .replace("/40", "/90")
        .replace("/75", "/90")
    : navbar.background;

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
            /*
             * IMPORTANT:
             * Do NOT use overflow-hidden here.
             *
             * MobileMenu renders an absolutely positioned
             * dropdown outside the navbar's visual bounds.
             * overflow-hidden would clip that dropdown.
             */
            "group/nav relative flex items-center justify-between",
            "border px-3 py-2.5",
            "transition-all duration-500 ease-out",
            "backdrop-blur-2xl",

            navbar.border,
            navbarBackground,

            scrolled
              ? "shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
              : "shadow-none",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* =====================================================
              SUBTLE NAVBAR ATMOSPHERE
          ====================================================== */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {/* Blue atmospheric wash */}
            <div
              className={[
                "absolute -right-20 -top-24 h-48 w-48",
                "rounded-full blur-3xl",
                "transition-opacity duration-700",
                isLight
                  ? "bg-blue/[0.045]"
                  : "bg-blue/[0.08]",
                "opacity-70 group-hover/nav:opacity-100",
              ].join(" ")}
            />

            {/* Gold counterbalance */}
            <div
              className={[
                "absolute -left-16 -bottom-24 h-40 w-40",
                "rounded-full blur-3xl",
                isLight
                  ? "bg-gold/[0.035]"
                  : "bg-gold/[0.06]",
              ].join(" ")}
            />

            {/* Fine blue horizon */}
            <span
              className={[
                "absolute left-0 top-0 h-px",
                "w-1/3",
                "bg-gradient-to-r",
                "from-transparent via-blue-soft/25 to-transparent",
              ].join(" ")}
            />

            {/* Fine gold horizon */}
            <span
              className={[
                "absolute bottom-0 right-0 h-px",
                "w-1/4",
                "bg-gradient-to-l",
                "from-transparent via-gold/20 to-transparent",
              ].join(" ")}
            />
          </div>

          {/* =====================================================
              BRAND
          ====================================================== */}

          <Link
            href="/"
            className="group relative z-10 flex shrink-0 items-center gap-3 pl-1"
          >
            {/* OS Logo */}
            <div
              className={[
                "relative flex h-8 w-8 shrink-0 items-center justify-center",
                "rounded-full border",
                "text-[10px] font-semibold tracking-tight",
                "transition-all duration-300",

                accent.text,
                navbar.border,

                "group-hover:border-blue-soft/45",
                "group-hover:bg-blue/[0.08]",
                "group-hover:text-blue-deep",

                "dark:group-hover:text-blue-soft",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              OS

              <span
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -inset-1",
                  "rounded-full border border-transparent",
                  "transition-all duration-500",
                  "group-hover:border-blue-soft/15",
                  "group-hover:scale-110",
                ].join(" ")}
              />
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
                  "group-hover:text-blue-soft",
                ].join(" ")}
              >
                Ministries
              </p>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <div className="relative z-10 hidden items-center gap-0.5 lg:flex">
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
                    "group/link relative px-3 py-2",
                    "text-[9px] font-medium uppercase",
                    "tracking-[0.11em]",
                    "transition-all duration-300",
                    "xl:px-3.5 xl:text-[10px]",

                    active
                      ? [
                          navbar.activeBackground,
                          navbar.activeText,
                        ].join(" ")
                      : [
                          navbar.mutedText,
                          navbar.accentHover,
                          "hover:bg-black/[0.035]",
                          isLight
                            ? "hover:text-blue-deep"
                            : "hover:text-blue-soft",
                        ].join(" "),
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.label}

                  {/* Active / hover underline */}
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute bottom-0 left-1/2",
                      "-translate-x-1/2",
                      "h-px transition-all duration-500",

                      active
                        ? "w-[55%] bg-gradient-to-r from-gold via-blue-soft to-transparent"
                        : [
                            "w-0",
                            "bg-gradient-to-r",
                            "from-gold via-blue-soft to-transparent",
                            "group-hover/link:w-[45%]",
                          ].join(" "),
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </div>

          {/* =====================================================
              ACTIONS
          ====================================================== */}

          <div className="relative z-10 flex items-center gap-2">
            {/* Explore
            <Link
              href="/resources"
              className={exploreButton}
            >
              <span className="relative z-10">
                Explore
              </span>
            </Link> */}

            {/* Mobile / Tablet Menu */}
            <MobileMenu theme={sectionTheme} />
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
