"use client";

import type {
  AdminMedia,
} from "@/lib/admin-api";

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

  title?: string;
}

function isYouTubeUrl(
  url?: string | null,
) {
  if (!url) return false;

  try {
    const hostname =
      new URL(url).hostname.toLowerCase();

    return (
      hostname.includes("youtube.com") ||
      hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

export default function ResourceMediaPreview({
  media,
  localPreviewUrl,
  title,
}: ResourceMediaPreviewProps) {
  if (!media) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
        <div>
          <p className="text-sm font-medium">
            No media selected
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Add media to preview it here.
          </p>
        </div>
      </div>
    );
  }

  /*
   * For uploaded Cloudinary media, media.url
   * is used.
   *
   * For a local file that has not completed
   * uploading yet, localPreviewUrl is used.
   */
  const url =
    media.url ||
    localPreviewUrl ||
    "";

  /*
   * YouTube can work without a local URL.
   */
  if (
    media.provider === "YOUTUBE"
  ) {
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
        </div>
      );
    }

    return (
      <YouTubePlayer
        url={youtubeUrl}
        title={
          media.title ||
          title
        }
      />
    );
  }

  if (!url) {
    return (
      <div className="rounded-2xl border bg-muted/20 p-8 text-center">
        <p className="text-sm font-medium">
          Media URL unavailable
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          This media asset does not have
          a previewable URL.
        </p>
      </div>
    );
  }

  /* PDF */

  if (media.type === "PDF") {
    return (
      <PdfPreview src={url} />
    );
  }

  /* IMAGE */

  if (media.type === "IMAGE") {
    return (
      <ImagePreview
        src={url}
        alt={
          media.title ||
          title ||
          "Resource image"
        }
      />
    );
  }

  /* AUDIO */

  if (media.type === "AUDIO") {
    return (
      <CustomAudioPlayer
        src={url}
        title={
          media.title ||
          title
        }
      />
    );
  }

  /* VIDEO */

  if (
    media.type === "VIDEO"
  ) {
    /*
     * If this is actually a YouTube URL,
     * use the YouTube player.
     */
    if (isYouTubeUrl(url)) {
      return (
        <YouTubePlayer
          url={url}
          title={
            media.title ||
            title
          }
        />
      );
    }

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