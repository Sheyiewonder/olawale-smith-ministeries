"use client";

import type {
  AdminMedia,
} from "@/lib/admin-api";

import CustomAudioPlayer from "./CustomAudioPlayer";
import ImagePreview from "./ImagePreview";
import PdfPreview from "./PdfPreview";
import YouTubePlayer from "./YouTubePlayer";

interface ResourceMediaPreviewProps {
  media?: AdminMedia | null;
  title?: string;
}

function isYouTubeUrl(
  url?: string | null,
) {
  if (!url) return false;

  try {
    const hostname =
      new URL(url).hostname;

    return (
      hostname.includes(
        "youtube.com",
      ) ||
      hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

export default function ResourceMediaPreview({
  media,
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

  const url = media.url;

  if (!url) {
    return (
      <div className="rounded-2xl border bg-muted/20 p-8 text-center">
        <p className="text-sm font-medium">
          Media URL unavailable
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          This media asset does not have a
          previewable URL.
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* PDF                                                                     */
  /* ---------------------------------------------------------------------- */

  if (media.type === "PDF") {
    return (
      <PdfPreview src={url} />
    );
  }

  /* ---------------------------------------------------------------------- */
  /* IMAGE                                                                   */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* AUDIO                                                                   */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* VIDEO / YOUTUBE                                                         */
  /* ---------------------------------------------------------------------- */

  if (
    media.type === "VIDEO" ||
    media.provider === "YOUTUBE" ||
    isYouTubeUrl(url)
  ) {
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

  /* ---------------------------------------------------------------------- */
  /* Fallback                                                                */
  /* ---------------------------------------------------------------------- */

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