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
import YouTubePlayer from "@/components/admin/resource-preview/YouTubePlayer";

const PdfPreview = dynamic(
() => import("@/components/admin/resource-preview/PdfPreview"),
{
ssr: false,
loading: () => ( <div className="flex min-h-[420px] items-center justify-center"> <div className="flex items-center gap-3 text-xs text-charcoal/45"> <Loader2 size={15} className="animate-spin" />
Loading PDF viewer... </div> </div>
),
},
);

interface ResourceCardProps {
resource: Resource;
audioPlaylist?: Resource[];
}

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
.replace(/[<>:"/\|?*\x00-\x1F]/g, "")
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
    /(?:v=|youtu\.be\/|shorts\/|embed\/)([^?&/]+)/
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
/* Audio state                                                              */
/* ------------------------------------------------------------------------ */

const isCurrentAudio =
Boolean(audioMedia?.url) &&
currentItem?.resource.id === resource.id &&
currentItem?.media.id === audioMedia?.id;

/* ------------------------------------------------------------------------ */
/* Audio playlist                                                           */
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
const playableAudio =
getAudioMedia(resource);


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
/* Thumbnail sources                                                        */
/* ------------------------------------------------------------------------ */

const youtubeId =
getYouTubeId(youtubeMedia);

const youtubeThumbnail =
youtubeId
? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
: null;

const pdfThumbnail =
pdfMedia?.thumbnailUrl ?? null;

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
? "from-charcoal-soft via-charcoal to-blue-deep"
: "from-ivory-muted via-ivory to-blue-pale";

const badgeBackground =
theme === "dark"
? "bg-charcoal/[0.72]"
: "bg-ivory/[0.88]";

const menuBackground =
theme === "dark"
? "bg-charcoal/[0.97] border-ivory/10"
: "bg-ivory/[0.97] border-charcoal/10";

const overlayBackground =
theme === "dark"
? "bg-charcoal/[0.78]"
: "bg-charcoal/[0.55]";

const subtleHover =
theme === "dark"
? "hover:bg-ivory/[0.05]"
: "hover:bg-charcoal/[0.045]";

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
/* Quick view                                                               */
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
fallbackIcon={ <Headphones
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
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
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
        "max-h-[70vh] overflow-y-auto",
        "rounded-lg border p-5 sm:p-8",
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
                "text-[8px] font-semibold uppercase",
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
              "text-[8px] uppercase tracking-[0.12em]",
              config.page.muted,
            ].join(" ")}
          >
            Article
          </span>
        </div>

        <h2
          className={[
            "section-heading text-xl sm:text-3xl",
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
            "mt-5 text-[9px] font-semibold uppercase",
            "tracking-[0.13em]",
            config.page.muted,
          ].join(" ")}
        >
          {resource.speaker}
        </p>
      )}

      <div className="mt-7">
        <Link
          href={`/resources/${resource.slug}`}
          onClick={() =>
            setQuickView(null)
          }
          className={[
            "group inline-flex items-center gap-2.5",
            "border-b pb-1.5",
            "text-[9px] font-semibold uppercase",
            "tracking-[0.14em]",
            config.page.foreground,
            config.page.border,
          ].join(" ")}
        >
          <span>Read full article</span>

          <ArrowUpRight
            size={13}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}

return (
  <div
    className={[
      "flex min-h-[260px] items-center justify-center",
      "rounded-lg border p-8 text-center",
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
<> <article className="group relative min-w-0">
{/* ================================================================== */}
{/* COMPACT MEDIA TILE                                                  */}
{/* ================================================================== */}


    <div
      className={[
        "relative aspect-square w-full",
        "overflow-hidden rounded-md sm:rounded-lg",
        "border",
        config.page.border,
        theme === "dark"
          ? "bg-charcoal-soft"
          : "bg-ivory-muted",
      ].join(" ")}
    >
      {/* Thumbnail / fallback */}

      <Link
        href={`/resources/${resource.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`Open ${resource.title}`}
      >
        {thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              alt={resource.title}
              loading="lazy"
              className={[
                "h-full w-full object-cover",
                "transition-transform duration-700",
                "group-hover:scale-[1.035]",
              ].join(" ")}
            />

            <div
              aria-hidden="true"
              className={[
                "absolute inset-0",
                theme === "dark"
                  ? "bg-gradient-to-t from-charcoal/[0.72] via-transparent to-charcoal/[0.08]"
                  : "bg-gradient-to-t from-charcoal/[0.38] via-transparent to-transparent",
              ].join(" ")}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-blue-deep/[0.10] via-transparent to-gold/[0.06] mix-blend-multiply"
            />
          </>
        ) : (
          <div
            className={[
              "absolute inset-0 flex flex-col items-center justify-center",
              "bg-gradient-to-br",
              cardImageFallback,
            ].join(" ")}
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-blue-soft/10 sm:-right-12 sm:-top-12 sm:h-36 sm:w-36"
            />

            <div
              aria-hidden="true"
              className="absolute -right-3 -top-3 h-20 w-20 rounded-full border border-gold/10 sm:-right-4 sm:-top-4 sm:h-24 sm:w-24"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full border border-blue-soft/[0.08] sm:-bottom-16 sm:-left-10 sm:h-36 sm:w-36"
            />

            <div
              aria-hidden="true"
              className={[
                "relative flex h-9 w-9 items-center justify-center",
                "rounded-full border sm:h-11 sm:w-11",
                theme === "dark"
                  ? "border-blue-soft/20 bg-charcoal/[0.28]"
                  : "border-blue-deep/15 bg-ivory/[0.35]",
              ].join(" ")}
            >
              <Icon
                size={17}
                strokeWidth={1.2}
                className="sm:hidden"
              />

              <Icon
                size={20}
                strokeWidth={1.2}
                className={[
                  "hidden sm:block",
                  config.page.accent,
                ].join(" ")}
              />
            </div>

            <span
              className={[
                "relative mt-2 text-[7px] font-semibold uppercase",
                "tracking-[0.2em] sm:mt-2.5 sm:text-[8px] sm:tracking-[0.24em]",
                config.page.accent,
              ].join(" ")}
            >
              {typeLabels[resource.type]}
            </span>
          </div>
        )}
      </Link>

      {/* ================================================================= */}
      {/* TYPE BADGE                                                         */}
      {/* ================================================================= */}

      <div className="absolute left-2 top-2 z-10 sm:left-2.5 sm:top-2.5">
        <span
          className={[
            "inline-flex items-center gap-1",
            "rounded-full border px-1.5 py-0.5",
            "text-[6px] font-semibold uppercase",
            "tracking-[0.1em] backdrop-blur-md",
            "sm:gap-1.5 sm:px-2 sm:py-0.5 sm:text-[7px]",
            config.page.border,
            badgeBackground,
            config.page.foreground,
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1",
              theme === "dark"
                ? "bg-gold"
                : "bg-bronze",
            ].join(" ")}
          />

          {typeLabels[resource.type]}
        </span>
      </div>

      {/* ================================================================= */}
      {/* AUDIO CONTROL                                                      */}
      {/* ================================================================= */}

      {audioMedia?.url && (
        <div className="absolute bottom-2 left-2 z-20 sm:bottom-2.5 sm:left-2.5">
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
              "flex h-7 w-7 items-center justify-center",
              "rounded-full border backdrop-blur-md",
              "transition-all duration-300",
              "hover:scale-105",
              "sm:h-8 sm:w-8",
              config.page.border,
              badgeBackground,
              config.page.foreground,
              isCurrentAudio && isPlaying
                ? "border-gold/60 bg-gold text-charcoal"
                : "",
            ].join(" ")}
          >
            {isCurrentAudio &&
            isPlaying ? (
              <Pause
                size={10}
                fill="currentColor"
              />
            ) : (
              <Play
                size={10}
                fill="currentColor"
              />
            )}
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* THREE-DOT MENU                                                     */}
      {/* ================================================================= */}

      <div className="absolute right-2 top-2 z-30 sm:right-2.5 sm:top-2.5">
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
            "flex h-7 w-7 items-center justify-center",
            "rounded-full border backdrop-blur-md",
            "transition-all duration-300",
            "hover:scale-105",
            "sm:h-8 sm:w-8",
            config.page.border,
            badgeBackground,
            config.page.foreground,
          ].join(" ")}
        >
          <MoreHorizontal size={13} />
        </button>

        {menuOpen && (
          <div
            className={[
              "absolute right-0 top-8 z-50 w-48",
              "overflow-hidden rounded-lg border",
              "shadow-2xl backdrop-blur-xl",
              "sm:top-9 sm:w-52",
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
                  "flex w-full items-center gap-2.5",
                  "px-3 py-2.5 text-left",
                  "text-[8px] font-semibold uppercase",
                  "tracking-[0.1em]",
                  "transition-colors",
                  config.page.foreground,
                  subtleHover,
                ].join(" ")}
              >
                <Play size={12} />
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
                  "flex w-full items-center gap-2.5",
                  "px-3 py-2.5 text-left",
                  "text-[8px] font-semibold uppercase",
                  "tracking-[0.1em]",
                  "transition-colors",
                  config.page.foreground,
                  subtleHover,
                ].join(" ")}
              >
                {isCurrentAudio &&
                isPlaying ? (
                  <Pause size={12} />
                ) : (
                  <Play size={12} />
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
                "flex w-full items-center gap-2.5",
                "px-3 py-2.5 text-left",
                "text-[8px] font-semibold uppercase",
                "tracking-[0.1em]",
                "transition-colors",
                config.page.foreground,
                subtleHover,
              ].join(" ")}
            >
              <ArrowUpRight size={12} />
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
                  "flex w-full items-center gap-2.5",
                  "px-3 py-2.5 text-left",
                  "text-[8px] font-semibold uppercase",
                  "tracking-[0.1em]",
                  "transition-colors disabled:opacity-50",
                  config.page.foreground,
                  subtleHover,
                ].join(" ")}
              >
                {downloading ? (
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                ) : (
                  <ArrowDownToLine size={12} />
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
                  "flex w-full items-center gap-2.5",
                  "px-3 py-2.5 text-left",
                  "text-[8px] font-semibold uppercase",
                  "tracking-[0.1em]",
                  "transition-colors disabled:opacity-50",
                  config.page.foreground,
                  subtleHover,
                ].join(" ")}
              >
                {downloading ? (
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                ) : (
                  <ArrowDownToLine size={12} />
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
                  "flex w-full items-center gap-2.5",
                  "px-3 py-2.5 text-left",
                  "text-[8px] font-semibold uppercase",
                  "tracking-[0.1em]",
                  "transition-colors disabled:opacity-50",
                  config.page.foreground,
                  subtleHover,
                ].join(" ")}
              >
                {downloading ? (
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                ) : (
                  <ArrowDownToLine size={12} />
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
                    "flex w-full items-center gap-2.5",
                    "px-3 py-2.5 text-left",
                    "text-[8px] font-semibold uppercase",
                    "tracking-[0.1em]",
                    "transition-colors disabled:opacity-50",
                    config.page.foreground,
                    subtleHover,
                  ].join(" ")}
                >
                  {downloading ? (
                    <Loader2
                      size={12}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowDownToLine size={12} />
                  )}

                  Download video
                </button>
              )}

            {/* Download error */}

            {downloadError && (
              <div
                className={[
                  "border-t px-3 py-2",
                  "text-[8px] leading-4",
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

      {/* ================================================================= */}
      {/* Bottom image metadata                                              */}
      {/* ================================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between p-2"
      >
        <span className="max-w-[70%] truncate text-[6px] font-semibold uppercase tracking-[0.16em] text-white/[0.5] sm:text-[7px] sm:tracking-[0.2em]">
          Olawale Smith Ministries
        </span>

        <span className="h-px w-4 bg-gradient-to-r from-gold to-blue-soft opacity-70 sm:w-6" />
      </div>
    </div>

    {/* ================================================================== */}
    {/* COMPACT CONTENT                                                      */}
    {/* ================================================================== */}

    <div className="pt-2 sm:pt-2.5">
      <Link
        href={`/resources/${resource.slug}`}
        className="block"
      >
        {/* Meta */}

        <div className="mb-1 flex items-center gap-1">
          {category && (
            <span
              className={[
                "max-w-[65%] truncate text-[6px] font-semibold uppercase",
                "tracking-[0.11em] sm:text-[7px] sm:tracking-[0.13em]",
                config.page.accent,
              ].join(" ")}
            >
              {category.name}
            </span>
          )}

          {category && (
            <span
              aria-hidden="true"
              className={[
                "h-0.5 w-0.5 shrink-0 rounded-full",
                theme === "dark"
                  ? "bg-gold/50"
                  : "bg-bronze/50",
              ].join(" ")}
            />
          )}

          <span
            className={[
              "shrink-0 text-[6px] uppercase tracking-[0.08em]",
              "sm:text-[7px] sm:tracking-[0.1em]",
              config.page.muted,
            ].join(" ")}
          >
            {typeLabels[resource.type]}
          </span>
        </div>

        {/* Title */}

        <h3
          className={[
            "section-heading text-sm leading-[1.08] sm:text-base sm:leading-[1.1]",
            "line-clamp-2",
            config.page.foreground,
            "transition-colors duration-300",
            config.page.accentHover,
          ].join(" ")}
        >
          {resource.title}
        </h3>

        {/* Description */}

        {resource.description && (
          <p
            className={[
              "mt-1 line-clamp-2 text-[9px] leading-4",
              "sm:text-[10px] sm:leading-4.5",
              config.page.muted,
            ].join(" ")}
          >
            {resource.description}
          </p>
        )}

        {/* Speaker */}

        {resource.speaker && (
          <p
            className={[
              "mt-1.5 truncate text-[7px] font-semibold uppercase",
              "tracking-[0.1em] sm:text-[8px] sm:tracking-[0.11em]",
              config.page.muted,
            ].join(" ")}
          >
            {resource.speaker}
          </p>
        )}
      </Link>
    </div>
  </article>

  {/* ==================================================================== */}
  {/* QUICK VIEW                                                           */}
  {/* ==================================================================== */}

  {quickView && (
    <div
      className={[
        "fixed inset-0 z-[100]",
        "flex items-center justify-center",
        "p-3 sm:p-6",
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
          "max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)]",
          "flex-col overflow-hidden rounded-xl",
          "border shadow-2xl",
          theme === "dark"
            ? "border-ivory/10 bg-charcoal"
            : "border-charcoal/10 bg-ivory",
        ].join(" ")}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}

        <div
          className={[
            "relative flex shrink-0 items-center justify-between",
            "border-b px-4 py-3.5 sm:px-6 sm:py-4",
            config.page.border,
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-px w-24 bg-gradient-to-r from-gold via-blue-soft to-transparent sm:w-32"
          />

          <div className="min-w-0 pr-3 sm:pr-4">
            <p
              className={[
                "text-[8px] font-semibold uppercase",
                "tracking-[0.15em] sm:text-[9px] sm:tracking-[0.16em]",
                config.page.accent,
              ].join(" ")}
            >
              {typeLabels[resource.type]}
            </p>

            <h2
              className={[
                "mt-0.5 truncate text-xs font-semibold sm:mt-1 sm:text-sm",
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
              "flex h-8 w-8 shrink-0 items-center justify-center",
              "rounded-full border transition-colors",
              "sm:h-9 sm:w-9",
              config.page.border,
              config.page.foreground,
              subtleHover,
            ].join(" ")}
          >
            <X
              size={15}
              className="sm:hidden"
            />

            <X
              size={17}
              className="hidden sm:block"
            />
          </button>
        </div>

        {/* Preview */}

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
          {renderQuickView()}
        </div>

        {/* Footer */}

        <div
          className={[
            "flex shrink-0 flex-wrap items-center justify-between",
            "gap-2.5 border-t px-4 py-3.5 sm:gap-3 sm:px-6 sm:py-4",
            config.page.border,
          ].join(" ")}
        >
          <p
            className={[
              "text-[8px] uppercase tracking-[0.1em]",
              "sm:text-[9px] sm:tracking-[0.12em]",
              config.page.muted,
            ].join(" ")}
          >
            Quick preview
          </p>

          <div className="flex items-center gap-1.5 sm:gap-2">
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
                    "inline-flex items-center gap-1.5",
                    "rounded-full border px-3 py-2",
                    "text-[8px] font-semibold uppercase",
                    "tracking-[0.11em]",
                    "transition-colors disabled:opacity-50",
                    "sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[9px] sm:tracking-[0.13em]",
                    config.page.border,
                    config.page.foreground,
                    config.page.accentHover,
                  ].join(" ")}
                >
                  {downloading ? (
                    <Loader2
                      size={12}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowDownToLine
                      size={12}
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
                    "inline-flex items-center gap-1.5",
                    "rounded-full border px-3 py-2",
                    "text-[8px] font-semibold uppercase",
                    "tracking-[0.11em]",
                    "transition-colors disabled:opacity-50",
                    "sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[9px] sm:tracking-[0.13em]",
                    config.page.border,
                    config.page.foreground,
                    config.page.accentHover,
                  ].join(" ")}
                >
                  {downloading ? (
                    <Loader2
                      size={12}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowDownToLine
                      size={12}
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
                "group inline-flex items-center gap-1.5",
                "rounded-full px-3 py-2",
                "text-[8px] font-semibold uppercase",
                "tracking-[0.11em]",
                "sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[9px] sm:tracking-[0.13em]",
                config.page.accent,
                "transition-opacity hover:opacity-75",
              ].join(" ")}
            >
              Open full resource

              <ArrowUpRight
                size={12}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )}
</>


);
}
