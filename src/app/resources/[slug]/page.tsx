import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import { getResourceBySlug } from "@/lib/api";

interface ResourceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const typeLabels = {
  SERMON: "Sermon",
  EBOOK: "Ebook",
  SONG: "Song",
  VIDEO: "Video",
  PODCAST: "Podcast",
  ARTICLE: "Article",
} as const;

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const { slug } = await params;

  let resource;

  try {
    resource = await getResourceBySlug(slug);
  } catch {
    notFound();
  }

  const category =
    resource.categories[0]?.category;

  const typeLabel = typeLabels[resource.type];

  const publishedDate = resource.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(resource.publishedAt))
    : null;

  return (
    <PageLayout theme="light">
      <main className="min-h-screen pt-32">
        {/* Back navigation */}
        <section className="mx-auto w-full max-w-7xl px-6 pt-8 lg:px-8">
          <Reveal>
            <Link
              href="/resources"
              className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50 transition-colors hover:text-bronze"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Back to Resources
            </Link>
          </Reveal>
        </section>

        {/* Hero */}
        <Section
          theme="light"
          className="pt-12 sm:pt-16"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-20 lg:px-8 lg:pb-32">
            {/* Content */}
            <div>
              <Reveal>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                  {category && (
                    <>
                      <span>{category.name}</span>
                      <span className="h-1 w-1 rounded-full bg-bronze/50" />
                    </>
                  )}

                  <span>{typeLabel}</span>

                  {publishedDate && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-bronze/50" />
                      <span>{publishedDate}</span>
                    </>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="display-heading mt-6 text-5xl text-charcoal sm:text-6xl lg:text-8xl">
                  {resource.title}
                </h1>
              </Reveal>

              {resource.speaker && (
                <Reveal delay={0.14}>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                    {resource.speaker}
                  </p>
                </Reveal>
              )}

              {resource.description && (
                <Reveal delay={0.2}>
                  <p className="mt-8 max-w-2xl text-base leading-8 text-charcoal/60 sm:text-lg">
                    {resource.description}
                  </p>
                </Reveal>
              )}
            </div>

            {/* Thumbnail */}
            <Reveal delay={0.12}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-charcoal/10 bg-ivory-muted">
                {resource.thumbnail?.url ? (
                  <img
                    src={resource.thumbnail.url}
                    alt={resource.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ivory-muted to-charcoal-soft">
                    <span className="eyebrow text-bronze">
                      {typeLabel}
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </Section>

        {/* Media */}
        {resource.media.length > 0 && (
          <Section theme="dark">
            <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
              <Reveal>
                <p className="eyebrow text-gold">
                  Resource
                </p>
              </Reveal>

              <div className="mt-10 space-y-6">
                {resource.media.map((media) => (
                  <ResourceMedia
                    key={media.id}
                    media={media}
                  />
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Article / description content */}
        {resource.type === "ARTICLE" &&
          resource.description && (
            <Section theme="light">
              <div className="mx-auto w-full max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
                <Reveal>
                  <p className="text-lg leading-9 text-charcoal/70 sm:text-xl sm:leading-10">
                    {resource.description}
                  </p>
                </Reveal>
              </div>
            </Section>
          )}

        {/* Footer CTA */}
        <Section theme="dark">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-24 sm:py-32 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <Reveal>
              <div>
                <p className="eyebrow text-gold">
                  Continue Exploring
                </p>

                <h2 className="display-heading mt-5 text-4xl text-ivory sm:text-5xl lg:text-6xl">
                  More resources
                  <br />
                  <span className="text-gold">
                    await.
                  </span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Link
                href="/resources"
                className="group inline-flex w-fit items-center gap-3 border border-gold/40 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal"
              >
                Browse Library

                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
        </Section>
      </main>
    </PageLayout>
  );
}

interface ResourceMediaProps {
  media: {
    id: string;
    type: "AUDIO" | "PDF" | "IMAGE" | "VIDEO";
    provider:
      | "R2"
      | "YOUTUBE"
      | "SUPABASE"
      | "EXTERNAL";
    title?: string | null;
    url?: string | null;
    externalId?: string | null;
  };
}

function ResourceMedia({
  media,
}: ResourceMediaProps) {
  const title = media.title ?? "Resource";

  /*
   * YouTube
   *
   * We prefer externalId because it is the cleanest
   * representation of a YouTube video ID.
   */
  if (
    media.type === "VIDEO" &&
    media.provider === "YOUTUBE"
  ) {
    const videoId =
      media.externalId ??
      extractYouTubeVideoId(media.url);

    if (!videoId) {
      return null;
    }

    return (
      <div className="overflow-hidden rounded-2xl border border-ivory/10 bg-black">
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  /*
   * Hosted / external video
   */
  if (media.type === "VIDEO") {
    if (!media.url) {
      return null;
    }

    return (
      <div className="overflow-hidden rounded-2xl border border-ivory/10 bg-black">
        <video
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full"
          src={media.url}
        >
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  /*
   * Audio
   */
  if (media.type === "AUDIO") {
    if (!media.url) {
      return null;
    }

    return (
      <div className="rounded-2xl border border-ivory/10 bg-charcoal-soft p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ivory/60">
            {title}
          </p>

          {media.provider === "EXTERNAL" && (
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:text-ivory"
            >
              Open ↗
            </a>
          )}
        </div>

        <audio
          controls
          preload="metadata"
          className="w-full"
          src={media.url}
        >
          Your browser does not support audio playback.
        </audio>
      </div>
    );
  }

  /*
   * PDF
   */
  if (media.type === "PDF") {
    if (!media.url) {
      return null;
    }

    return (
      <div className="overflow-hidden rounded-2xl border border-ivory/10 bg-charcoal-soft">
        <div className="flex items-center justify-between gap-4 border-b border-ivory/10 px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ivory/60">
            {title}
          </p>

          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:text-ivory"
          >
            Open PDF ↗
          </a>
        </div>

        <iframe
          src={media.url}
          title={title}
          className="h-[70vh] min-h-[500px] w-full"
        />
      </div>
    );
  }

  /*
   * Image
   */
  if (media.type === "IMAGE") {
    if (!media.url) {
      return null;
    }

    return (
      <div className="overflow-hidden rounded-2xl border border-ivory/10 bg-charcoal-soft">
        <img
          src={media.url}
          alt={title}
          className="h-auto w-full object-cover"
        />
      </div>
    );
  }

  return null;
}

/**
 * Extract a YouTube video ID from common YouTube URL formats.
 */
function extractYouTubeVideoId(
  url?: string | null,
) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }

    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtube-nocookie.com")
    ) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1];
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}