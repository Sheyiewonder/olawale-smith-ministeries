"use client";

import ResourceCard from "./ResourceCard";
import { usePageTheme } from "@/components/theme/ThemeProvider";
import type { Resource } from "@/lib/api";

interface ResourceGridProps {
  resources: Resource[];
}

export default function ResourceGrid({
  resources,
}: ResourceGridProps) {
  const { config } = usePageTheme();

  if (!resources.length) {
    return (
      <div
        className={[
          "rounded-3xl border p-10 text-center sm:p-12",
          config.page.border,
        ].join(" ")}
      >
        <p
          className={[
            "section-heading text-xl sm:text-2xl",
            config.page.foreground,
          ].join(" ")}
        >
          No resources found.
        </p>

        <p
          className={[
            "mt-2.5 text-xs sm:mt-3 sm:text-sm",
            config.page.muted,
          ].join(" ")}
        >
          Check back soon for new resources.
        </p>
      </div>
    );
  }

  /**
   * Build the playlist once for the entire resource grid.
   *
   * Only resources with an actual AUDIO media URL are included.
   * This playlist is passed to every ResourceCard so the global
   * AudioPlayerProvider can handle previous/next navigation.
   */
  const audioPlaylist = resources.filter((resource) =>
    resource.media?.some(
      (media) =>
        media.type === "AUDIO" &&
        Boolean(media.url),
    ),
  );

  return (
    <div
      className={[
        "grid",
        "grid-cols-2",
        "gap-x-4 gap-y-8",
        "sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9",
        "md:grid-cols-4",
        "lg:grid-cols-5 lg:gap-x-6 lg:gap-y-10",
      ].join(" ")}
    >
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          audioPlaylist={audioPlaylist}
        />
      ))}
    </div>
  );
}
