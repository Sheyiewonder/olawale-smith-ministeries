"use client";

interface YouTubePlayerProps {
  url: string;
  title?: string | null;
}

function getYouTubeId(url: string): string | null {
  const value = url.trim();

  if (!value) return null;

  // Direct YouTube ID
  if (
    /^[a-zA-Z0-9_-]{11}$/.test(value)
  ) {
    return value;
  }

  try {
    const parsed = new URL(value);

    const hostname =
      parsed.hostname.toLowerCase();

    if (
      hostname === "youtu.be"
    ) {
      return (
        parsed.pathname
          .replace("/", "")
          .split("/")[0] || null
      );
    }

    if (
      hostname.includes("youtube.com")
    ) {
      const watchId =
        parsed.searchParams.get("v");

      if (watchId) {
        return watchId;
      }

      const pathParts =
        parsed.pathname
          .split("/")
          .filter(Boolean);

      const embedIndex =
        pathParts.findIndex(
          (part) =>
            part === "embed" ||
            part === "shorts" ||
            part === "live",
        );

      if (
        embedIndex !== -1 &&
        pathParts[embedIndex + 1]
      ) {
        return pathParts[
          embedIndex + 1
        ];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function YouTubePlayer({
  url,
  title,
}: YouTubePlayerProps) {
  const videoId =
    getYouTubeId(url);

  if (!videoId) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <p className="text-sm font-medium text-red-600">
          Invalid YouTube URL
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Please provide a valid YouTube
          video URL.
        </p>
      </div>
    );
  }

  const embedUrl =
    `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <div className="overflow-hidden rounded-2xl border bg-black shadow-sm">
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          title={
            title ||
            "YouTube video preview"
          }
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {title && (
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-sm font-medium text-white">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}