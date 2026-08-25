"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import Section from "@/components/layout/Section";
import { useSectionTheme } from "@/components/layout/SectionTheme";
import { pageThemes } from "@/lib/theme";
import { getResources, type Resource } from "@/lib/api";

export default function LatestArticles() {
  return (
    <Section theme="light" className="py-24 sm:py-32 lg:py-40">
      <LatestArticlesContent />
    </Section>
  );
}

function LatestArticlesContent() {
  const theme = useSectionTheme();
  const config = pageThemes[theme];

  const [articles, setArticles] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadArticles() {
      try {
        const response = await getResources({
          type: "ARTICLE",
          limit: 3,
        });

        if (mounted) {
          setArticles(response.data);
        }
      } catch (error) {
        console.error("Failed to load latest articles:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      mounted = false;
    };
  }, []);

  const imageBackground =
    theme === "dark"
      ? "bg-charcoal-soft"
      : "bg-ivory-muted";

  const placeholderText =
    theme === "dark"
      ? "text-ivory/40"
      : "text-charcoal/40";

  const divider =
    theme === "dark"
      ? "bg-gold/40"
      : "bg-bronze/40";

  const formatDate = (date?: string | null) => {
    if (!date) return null;

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <p className={`eyebrow ${config.page.accent}`}>
              From the Journal
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2
              className={[
                "display-heading mt-5 max-w-3xl",
                "text-5xl sm:text-6xl lg:text-7xl",
                config.page.foreground,
              ].join(" ")}
            >
              Articles &
              <br />
              <span className={config.page.accent}>
                Insights.
              </span>
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <Link
            href="/articles"
            className={[
              "group inline-flex w-fit items-center gap-2",
              "border-b pb-2 text-xs font-semibold uppercase",
              "tracking-[0.14em]",
              config.page.foreground,
              config.page.accentHover,
              theme === "dark"
                ? "border-gold/40"
                : "border-bronze/40",
              "transition-colors",
            ].join(" ")}
          >
            View all articles

            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse">
              <div
                className={[
                  "aspect-[4/3]",
                  imageBackground,
                  "border",
                  config.page.border,
                ].join(" ")}
              />

              <div className="mt-6 space-y-4">
                <div
                  className={[
                    "h-3 w-32 rounded",
                    theme === "dark"
                      ? "bg-ivory/10"
                      : "bg-charcoal/10",
                  ].join(" ")}
                />

                <div
                  className={[
                    "h-8 w-4/5 rounded",
                    theme === "dark"
                      ? "bg-ivory/10"
                      : "bg-charcoal/10",
                  ].join(" ")}
                />

                <div
                  className={[
                    "h-4 w-full rounded",
                    theme === "dark"
                      ? "bg-ivory/10"
                      : "bg-charcoal/10",
                  ].join(" ")}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Articles */}
      {!loading && articles.length > 0 && (
        <Stagger className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const category =
              article.categories[0]?.category;

            const formattedDate = formatDate(
              article.publishedAt,
            );

            return (
              <Reveal key={article.id}>
                <article className="group">
                  <Link href={`/articles/${article.slug}`}>
                    {/* Image */}
                    <div
                      className={[
                        "relative aspect-[4/3] overflow-hidden",
                        imageBackground,
                        "border",
                        config.page.border,
                      ].join(" ")}
                    >
                      {article.thumbnail?.url ? (
                        <img
                          src={article.thumbnail.url}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={[
                            "absolute inset-0 flex items-center justify-center",
                            "text-xs uppercase tracking-[0.2em]",
                            placeholderText,
                            "transition-transform duration-700",
                            "group-hover:scale-105",
                          ].join(" ")}
                        >
                          Article
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="mt-6">
                      <div
                        className={[
                          "flex items-center gap-3",
                          "text-[10px] font-semibold uppercase",
                          "tracking-[0.15em]",
                          config.page.accent,
                        ].join(" ")}
                      >
                        {category && (
                          <span>{category.name}</span>
                        )}

                        {category && formattedDate && (
                          <span
                            className={[
                              "h-px w-6",
                              divider,
                            ].join(" ")}
                          />
                        )}

                        {formattedDate && (
                          <span>{formattedDate}</span>
                        )}
                      </div>

                      <h3
                        className={[
                          "mt-4 text-2xl font-medium",
                          "tracking-[-0.025em]",
                          config.page.foreground,
                          config.page.accentHover,
                          "transition-colors duration-300",
                          "sm:text-3xl",
                        ].join(" ")}
                      >
                        {article.title}
                      </h3>

                      {article.description && (
                        <p
                          className={[
                            "mt-4 line-clamp-3 text-sm leading-7",
                            config.page.muted,
                          ].join(" ")}
                        >
                          {article.description}
                        </p>
                      )}

                      <span
                        className={[
                          "mt-6 inline-flex items-center gap-2",
                          "text-xs font-semibold uppercase",
                          "tracking-[0.13em]",
                          config.page.foreground,
                        ].join(" ")}
                      >
                        Read article

                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </Stagger>
      )}

      {/* Empty state */}
      {!loading && articles.length === 0 && (
        <div
          className={[
            "mt-16 border-t pt-10",
            config.page.border,
          ].join(" ")}
        >
          <p
            className={[
              "text-sm",
              config.page.muted,
            ].join(" ")}
          >
            New articles are coming soon.
          </p>
        </div>
      )}
    </div>
  );
}