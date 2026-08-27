import Link from "next/link";
import Section from "@/components/layout/Section";

import {
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
  const categories = await getCategories();

  if (!categories.length) {
    return null;
  }

  return (
    <Section
      theme="light"
      className="py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-bronze">
            The Library
          </p>

          <h2 className="font-[var(--font-bricolage)] text-5xl leading-none sm:text-6xl">
            Explore the collection.
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-charcoal/60">
            Explore teachings, messages, books, songs,
            articles, and other resources from Olawale
            Smith Ministries.
          </p>
        </div>

        <div className="grid border-l border-t border-charcoal/15 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(
            (category, index) => {
              const Icon =
                categoryIcons[
                  index % categoryIcons.length
                ];

              return (
                <Link
                  key={category.id}
                  href={`/resources?category=${encodeURIComponent(
                    category.slug,
                  )}`}
                  className="group border-b border-r border-charcoal/15 p-7 transition-colors hover:bg-charcoal hover:text-ivory lg:p-8"
                >
                  <Icon
                    size={22}
                    strokeWidth={1.3}
                    className="mb-16 text-bronze transition-colors group-hover:text-gold"
                  />

                  <h3 className="font-[var(--font-bricolage)] text-3xl">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="mt-3 text-sm leading-6 text-charcoal/60 transition-colors group-hover:text-ivory/55">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
                    Explore →
                  </div>
                </Link>
              );
            },
          )}
        </div>
      </div>
    </Section>
  );
}