"use client";

import { useRouter, useSearchParams } from "next/navigation";

const filters = [
  { label: "All", value: "" },
  { label: "Sermons", value: "SERMON" },
  { label: "Ebooks", value: "EBOOK" },
  { label: "Songs", value: "SONG" },
  { label: "Videos", value: "VIDEO" },
  { label: "Podcasts", value: "PODCAST" },
  { label: "Articles", value: "ARTICLE" },
] as const;

export default function ResourceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeType = searchParams.get("type") ?? "";
  const currentSearch = searchParams.get("search") ?? "";

  function updateType(type: string) {
    const params = new URLSearchParams();

    if (type) {
      params.set("type", type);
    }

    const trimmedSearch = currentSearch.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    const query = params.toString();

    router.push(
      `/resources${query ? `?${query}` : ""}`,
      { scroll: false },
    );
  }

  return (
    <div className="w-full">
      <div className="flex w-full gap-2 overflow-x-auto pb-2 scrollbar-none md:overflow-visible">
        {filters.map((filter) => {
          const active = activeType === filter.value;

          return (
            <button
              key={filter.label}
              type="button"
              onClick={() => updateType(filter.value)}
              className={[
                // Mobile
                "shrink-0 border px-5 py-2.5",

                // Desktop
                "md:flex-1 md:px-3",

                "text-[10px] font-semibold uppercase",
                "tracking-[0.14em]",
                "transition-all duration-300",

                active
                  ? "border-bronze bg-bronze text-ivory"
                  : [
                      "border-charcoal/10",
                      "bg-white/50",
                      "text-charcoal/55",
                      "hover:border-bronze/40",
                      "hover:text-bronze",
                    ].join(" "),
              ].join(" ")}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}