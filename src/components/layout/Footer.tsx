"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";

import { pageThemes } from "@/lib/theme";
import { useSectionTheme } from "./SectionTheme";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Resources", href: "/resources" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
  { label: "Invite", href: "/invite" },
  { label: "Partner With Us", href: "/partner" },
];

const resourceLinks = [
  { label: "Sermons", href: "/resources?type=SERMON" },
  { label: "Ebooks", href: "/resources?type=EBOOK" },
  { label: "Songs", href: "/resources?type=SONG" },
  { label: "Podcasts", href: "/resources?type=PODCAST" },
  { label: "Articles", href: "/resources?type=ARTICLE" },
];

export default function Footer() {
  const theme = useSectionTheme();
  const config = pageThemes[theme];

  const mutedBorder =
    theme === "dark"
      ? "border-ivory/10"
      : "border-charcoal/10";

  const background =
    theme === "dark"
      ? "bg-charcoal"
      : config.page.background;

  const foreground =
    theme === "dark"
      ? "text-ivory"
      : config.page.foreground;

  const muted =
    theme === "dark"
      ? "text-ivory/45"
      : config.page.muted;

  const accent =
    theme === "dark"
      ? "text-gold"
      : config.page.accent;

  const accentHover =
    theme === "dark"
      ? "hover:text-gold-light"
      : config.page.accentHover;

  return (
    <footer
      className={[
        "relative overflow-hidden border-t",
        background,
        foreground,
        mutedBorder,
      ].join(" ")}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Atmospheric background                                            */}
      {/* ------------------------------------------------------------------ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Blue atmosphere */}
        <div className="absolute right-[-12%] top-[-18%] h-[560px] w-[560px] rounded-full bg-blue/[0.07] blur-[150px]" />

        <div className="absolute left-[-14%] bottom-[-20%] h-[460px] w-[460px] rounded-full bg-blue-soft/[0.045] blur-[130px]" />

        {/* Gold counterbalance */}
        <div className="absolute left-[38%] top-[30%] h-[280px] w-[280px] rounded-full bg-gold/[0.035] blur-[110px]" />

        {/* Architectural rings */}
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-blue-soft/10" />

        <div className="absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full border border-gold/10" />

        <div className="absolute right-8 top-8 h-[120px] w-[120px] rounded-full border border-blue-soft/[0.06]" />

        {/* Fine horizon */}
        <div className="absolute left-0 right-0 top-[30%] h-px bg-gradient-to-r from-transparent via-blue-soft/[0.10] to-transparent" />

        <div className="absolute bottom-[18%] right-0 h-px w-[28%] bg-gradient-to-r from-transparent via-gold/[0.18] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Main footer                                                      */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid gap-16 py-20 sm:py-24 lg:grid-cols-[1.5fr_0.75fr_0.75fr_1fr] lg:gap-14 lg:py-28">
          {/* ---------------------------------------------------------------- */}
          {/* Brand                                                           */}
          {/* ---------------------------------------------------------------- */}
          <div className="max-w-md">
            <Link
              href="/"
              className="group inline-flex items-center gap-4"
            >
              <div
                className={[
                  "relative flex h-12 w-12 items-center justify-center",
                  "rounded-full border",
                  "text-xs font-semibold tracking-tight",
                  "transition-all duration-500",
                  mutedBorder,
                  accent,
                  "group-hover:border-gold/50",
                  "group-hover:bg-gold",
                  "group-hover:text-charcoal",
                ].join(" ")}
              >
                <span>OS</span>

                <span
                  aria-hidden="true"
                  className="absolute -inset-1 rounded-full border border-blue-soft/0 transition-all duration-500 group-hover:border-blue-soft/20"
                />
              </div>

              <div>
                <p
                  className={[
                    "font-[var(--font-bricolage)] text-sm font-medium",
                    "tracking-[0.08em]",
                    foreground,
                  ].join(" ")}
                >
                  OLAWALE SMITH
                </p>

                <p
                  className={[
                    "mt-1 text-[8px] font-semibold uppercase",
                    "tracking-[0.3em]",
                    accent,
                  ].join(" ")}
                >
                  Ministries
                </p>
              </div>
            </Link>

            <p
              className={[
                "mt-8 max-w-sm text-sm leading-7",
                muted,
              ].join(" ")}
            >
              Raising people who know God, understand their
              purpose, and make meaningful kingdom impact.
            </p>

            <Link
              href="/resources"
              className={[
                "group mt-8 inline-flex items-center gap-3",
                "border-b pb-2",
                "text-[9px] font-bold uppercase tracking-[0.2em]",
                "transition-all duration-300",
                mutedBorder,
                accent,
                "hover:border-gold/50",
              ].join(" ")}
            >
              <span>Explore the library</span>

              <ArrowUpRight
                size={14}
                strokeWidth={1.4}
                className={[
                  "transition-transform duration-300",
                  "group-hover:-translate-y-0.5",
                  "group-hover:translate-x-0.5",
                ].join(" ")}
              />
            </Link>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Navigation                                                       */}
          {/* ---------------------------------------------------------------- */}
          <div>
            <p
              className={[
                "text-[9px] font-bold uppercase",
                "tracking-[0.28em]",
                accent,
              ].join(" ")}
            >
              Navigation
            </p>

            <nav className="mt-7 flex flex-col gap-4">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "group flex w-fit items-center gap-2",
                    "text-sm transition-colors duration-300",
                    muted,
                    accentHover,
                  ].join(" ")}
                >
                  <span>{link.label}</span>

                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.4}
                    className="translate-y-0 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-60"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Resources                                                        */}
          {/* ---------------------------------------------------------------- */}
          <div>
            <p
              className={[
                "text-[9px] font-bold uppercase",
                "tracking-[0.28em]",
                accent,
              ].join(" ")}
            >
              Resources
            </p>

            <nav className="mt-7 flex flex-col gap-4">
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "group flex w-fit items-center gap-2",
                    "text-sm transition-colors duration-300",
                    muted,
                    accentHover,
                  ].join(" ")}
                >
                  <span>{link.label}</span>

                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.4}
                    className="translate-y-0 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-60"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Connect                                                          */}
          {/* ---------------------------------------------------------------- */}
          <div className="max-w-sm">
            <p
              className={[
                "text-[9px] font-bold uppercase",
                "tracking-[0.28em]",
                accent,
              ].join(" ")}
            >
              Connect
            </p>

            <p
              className={[
                "mt-7 text-sm leading-7",
                muted,
              ].join(" ")}
            >
              Stay connected with Olawale Smith Ministries and
              follow along with what God is doing through the
              ministry.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <a
                href="#"
                className={[
                  "group inline-flex items-center gap-2",
                  "rounded-full border px-4 py-2.5",
                  "text-[8px] font-bold uppercase",
                  "tracking-[0.16em]",
                  "transition-all duration-300",
                  mutedBorder,
                  muted,
                  "hover:border-blue-soft/40",
                  "hover:bg-blue/10",
                  "hover:text-blue-soft",
                ].join(" ")}
              >
                Instagram

                <ArrowUpRight
                  size={11}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

              <a
                href="#"
                className={[
                  "group inline-flex items-center gap-2",
                  "rounded-full border px-4 py-2.5",
                  "text-[8px] font-bold uppercase",
                  "tracking-[0.16em]",
                  "transition-all duration-300",
                  mutedBorder,
                  muted,
                  "hover:border-blue-soft/40",
                  "hover:bg-blue/10",
                  "hover:text-blue-soft",
                ].join(" ")}
              >
                YouTube

                <ArrowUpRight
                  size={11}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Closing statement                                                */}
        {/* ---------------------------------------------------------------- */}
        <div
          className={[
            "border-t py-10",
            mutedBorder,
          ].join(" ")}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className={[
                  "max-w-2xl font-[var(--font-bricolage)]",
                  "text-2xl leading-tight tracking-[-0.02em]",
                  foreground,
                  "sm:text-3xl",
                ].join(" ")}
              >
                Resources for faith,
                <br />
                <span className={accent}>purpose & impact.</span>
              </p>
            </div>

            <a
              href="#"
              className={[
                "group inline-flex w-fit items-center gap-3",
                "text-[9px] font-bold uppercase",
                "tracking-[0.2em]",
                muted,
                accentHover,
                "transition-colors duration-300",
              ].join(" ")}
            >
              <span>Back to top</span>

              <span
                className={[
                  "flex h-9 w-9 items-center justify-center",
                  "rounded-full border",
                  mutedBorder,
                  "transition-all duration-300",
                  "group-hover:border-blue-soft/40",
                  "group-hover:bg-blue/10",
                  "group-hover:text-blue-soft",
                ].join(" ")}
              >
                <ArrowUp
                  size={14}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p
              className={[
                "text-[8px] uppercase tracking-[0.16em]",
                muted,
              ].join(" ")}
            >
              © {new Date().getFullYear()} Olawale Smith Ministries
            </p>

            <div className="flex items-center gap-3">
              <span
                className={[
                  "text-[8px] uppercase tracking-[0.2em]",
                  muted,
                ].join(" ")}
              >
                Built for Kingdom Impact
              </span>

              <span className="h-px w-8 bg-gradient-to-r from-gold/50 to-blue-soft/30" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
