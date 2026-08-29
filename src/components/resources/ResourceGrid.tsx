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
          "rounded-3xl border p-12 text-center",
          config.page.border,
        ].join(" ")}
      >
        <p
          className={[
            "section-heading text-2xl",
            config.page.foreground,
          ].join(" ")}
        >
          No resources found.
        </p>

        <p
          className={[
            "mt-3 text-sm",
            config.page.muted,
          ].join(" ")}
        >
          Check back soon for new resources.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
        />
      ))}
    </div>
  );
}