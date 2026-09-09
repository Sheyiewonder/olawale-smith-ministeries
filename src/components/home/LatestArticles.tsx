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
    <Section
      theme="light"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
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
    theme === "dark" ? "bg-charcoal-soft" : "bg-ivory-muted";

  const placeholderText =
    theme === "dark" ? "text-ivory/40" : "text-charcoal/35";

  const divider =
    theme === "dark" ? "bg-gold/40" : "bg-bronze/40";

  const skeletonBackground =
    theme === "dark" ? "bg-ivory/10" : "bg-charcoal/10";

  const formatDate = (date?: string | null) => {
    if (!date) return null;

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
      {/* ------------------------------------------------------------------ */}
      {/* Atmospheric background                                             */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
      >
        {/* Soft blue atmosphere */}
        <div className="absolute right-[-12%] top-[-8%] h-[460px] w-[460px] rounded-full bg-blue/[0.07] blur-[130px]" />

        <div className="absolute left-[-15%] bottom-[-15%] h-[420px] w-[420px] rounded-full bg-blue-soft/[0.05] blur-[120px]" />

        {/* Warm counterbalance */}
        <div className="absolute left-[28%] top-[24%] h-[280px] w-[280px] rounded-full bg-gold/[0.045] blur-[110px]" />

        {/* Fine architectural rings */}
        <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-blue-soft/10" />

        <div className="absolute -right-16 -top-16 h-[300px] w-[300px] rounded-full border border-gold/10" />

        {/* Horizontal editorial line */}
        <div className="absolute right-0 top-[34%] h-px w-[20%] bg-gradient-to-r from-transparent via-blue-soft/20 to-transparent" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-bronze" />

              <p
                className={[
                  "text-[10px] font-bold uppercase tracking-[0.3em]",
                  config.page.accent,
                ].join(" ")}
              >
                From the Journal
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2
              className={[
                "display-heading mt-6 max-w-3xl",
                "text-5xl leading-[0.95]",
                "tracking-[-0.035em]",
                "sm:text-6xl lg:text-[6.5rem]",
                config.page.foreground,
              ].join(" ")}
            >
              Articles &
              <br />
              <span className="relative inline-block">
                <span className={config.page.accent}>Insights.</span>

                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-bronze via-blue-soft to-transparent opacity-60"
                />
              </span>
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <Link
            href="/articles"
            className={[
              "group inline-flex w-fit items-center gap-3",
              "border-b pb-2 text-xs font-semibold uppercase",
              "tracking-[0.16em]",
              config.page.foreground,
              theme === "dark"
                ? "border-gold/40 hover:border-gold"
                : "border-bronze/40 hover:border-blue-soft/60",
              config.page.accentHover,
              "transition-all duration-300",
            ].join(" ")}
          >
            <span>View all articles</span>

            <ArrowUpRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Loading state                                                      */}
      {/* ------------------------------------------------------------------ */}

      {loading && (
        <div className="relative z-10 mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse">
              <div
                className={[
                  "aspect-[4/3] overflow-hidden border",
                  imageBackground,
                  config.page.border,
                ].join(" ")}
              />

              <div className="mt-6 space-y-4">
                <div
                  className={[
                    "h-3 w-32 rounded-sm",
                    skeletonBackground,
                  ].join(" ")}
                />

                <div
                  className={[
                    "h-8 w-4/5 rounded-sm",
                    skeletonBackground,
                  ].join(" ")}
                />

                <div
                  className={[
                    "h-4 w-full rounded-sm",
                    skeletonBackground,
                  ].join(" ")}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Articles                                                           */}
      {/* ------------------------------------------------------------------ */}

      {!loading && articles.length > 0 && (
        <Stagger className="relative z-10 mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => {
            const category = article.categories[0]?.category;
            const formattedDate = formatDate(article.publishedAt);

            return (
              <Reveal key={article.id}>
                <article className="group relative">
                  <Link href={`/articles/${article.slug}`}>
                    {/* ---------------------------------------------------- */}
                    {/* Image                                                  */}
                    {/* ---------------------------------------------------- */}

                    <div
                      className={[
                        "relative aspect-[4/3] overflow-hidden",
                        "border",
                        imageBackground,
                        theme === "dark"
                          ? "border-white/10"
                          : "border-charcoal/10",
                        "transition-all duration-500",
                        theme === "dark"
                          ? "group-hover:border-gold/30"
                          : "group-hover:border-blue-soft/30",
                      ].join(" ")}
                    >
                      {article.thumbnail?.url ? (
                        <>
                          <img
                            src={article.thumbnail.url}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                          />

                          {/* Restrained image atmosphere */}
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-br from-blue-deep/[0.04] via-transparent to-gold/[0.05] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                          />

                          {/* Bottom editorial line */}
                          <div
                            aria-hidden="true"
                            className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-gold via-blue-soft to-transparent transition-all duration-500 group-hover:w-2/3"
                          />
                        </>
                      ) : (
                        <div
                          className={[
                            "absolute inset-0 flex items-center justify-center",
                            "text-[10px] font-semibold uppercase tracking-[0.3em]",
                            placeholderText,
                            "transition-transform duration-700",
                            "group-hover:scale-[1.02]",
                          ].join(" ")}
                        >
                          <div className="flex flex-col items-center gap-4">
                            <span className="h-px w-8 bg-current opacity-40" />
                            <span>Article</span>
                            <span className="h-px w-8 bg-current opacity-40" />
                          </div>
                        </div>
                      )}

                      {/* Article number */}
                      <span
                        className={[
                          "absolute right-5 top-5 text-[9px]",
                          "font-semibold tracking-[0.2em]",
                          theme === "dark"
                            ? "text-ivory/35"
                            : "text-charcoal/30",
                        ].join(" ")}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* Content                                                */}
                    {/* ---------------------------------------------------- */}

                    <div className="mt-6">
                      <div
                        className={[
                          "flex flex-wrap items-center gap-3",
                          "text-[9px] font-bold uppercase",
                          "tracking-[0.18em]",
                          config.page.accent,
                        ].join(" ")}
                      >
                        {category && <span>{category.name}</span>}

                        {category && formattedDate && (
                          <span
                            aria-hidden="true"
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
                          "mt-4 max-w-xl",
                          "text-2xl font-medium leading-[1.12]",
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
                            "mt-4 line-clamp-3 max-w-lg",
                            "text-sm leading-7",
                            config.page.muted,
                          ].join(" ")}
                        >
                          {article.description}
                        </p>
                      )}

                      {/* Read link */}
                      <span
                        className={[
                          "mt-6 inline-flex items-center gap-2",
                          "text-[10px] font-bold uppercase",
                          "tracking-[0.17em]",
                          config.page.foreground,
                          "transition-colors duration-300",
                        ].join(" ")}
                      >
                        <span className="relative">
                          Read article

                          <span
                            aria-hidden="true"
                            className="absolute -bottom-1 left-0 h-px w-0 bg-blue-soft transition-all duration-300 group-hover:w-full"
                          />
                        </span>

                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.5}
                          className={[
                            "transition-all duration-300",
                            theme === "dark"
                              ? "group-hover:text-gold"
                              : "group-hover:text-blue-deep",
                            "group-hover:-translate-y-0.5",
                            "group-hover:translate-x-0.5",
                          ].join(" ")}
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

      {/* ------------------------------------------------------------------ */}
      {/* Empty state                                                        */}
      {/* ------------------------------------------------------------------ */}

      {!loading && articles.length === 0 && (
        <Reveal>
          <div
            className={[
              "relative z-10 mt-16 border-t pt-10",
              config.page.border,
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-6">
              <p
                className={[
                  "text-sm",
                  config.page.muted,
                ].join(" ")}
              >
                New articles are coming soon.
              </p>

              <span
                aria-hidden="true"
                className="hidden h-px w-20 bg-gradient-to-r from-gold/40 to-blue-soft/30 sm:block"
              />
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
