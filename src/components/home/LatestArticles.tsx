import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import Section from "@/components/layout/Section";

const articles = [
  {
    category: "Faith",
    title: "Walking With God Through Every Season",
    excerpt:
      "A placeholder reflection on faith, growth, and remaining grounded through every season of life.",
    date: "August 21, 2026",
    slug: "walking-with-god-through-every-season",
  },
  {
    category: "Kingdom",
    title: "The Power of Purposeful Living",
    excerpt:
      "Exploring the importance of discovering purpose and living intentionally for kingdom impact.",
    date: "August 14, 2026",
    slug: "the-power-of-purposeful-living",
  },
  {
    category: "Leadership",
    title: "Leading From a Place of Conviction",
    excerpt:
      "A placeholder article on leadership, character, conviction, and influence.",
    date: "August 7, 2026",
    slug: "leading-from-a-place-of-conviction",
  },
];

export default function LatestArticles() {
  return (
    <Section theme="light" className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow text-bronze">From the Journal</p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="display-heading mt-5 max-w-3xl text-5xl sm:text-6xl lg:text-7xl">
                Articles &
                <br />
                <span className="text-bronze">Insights.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <Link
              href="/articles"
              className="group inline-flex w-fit items-center gap-2 border-b border-bronze/40 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-bronze hover:text-bronze"
            >
              View all articles
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Reveal key={article.slug}>
              <article className="group">
                <Link href={`/articles/${article.slug}`}>
                  {/* Placeholder image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-soft">
                    <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.2em] text-ivory/30 transition-transform duration-700 group-hover:scale-105">
                      Article Image
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                      <span>{article.category}</span>
                      <span className="h-px w-6 bg-bronze/40" />
                      <span>{article.date}</span>
                    </div>

                    <h3 className="mt-4 text-2xl font-medium tracking-[-0.025em] transition-colors duration-300 group-hover:text-bronze sm:text-3xl">
                      {article.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-charcoal/65">
                      {article.excerpt}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-charcoal">
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
          ))}
        </Stagger>
      </div>
    </Section>
  );
}