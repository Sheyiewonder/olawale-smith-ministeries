"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResourceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  function updateSearch(value: string) {
    setSearch(value);

    const params = new URLSearchParams(searchParams.toString());

    const trimmed = value.trim();

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    // New search should start from page 1.
    params.delete("page");

    const query = params.toString();

    router.push(
      `/resources${query ? `?${query}` : ""}`,
      { scroll: false },
    );
  }

  return (
    <div className="relative">
      <Search
        size={18}
        strokeWidth={1.5}
        className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-gold"
        aria-hidden="true"
      />

      <input
        type="search"
        value={search}
        onChange={(event) =>
          updateSearch(event.target.value)
        }
        placeholder="Search the resource library..."
        className="h-14 w-full appearance-none border border-charcoal/10 bg-white/60 pl-13 pr-12 text-sm text-charcoal outline-none backdrop-blur-md transition-all placeholder:text-charcoal/35 focus:border-bronze/50 focus:ring-2 focus:ring-bronze/10 [&::-webkit-search-cancel-button]:hidden"
      />

      {search && (
        <button
          type="button"
          onClick={() => updateSearch("")}
          aria-label="Clear search"
          className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-bronze transition-colors hover:text-charcoal"
        >
          <X size={17} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}