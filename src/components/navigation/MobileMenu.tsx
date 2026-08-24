"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
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
  const accent = config.accent;

  const isLight = theme === "light";

  return (
    <div className="lg:hidden">
      {/* =====================================================
          MENU BUTTON
      ====================================================== */}

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

          accent.hoverBackground,
          accent.hoverText,
          accent.hoverBorder,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <AnimatePresence
          mode="wait"
          initial={false}
        >
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

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}

            <motion.button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className={[
                "fixed inset-0 z-40 cursor-default",
                isLight
                  ? "bg-charcoal/20"
                  : "bg-black/50",
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
            />

            {/* Menu panel */}

            <motion.div
              className={[
                "absolute right-0 top-14 z-50",
                "w-[calc(100vw-2rem)] max-w-sm",
                "overflow-hidden rounded-3xl",
                "border p-5 shadow-2xl",
                "backdrop-blur-2xl",

                navbar.border,
                navbar.background,
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
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Header */}

              <div
                className={[
                  "mb-4 border-b pb-4",
                  navbar.border,
                ].join(" ")}
              >
                <p
                  className={[
                    "eyebrow",
                    navbar.accent,
                  ].join(" ")}
                >
                  Navigation
                </p>
              </div>

              {/* Navigation */}

              <nav className="flex flex-col">
                {navigation.map((item, index) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        pathname.startsWith(
                          `${item.href}/`
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
                        delay:
                          0.04 + index * 0.05,
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
                          "group flex items-center justify-between",
                          "border-b py-4",
                          "text-sm font-medium uppercase",
                          "tracking-[0.1em]",
                          "transition-all duration-300",

                          navbar.border,

                          active
                            ? [
                                navbar.accent,
                                "border-opacity-30",
                              ].join(" ")
                            : [
                                navbar.mutedText,
                                navbar.accentHover,
                              ].join(" "),
                        ].join(" ")}
                      >
                        {item.label}

                        <ArrowUpRight
                          size={16}
                          strokeWidth={1.5}
                          className={[
                            "transition-all duration-300",

                            active
                              ? navbar.accent
                              : [
                                  "opacity-30",
                                  "group-hover:-translate-y-0.5",
                                  "group-hover:translate-x-0.5",
                                  navbar.accentHover,
                                ].join(" "),
                          ].join(" ")}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Explore Resources */}

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
                  delay: 0.3,
                  duration: 0.4,
                }}
                className="mt-5"
              >
                <Link
                  href="/resources"
                  onClick={closeMenu}
                  className={[
                    "flex items-center justify-center",
                    "rounded-full px-5 py-3.5",
                    "text-xs font-semibold uppercase",
                    "tracking-[0.16em]",
                    "transition-all duration-300",

                    isLight
                      ? "bg-bronze text-ivory hover:bg-charcoal"
                      : "bg-gold text-charcoal hover:bg-gold-light",
                  ].join(" ")}
                >
                  Explore Resources
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}