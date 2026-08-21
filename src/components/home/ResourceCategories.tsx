import Link from "next/link";
import {
  BookOpen,
  Headphones,
  Music2,
  Play,
  Podcast,
} from "lucide-react";

const categories = [
  {
    title: "Ebooks",
    description: "Read and download written resources.",
    href: "/resources?type=ebook",
    icon: BookOpen,
  },
  {
    title: "Sermons",
    description: "Listen to teachings and messages.",
    href: "/resources?type=sermon",
    icon: Headphones,
  },
  {
    title: "Songs",
    description: "Music and worship resources.",
    href: "/resources?type=song",
    icon: Music2,
  },
  {
    title: "Videos",
    description: "Watch teachings and ministry content.",
    href: "/resources?type=video",
    icon: Play,
  },
  {
    title: "Podcasts",
    description: "Listen to conversations and series.",
    href: "/resources?type=podcast",
    icon: Podcast,
  },
];

export default function ResourceCategories() {
  return (
    <section className="bg-ivory text-charcoal">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-bronze">
            The Library
          </p>

          <h2 className="font-[var(--font-bricolage)] text-5xl leading-none sm:text-6xl">
            Explore the collection.
          </h2>
        </div>

        <div className="grid border-l border-t border-charcoal/15 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={category.href}
                className="group border-b border-r border-charcoal/15 p-7 transition-colors hover:bg-charcoal hover:text-ivory lg:p-8"
              >
                <Icon
                  size={22}
                  strokeWidth={1.3}
                  className="mb-16 text-bronze transition-colors group-hover:text-gold"
                />

                <h3 className="font-[var(--font-bricolage)] text-3xl">
                  {category.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-charcoal/60 transition-colors group-hover:text-ivory/55">
                  {category.description}
                </p>

                <div className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
                  Explore →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}