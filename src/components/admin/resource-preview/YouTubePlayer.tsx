"use client";

interface YouTubePlayerProps {
  url: string;
  title?: string | null;
}

function getYouTubeEmbedUrl(
  url: string,
): string | null {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname === "youtu.be"
    ) {
      const id = parsed.pathname.slice(1);

      return id
        ? `https://www.youtube.com/embed/${id}`
        : null;
    }

    if (
      parsed.hostname.includes(
        "youtube.com",
      )
    ) {
      if (
        parsed.pathname ===
        "/watch"
      ) {
        const id =
          parsed.searchParams.get(
            "v",
          );

        return id
          ? `https://www.youtube.com/embed/${id}`
          : null;
      }

      if (
        parsed.pathname.startsWith(
          "/embed/",
        )
      ) {
        return url;
      }

      if (
        parsed.pathname.startsWith(
          "/shorts/",
        )
      ) {
        const id =
          parsed.pathname.split(
            "/",
          )[2];

        return id
          ? `https://www.youtube.com/embed/${id}`
          : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default function YouTubePlayer({
  url,
  title,
}: YouTubePlayerProps) {
  const embedUrl =
    getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className="rounded-2xl border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        Invalid YouTube URL.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-black shadow-sm">
      <div className="aspect-video w-full">
        <iframe
          src={embedUrl}
          title={
            title ||
            "YouTube preview"
          }
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}