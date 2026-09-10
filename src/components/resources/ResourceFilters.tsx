"use client";

import { useEffect, useState } from "react";
import type {
  Category,
  ResourceType,
} from "@/lib/api";
import { getCategories } from "@/lib/api";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const filters: {
  label: string;
  value?: ResourceType;
}[] = [
  {
    label: "All",
  },
  {
    label: "Sermons",
    value: "SERMON",
  },
  {
    label: "Ebooks",
    value: "EBOOK",
  },
  {
    label: "Songs",
    value: "SONG",
  },
  {
    label: "Videos",
    value: "VIDEO",
  },
  {
    label: "Podcasts",
    value: "PODCAST",
  },
  {
    label: "Articles",
    value: "ARTICLE",
  },
];

export default function ResourceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const activeType =
    (searchParams.get("type") as
      | ResourceType
      | null) ?? undefined;

  const activeCategory =
    searchParams.get("category") ??
    undefined;

  /* ------------------------------------------------------------------------ */
  /* Load Categories                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (mounted) {
          setCategories(data);
        }
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error,
        );
      } finally {
        if (mounted) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Type Filter                                                              */
  /* ------------------------------------------------------------------------ */

  function handleTypeChange(
    type?: ResourceType,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    // Changing filters always starts from page 1.
    params.delete("page");

    const query = params.toString();

    router.push(
      `${pathname}${
        query ? `?${query}` : ""
      }`,
      {
        scroll: false,
      },
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Category Filter                                                          */
  /* ------------------------------------------------------------------------ */

  function handleCategoryChange(
    category?: string,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    // Changing filters always starts from page 1.
    params.delete("page");

    const query = params.toString();

    router.push(
      `${pathname}${
        query ? `?${query}` : ""
      }`,
      {
        scroll: false,
      },
    );
  }

  return (
    <div className="relative space-y-4">
      {/* ------------------------------------------------------------------ */}
      {/* Resource Type Filters                                              */}
      {/* ------------------------------------------------------------------ */}

      <div
        className={[
          "flex w-full gap-2 overflow-x-auto pb-2",
          "scrollbar-none",
        ].join(" ")}
      >
        {filters.map((filter) => {
          const active =
            activeType === filter.value;

          return (
            <button
              key={filter.label}
              type="button"
              onClick={() =>
                handleTypeChange(filter.value)
              }
              aria-pressed={active}
              className={[
                "group relative shrink-0",
                "border px-4 py-2.5",
                "text-[10px] font-semibold uppercase",
                "tracking-[0.14em]",
                "transition-all duration-300",
                "sm:flex-1",

                active
                  ? [
                      "border-bronze",
                      "bg-bronze text-ivory",
                      "shadow-sm",
                    ].join(" ")
                  : [
                      "border-charcoal/10",
                      "bg-white/50",
                      "text-charcoal/55",
                      "hover:border-blue/[0.30]",
                      "hover:bg-blue-soft/[0.05]",
                      "hover:text-blue-deep",
                    ].join(" "),
              ].join(" ")}
            >
              {filter.label}

              {/* Subtle blue editorial underline */}
              {!active && (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute bottom-0 left-3",
                    "h-px w-0 bg-blue",
                    "transition-all duration-300",
                    "group-hover:w-5",
                  ].join(" ")}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Category Filter                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-px w-5 bg-blue/[0.35]"
          />
          <span
            className={[
              "shrink-0",
              "text-[10px] font-semibold uppercase",
              "tracking-[0.14em]",
              "text-charcoal/40",
            ].join(" ")}
          >
            Category
          </span>
        </div>

        <div className="group relative min-w-0 flex-1 sm:flex-none">
          <select
            value={activeCategory ?? ""}
            onChange={(event) =>
              handleCategoryChange(
                event.target.value || undefined,
              )
            }
            disabled={categoriesLoading}
            className={[
              "w-full appearance-none",
              "min-w-0 sm:min-w-48",
              "border border-charcoal/10",
              "bg-white/50",
              "px-4 py-2.5 pr-10",
              "text-[10px] font-semibold uppercase",
              "tracking-[0.12em] text-charcoal/60",
              "outline-none",
              "backdrop-blur-sm",
              "transition-all duration-300",
              "hover:border-blue/[0.25]",
              "hover:bg-blue-soft/[0.035]",
              "focus:border-blue/[0.40]",
              "focus:ring-2 focus:ring-blue/[0.08]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            ].join(" ")}
          >
            <option value="">
              {categoriesLoading
                ? "Loading Categories..."
                : "All Categories"}
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.slug}
              >
                {category.name}
              </option>
            ))}
          </select>

          <span
            aria-hidden="true"
            className={[
              "pointer-events-none",
              "absolute right-3 top-1/2",
              "-translate-y-1/2",
              "h-1.5 w-1.5",
              "rotate-45",
              "border-b border-r",
              "border-charcoal/35",
              "transition-colors duration-300",
              "group-hover:border-blue-deep",
              "group-focus-within:border-blue-deep",
            ].join(" ")}
          />
        </div>

        {activeCategory && (
          <button
            type="button"
            onClick={() =>
              handleCategoryChange(undefined)
            }
            className={[
              "group relative shrink-0",
              "text-[10px] font-semibold uppercase",
              "tracking-[0.14em]",
              "text-bronze",
              "transition-colors duration-300",
              "hover:text-blue-deep",
            ].join(" ")}
          >
            Clear

            <span
              aria-hidden="true"
              className={[
                "absolute -bottom-1 left-0",
                "h-px w-0 bg-blue",
                "transition-all duration-300",
                "group-hover:w-full",
              ].join(" ")}
            />
          </button>
        )}
      </div>
    </div>
  );
}
