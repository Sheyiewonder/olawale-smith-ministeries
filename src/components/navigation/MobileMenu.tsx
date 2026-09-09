"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  pageThemes,
  type PageTheme,
} from "@/lib/theme";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Resources", href: "/resources" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
  { label: "Invite", href: "/invite" },
  { label: "Partner With Us", href: "/partner" },
];

interface MobileMenuProps {
  theme?: PageTheme;
}

export default function MobileMenu({
  theme = "dark",
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => {
    setOpen(false);
  };

  const config = pageThemes[theme];
  const navbar = config.navbar;

  const isLight = theme === "light";

  /*
   * The mobile menu deliberately keeps the warm ministry palette
   * as the foundation while introducing blue as an atmospheric
   * and interaction accent.
   */
  const panelBackground = isLight
    ? "bg-ivory/95"
    : "bg-charcoal/95";

  const panelForeground = isLight
    ? "text-charcoal"
    : "text-ivory";

  const panelMuted = isLight
    ? "text-charcoal/45"
    : "text-ivory/45";

  const panelBorder = isLight
    ? "border-charcoal/10"
    : "border-white/10";

  const panelAccent = isLight
    ? "text-bronze"
    : "text-gold";

  const panelAccentHover = isLight
    ? "hover:text-blue-deep"
    : "hover:text-blue-soft";

  return (
    <div className="lg:hidden">
      {/* =========================================================
          MENU BUTTON
      ========================================================== */}

      <button
        type="button"
        aria-label={
          open
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={[
          "relative z-[70] flex h-10 w-10 items-center justify-center",
          "border backdrop-blur-md",
          "transition-all duration-300",

          navbar.border,
          navbar.background,
          navbar.text,

          "hover:border-blue-soft/40",
          "hover:bg-blue/10",
          "hover:text-blue-soft",

          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-blue-soft/30",
          "focus-visible:ring-offset-2",
          isLight
            ? "focus-visible:ring-offset-ivory"
            : "focus-visible:ring-offset-charcoal",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="close"
              initial={{
                rotate: -90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
              exit={{
                rotate: 90,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <X
                size={18}
                strokeWidth={1.5}
              />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{
                rotate: 90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
              exit={{
                rotate: -90,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <Menu
                size={18}
                strokeWidth={1.5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* =========================================================
          MOBILE MENU
      ========================================================== */}

      <AnimatePresence>
        {open && (
          <>
            {/* -----------------------------------------------------
                Backdrop
            ------------------------------------------------------ */}

            <motion.button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className={[
                "fixed inset-0 z-40 cursor-default",
                isLight
                  ? "bg-charcoal/20"
                  : "bg-black/55",
                "backdrop-blur-sm",
              ].join(" ")}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
            />

            {/* -----------------------------------------------------
                Menu Panel
            ------------------------------------------------------ */}

            <motion.div
              className={[
                "absolute right-0 top-14 z-50",
                "w-[calc(100vw-2rem)] max-w-sm",
                "overflow-hidden rounded-[1.5rem]",
                "border shadow-2xl",
                "backdrop-blur-2xl",

                panelBackground,
                panelBorder,
                panelForeground,
              ].join(" ")}
              initial={{
                opacity: 0,
                y: -12,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -8,
                scale: 0.98,
              }}
              transition={{
                duration: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* ---------------------------------------------------
                  Atmospheric background
              ---------------------------------------------------- */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                {/* Blue glow */}
                <div
                  className={[
                    "absolute -right-28 -top-28 h-72 w-72",
                    "rounded-full blur-[90px]",
                    isLight
                      ? "bg-blue-soft/[0.10]"
                      : "bg-blue/[0.12]",
                  ].join(" ")}
                />

                {/* Secondary blue atmosphere */}
                <div
                  className={[
                    "absolute -left-32 bottom-[-18%] h-64 w-64",
                    "rounded-full blur-[80px]",
                    isLight
                      ? "bg-blue-soft/[0.06]"
                      : "bg-blue-soft/[0.05]",
                  ].join(" ")}
                />

                {/* Gold counterbalance */}
                <div
                  className={[
                    "absolute right-[18%] top-[32%] h-40 w-40",
                    "rounded-full blur-[70px]",
                    isLight
                      ? "bg-gold/[0.035]"
                      : "bg-gold/[0.045]",
                  ].join(" ")}
                />

                {/* Architectural rings */}
                <div
                  className={[
                    "absolute -right-24 -top-24 h-72 w-72",
                    "rounded-full border",
                    isLight
                      ? "border-blue-soft/[0.10]"
                      : "border-blue-soft/[0.12]",
                  ].join(" ")}
                />

                <div
                  className={[
                    "absolute -right-8 -top-8 h-40 w-40",
                    "rounded-full border",
                    isLight
                      ? "border-gold/[0.10]"
                      : "border-gold/[0.12]",
                  ].join(" ")}
                />

                {/* Fine horizontal line */}
                <div
                  className={[
                    "absolute left-0 right-0 top-[18%] h-px",
                    isLight
                      ? "bg-gradient-to-r from-transparent via-blue-soft/[0.12] to-transparent"
                      : "bg-gradient-to-r from-transparent via-blue-soft/[0.14] to-transparent",
                  ].join(" ")}
                />
              </div>

              <div className="relative z-10 p-5">
                {/* -------------------------------------------------
                    Header
                -------------------------------------------------- */}

                <div
                  className={[
                    "mb-3 flex items-end justify-between",
                    "border-b pb-4",
                    panelBorder,
                  ].join(" ")}
                >
                  <div>
                    <p
                      className={[
                        "text-[9px] font-bold uppercase",
                        "tracking-[0.3em]",
                        panelAccent,
                      ].join(" ")}
                    >
                      Navigation
                    </p>

                    <p
                      className={[
                        "mt-2 text-[8px] uppercase",
                        "tracking-[0.2em]",
                        panelMuted,
                      ].join(" ")}
                    >
                      Olawale Smith Ministries
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mb-1 h-px w-8 bg-gradient-to-r from-gold/50 to-blue-soft/50"
                  />
                </div>

                {/* -------------------------------------------------
                    Navigation
                -------------------------------------------------- */}

                <nav className="flex flex-col">
                  {navigation.map((item, index) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href ||
                          pathname.startsWith(
                            `${item.href}/`,
                          );

                    return (
                      <motion.div
                        key={item.href}
                        initial={{
                          opacity: 0,
                          x: -12,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: 0.04 + index * 0.045,
                          duration: 0.35,
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          aria-current={
                            active
                              ? "page"
                              : undefined
                          }
                          className={[
                            "group relative flex items-center",
                            "justify-between overflow-hidden",
                            "border-b py-4",
                            "text-sm font-medium uppercase",
                            "tracking-[0.1em]",
                            "transition-all duration-300",

                            panelBorder,

                            active
                              ? [
                                  panelAccent,
                                  "border-gold/25",
                                ].join(" ")
                              : [
                                  panelMuted,
                                  panelAccentHover,
                                ].join(" "),
                          ].join(" ")}
                        >
                          {/* Active / hover atmosphere */}
                          <span
                            aria-hidden="true"
                            className={[
                              "absolute inset-y-0 left-0",
                              "w-0 bg-blue/[0.06]",
                              "transition-all duration-500",
                              "group-hover:w-full",
                              active
                                ? "w-full"
                                : "",
                            ].join(" ")}
                          />

                          {/* Active indicator */}
                          <span
                            aria-hidden="true"
                            className={[
                              "absolute left-0 top-1/2",
                              "h-4 w-px -translate-y-1/2",
                              "bg-gradient-to-b from-gold to-blue-soft",
                              "transition-all duration-300",
                              active
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-70",
                            ].join(" ")}
                          />

                          <span className="relative z-10 pl-3">
                            {item.label}
                          </span>

                          <span
                            className={[
                              "relative z-10 flex h-8 w-8",
                              "items-center justify-center",
                              "rounded-full border",
                              "transition-all duration-300",

                              active
                                ? [
                                    "border-gold/30",
                                    "bg-gold/[0.08]",
                                    "text-gold",
                                  ].join(" ")
                                : [
                                    "border-transparent",
                                    panelMuted,
                                    "group-hover:border-blue-soft/25",
                                    "group-hover:bg-blue/[0.08]",
                                    "group-hover:text-blue-soft",
                                  ].join(" "),
                            ].join(" ")}
                          >
                            <ArrowUpRight
                              size={15}
                              strokeWidth={1.4}
                              className={[
                                "transition-transform duration-300",
                                "group-hover:-translate-y-0.5",
                                "group-hover:translate-x-0.5",
                              ].join(" ")}
                            />
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* -------------------------------------------------
                    Explore Resources
                -------------------------------------------------- */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.31,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-5"
                >
                  <Link
                    href="/resources"
                    onClick={closeMenu}
                    className={[
                      "group relative flex items-center",
                      "justify-between overflow-hidden",
                      "border px-5 py-4",
                      "text-xs font-bold uppercase",
                      "tracking-[0.16em]",
                      "transition-all duration-300",

                      isLight
                        ? [
                            "border-bronze/40",
                            "bg-bronze",
                            "text-ivory",
                            "hover:border-charcoal",
                            "hover:bg-charcoal",
                          ].join(" ")
                        : [
                            "border-gold/60",
                            "bg-gold",
                            "text-charcoal",
                            "hover:border-gold-light",
                            "hover:bg-gold-light",
                          ].join(" "),
                    ].join(" ")}
                  >
                    <span className="relative z-10">
                      Explore Resources
                    </span>

                    <span
                      aria-hidden="true"
                      className={[
                        "relative z-10 flex h-7 w-7",
                        "items-center justify-center",
                        "rounded-full border",
                        isLight
                          ? "border-ivory/25"
                          : "border-charcoal/20",
                      ].join(" ")}
                    >
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.5}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>

                    {/* Blue hover wash */}
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute inset-0 -translate-x-full",
                        "bg-blue-deep/[0.08]",
                        "transition-transform duration-500",
                        "group-hover:translate-x-0",
                      ].join(" ")}
                    />
                  </Link>
                </motion.div>

                {/* -------------------------------------------------
                    Footer detail
                -------------------------------------------------- */}

                <div className="mt-5 flex items-center justify-between">
                  <span
                    className={[
                      "text-[7px] uppercase",
                      "tracking-[0.28em]",
                      panelMuted,
                    ].join(" ")}
                  >
                    Faith · Teaching · Impact
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="h-px w-5 bg-gold/40" />
                    <span className="h-px w-3 bg-blue-soft/40" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
