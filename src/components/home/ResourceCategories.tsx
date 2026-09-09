import Link from "next/link";
import Section from "@/components/layout/Section";
import {
  ArrowUpRight,
  BookOpen,
  FolderOpen,
  Headphones,
  Library,
  Music2,
  Play,
  Podcast,
} from "lucide-react";

import { getCategories } from "@/lib/api";

const categoryIcons = [
  BookOpen,
  Headphones,
  Music2,
  Play,
  Podcast,
  Library,
  FolderOpen,
];

export default async function ResourceCategories() {
  let categories;

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load resource categories:", error);
    return null;
  }

  if (!categories.length) {
    return null;
  }

  return (
    <Section
      theme="light"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Atmospheric background                                            */}
      {/* ------------------------------------------------------------------ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute right-[-12%] top-[-8%] h-[520px] w-[520px] rounded-full bg-blue/[0.06] blur-[140px]" />

        <div className="absolute left-[-14%] bottom-[-15%] h-[460px] w-[460px] rounded-full bg-blue-soft/[0.05] blur-[130px]" />

        <div className="absolute left-[35%] top-[38%] h-[300px] w-[300px] rounded-full bg-gold/[0.045] blur-[110px]" />

        <div className="absolute -right-36 -top-36 h-[500px] w-[500px] rounded-full border border-blue-soft/10" />

        <div className="absolute -right-16 -top-16 h-[320px] w-[320px] rounded-full border border-gold/10" />

        <div className="absolute left-0 top-[28%] h-px w-[18%] bg-gradient-to-r from-transparent via-blue-soft/20 to-transparent" />

        <div className="absolute right-0 bottom-[24%] h-px w-[20%] bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-bronze" />

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze">
                The Library
              </p>
            </div>

            <h2 className="display-heading mt-6 max-w-4xl text-5xl leading-[0.94] tracking-[-0.035em] text-charcoal sm:text-6xl lg:text-[6.5rem]">
              Explore the
              <br />
              <span className="relative inline-block text-bronze">
                collection.
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-bronze via-blue-soft to-transparent opacity-60"
                />
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-lg text-sm leading-7 text-charcoal/55 sm:text-base">
              Explore teachings, messages, books, songs, articles, and other
              resources from Olawale Smith Ministries.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-px w-8 bg-gold/50" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-charcoal/30">
                Faith · Teaching · Impact
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Category Grid                                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-16 border-l border-t border-charcoal/10 sm:mt-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const Icon =
                categoryIcons[index % categoryIcons.length];

              return (
                <Link
                  key={category.id}
                  href={`/resources?category=${encodeURIComponent(
                    category.slug,
                  )}`}
                  className="group relative min-h-[300px] overflow-hidden border-b border-r border-charcoal/10 bg-transparent p-7 transition-colors duration-500 hover:bg-charcoal sm:min-h-[330px] sm:p-8 lg:p-9"
                >
                  {/* Hover atmosphere */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-blue-deep/[0.08] via-transparent to-gold/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {/* Corner architecture */}
                  <div
                    aria-hidden="true"
                    className="absolute right-[-70px] top-[-70px] h-44 w-44 rounded-full border border-blue-soft/0 transition-all duration-700 group-hover:border-blue-soft/15 group-hover:scale-110"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute right-[-28px] top-[-28px] h-24 w-24 rounded-full border border-gold/0 transition-all duration-700 group-hover:border-gold/15"
                  />

                  {/* Number */}
                  <span className="absolute right-7 top-7 text-[9px] font-semibold tracking-[0.2em] text-charcoal/20 transition-colors duration-300 group-hover:text-ivory/20 sm:right-8 sm:top-8">
                    0{index + 1}
                  </span>

                  {/* Icon */}
                  <div className="relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-bronze/20 text-bronze transition-all duration-500 group-hover:border-gold/50 group-hover:bg-gold group-hover:text-charcoal">
                      <Icon size={19} strokeWidth={1.35} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-16">
                    <h3 className="max-w-[14rem] font-[var(--font-bricolage)] text-3xl leading-[1.05] tracking-[-0.025em] text-charcoal transition-colors duration-300 group-hover:text-ivory sm:text-[2.1rem]">
                      {category.name}
                    </h3>

                    {category.description && (
                      <p className="mt-4 max-w-sm text-sm leading-6 text-charcoal/55 transition-colors duration-300 group-hover:text-ivory/50">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom action */}
                  <div className="absolute bottom-7 left-7 right-7 z-10 flex items-center justify-between sm:bottom-8 sm:left-8 sm:right-8">
                    <span className="relative text-[9px] font-bold uppercase tracking-[0.22em] text-bronze transition-colors duration-300 group-hover:text-gold">
                      <span>Explore</span>

                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
                      />
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/10 text-charcoal/25 transition-all duration-300 group-hover:border-blue-soft/40 group-hover:bg-blue/10 group-hover:text-blue-soft">
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.4}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>

                  {/* Bottom hover line */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-gold via-blue-soft to-transparent transition-all duration-700 group-hover:w-2/3"
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Footer detail                                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-8 flex items-center justify-between">
          <span className="text-[8px] uppercase tracking-[0.3em] text-charcoal/25">
            Olawale Smith Ministries
          </span>

          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-px w-4 bg-blue-soft/30" />
          </div>
        </div>
      </div>
    </Section>
  );
}