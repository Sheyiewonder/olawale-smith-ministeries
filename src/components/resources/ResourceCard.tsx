"use client";

import Link from "next/link";
import type { Resource } from "@/lib/api";
import { usePageTheme } from "@/components/theme/ThemeProvider";

interface ResourceCardProps {
  resource: Resource;
}

const typeLabels: Record<Resource["type"], string> = {
  SERMON: "Sermon",
  EBOOK: "Ebook",
  SONG: "Song",
  VIDEO: "Video",
  PODCAST: "Podcast",
  ARTICLE: "Article",
};

export default function ResourceCard({
  resource,
}: ResourceCardProps) {
  const { config, theme } = usePageTheme();

  const category = resource.categories[0]?.category;

  const cardImageFallback =
    theme === "dark"
      ? "from-charcoal-soft to-charcoal"
      : "from-ivory-muted to-ivory";

  const badgeBackground =
    theme === "dark"
      ? "bg-charcoal/70"
      : "bg-ivory/80";

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group block"
    >
      <article>
        {/* Visual */}
        <div
          className={[
            "relative aspect-[4/3] overflow-hidden rounded-2xl",
            "border",
            config.page.border,
            theme === "dark"
              ? "bg-charcoal-soft"
              : "bg-ivory-muted",
          ].join(" ")}
        >
          {resource.thumbnail?.url ? (
            <img
              src={resource.thumbnail.url}
              alt={resource.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className={[
                "absolute inset-0 flex items-center justify-center",
                "bg-gradient-to-br",
                cardImageFallback,
              ].join(" ")}
            >
              <span className={["eyebrow", config.page.accent].join(" ")}>
                {typeLabels[resource.type]}
              </span>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute left-4 top-4">
            <span
              className={[
                "rounded-full border px-3 py-1.5",
                "text-[9px] font-semibold uppercase",
                "tracking-[0.14em] backdrop-blur-md",
                config.page.border,
                badgeBackground,
                config.page.foreground,
              ].join(" ")}
            >
              {typeLabels[resource.type]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="pt-5">
          {/* Meta */}
          <div className="mb-2 flex items-center gap-2">
            {category && (
              <span
                className={[
                  "text-[9px] font-semibold uppercase",
                  "tracking-[0.16em]",
                  config.page.accent,
                ].join(" ")}
              >
                {category.name}
              </span>
            )}

            {category && (
              <span
                className={[
                  "h-1 w-1 rounded-full",
                  theme === "dark"
                    ? "bg-gold/50"
                    : "bg-bronze/50",
                ].join(" ")}
              />
            )}

            <span
              className={[
                "text-[9px] uppercase tracking-[0.12em]",
                config.page.muted,
              ].join(" ")}
            >
              {typeLabels[resource.type]}
            </span>
          </div>

          {/* Title */}
          <h3
            className={[
              "section-heading text-2xl",
              config.page.foreground,
              "transition-colors duration-300",
              config.page.accentHover,
            ].join(" ")}
          >
            {resource.title}
          </h3>

          {/* Description */}
          {resource.description && (
            <p
              className={[
                "mt-3 line-clamp-2 text-sm leading-7",
                config.page.muted,
              ].join(" ")}
            >
              {resource.description}
            </p>
          )}

          {/* Speaker */}
          {resource.speaker && (
            <p
              className={[
                "mt-4 text-[10px] font-semibold uppercase",
                "tracking-[0.13em]",
                config.page.muted,
              ].join(" ")}
            >
              {resource.speaker}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}