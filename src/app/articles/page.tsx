import Navbar from "@/components/navigation/Navbar";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <Navbar />

      <section className="px-6 pb-20 pt-36 sm:px-8 lg:px-12 lg:pb-28 lg:pt-44">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-bronze">The Journal</p>

          <h1 className="display-heading mt-6 max-w-5xl text-6xl sm:text-7xl lg:text-[8rem]">
            Articles &
            <br />
            <span className="text-bronze">Insights.</span>
          </h1>

          <p className="body-copy mt-8 max-w-2xl text-base text-charcoal/65 sm:text-lg">
            Reflections, teachings, insights and conversations from Pastor
            Olawale Smith and the ministry.
          </p>
        </div>
      </section>

      <section className="border-t border-charcoal/10 px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.slug} className="group">
                <Link href={`/articles/${article.slug}`}>
                  <div className="aspect-[4/3] overflow-hidden bg-charcoal-soft">
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-ivory/30 transition-transform duration-700 group-hover:scale-105">
                      Article Image
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                      <span>{article.category}</span>
                      <span className="h-px w-6 bg-bronze/40" />
                      <span>{article.date}</span>
                    </div>

                    <h2 className="mt-4 text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-bronze">
                      {article.title}
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-charcoal/65">
                      {article.excerpt}
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em]">
                      Read article
                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}