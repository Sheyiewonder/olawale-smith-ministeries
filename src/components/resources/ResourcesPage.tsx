"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getResources,
  type Resource,
  type ResourceType,
} from "@/lib/api";

import ResourceCard from "./ResourceCard";
import ResourceFilters from "./ResourceFilters";
import ResourceSearch from "./ResourceSearch";
import ResourcePagination from "./ResourcePagination";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [type, setType] = useState<ResourceType | undefined>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResources = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getResources({
        page,
        limit: 12,
        type,
        search: search.trim() || undefined,
      });

      setResources(result.data);
      setTotalPages(result.meta.totalPages);
      setTotal(result.meta.total);
    } catch (error) {
      console.error(error);
      setError(
        "We couldn't load the resource library. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, type, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadResources();
    }, search ? 350 : 0);

    return () => clearTimeout(timer);
  }, [loadResources, search]);

  const handleTypeChange = (newType?: ResourceType) => {
    setType(newType);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-ivory text-charcoal">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-36 lg:px-8">
        <div className="max-w-4xl">
          <p className="eyebrow text-bronze">
            Olawale Smith Ministries
          </p>

          <h1 className="display-heading mt-5 text-6xl sm:text-7xl lg:text-[7rem]">
            The Resource
            <br />
            <span className="text-bronze">Library.</span>
          </h1>

          <p className="body-copy mt-7 max-w-2xl text-base text-charcoal/60 sm:text-lg">
            Explore sermons, teachings, ebooks, songs, podcasts and
            other resources from Olawale Smith Ministries.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-y border-charcoal/10 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <ResourceFilters/>

            <div className="w-full lg:max-w-sm">
              <ResourceSearch/>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal/40">
            {loading
              ? "Loading resources..."
              : `${total} ${total === 1 ? "resource" : "resources"}`}
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-charcoal/10 bg-white/40 p-10 text-center">
            <p className="text-sm text-charcoal/60">{error}</p>

            <button
              type="button"
              onClick={loadResources}
              className="mt-5 rounded-full bg-bronze px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[4/3] animate-pulse rounded-2xl bg-charcoal/5" />

                <div className="mt-5 h-3 w-24 animate-pulse rounded-full bg-charcoal/5" />

                <div className="mt-3 h-7 w-3/4 animate-pulse rounded-full bg-charcoal/5" />
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="py-24 text-center">
            <p className="section-heading text-3xl">
              Nothing found.
            </p>

            <p className="mt-3 text-sm text-charcoal/50">
              Try another search or resource category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                />
              ))}
            </div>

            <ResourcePagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </section>
  );
}