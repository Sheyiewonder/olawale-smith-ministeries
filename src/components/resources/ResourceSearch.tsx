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

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    const trimmed = value.trim();

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    // A new search always starts from page 1.
    params.delete("page");

    const query = params.toString();

    router.push(
      `/resources${query ? `?${query}` : ""}`,
      { scroll: false },
    );
  }

  return (
    <div className="group relative">
      {/* Subtle blue atmospheric glow */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -inset-2 -z-10",
          "rounded-2xl bg-blue-soft/[0.05]",
          "opacity-0 blur-xl transition-opacity duration-500",
          "group-focus-within:opacity-100",
        ].join(" ")}
      />

      <Search
        size={18}
        strokeWidth={1.5}
        className={[
          "absolute left-5 top-1/2 z-10",
          "-translate-y-1/2",
          "text-gold",
          "transition-colors duration-300",
          "group-focus-within:text-blue-deep",
        ].join(" ")}
        aria-hidden="true"
      />

      <input
        type="search"
        value={search}
        onChange={(event) =>
          updateSearch(event.target.value)
        }
        placeholder="Search the resource library..."
        className={[
          "h-14 w-full appearance-none",
          "border border-charcoal/10",
          "bg-white/60",
          "pl-13 pr-12",
          "text-sm text-charcoal",
          "outline-none",
          "backdrop-blur-md",

          "transition-all duration-300",

          "placeholder:text-charcoal/35",

          // Focus treatment
          "focus:border-blue/[0.35]",
          "focus:ring-2 focus:ring-blue/[0.08]",

          // Slightly stronger background while active
          "focus:bg-white/75",

          // Hide native search clear button
          "[&::-webkit-search-cancel-button]:hidden",
        ].join(" ")}
      />

      {search && (
        <button
          type="button"
          onClick={() => updateSearch("")}
          aria-label="Clear search"
          className={[
            "absolute right-5 top-1/2 z-10",
            "-translate-y-1/2",
            "text-bronze",
            "transition-all duration-300",
            "hover:text-blue-deep",
            "focus-visible:text-blue-deep",
            "focus-visible:outline-none",
          ].join(" ")}
        >
          <X
            size={17}
            strokeWidth={1.5}
          />
        </button>
      )}

      {/* Fine blue focus line */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute bottom-0 left-5",
          "h-px w-0 bg-blue",
          "transition-all duration-500",
          "group-focus-within:w-10",
        ].join(" ")}
      />
    </div>
  );
}
