"use client";

import type { ResourceType } from "@/lib/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

export default function ResourceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeType =
    (searchParams.get("type") as ResourceType | null) ?? undefined;

  function handleTypeChange(type?: ResourceType) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    params.delete("page");

    const query = params.toString();

    router.push(
      `${pathname}${query ? `?${query}` : ""}`,
      { scroll: false },
    );
  }

  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-2 scrollbar-none">
      {filters.map((filter) => {
        const active = activeType === filter.value;

        return (
          <button
            key={filter.label}
            type="button"
            onClick={() => handleTypeChange(filter.value)}
            className={[
              "shrink-0 border px-4 py-2.5",
              "text-[10px] font-semibold uppercase",
              "tracking-[0.14em]",
              "transition-all duration-300",
              "sm:flex-1",
              active
                ? "border-bronze bg-bronze text-ivory"
                : "border-charcoal/10 bg-white/50 text-charcoal/55",
              "hover:border-bronze/40 hover:text-bronze",
            ].join(" ")}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}