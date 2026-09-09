"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowDownToLine,
  ArrowUpRight,
  BookOpen,
  FileText,
  Headphones,
  Loader2,
  Mic2,
  MoreHorizontal,
  Music2,
  Pause,
  Play,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAudioPlayer } from "@/components/audio/AudioPlayerProvider";
import { usePageTheme } from "@/components/theme/ThemeProvider";
import type { MediaAsset, Resource } from "@/lib/api";

import CustomAudioPlayer from "@/components/admin/resource-preview/CustomAudioPlayer";
import ImagePreview from "@/components/admin/resource-preview/ImagePreview";
// import PdfPreview from "@/components/admin/resource-preview/PdfPreview";
import YouTubePlayer from "@/components/admin/resource-preview/YouTubePlayer";

interface ResourceCardProps {
  resource: Resource;
  audioPlaylist?: Resource[];
}

const PdfPreview = dynamic(
  () => import("@/components/admin/resource-preview/PdfPreview"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[420px] items-center justify-center">
        Loading PDF viewer...
      </div>
    ),
  },
);

const typeLabels: Record<Resource["type"], string> = {
  SERMON: "Sermon",
  EBOOK: "Ebook",
  SONG: "Song",
  VIDEO: "Video",
  PODCAST: "Podcast",
  ARTICLE: "Article",
};

const typeIcons = {
  SERMON: Mic2,
  EBOOK: BookOpen,
  SONG: Music2,
  VIDEO: Video,
  PODCAST: Headphones,
  ARTICLE: FileText,
} satisfies Record<Resource["type"], typeof FileText>;

type QuickViewMode =
  | "AUDIO"
  | "PDF"
  | "VIDEO"
  | "YOUTUBE"
  | "IMAGE"
  | "ARTICLE"
  | null;

/* -------------------------------------------------------------------------- */
/* Download helpers                                                           */
/* -------------------------------------------------------------------------- */

function getDownloadFilename(
  title: string,
  mimeType?: string | null,
  url?: string | null,
) {
  const safeTitle =
    title
      .trim()
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 180) || "Resource";

  const mimeExtension: Record<string, string> = {
    "audio/mpeg": ".mp3",
    "audio/mp3": ".mp3",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "audio/ogg": ".ogg",
    "audio/mp4": ".m4a",
    "audio/aac": ".aac",
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
  };

  if (mimeType && mimeExtension[mimeType]) {
    return `${safeTitle}${mimeExtension[mimeType]}`;
  }

  try {
    if (url) {
      const pathname = new URL(url).pathname;

      const extension = pathname.match(
        /\.([a-z0-9]{2,5})(?:$|\?)/i,
      )?.[1];

      if (extension) {
        return `${safeTitle}.${extension.toLowerCase()}`;
      }
    }
  } catch {
    // Ignore malformed URLs.
  }

  return safeTitle;
}

async function downloadMedia(
  media: MediaAsset,
  title: string,
) {
  if (!media.url) {
    throw new Error("Media URL unavailable.");
  }

  const response = await fetch(media.url);

  if (!response.ok) {
    throw new Error("Unable to download this resource.");
  }

  const blob = await response.blob();

  if (!blob.size) {
    throw new Error("Downloaded resource is empty.");
  }

  const objectUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = getDownloadFilename(
    title,
    media.mimeType,
    media.url,
  );

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

/* -------------------------------------------------------------------------- */
/* Media helpers                                                              */
/* -------------------------------------------------------------------------- */

function getMedia(
  resource: Resource,
  predicate: (media: MediaAsset) => boolean,
) {
  return resource.media?.find(predicate) ?? null;
}

function getYouTubeId(media: MediaAsset | null) {
  if (!media) {
    return null;
  }

  if (media.externalId) {
    return media.externalId;
  }

  if (!media.url) {
    return null;
  }

  return (
    media.url.match(
      /(?:v=|youtu\.be\/|shorts\/|embed\/)([^?&/]+)/,
    )?.[1] ?? null
  );
}

function isYouTubeUrl(url?: string | null) {
  if (!url) {
    return false;
  }

  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com") ||
      hostname === "youtu.be" ||
      hostname.endsWith(".youtu.be")
    );
  } catch {
    return false;
  }
}

function getAudioMedia(resource: Resource) {
  return (
    resource.media?.find(
      (media) =>
        media.type === "AUDIO" &&
        Boolean(media.url),
    ) ?? null
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ResourceCard({
  resource,
  audioPlaylist = [],
}: ResourceCardProps) {
  const { config, theme } = usePageTheme();

  const {
    currentItem,
    isPlaying,
    play,
    togglePlay,
  } = useAudioPlayer();

  const [menuOpen, setMenuOpen] = useState(false);

  const [quickView, setQuickView] =
    useState<QuickViewMode>(null);

  const [downloading, setDownloading] =
    useState(false);

  const [downloadError, setDownloadError] =
    useState<string | null>(null);

  const category =
    resource.categories?.[0]?.category;

  const Icon = typeIcons[resource.type];

  /* ------------------------------------------------------------------------ */
  /* Media                                                                    */
  /* ------------------------------------------------------------------------ */

  const audioMedia = useMemo(
    () => getAudioMedia(resource),
    [resource],
  );

  const pdfMedia = useMemo(
    () =>
      getMedia(
        resource,
        (media) =>
          media.type === "PDF" &&
          Boolean(media.url),
      ),
    [resource],
  );

  const imageMedia = useMemo(
    () =>
      getMedia(
        resource,
        (media) =>
          media.type === "IMAGE" &&
          Boolean(media.url),
      ),
    [resource],
  );

  const videoMedia = useMemo(
    () =>
      getMedia(
        resource,
        (media) =>
          media.type === "VIDEO" &&
          Boolean(media.url),
      ),
    [resource],
  );

  const youtubeMedia = useMemo(
    () =>
      getMedia(
        resource,
        (media) =>
          media.provider === "YOUTUBE" &&
          media.type === "VIDEO" &&
          Boolean(
            media.url ||
              media.externalId,
          ),
      ),
    [resource],
  );

  /* ------------------------------------------------------------------------ */
  /* Current audio state                                                      */
  /* ------------------------------------------------------------------------ */

  const isCurrentAudio =
    Boolean(audioMedia?.url) &&
    currentItem?.resource.id === resource.id &&
    currentItem?.media.id === audioMedia?.id;

  /* ------------------------------------------------------------------------ */
  /* Audio playlist                                                            */
  /* ------------------------------------------------------------------------ */

  const resolvedAudioPlaylist = useMemo(() => {
    const source =
      audioPlaylist.length > 0
        ? audioPlaylist
        : [resource];

    const playableResources = source.filter(
      (item) =>
        Boolean(getAudioMedia(item)?.url),
    );

    /*
     * Make sure the resource represented by this card
     * is always available in the playlist.
     */
    if (
      audioMedia?.url &&
      !playableResources.some(
        (item) => item.id === resource.id,
      )
    ) {
      return [
        ...playableResources,
        resource,
      ];
    }

    return playableResources;
  }, [
    audioPlaylist,
    audioMedia,
    resource,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Background audio                                                         */
  /* ------------------------------------------------------------------------ */

  async function handleBackgroundPlay() {
    /*
     * IMPORTANT:
     * Use a local variable for the null check.
     *
     * TypeScript cannot always preserve the narrowing of
     * the memoized `audioMedia` value across the async
     * function boundary.
     */
    const playableAudio = getAudioMedia(resource);

    if (!playableAudio?.url) {
      return;
    }

    await play(
      resource,
      playableAudio,
      resolvedAudioPlaylist,
    );
  }

  async function handleBackgroundToggle() {
    if (!isCurrentAudio) {
      await handleBackgroundPlay();
      return;
    }

    await togglePlay();
  }

  /* ------------------------------------------------------------------------ */
  /* YouTube thumbnail                                                        */
  /* ------------------------------------------------------------------------ */

  const youtubeId =
    getYouTubeId(youtubeMedia);

  const youtubeThumbnail =
    youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : null;

  /* ------------------------------------------------------------------------ */
  /* PDF thumbnail                                                            */
  /* ------------------------------------------------------------------------ */

  const pdfThumbnail =
    pdfMedia?.thumbnailUrl ?? null;

  /* ------------------------------------------------------------------------ */
  /* Final thumbnail                                                          */
  /* ------------------------------------------------------------------------ */

  const thumbnailUrl =
    resource.thumbnail?.url ??
    youtubeThumbnail ??
    pdfThumbnail ??
    imageMedia?.url ??
    null;

  /* ------------------------------------------------------------------------ */
  /* Theme styles                                                             */
  /* ------------------------------------------------------------------------ */

  const cardImageFallback =
    theme === "dark"
      ? "from-charcoal-soft to-charcoal"
      : "from-ivory-muted to-ivory";

  const badgeBackground =
    theme === "dark"
      ? "bg-charcoal/70"
      : "bg-ivory/80";

  const menuBackground =
    theme === "dark"
      ? "bg-charcoal/95 border-ivory/10"
      : "bg-ivory/95 border-charcoal/10";

  const overlayBackground =
    theme === "dark"
      ? "bg-charcoal/70"
      : "bg-charcoal/50";

  /* ------------------------------------------------------------------------ */
  /* Available actions                                                        */
  /* ------------------------------------------------------------------------ */

  const hasFramePreview =
    Boolean(audioMedia?.url) ||
    Boolean(pdfMedia?.url) ||
    Boolean(imageMedia?.url) ||
    Boolean(videoMedia?.url) ||
    Boolean(
      youtubeMedia?.url ||
        youtubeMedia?.externalId,
    ) ||
    resource.type === "ARTICLE";

  /* ------------------------------------------------------------------------ */
  /* Menu helpers                                                             */
  /* ------------------------------------------------------------------------ */

  function closeMenu() {
    setMenuOpen(false);
  }

  function openQuickView(
    mode: QuickViewMode,
  ) {
    closeMenu();
    setDownloadError(null);
    setQuickView(mode);
  }

  function getDefaultQuickView(): QuickViewMode {
    if (audioMedia?.url) {
      return "AUDIO";
    }

    if (pdfMedia?.url) {
      return "PDF";
    }

    if (
      youtubeMedia?.url ||
      youtubeMedia?.externalId ||
      videoMedia?.url
    ) {
      return youtubeMedia
        ? "YOUTUBE"
        : "VIDEO";
    }

    if (imageMedia?.url) {
      return "IMAGE";
    }

    if (resource.type === "ARTICLE") {
      return "ARTICLE";
    }

    return null;
  }

  async function handleDownload(
    media: MediaAsset | null,
  ) {
    if (!media?.url || downloading) {
      return;
    }

    try {
      setDownloadError(null);
      setDownloading(true);

      await downloadMedia(
        media,
        resource.title,
      );
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Unable to download this resource.",
      );
    } finally {
      setDownloading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Escape + body scroll                                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!quickView) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setQuickView(null);
      }
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [quickView]);

  /* ------------------------------------------------------------------------ */
  /* Quick-view media                                                         */
  /* ------------------------------------------------------------------------ */

  function renderQuickView() {
    if (
      quickView === "AUDIO" &&
      audioMedia?.url
    ) {
      return (
        <CustomAudioPlayer
          src={audioMedia.url}
          title={resource.title}
          thumbnailUrl={
            audioMedia.thumbnailUrl ??
            thumbnailUrl ??
            null
          }
          fallbackIcon={
            <Headphones
              size={42}
              strokeWidth={1.2}
            />
          }
        />
      );
    }

    if (
      quickView === "PDF" &&
      pdfMedia?.url
    ) {
      return (
        <PdfPreview
          src={pdfMedia.url}
          title={resource.title}
          thumbnailUrl={
            pdfMedia.thumbnailUrl ?? null
          }
          pageCount={pdfMedia.pageCount}
        />
      
      );
    }

    if (quickView === "YOUTUBE") {
      const youtubeUrl =
        youtubeMedia?.url ||
        youtubeMedia?.externalId ||
        "";

      if (!youtubeUrl) {
        return null;
      }

      return (
        <YouTubePlayer
          url={youtubeUrl}
          title={resource.title}
        />
      );
    }

    if (
      quickView === "VIDEO" &&
      videoMedia?.url
    ) {
      return (
        <div className="overflow-hidden rounded-2xl border bg-black">
          <video
            controls
            autoPlay
            preload="metadata"
            src={videoMedia.url}
            className="max-h-[70vh] w-full"
          />
        </div>
      );
    }

    if (
      quickView === "IMAGE" &&
      imageMedia?.url
    ) {
      return (
        <ImagePreview
          src={imageMedia.url}
          alt={resource.title}
        />
      );
    }

    if (quickView === "ARTICLE") {
      return (
        <div
          className={[
            "max-h-[70vh] overflow-y-auto rounded-2xl",
            "border p-6 sm:p-8",
            theme === "dark"
              ? "border-ivory/10 bg-charcoal"
              : "border-charcoal/10 bg-ivory",
          ].join(" ")}
        >
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
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
                Article
              </span>
            </div>

            <h2
              className={[
                "section-heading text-2xl sm:text-3xl",
                config.page.foreground,
              ].join(" ")}
            >
              {resource.title}
            </h2>
          </div>

          {resource.description && (
            <p
              className={[
                "text-sm leading-7",
                config.page.muted,
              ].join(" ")}
            >
              {resource.description}
            </p>
          )}

          {resource.speaker && (
            <p
              className={[
                "mt-6 text-[10px] font-semibold uppercase",
                "tracking-[0.13em]",
                config.page.muted,
              ].join(" ")}
            >
              {resource.speaker}
            </p>
          )}

          <div className="mt-8">
            <Link
              href={`/resources/${resource.slug}`}
              onClick={() =>
                setQuickView(null)
              }
              className={[
                "inline-flex items-center gap-2 rounded-full",
                "border px-5 py-3 text-[10px] font-semibold",
                "uppercase tracking-[0.14em]",
                "transition-colors duration-300",
                config.page.border,
                config.page.foreground,
                config.page.accentHover,
              ].join(" ")}
            >
              Read full article
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div
        className={[
          "flex min-h-[260px] items-center justify-center",
          "rounded-2xl border p-8 text-center",
          theme === "dark"
            ? "border-ivory/10 bg-charcoal"
            : "border-charcoal/10 bg-ivory",
        ].join(" ")}
      >
        <div>
          <Icon
            size={42}
            strokeWidth={1.2}
            className={config.page.accent}
          />

          <p
            className={[
              "mt-4 text-sm font-medium",
              config.page.foreground,
            ].join(" ")}
          >
            Preview unavailable
          </p>

          <p
            className={[
              "mt-1 text-xs",
              config.page.muted,
            ].join(" ")}
          >
            Open the resource to view the
            full content.
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <article className="group relative">
        {/* ---------------------------------------------------------------- */}
        {/* Visual                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div
          className={[
            "relative aspect-[16/10] overflow-hidden rounded-xl",
            "border",
            config.page.border,
            theme === "dark"
              ? "bg-charcoal-soft"
              : "bg-ivory-muted",
          ].join(" ")}
        >
          <Link
            href={`/resources/${resource.slug}`}
            className="absolute inset-0 z-0"
            aria-label={`Open ${resource.title}`}
          >
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={resource.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className={[
                  "absolute inset-0 flex flex-col items-center justify-center",
                  "bg-gradient-to-br",
                  cardImageFallback,
                ].join(" ")}
              >
                <Icon
                  size={48}
                  strokeWidth={1.2}
                  className={config.page.accent}
                />

                <span
                  className={[
                    "mt-3",
                    "eyebrow",
                    config.page.accent,
                  ].join(" ")}
                >
                  {typeLabels[resource.type]}
                </span>
              </div>
            )}
          </Link>

          {/* -------------------------------------------------------------- */}
          {/* Type badge                                                      */}
          {/* -------------------------------------------------------------- */}

          <div className="absolute left-4 top-4 z-10">
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

          {/* -------------------------------------------------------------- */}
          {/* Audio play button                                               */}
          {/* -------------------------------------------------------------- */}

          {audioMedia?.url && (
            <div className="absolute bottom-4 left-4 z-20">
              <button
                type="button"
                aria-label={
                  isCurrentAudio && isPlaying
                    ? `Pause ${resource.title}`
                    : `Play ${resource.title}`
                }
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  void handleBackgroundToggle();
                }}
                className={[
                  "flex h-11 w-11 items-center justify-center",
                  "rounded-full border backdrop-blur-md",
                  "transition-all duration-300",
                  "hover:scale-105",
                  config.page.border,
                  badgeBackground,
                  config.page.foreground,
                ].join(" ")}
              >
                {isCurrentAudio &&
                isPlaying ? (
                  <Pause
                    size={16}
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    size={16}
                    fill="currentColor"
                  />
                )}
              </button>
            </div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* Three-dot menu                                                  */}
          {/* -------------------------------------------------------------- */}

          <div className="absolute right-4 top-4 z-20">
            <button
              type="button"
              aria-label={`More actions for ${resource.title}`}
              aria-expanded={menuOpen}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                setMenuOpen(
                  (open) => !open,
                );
              }}
              className={[
                "flex h-9 w-9 items-center justify-center",
                "rounded-full border backdrop-blur-md",
                "transition-all duration-300",
                config.page.border,
                badgeBackground,
                config.page.foreground,
                "hover:scale-105",
              ].join(" ")}
            >
              <MoreHorizontal size={17} />
            </button>

            {menuOpen && (
              <div
                className={[
                  "absolute right-0 top-11 w-52 overflow-hidden",
                  "rounded-xl border shadow-2xl backdrop-blur-xl",
                  menuBackground,
                ].join(" ")}
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {/* Open / View */}

                {hasFramePreview && (
                  <button
                    type="button"
                    onClick={() =>
                      openQuickView(
                        getDefaultQuickView(),
                      )
                    }
                    className={[
                      "flex w-full items-center gap-3",
                      "px-4 py-3 text-left",
                      "text-[10px] font-semibold uppercase",
                      "tracking-[0.12em]",
                      "transition-colors",
                      config.page.foreground,
                      theme === "dark"
                        ? "hover:bg-ivory/5"
                        : "hover:bg-charcoal/5",
                    ].join(" ")}
                  >
                    <Play size={14} />
                    Open in frame
                  </button>
                )}

                {/* Background audio */}

                {audioMedia?.url && (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();

                      void handleBackgroundToggle();
                    }}
                    className={[
                      "flex w-full items-center gap-3",
                      "px-4 py-3 text-left",
                      "text-[10px] font-semibold uppercase",
                      "tracking-[0.12em]",
                      "transition-colors",
                      config.page.foreground,
                      theme === "dark"
                        ? "hover:bg-ivory/5"
                        : "hover:bg-charcoal/5",
                    ].join(" ")}
                  >
                    {isCurrentAudio &&
                    isPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )}

                    {isCurrentAudio &&
                    isPlaying
                      ? "Pause audio"
                      : "Play in background"}
                  </button>
                )}

                {/* Full resource */}

                <Link
                  href={`/resources/${resource.slug}`}
                  onClick={closeMenu}
                  className={[
                    "flex w-full items-center gap-3",
                    "px-4 py-3 text-left",
                    "text-[10px] font-semibold uppercase",
                    "tracking-[0.12em]",
                    "transition-colors",
                    config.page.foreground,
                    theme === "dark"
                      ? "hover:bg-ivory/5"
                      : "hover:bg-charcoal/5",
                  ].join(" ")}
                >
                  <ArrowUpRight size={14} />
                  Open resource
                </Link>

                {/* Download audio */}

                {audioMedia?.url && (
                  <button
                    type="button"
                    disabled={downloading}
                    onClick={() =>
                      void handleDownload(
                        audioMedia,
                      )
                    }
                    className={[
                      "flex w-full items-center gap-3",
                      "px-4 py-3 text-left",
                      "text-[10px] font-semibold uppercase",
                      "tracking-[0.12em]",
                      "transition-colors disabled:opacity-50",
                      config.page.foreground,
                      theme === "dark"
                        ? "hover:bg-ivory/5"
                        : "hover:bg-charcoal/5",
                    ].join(" ")}
                  >
                    {downloading ? (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <ArrowDownToLine
                        size={14}
                      />
                    )}

                    Download audio
                  </button>
                )}

                {/* Download PDF */}

                {pdfMedia?.url && (
                  <button
                    type="button"
                    disabled={downloading}
                    onClick={() =>
                      void handleDownload(
                        pdfMedia,
                      )
                    }
                    className={[
                      "flex w-full items-center gap-3",
                      "px-4 py-3 text-left",
                      "text-[10px] font-semibold uppercase",
                      "tracking-[0.12em]",
                      "transition-colors disabled:opacity-50",
                      config.page.foreground,
                      theme === "dark"
                        ? "hover:bg-ivory/5"
                        : "hover:bg-charcoal/5",
                    ].join(" ")}
                  >
                    {downloading ? (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <ArrowDownToLine
                        size={14}
                      />
                    )}

                    Download PDF
                  </button>
                )}

                {/* Download image */}

                {imageMedia?.url && (
                  <button
                    type="button"
                    disabled={downloading}
                    onClick={() =>
                      void handleDownload(
                        imageMedia,
                      )
                    }
                    className={[
                      "flex w-full items-center gap-3",
                      "px-4 py-3 text-left",
                      "text-[10px] font-semibold uppercase",
                      "tracking-[0.12em]",
                      "transition-colors disabled:opacity-50",
                      config.page.foreground,
                      theme === "dark"
                        ? "hover:bg-ivory/5"
                        : "hover:bg-charcoal/5",
                    ].join(" ")}
                  >
                    {downloading ? (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <ArrowDownToLine
                        size={14}
                      />
                    )}

                    Download image
                  </button>
                )}

                {/* Download video */}

                {videoMedia?.url &&
                  !isYouTubeUrl(
                    videoMedia.url,
                  ) && (
                    <button
                      type="button"
                      disabled={downloading}
                      onClick={() =>
                        void handleDownload(
                          videoMedia,
                        )
                      }
                      className={[
                        "flex w-full items-center gap-3",
                        "px-4 py-3 text-left",
                        "text-[10px] font-semibold uppercase",
                        "tracking-[0.12em]",
                        "transition-colors disabled:opacity-50",
                        config.page.foreground,
                        theme === "dark"
                          ? "hover:bg-ivory/5"
                          : "hover:bg-charcoal/5",
                      ].join(" ")}
                    >
                      {downloading ? (
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        <ArrowDownToLine
                          size={14}
                        />
                      )}

                      Download video
                    </button>
                  )}

                {downloadError && (
                  <div
                    className={[
                      "border-t px-4 py-3 text-[10px] leading-5",
                      config.page.border,
                      config.page.muted,
                    ].join(" ")}
                  >
                    {downloadError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Content                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="pt-5">
          <Link
            href={`/resources/${resource.slug}`}
            className="block"
          >
            {/* ------------------------------------------------------------ */}
            {/* Meta                                                          */}
            {/* ------------------------------------------------------------ */}

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

            {/* ------------------------------------------------------------ */}
            {/* Title                                                         */}
            {/* ------------------------------------------------------------ */}

            <h3
              className={[
                "section-heading text-xl",
                config.page.foreground,
                "transition-colors duration-300",
                config.page.accentHover,
              ].join(" ")}
            >
              {resource.title}
            </h3>

            {/* ------------------------------------------------------------ */}
            {/* Description                                                   */}
            {/* ------------------------------------------------------------ */}

            {resource.description && (
              <p
                className={[
                  "mt-2 line-clamp-2 text-xs leading-6",
                  config.page.muted,
                ].join(" ")}
              >
                {resource.description}
              </p>
            )}

            {/* ------------------------------------------------------------ */}
            {/* Speaker                                                       */}
            {/* ------------------------------------------------------------ */}

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
          </Link>
        </div>
      </article>

      {/* ================================================================== */}
      {/* QUICK VIEW                                                         */}
      {/* ================================================================== */}

      {quickView && (
        <div
          className={[
            "fixed inset-0 z-[100]",
            "flex items-center justify-center",
            "p-4 sm:p-6",
            overlayBackground,
            "backdrop-blur-md",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${resource.title}`}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setQuickView(null);
            }
          }}
        >
          <div
            className={[
              "relative flex w-full max-w-4xl",
              "max-h-[calc(100vh-2rem)]",
              "flex-col overflow-hidden rounded-2xl",
              "border shadow-2xl",
              theme === "dark"
                ? "border-ivory/10 bg-charcoal"
                : "border-charcoal/10 bg-ivory",
            ].join(" ")}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* ------------------------------------------------------------ */}
            {/* Header                                                        */}
            {/* ------------------------------------------------------------ */}

            <div
              className={[
                "flex shrink-0 items-center justify-between",
                "border-b px-5 py-4 sm:px-6",
                config.page.border,
              ].join(" ")}
            >
              <div className="min-w-0 pr-4">
                <p
                  className={[
                    "text-[9px] font-semibold uppercase",
                    "tracking-[0.16em]",
                    config.page.accent,
                  ].join(" ")}
                >
                  {typeLabels[resource.type]}
                </p>

                <h2
                  className={[
                    "mt-1 truncate text-sm font-semibold",
                    config.page.foreground,
                  ].join(" ")}
                >
                  {resource.title}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close preview"
                onClick={() =>
                  setQuickView(null)
                }
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center",
                  "rounded-full border transition-colors",
                  config.page.border,
                  config.page.foreground,
                  theme === "dark"
                    ? "hover:bg-ivory/5"
                    : "hover:bg-charcoal/5",
                ].join(" ")}
              >
                <X size={17} />
              </button>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Preview                                                       */}
            {/* ------------------------------------------------------------ */}

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              {renderQuickView()}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Footer                                                        */}
            {/* ------------------------------------------------------------ */}

            <div
              className={[
                "flex shrink-0 flex-wrap items-center justify-between",
                "gap-3 border-t px-5 py-4 sm:px-6",
                config.page.border,
              ].join(" ")}
            >
              <p
                className={[
                  "text-[9px] uppercase tracking-[0.12em]",
                  config.page.muted,
                ].join(" ")}
              >
                Quick preview
              </p>

              <div className="flex items-center gap-2">
                {audioMedia?.url &&
                  quickView === "AUDIO" && (
                    <button
                      type="button"
                      disabled={downloading}
                      onClick={() =>
                        void handleDownload(
                          audioMedia,
                        )
                      }
                      className={[
                        "inline-flex items-center gap-2",
                        "rounded-full border px-4 py-2.5",
                        "text-[9px] font-semibold uppercase",
                        "tracking-[0.13em]",
                        "transition-colors disabled:opacity-50",
                        config.page.border,
                        config.page.foreground,
                        config.page.accentHover,
                      ].join(" ")}
                    >
                      {downloading ? (
                        <Loader2
                          size={13}
                          className="animate-spin"
                        />
                      ) : (
                        <ArrowDownToLine
                          size={13}
                        />
                      )}

                      Download
                    </button>
                  )}

                {pdfMedia?.url &&
                  quickView === "PDF" && (
                    <button
                      type="button"
                      disabled={downloading}
                      onClick={() =>
                        void handleDownload(
                          pdfMedia,
                        )
                      }
                      className={[
                        "inline-flex items-center gap-2",
                        "rounded-full border px-4 py-2.5",
                        "text-[9px] font-semibold uppercase",
                        "tracking-[0.13em]",
                        "transition-colors disabled:opacity-50",
                        config.page.border,
                        config.page.foreground,
                        config.page.accentHover,
                      ].join(" ")}
                    >
                      {downloading ? (
                        <Loader2
                          size={13}
                          className="animate-spin"
                        />
                      ) : (
                        <ArrowDownToLine
                          size={13}
                        />
                      )}

                      Download
                    </button>
                  )}

                <Link
                  href={`/resources/${resource.slug}`}
                  onClick={() =>
                    setQuickView(null)
                  }
                  className={[
                    "inline-flex items-center gap-2",
                    "rounded-full px-4 py-2.5",
                    "text-[9px] font-semibold uppercase",
                    "tracking-[0.13em]",
                    "transition-opacity hover:opacity-80",
                    config.page.accent,
                  ].join(" ")}
                >
                  Open full resource
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
