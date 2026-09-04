"use client";

import type { AdminMedia } from "@/lib/admin-api";
import type { ReactNode } from "react";

import CustomAudioPlayer from "./CustomAudioPlayer";
import ImagePreview from "./ImagePreview";
import PdfPreview from "./PdfPreview";
import YouTubePlayer from "./YouTubePlayer";

interface ResourceMediaPreviewProps {
  media?: (Omit<AdminMedia, "id"> & {
    id?: string;
  }) | null;

  /**
   * Temporary browser URL used while
   * editing/uploading a local file.
   */
  localPreviewUrl?: string | null;

  /**
   * Optional thumbnail for audio playback.
   *
   * This should normally be the thumbnail
   * belonging to the current audio media item.
   */
  thumbnailUrl?: string | null;

  fallbackIcon?: ReactNode;

  /**
   * Resource-level title.
   *
   * Used as the fallback title for media
   * previews and, importantly, as the PDF
   * download filename.
   */
  title?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function isYouTubeUrl(url?: string | null) {
  if (!url) return false;

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

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ResourceMediaPreview({
  media,
  localPreviewUrl,
  thumbnailUrl,
  fallbackIcon,
  title,
}: ResourceMediaPreviewProps) {
  /* ------------------------------------------------------------------------ */
  /* No media                                                                 */
  /* ------------------------------------------------------------------------ */

  if (!media) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
        <div>
          <p className="text-sm font-medium">No media selected</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Add media to preview it here.
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Resolve URL                                                              */
  /* ------------------------------------------------------------------------ */

  /*
   * Uploaded Cloudinary media uses media.url.
   *
   * Local files that have not finished uploading can temporarily
   * use localPreviewUrl.
   *
   * For YouTube media, media.url/externalId is handled separately below.
   */
  const url = media.url || localPreviewUrl || "";

  /* ------------------------------------------------------------------------ */
  /* Resolve title                                                            */
  /* ------------------------------------------------------------------------ */

  /*
   * Prefer the media item's own title.
   *
   * Fall back to the parent resource title.
   */
  const previewTitle =
    media.title?.trim() ||
    title?.trim() ||
    undefined;

  /* ------------------------------------------------------------------------ */
  /* YouTube provider                                                         */
  /* ------------------------------------------------------------------------ */

  if (media.provider === "YOUTUBE") {
    const youtubeUrl =
      media.url ||
      media.externalId ||
      "";

    if (!youtubeUrl) {
      return (
        <div className="rounded-2xl border bg-muted/20 p-8 text-center">
          <p className="text-sm font-medium">
            YouTube URL unavailable
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            This video does not have a valid YouTube URL.
          </p>
        </div>
      );
    }

    return (
      <YouTubePlayer
        url={youtubeUrl}
        title={previewTitle}
      />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Missing URL                                                              */
  /* ------------------------------------------------------------------------ */

  if (!url) {
    return (
      <div className="rounded-2xl border bg-muted/20 p-8 text-center">
        <p className="text-sm font-medium">
          Media URL unavailable
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          This media asset does not have a previewable URL.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* PDF                                                                      */
  /* ------------------------------------------------------------------------ */

  if (media.type === "PDF") {
    /*
     * PDF thumbnails are stored directly on the MediaAsset as
     * media.thumbnailUrl.
     *
     * This is intentionally separate from the audio thumbnail
     * prop because every PDF can have its own Cloudinary-generated
     * first-page thumbnail.
     *
     * PdfPreview will:
     * 1. Show the Cloudinary thumbnail when available.
     * 2. Fall back to the browser PDF viewer when unavailable.
     * 3. Use the resource title for the downloaded filename.
     */
    return (
      <PdfPreview
        src={url}
        title={previewTitle}
        thumbnailUrl={media.thumbnailUrl ?? null}
      />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* IMAGE                                                                    */
  /* ------------------------------------------------------------------------ */

  if (media.type === "IMAGE") {
    return (
      <ImagePreview
        src={url}
        alt={previewTitle || "Resource image"}
      />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* AUDIO                                                                    */
  /* ------------------------------------------------------------------------ */

  if (media.type === "AUDIO") {
    /*
     * Priority:
     * 1. Explicit thumbnail passed by the parent.
     * 2. Thumbnail belonging to this media asset.
     * 3. null -> CustomAudioPlayer uses its fallback UI.
     */
    const audioThumbnail =
      thumbnailUrl ||
      media.thumbnailUrl ||
      null;

    return (
      <CustomAudioPlayer
        src={url}
        thumbnailUrl={audioThumbnail}
        fallbackIcon={fallbackIcon}
        title={previewTitle}
      />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* VIDEO                                                                    */
  /* ------------------------------------------------------------------------ */

  if (media.type === "VIDEO") {
    /*
     * Videos are normally YouTube/external videos.
     *
     * If a video media item contains a YouTube URL even though
     * its provider is not explicitly YOUTUBE, still render it
     * through the YouTube player.
     */
    if (isYouTubeUrl(url)) {
      return (
        <YouTubePlayer
          url={url}
          title={previewTitle}
        />
      );
    }

    /*
     * Keep support for direct video URLs as a fallback.
     */
    return (
      <div className="overflow-hidden rounded-2xl border bg-black shadow-sm">
        <video
          controls
          preload="metadata"
          src={url}
          className="max-h-[620px] w-full"
        />
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Fallback                                                                 */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="rounded-2xl border bg-muted/20 p-8 text-center">
      <p className="text-sm font-medium">
        Preview unavailable
      </p>

      <p className="mt-1 break-all text-xs text-muted-foreground">
        {url}
      </p>
    </div>
  );
}
