"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Plus,
  Search,
  Video,
  Headphones,
  BookOpen,
  Mic2,
  Music2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  Eye,
  RefreshCw,
  FolderTree,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  getAdminResources,
  deleteResource,
  type AdminResource,
} from "@/lib/admin-api";
import AdminDialog from "@/components/admin/AdminDialog";

type ResourceType =
  | "SERMON"
  | "EBOOK"
  | "SONG"
  | "VIDEO"
  | "PODCAST"
  | "ARTICLE";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

const filters: {
  label: string;
  value: "ALL" | ResourceType;
}[] = [
  { label: "All", value: "ALL" },
  { label: "Sermons", value: "SERMON" },
  { label: "Ebooks", value: "EBOOK" },
  { label: "Songs", value: "SONG" },
  { label: "Videos", value: "VIDEO" },
  { label: "Podcasts", value: "PODCAST" },
  { label: "Articles", value: "ARTICLE" },
];

const typeConfig: Record<
  ResourceType,
  {
    label: string;
    icon: typeof FileText;
  }
> = {
  SERMON: {
    label: "Sermon",
    icon: Mic2,
  },
  EBOOK: {
    label: "Ebook",
    icon: BookOpen,
  },
  SONG: {
    label: "Song",
    icon: Music2,
  },
  VIDEO: {
    label: "Video",
    icon: Video,
  },
  PODCAST: {
    label: "Podcast",
    icon: Headphones,
  },
  ARTICLE: {
    label: "Article",
    icon: FileText,
  },
};

function getResourceThumbnail(
  resource: AdminResource,
): string | undefined {
  if (resource.thumbnail?.url) {
    return resource.thumbnail.url;
  }

  const youtube = resource.media?.find(
    (media) =>
      media.provider === "YOUTUBE" &&
      media.type === "VIDEO",
  );

  const videoId =
    youtube?.externalId ??
    youtube?.url?.match(
      /(?:v=|youtu\.be\/|shorts\/|embed\/)([^?&/]+)/,
    )?.[1];

  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : undefined;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<
    AdminResource[]
  >([]);

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [categoryError, setCategoryError] =
    useState("");

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<"ALL" | ResourceType>("ALL");

  const [activeCategory, setActiveCategory] =
    useState<string>("ALL");

  const [menuId, setMenuId] = useState<
    string | null
  >(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [resourceToDelete, setResourceToDelete] =
    useState<AdminResource | null>(null);

  async function loadResources() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminResources();

      setResources(response.data ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load resources.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      setCategoriesLoading(true);
      setCategoryError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load categories.",
        );
      }

      const result: {
        data: Category[];
      } = await response.json();

      setCategories(result.data ?? []);
    } catch (error) {
      setCategoryError(
        error instanceof Error
          ? error.message
          : "Unable to load categories.",
      );
    } finally {
      setCategoriesLoading(false);
    }
  }

  useEffect(() => {
    loadResources();
    loadCategories();
  }, []);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesType =
        activeFilter === "ALL" ||
        resource.type === activeFilter;

      const matchesCategory =
        activeCategory === "ALL" ||
        resource.categories?.some(
          (item) =>
            item.category.id === activeCategory,
        );

      const matchesSearch =
        !query ||
        resource.title
          .toLowerCase()
          .includes(query) ||
        resource.slug
          .toLowerCase()
          .includes(query) ||
        resource.description
          ?.toLowerCase()
          .includes(query) ||
        resource.categories?.some(
          (item) =>
            item.category.name
              .toLowerCase()
              .includes(query),
        );

      return (
        matchesType &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    resources,
    search,
    activeFilter,
    activeCategory,
  ]);

  const publishedCount = resources.filter(
    (resource) => resource.published,
  ).length;

  const draftCount =
    resources.length - publishedCount;

  const featuredCount = resources.filter(
    (resource) => resource.featured,
  ).length;

  function handleDelete(
    resource: AdminResource,
  ) {
    setMenuId(null);
    setResourceToDelete(resource);
  }

  async function confirmDelete() {
    if (!resourceToDelete) {
      return;
    }

    const resource = resourceToDelete;
    try {
      setDeletingId(resource.id);

      await deleteResource(resource.id);

      setResources((current) =>
        current.filter(
          (item) => item.id !== resource.id,
        ),
      );
      setResourceToDelete(null);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete resource.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main
      className="min-h-screen bg-ivory text-charcoal"
      onClick={() => setMenuId(null)}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-6 lg:px-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bronze">
              Content Management
            </p>

            <h1 className="display-heading mt-2 text-3xl sm:text-4xl">
              Resources
            </h1>

            <p className="mt-2 text-sm text-charcoal/40">
              Manage sermons, ebooks, songs, videos,
              podcasts, and articles.
            </p>
          </div>

          <Link
            href="/admin/dashboard/resources/new"
            className="group inline-flex shrink-0 items-center gap-2 bg-charcoal px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze"
          >
            <Plus size={15} />

            <span className="hidden sm:inline">
              New Resource
            </span>

            <span className="sm:hidden">
              New
            </span>

            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-10 lg:py-12">
        {/* ---------------------------------------------------------------- */}
        {/* Stats                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Total Resources"
            value={resources.length}
          />

          <Stat
            label="Published"
            value={publishedCount}
          />

          <Stat
            label="Drafts"
            value={draftCount}
          />

          <Stat
            label="Featured"
            value={featuredCount}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Controls                                                         */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full max-w-2xl">
              <Search
                size={17}
                strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-bronze"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search resources..."
                className="h-12 w-full appearance-none border border-charcoal/10 bg-white pl-11 pr-5 text-sm outline-none transition-all placeholder:text-charcoal/35 focus:border-bronze/50 focus:ring-2 focus:ring-bronze/10"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                loadResources();
                loadCategories();
              }}
              disabled={loading || categoriesLoading}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 border border-charcoal/10 bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/50 transition-colors hover:border-bronze/40 hover:text-bronze disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw
                size={14}
                className={
                  loading || categoriesLoading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>

          {/* Resource Type Filters */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filters.map((filter) => {
              const active =
                activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter.value,
                    )
                  }
                  className={[
                    "shrink-0 border px-5 py-2.5",
                    "text-[10px] font-semibold uppercase tracking-[0.14em]",
                    "transition-all duration-200",
                    active
                      ? "border-bronze bg-bronze text-ivory"
                      : "border-charcoal/10 bg-white text-charcoal/55 hover:border-bronze/40 hover:text-bronze",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <FolderTree
                  size={13}
                  className="text-bronze"
                />

                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                  Categories
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <CategoryFilterButton
                  active={
                    activeCategory === "ALL"
                  }
                  onClick={() =>
                    setActiveCategory("ALL")
                  }
                >
                  All Categories
                </CategoryFilterButton>

                {categories.map(
                  (category) => (
                    <CategoryFilterButton
                      key={category.id}
                      active={
                        activeCategory ===
                        category.id
                      }
                      onClick={() =>
                        setActiveCategory(
                          category.id,
                        )
                      }
                    >
                      {category.name}
                    </CategoryFilterButton>
                  ),
                )}
              </div>
            </div>
          )}

          {categoryError && (
            <p className="mt-3 text-[11px] text-red-500">
              {categoryError}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Active Filters Summary                                           */}
        {/* ---------------------------------------------------------------- */}

        {(activeFilter !== "ALL" ||
          activeCategory !== "ALL" ||
          search.trim()) && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.12em] text-charcoal/35">
              Showing
            </span>

            {activeFilter !== "ALL" && (
              <FilterBadge>
                {
                  typeConfig[activeFilter]
                    .label
                }
              </FilterBadge>
            )}

            {activeCategory !== "ALL" && (
              <FilterBadge>
                {
                  categories.find(
                    (category) =>
                      category.id ===
                      activeCategory,
                  )?.name
                }
              </FilterBadge>
            )}

            {search.trim() && (
              <FilterBadge>
                "{search.trim()}"
              </FilterBadge>
            )}

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("ALL");
                setActiveCategory("ALL");
              }}
              className="ml-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/35 hover:text-bronze"
            >
              Clear
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Content                                                         */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-10">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={loadResources}
            />
          ) : filteredResources.length === 0 ? (
            <EmptyState
              hasSearch={
                Boolean(search.trim()) ||
                activeFilter !== "ALL" ||
                activeCategory !== "ALL"
              }
            />
          ) : (
            <ResourceTable
              resources={filteredResources}
              menuId={menuId}
              setMenuId={setMenuId}
              deletingId={deletingId}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <AdminDialog
        open={Boolean(resourceToDelete)}
        title="Delete resource?"
        description={
          resourceToDelete
            ? `Delete "${resourceToDelete.title}"? This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete resource"
        cancelLabel="Keep resource"
        variant="danger"
        loading={Boolean(deletingId)}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deletingId) {
            setResourceToDelete(null);
          }
        }}
      />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Category Filter Button                                                     */
/* -------------------------------------------------------------------------- */

function CategoryFilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 inline-flex items-center gap-2 border px-4 py-2.5",
        "text-[10px] font-semibold uppercase tracking-[0.12em]",
        "transition-all duration-200",
        active
          ? "border-charcoal bg-charcoal text-ivory"
          : "border-charcoal/10 bg-white text-charcoal/50 hover:border-bronze/40 hover:text-bronze",
      ].join(" ")}
    >
      <FolderTree size={12} />
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter Badge                                                               */
/* -------------------------------------------------------------------------- */

function FilterBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="border border-bronze/20 bg-bronze/5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-bronze">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat                                                                       */
/* -------------------------------------------------------------------------- */

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white px-6 py-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal/40">
        {label}
      </p>

      <p className="mt-3 text-3xl font-medium tracking-[-0.04em]">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Resource Table                                                             */
/* -------------------------------------------------------------------------- */

function ResourceTable({
  resources,
  menuId,
  setMenuId,
  deletingId,
  onDelete,
}: {
  resources: AdminResource[];
  menuId: string | null;
  setMenuId: (
    id: string | null,
  ) => void;
  deletingId: string | null;
  onDelete: (
    resource: AdminResource,
  ) => void;
}) {
  return (
    <div className="overflow-visible border border-charcoal/10 bg-white">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-[minmax(300px,1fr)_140px_220px_140px_120px_60px] border-b border-charcoal/10 bg-charcoal/[0.025] px-6 py-4">
          <HeaderCell>
            Resource
          </HeaderCell>

          <HeaderCell>Type</HeaderCell>

          <HeaderCell>Categories</HeaderCell>

          <HeaderCell>Status</HeaderCell>

          <HeaderCell>Created</HeaderCell>

          <span />
        </div>

        {resources.map((resource) => {
          const config =
            typeConfig[resource.type];

          const Icon = config.icon;
          const thumbnailUrl =
            getResourceThumbnail(resource);

          return (
            <div
              key={resource.id}
              className="grid min-h-[92px] grid-cols-[minmax(300px,1fr)_140px_220px_140px_120px_60px] items-center border-b border-charcoal/10 px-6 last:border-b-0"
            >
              {/* Resource */}
              <div className="min-w-0 pr-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden bg-bronze/10 text-bronze">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={`/resources/${resource.slug}`}
                      target="_blank"
                      className="block truncate text-sm font-medium transition-colors hover:text-bronze"
                    >
                      {resource.title}
                    </Link>

                    <p className="mt-1 truncate text-[11px] text-charcoal/35">
                      /{resource.slug}
                    </p>
                  </div>

                  {resource.featured && (
                    <Star
                      size={13}
                      className="shrink-0 fill-bronze text-bronze"
                    />
                  )}
                </div>
              </div>

              {/* Type */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/50">
                  {config.label}
                </span>
              </div>

              {/* Categories */}
              <CategoryList
                resource={resource}
              />

              {/* Status */}
              <div>
                <StatusBadge
                  published={
                    resource.published
                  }
                />
              </div>

              {/* Created */}
              <div className="text-xs text-charcoal/45">
                {formatDate(
                  resource.createdAt,
                )}
              </div>

              {/* Actions */}
              <ActionMenu
                resource={resource}
                open={
                  menuId === resource.id
                }
                setOpen={(open) =>
                  setMenuId(
                    open
                      ? resource.id
                      : null,
                  )
                }
                deleting={
                  deletingId === resource.id
                }
                onDelete={onDelete}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile / Tablet */}
      <div className="lg:hidden">
        {resources.map((resource) => {
          const config =
            typeConfig[resource.type];

          const Icon = config.icon;

          return (
            <div
              key={resource.id}
              className="relative border-b border-charcoal/10 p-5 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-bronze/10 text-bronze">
                  <Icon size={17} />
                </div>

                <div className="min-w-0 flex-1 pr-8">
                  <Link
                    href={`/resources/${resource.slug}`}
                    target="_blank"
                    className="block text-sm font-medium hover:text-bronze"
                  >
                    {resource.title}
                  </Link>

                  <p className="mt-1 truncate text-[11px] text-charcoal/35">
                    /{resource.slug}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/40">
                      {config.label}
                    </span>

                    <StatusBadge
                      published={
                        resource.published
                      }
                    />

                    {resource.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-bronze">
                        <Star
                          size={11}
                          className="fill-bronze"
                        />
                        Featured
                      </span>
                    )}
                  </div>

                  <CategoryList
                    resource={resource}
                    mobile
                  />

                  <p className="mt-3 text-[11px] text-charcoal/35">
                    Created{" "}
                    {formatDate(
                      resource.createdAt,
                    )}
                  </p>
                </div>

                <ActionMenu
                  resource={resource}
                  open={
                    menuId === resource.id
                  }
                  setOpen={(open) =>
                    setMenuId(
                      open
                        ? resource.id
                        : null,
                    )
                  }
                  deleting={
                    deletingId === resource.id
                  }
                  onDelete={onDelete}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Category List                                                              */
/* -------------------------------------------------------------------------- */

function CategoryList({
  resource,
  mobile = false,
}: {
  resource: AdminResource;
  mobile?: boolean;
}) {
  const categories =
    resource.categories ?? [];

  if (categories.length === 0) {
    return (
      <span className="text-[10px] text-charcoal/25">
        Uncategorized
      </span>
    );
  }

  return (
    <div
      className={[
        "flex flex-wrap gap-1.5",
        mobile ? "mt-4" : "",
      ].join(" ")}
    >
      {categories.slice(0, 3).map((item) => (
        <span
          key={item.category.id}
          className="inline-flex items-center gap-1 border border-charcoal/10 bg-charcoal/[0.02] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.08em] text-charcoal/45"
        >
          <FolderTree size={9} />
          {item.category.name}
        </span>
      ))}

      {categories.length > 3 && (
        <span className="px-1 py-1 text-[9px] text-charcoal/30">
          +{categories.length - 3}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Action Menu                                                                */
/* -------------------------------------------------------------------------- */

function ActionMenu({
  resource,
  open,
  setOpen,
  deleting,
  onDelete,
}: {
  resource: AdminResource;
  open: boolean;
  setOpen: (open: boolean) => void;
  deleting: boolean;
  onDelete: (
    resource: AdminResource,
  ) => void;
}) {
  return (
    <div
      className="relative"
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={deleting}
        className="flex h-9 w-9 items-center justify-center text-charcoal/35 transition-colors hover:bg-charcoal/5 hover:text-charcoal disabled:opacity-40"
        aria-label="Resource actions"
      >
        <MoreHorizontal size={17} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-30 w-48 border border-charcoal/10 bg-white p-1 shadow-xl">
          <Link
            href={`/admin/dashboard/resources/${resource.id}/edit`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-xs text-charcoal/65 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
          >
            <Pencil size={14} />
            Edit resource
          </Link>

          <Link
            href={`/resources/${resource.slug}`}
            target="_blank"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-xs text-charcoal/65 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
          >
            <Eye size={14} />
            View resource
          </Link>

          <div className="my-1 border-t border-charcoal/10" />

          <button
            type="button"
            disabled={deleting}
            onClick={() =>
              onDelete(resource)
            }
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={14} />

            {deleting
              ? "Deleting..."
              : "Delete resource"}
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Header Cell                                                                */
/* -------------------------------------------------------------------------- */

function HeaderCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  published,
}: {
  published: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]",
        published
          ? "bg-green-500/10 text-green-700"
          : "bg-charcoal/5 text-charcoal/40",
      ].join(" ")}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function LoadingState() {
  return (
    <div className="border border-charcoal/10 bg-white px-6 py-20 text-center">
      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-charcoal/10 border-t-bronze" />

      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-charcoal/40">
        Loading resources
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error                                                                      */
/* -------------------------------------------------------------------------- */

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="border border-red-500/15 bg-red-500/[0.03] px-6 py-16 text-center">
      <p className="text-sm text-red-600">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 border border-charcoal/10 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] hover:border-bronze hover:text-bronze"
      >
        <RefreshCw size={13} />
        Try Again
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  hasSearch,
}: {
  hasSearch: boolean;
}) {
  return (
    <div className="border border-charcoal/10 bg-white px-6 py-20 text-center">
      <FileText
        size={25}
        className="mx-auto text-charcoal/20"
        strokeWidth={1.2}
      />

      <h2 className="mt-5 text-lg font-medium">
        {hasSearch
          ? "No matching resources"
          : "No resources yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-charcoal/45">
        {hasSearch
          ? "Try changing your search or filter."
          : "Create your first resource to start building the ministry library."}
      </p>

      {!hasSearch && (
        <Link
          href="/admin/dashboard/resources/new"
          className="mt-6 inline-flex items-center gap-2 bg-charcoal px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-bronze"
        >
          <Plus size={14} />
          Create Resource
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Date                                                                       */
/* -------------------------------------------------------------------------- */

function formatDate(
  value: string | Date,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}