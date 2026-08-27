"use client";

import { useEffect, useState } from "react";
import type {
  Category,
  ResourceType,
} from "@/lib/api";
import {
  getCategories,
} from "@/lib/api";

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
  const searchParams =
    useSearchParams();

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
        const data =
          await getCategories();

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
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    params.delete("page");

    const query =
      params.toString();

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
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    if (category) {
      params.set(
        "category",
        category,
      );
    } else {
      params.delete("category");
    }

    params.delete("page");

    const query =
      params.toString();

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
    <div className="space-y-4">
      {/* Resource Type Filters */}
      <div className="flex w-full gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filters.map((filter) => {
          const active =
            activeType ===
            filter.value;

          return (
            <button
              key={filter.label}
              type="button"
              onClick={() =>
                handleTypeChange(
                  filter.value,
                )
              }
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

      {/* Category Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
          Category
        </span>

        <select
          value={activeCategory ?? ""}
          onChange={(event) =>
            handleCategoryChange(
              event.target.value ||
                undefined,
            )
          }
          disabled={categoriesLoading}
          className={[
            "min-w-48 border border-charcoal/10",
            "bg-white/50 px-4 py-2.5",
            "text-[10px] font-semibold uppercase",
            "tracking-[0.12em] text-charcoal/60",
            "outline-none transition-colors",
            "focus:border-bronze",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          <option value="">
            {categoriesLoading
              ? "Loading Categories..."
              : "All Categories"}
          </option>

          {categories.map(
            (category) => (
              <option
                key={category.id}
                value={category.slug}
              >
                {category.name}
              </option>
            ),
          )}
        </select>

        {activeCategory && (
          <button
            type="button"
            onClick={() =>
              handleCategoryChange(
                undefined,
              )
            }
            className="w-fit shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze transition-colors hover:text-charcoal"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}