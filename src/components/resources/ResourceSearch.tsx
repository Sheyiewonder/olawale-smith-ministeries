"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResourceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const activeType = searchParams.get("type") ?? "";

  const [search, setSearch] = useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (activeType) {
      params.set("type", activeType);
    }

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    const query = params.toString();

    router.push(
      `/resources${query ? `?${query}` : ""}`,
      { scroll: false },
    );
  }

  function clearSearch() {
    setSearch("");

    const params = new URLSearchParams();

    if (activeType) {
      params.set("type", activeType);
    }

    const query = params.toString();

    router.push(
      `/resources${query ? `?${query}` : ""}`,
      { scroll: false },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative w-full">
        {/* Gold Search Icon */}
        <Search
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
          className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-gold"
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search the resource library..."
          aria-label="Search the resource library"
          className={[
            "h-14 w-full",
            "border border-charcoal/10",
            "bg-white/60",
            "pl-13 pr-12",
            "text-sm text-charcoal",
            "outline-none",
            "backdrop-blur-md",
            "transition-all",
            "placeholder:text-charcoal/35",
            "focus:border-bronze/50",
            "focus:ring-2 focus:ring-bronze/10",

            // Remove browser's native search clear button
            "[&::-webkit-search-cancel-button]:appearance-none",
            "[&::-webkit-search-decoration]:appearance-none",
          ].join(" ")}
        />

        {/* Gold Clear Button */}
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-gold transition-colors hover:text-bronze"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        )}
      </div>
    </form>
  );
}