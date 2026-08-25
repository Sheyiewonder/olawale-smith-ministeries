"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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

  return (
    <footer
      className={[
        "relative border-t",
        config.page.background,
        config.page.foreground,
        mutedBorder,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-14 py-20 sm:py-24 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center",
                  "rounded-full border text-xs font-semibold",
                  "tracking-tight transition-colors duration-300",
                  config.page.accent,
                  mutedBorder,
                ].join(" ")}
              >
                OS
              </div>

              <div>
                <p
                  className={[
                    "text-[11px] font-semibold tracking-[0.16em]",
                    config.page.foreground,
                  ].join(" ")}
                >
                  OLAWALE SMITH
                </p>

                <p
                  className={[
                    "mt-0.5 text-[8px] uppercase tracking-[0.28em]",
                    config.page.accent,
                  ].join(" ")}
                >
                  Ministries
                </p>
              </div>
            </Link>

            <p
              className={[
                "mt-7 max-w-sm text-sm leading-7",
                config.page.muted,
              ].join(" ")}
            >
              Raising people who know God, understand their
              purpose, and make meaningful kingdom impact.
            </p>

            <Link
              href="/resources"
              className={[
                "group mt-7 inline-flex items-center gap-2",
                "text-[10px] font-semibold uppercase",
                "tracking-[0.14em]",
                config.page.accent,
              ].join(" ")}
            >
              Explore the library

              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <p
              className={[
                "eyebrow",
                config.page.accent,
              ].join(" ")}
            >
              Navigation
            </p>

            <nav className="mt-6 flex flex-col gap-4">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "w-fit text-sm transition-colors duration-300",
                    config.page.muted,
                    config.page.accentHover,
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <p
              className={[
                "eyebrow",
                config.page.accent,
              ].join(" ")}
            >
              Resources
            </p>

            <nav className="mt-6 flex flex-col gap-4">
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "w-fit text-sm transition-colors duration-300",
                    config.page.muted,
                    config.page.accentHover,
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <p
              className={[
                "eyebrow",
                config.page.accent,
              ].join(" ")}
            >
              Connect
            </p>

            <p
              className={[
                "mt-6 max-w-xs text-sm leading-7",
                config.page.muted,
              ].join(" ")}
            >
              Stay connected with Olawale Smith Ministries
              and follow along with what God is doing through
              the ministry.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                className={[
                  "rounded-full border px-4 py-2.5",
                  "text-[9px] font-semibold uppercase",
                  "tracking-[0.13em]",
                  "transition-colors duration-300",
                  mutedBorder,
                  config.page.muted,
                  config.page.accentHover,
                ].join(" ")}
              >
                Instagram
              </a>

              <a
                href="#"
                className={[
                  "rounded-full border px-4 py-2.5",
                  "text-[9px] font-semibold uppercase",
                  "tracking-[0.13em]",
                  "transition-colors duration-300",
                  mutedBorder,
                  config.page.muted,
                  config.page.accentHover,
                ].join(" ")}
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={[
            "flex flex-col gap-4 border-t py-7",
            "sm:flex-row sm:items-center sm:justify-between",
            mutedBorder,
          ].join(" ")}
        >
          <p
            className={[
              "text-[9px] uppercase tracking-[0.14em]",
              config.page.muted,
            ].join(" ")}
          >
            © {new Date().getFullYear()} Olawale Smith Ministries
          </p>

          <p
            className={[
              "text-[9px] uppercase tracking-[0.14em]",
              config.page.muted,
            ].join(" ")}
          >
            Built for Kingdom Impact
          </p>
        </div>
      </div>
    </footer>
  );
}