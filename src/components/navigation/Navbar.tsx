"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

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

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  /*
   * These pages use an ivory background.
   * The navbar needs a darker treatment there.
   */
  const lightPage =
    pathname === "/partner" ||
    pathname === "/articles" ||
    pathname.startsWith("/articles/");

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
            "relative flex items-center justify-between rounded-full border px-3 py-2.5",
            "transition-all duration-500",
            lightPage
              ? scrolled
                ? "border-charcoal/10 bg-ivory/90 shadow-2xl backdrop-blur-2xl"
                : "border-charcoal/10 bg-ivory/75 backdrop-blur-xl"
              : scrolled
                ? "border-ivory/10 bg-charcoal/85 shadow-2xl backdrop-blur-2xl"
                : "border-ivory/10 bg-charcoal/40 backdrop-blur-xl",
          ].join(" ")}
        >
          {/* Brand */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 pl-1"
          >
            <div
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full border",
                "text-[10px] font-semibold tracking-tight",
                "transition-all duration-300",
                lightPage
                  ? "border-bronze/50 text-bronze group-hover:border-bronze group-hover:bg-bronze group-hover:text-ivory"
                  : "border-gold/50 text-gold group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal",
              ].join(" ")}
            >
              OS
            </div>

            <div className="hidden sm:block">
              <p
                className={[
                  "text-[11px] font-semibold tracking-[0.16em]",
                  lightPage ? "text-charcoal" : "text-ivory",
                ].join(" ")}
              >
                OLAWALE SMITH
              </p>

              <p
                className={[
                  "text-[8px] uppercase tracking-[0.28em]",
                  lightPage ? "text-bronze" : "text-gold",
                ].join(" ")}
              >
                Ministries
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "rounded-full px-3 py-2 text-[9px] font-medium uppercase",
                    "tracking-[0.11em] transition-all duration-300",
                    "xl:px-3.5 xl:text-[10px]",
                    active
                      ? "bg-gold text-charcoal"
                      : lightPage
                        ? "text-charcoal/60 hover:bg-charcoal/5 hover:text-bronze"
                        : "text-ivory/65 hover:bg-ivory/5 hover:text-gold",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/resources"
              className={[
                "hidden rounded-full border px-4 py-2.5 text-[10px]",
                "font-semibold uppercase tracking-[0.13em]",
                "transition-all duration-300 md:block",
                lightPage
                  ? "border-bronze/50 text-bronze hover:bg-bronze hover:text-ivory"
                  : "border-gold/50 text-gold hover:bg-gold hover:text-charcoal",
                "lg:hidden",
              ].join(" ")}
            >
              Explore
            </Link>

            <Link
              href="/resources"
              className={[
                "hidden rounded-full border px-4 py-2.5 text-[10px]",
                "font-semibold uppercase tracking-[0.13em]",
                "transition-all duration-300 lg:block",
                lightPage
                  ? "border-bronze/50 text-bronze hover:bg-bronze hover:text-ivory"
                  : "border-gold/50 text-gold hover:bg-gold hover:text-charcoal",
              ].join(" ")}
            >
              Explore
            </Link>

            <MobileMenu lightPage={lightPage} />
          </div>
        </nav>
      </div>
    </motion.header>
  );
}