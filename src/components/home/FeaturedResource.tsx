"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Section from "@/components/layout/Section";
import { getResources, type Resource } from "@/lib/api";

export default function FeaturedResource() {
const [resources, setResources] = useState<Resource[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
let mounted = true;


async function loadFeaturedResources() {
  try {
    const response = await getResources({
      page: 1,
      limit: 3,
      featured: true,
    });

    if (mounted) {
      setResources(response.data ?? []);
    }
  } catch (error) {
    console.error("Failed to load featured resources:", error);

    if (mounted) {
      setResources([]);
    }
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
}

loadFeaturedResources();

return () => {
  mounted = false;
};


}, []);

const getResourceThumbnail = (resource: Resource) => {
const media = resource.media ?? [];


// Prefer an explicitly supplied image media item.
const image = media.find(
  (item) => item.type === "IMAGE" && Boolean(item.url),
);

if (image?.url) {
  return image.url;
}

// YouTube resources should use the YouTube thumbnail.
const youtube = media.find(
  (item) =>
    item.provider === "YOUTUBE" &&
    Boolean(item.externalId),
);

if (youtube?.externalId) {
  return `https://img.youtube.com/vi/${youtube.externalId}/maxresdefault.jpg`;
}

// Audio resources use their uploaded thumbnail.
const audio = media.find(
  (item) =>
    item.type === "AUDIO" &&
    Boolean(item.url),
);

if (audio?.thumbnailUrl) {
  return audio.thumbnailUrl;
}

return null;


};

const formatType = (type: Resource["type"]) => {
switch (type) {
case "SERMON":
return "Sermon";
case "EBOOK":
return "Ebook";
case "SONG":
return "Song";
case "VIDEO":
return "Video";
case "PODCAST":
return "Podcast";
case "ARTICLE":
return "Article";
default:
return "Resource";
}
};

return ( <Section
   theme="dark"
   className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
 >
{/* Atmospheric background */} <div className="pointer-events-none absolute inset-0 overflow-hidden"> <div className="absolute right-[-8%] top-[12%] h-[520px] w-[520px] rounded-full bg-blue/10 blur-[140px]" />


    <div className="absolute bottom-[-18%] left-[-12%] h-[460px] w-[460px] rounded-full bg-blue-soft/8 blur-[130px]" />

    <div className="absolute left-[18%] top-[28%] h-[320px] w-[320px] rounded-full bg-gold/7 blur-[110px]" />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(59,130,208,0.10),transparent_34%)]" />

    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-deep/15 to-transparent" />

    <div className="absolute right-0 top-1/2 h-px w-[35%] bg-gradient-to-r from-transparent via-blue-soft/20 to-transparent" />
  </div>

  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
    <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20">
      {/* Section introduction */}
      <div className="lg:sticky lg:top-32">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-12 bg-gold" />

          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            Featured Resource
          </span>
        </div>

        <h2 className="font-[var(--font-bricolage)] text-5xl leading-[0.94] text-ivory sm:text-6xl lg:text-[5.5rem]">
          Latest Resources
          <br />
          from the
          <br />
          <span className="relative inline-block text-gold">
            Collection
            <span className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-gold via-blue-soft to-transparent opacity-70" />
          </span>
        </h2>

        <p className="mt-8 max-w-lg text-base leading-8 text-ivory/60">
          Recent messages, books, music and conversations from
          Pastor Olawale Smith — created to strengthen your faith,
          deepen your understanding and inspire Kingdom impact.
        </p>

        <Link
          href="/resources"
          className="group mt-9 inline-flex min-w-[170px] items-center justify-center border border-gold/60 bg-transparent px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-gold transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-charcoal"
        >
          <span>See more</span>

          <span className="ml-3 h-px w-0 bg-charcoal transition-all duration-300 group-hover:w-5" />
        </Link>
      </div>

      {/* Featured resources */}
      <div className="grid gap-5 sm:grid-cols-2">
        {loading ? (
          <>
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className={[
                  "animate-pulse overflow-hidden border border-white/10",
                  "bg-charcoal-soft",
                  item === 0 ? "sm:col-span-2" : "",
                ].join(" ")}
              >
                <div
                  className={[
                    "bg-white/[0.04]",
                    item === 0
                      ? "aspect-[16/8]"
                      : "aspect-[4/5]",
                  ].join(" ")}
                />

                <div className="space-y-3 p-6">
                  <div className="h-2.5 w-20 bg-white/[0.06]" />
                  <div className="h-6 w-4/5 bg-white/[0.06]" />
                  <div className="h-3 w-full bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </>
        ) : resources.length ? (
          resources.map((resource, index) => {
            const thumbnail = getResourceThumbnail(resource);

            return (
              <Link
                key={resource.id}
                href={`/resources/${resource.slug}`}
                className={[
                  "group relative block overflow-hidden border border-white/10",
                  "bg-charcoal-soft transition-all duration-500",
                  "hover:-translate-y-1 hover:border-blue-soft/30",
                  "hover:shadow-[0_24px_70px_rgba(36,90,150,0.16)]",
                  index === 0 ? "sm:col-span-2" : "",
                ].join(" ")}
              >
                {/* Image / artwork */}
                <div
                  className={[
                    "relative overflow-hidden",
                    index === 0
                      ? "aspect-[16/8]"
                      : "aspect-[4/5]",
                  ].join(" ")}
                >
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={resource.title}
                      fill
                      sizes={
                        index === 0
                          ? "(max-width: 640px) 100vw, 70vw"
                          : "(max-width: 640px) 100vw, 35vw"
                      }
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-deep/30 via-charcoal-soft to-gold/10">
                      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-blue-soft/10 transition-transform duration-700 group-hover:scale-110" />

                      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full border border-gold/10" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-blue-soft/15">
                          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-ivory/25">
                            Resource
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cinematic overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/15 to-transparent opacity-90" />

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-deep/15 via-transparent to-gold/10 mix-blend-screen" />

                  {/* Hover wash */}
                  <div className="absolute inset-0 bg-blue/0 transition-colors duration-500 group-hover:bg-blue/[0.08]" />

                  {/* Inner architectural frame */}
                  <div className="absolute inset-4 border border-white/10 transition-colors duration-500 group-hover:border-blue-soft/25" />

                  {/* Type */}
                  <div className="absolute left-7 top-7">
                    <span className="border border-white/15 bg-charcoal/40 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-ivory/75 backdrop-blur-md">
                      {formatType(resource.type)}
                    </span>
                  </div>

                  {/* Bottom resource information */}
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="h-px w-8 bg-gold" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold">
                        Featured
                      </span>
                    </div>

                    <h3
                      className={[
                        "font-[var(--font-bricolage)] font-medium leading-[1.02] text-ivory",
                        index === 0
                          ? "text-3xl sm:text-4xl lg:text-5xl"
                          : "text-2xl",
                      ].join(" ")}
                    >
                      {resource.title}
                    </h3>

                    {resource.description && (
                      <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-ivory/55">
                        {resource.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-ivory/35">
                        Olawale Smith Ministries
                      </span>

                      <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-soft transition-colors duration-300 group-hover:text-gold">
                        Explore
                        <span className="h-px w-5 bg-blue-soft transition-all duration-300 group-hover:w-8 group-hover:bg-gold" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="sm:col-span-2 border border-white/10 bg-charcoal-soft p-10">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gold" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                Coming soon
              </span>
            </div>

            <p className="mt-5 max-w-lg text-sm leading-7 text-ivory/45">
              New featured resources will appear here as they are
              published.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
</Section>


);
}
