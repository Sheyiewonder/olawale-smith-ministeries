"use client";

import type { ResourceType } from "@/lib/api";

interface ResourceFiltersProps {
  activeType?: ResourceType;
  onTypeChange: (type?: ResourceType) => void;
}

const filters: {
  label: string;
  value?: ResourceType;
}[] = [
  { label: "All" },
  { label: "Sermons", value: "SERMON" },
  { label: "Ebooks", value: "EBOOK" },
  { label: "Songs", value: "SONG" },
  { label: "Videos", value: "VIDEO" },
  { label: "Podcasts", value: "PODCAST" },
  { label: "Articles", value: "ARTICLE" },
];

export default function ResourceFilters({
  activeType,
  onTypeChange,
}: ResourceFiltersProps) {
  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-2 scrollbar-none">
      {filters.map((filter) => {
        const active = activeType === filter.value;

        return (
          <button
            key={filter.label}
            type="button"
            onClick={() => onTypeChange(filter.value)}
            className={[
              "shrink-0 border px-4 py-2.5",
              "text-[10px] font-semibold uppercase",
              "tracking-[0.14em]",
              "transition-all duration-300",
              active
                ? "border-bronze bg-bronze text-ivory"
                : "border-charcoal/10 bg-white/50 text-charcoal/55",
              "hover:border-bronze/40 hover:text-bronze",

              // Tablet and desktop:
              // distribute evenly across the available width.
              "sm:flex-1",
            ].join(" ")}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}