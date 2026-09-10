"use client";

import { useCallback, useEffect, useState } from "react";
import {
getResources,
type Resource,
type ResourceType,
} from "@/lib/api";

import {
usePathname,
useRouter,
useSearchParams,
} from "next/navigation";

import ResourceCard from "./ResourceCard";
import ResourceFilters from "./ResourceFilters";
import ResourceSearch from "./ResourceSearch";
import ResourcePagination from "./ResourcePagination";

export default function ResourcesPage() {
const router = useRouter();
const pathname = usePathname();
const searchParams = useSearchParams();

const [resources, setResources] = useState<Resource[]>([]);

const [totalPages, setTotalPages] = useState(1);
const [total, setTotal] = useState(0);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

/* ------------------------------------------------------------------------ */
/* URL State                                                                */
/* ------------------------------------------------------------------------ */

const type =
(searchParams.get("type") as ResourceType | null) ??
undefined;

const category =
searchParams.get("category") ??
undefined;

const search =
searchParams.get("search") ??
"";

const page =
Number(searchParams.get("page")) || 1;

/* ------------------------------------------------------------------------ */
/* Load Resources                                                           */
/* ------------------------------------------------------------------------ */

const loadResources = useCallback(async () => {
try {
setLoading(true);
setError("");


  const result = await getResources({
    page,
    limit: 20,
    type,
    category,
    search: search.trim() || undefined,
  });

  setResources(result.data);
  setTotalPages(result.meta.totalPages);
  setTotal(result.meta.total);
} catch (error) {
  console.error("Failed to load resources:", error);

  setError(
    "We couldn't load the resource library. Please try again.",
  );
} finally {
  setLoading(false);
}


}, [page, type, category, search]);

/* ------------------------------------------------------------------------ */
/* Fetch                                                                    */
/* ------------------------------------------------------------------------ */

useEffect(() => {
const timer = setTimeout(
() => {
loadResources();
},
search ? 350 : 0,
);


return () => clearTimeout(timer);


}, [loadResources, search]);

/* ------------------------------------------------------------------------ */
/* Pagination                                                               */
/* ------------------------------------------------------------------------ */

const handlePageChange = (newPage: number) => {
const params = new URLSearchParams(
searchParams.toString(),
);


if (newPage > 1) {
  params.set("page", String(newPage));
} else {
  params.delete("page");
}

const query = params.toString();

router.push(
  `${pathname}${query ? `?${query}` : ""}`,
  {
    scroll: false,
  },
);

window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

/* ------------------------------------------------------------------------ */
/* Retry                                                                    */
/* ------------------------------------------------------------------------ */

const handleRetry = () => {
loadResources();
};

return ( <section className="relative min-h-screen overflow-hidden bg-ivory text-charcoal">
{/* ------------------------------------------------------------------ */}
{/* Global blue atmosphere                                             */}
{/* ------------------------------------------------------------------ */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 h-[720px] overflow-hidden"
  >
    <div className="absolute -right-32 -top-40 h-[620px] w-[620px] rounded-full bg-blue-soft/[0.10] blur-3xl" />

    <div className="absolute left-[28%] top-[120px] h-[280px] w-[280px] rounded-full bg-blue-light/[0.07] blur-3xl" />

    <div className="absolute right-[18%] top-[280px] h-px w-[340px] rotate-[-18deg] bg-blue/[0.16]" />

    <div className="absolute right-[7%] top-[360px] h-[190px] w-[190px] rounded-full border border-blue/[0.10]" />

    <div className="absolute right-[10%] top-[390px] h-[130px] w-[130px] rounded-full border border-gold/[0.12]" />
  </div>

  {/* ------------------------------------------------------------------ */}
  {/* Header                                                             */}
  {/* ------------------------------------------------------------------ */}

  <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-36 lg:px-8">
    <div className="max-w-4xl">
      <p className="eyebrow text-bronze">
        Olawale Smith Ministries
      </p>

      <h1 className="display-heading mt-5 text-6xl sm:text-7xl lg:text-[7rem]">
        The Resource
        <br />
        <span className="relative inline-block text-bronze">
          Library.
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-0 h-px w-16 bg-blue"
          />
        </span>
      </h1>

      <p className="body-copy mt-7 max-w-2xl text-base text-charcoal/60 sm:text-lg">
        Explore sermons, teachings, ebooks, songs,
        podcasts and other resources from Olawale
        Smith Ministries.
      </p>

      {/* Small editorial marker */}
      <div className="mt-9 flex items-center gap-3">
        <span className="h-px w-10 bg-blue/[0.45]" />

        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-deep/60">
          Faith · Purpose · Impact
        </span>
      </div>
    </div>
  </div>

  {/* ------------------------------------------------------------------ */}
  {/* Controls                                                           */}
  {/* ------------------------------------------------------------------ */}

  <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
    <div className="border-y border-charcoal/10 py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ResourceFilters />

        <div className="w-full lg:max-w-sm">
          <ResourceSearch />
        </div>
      </div>
    </div>
  </div>

  {/* ------------------------------------------------------------------ */}
  {/* Results                                                            */}
  {/* ------------------------------------------------------------------ */}

  <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
    {/* Subtle blue vertical atmosphere */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[-220px] top-0 h-[500px] w-[500px] rounded-full bg-blue-soft/[0.05] blur-3xl"
    />

    {/* Result Count */}
    <div className="relative mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-blue/[0.35]" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal/40">
          {loading
            ? "Loading resources..."
            : `${total} ${
                total === 1
                  ? "resource"
                  : "resources"
              }`}
        </p>
      </div>

      {!loading && total > 0 && (
        <span className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-deep/45 sm:block">
          Collection
        </span>
      )}
    </div>

    {/* Error */}
    {error ? (
      <div className="relative overflow-hidden rounded-2xl border border-charcoal/10 bg-white/40 p-10 text-center">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-soft/[0.08] blur-2xl"
        />

        <p className="relative text-sm text-charcoal/60">
          {error}
        </p>

        <button
          type="button"
          onClick={handleRetry}
          className={[
            "relative mt-5 rounded-full bg-bronze px-5 py-3",
            "text-[10px] font-semibold uppercase",
            "tracking-[0.14em] text-ivory",
            "transition-all duration-300",
            "hover:bg-blue-deep",
          ].join(" ")}
        >
          Try again
        </button>
      </div>
    ) : loading ? (
      /* -------------------------------------------------------------- */
      /* Loading Skeleton                                               */
      /* -------------------------------------------------------------- */

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
        {Array.from({
          length: 20,
        }).map((_, index) => (
          <div key={index}>
            <div className="relative aspect-square overflow-hidden rounded-md bg-charcoal/5 sm:rounded-lg">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-blue-soft/[0.035]"
              />
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-soft/[0.07] blur-xl"
              />
            </div>

            <div className="mt-2.5 h-2.5 w-20 animate-pulse rounded-full bg-charcoal/5" />

            <div className="mt-2 h-4 w-3/4 animate-pulse rounded-full bg-charcoal/5" />

            <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded-full bg-charcoal/5" />
          </div>
        ))}
      </div>
    ) : resources.length === 0 ? (
      /* -------------------------------------------------------------- */
      /* Empty State                                                    */
      /* -------------------------------------------------------------- */

      <div className="relative overflow-hidden py-24 text-center">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-soft/[0.06] blur-3xl"
        />

        <div className="relative">
          <span className="mx-auto mb-6 block h-px w-10 bg-blue/[0.35]" />

          <p className="section-heading text-3xl">
            Nothing found.
          </p>

          <p className="mt-3 text-sm text-charcoal/50">
            Try another search or resource category.
          </p>
        </div>
      </div>
    ) : (
      <>
        {/* ------------------------------------------------------------ */}
        {/* Resource Grid                                                 */}
        {/* ------------------------------------------------------------ */}

        <div
          className={[
            "relative grid",
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
            />
          ))}
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Pagination                                                    */}
        {/* ------------------------------------------------------------ */}

        <ResourcePagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    )}
  </div>
</section>


);
}
