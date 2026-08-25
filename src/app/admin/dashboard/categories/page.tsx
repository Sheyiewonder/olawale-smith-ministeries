"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FolderTree,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { adminRequest } from "@/lib/admin-api";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    resources: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [menuId, setMenuId] = useState<string | null>(
    null,
  );

  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await adminRequest<{
        data: Category[];
      }>("/admin/categories");

      setCategories(response.data ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load categories.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter(
      (category) =>
        category.name
          .toLowerCase()
          .includes(query) ||
        category.slug
          .toLowerCase()
          .includes(query) ||
        category.description
          ?.toLowerCase()
          .includes(query),
    );
  }, [categories, search]);

  async function handleDelete(
    category: Category,
  ) {
    if (
      category._count?.resources &&
      category._count.resources > 0
    ) {
      window.alert(
        `You cannot delete "${category.name}" because it is currently assigned to ${category._count.resources} resource${
          category._count.resources === 1
            ? ""
            : "s"
        }.`,
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);
      setMenuId(null);

      await adminRequest(
        `/admin/categories/${category.id}`,
        {
          method: "DELETE",
        },
      );

      setCategories((current) =>
        current.filter(
          (item) => item.id !== category.id,
        ),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete category.",
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
      {/* Header */}
      <header className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 lg:px-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bronze">
              Content Management
            </p>

            <h1 className="display-heading mt-2 text-3xl sm:text-4xl">
              Categories
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-charcoal/45">
              Organize sermons, ebooks, songs, videos,
              podcasts, and articles into meaningful
              collections.
            </p>
          </div>

          <Link
            href="/admin/dashboard/categories/new"
            className="group inline-flex items-center gap-2 bg-charcoal px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze"
          >
            <Plus size={15} />

            New Category

            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-10 lg:py-12">
        {/* Stats */}
        <div className="grid gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            label="Total Categories"
            value={categories.length}
          />

          <Stat
            label="Assigned Resources"
            value={categories.reduce(
              (total, category) =>
                total +
                (category._count?.resources ?? 0),
              0,
            )}
          />

          <Stat
            label="Unused Categories"
            value={
              categories.filter(
                (category) =>
                  (category._count?.resources ?? 0) ===
                  0,
              ).length
            }
          />
        </div>

        {/* Search */}
        <div className="mt-10">
          <div className="relative max-w-2xl">
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
              placeholder="Search categories..."
              className="h-12 w-full appearance-none border border-charcoal/10 bg-white pl-11 pr-5 text-sm outline-none transition-all placeholder:text-charcoal/35 focus:border-bronze/50 focus:ring-2 focus:ring-bronze/10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-10">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={loadCategories}
            />
          ) : filteredCategories.length === 0 ? (
            <EmptyState
              hasSearch={Boolean(search.trim())}
            />
          ) : (
            <CategoryTable
              categories={filteredCategories}
              menuId={menuId}
              setMenuId={setMenuId}
              deletingId={deletingId}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                      */
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
/* Category Table                                                             */
/* -------------------------------------------------------------------------- */

function CategoryTable({
  categories,
  menuId,
  setMenuId,
  deletingId,
  onDelete,
}: {
  categories: Category[];
  menuId: string | null;
  setMenuId: (
    id: string | null,
  ) => void;
  deletingId: string | null;
  onDelete: (
    category: Category,
  ) => void;
}) {
  return (
    <div className="overflow-visible border border-charcoal/10 bg-white">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-[minmax(300px,1fr)_180px_140px_60px] border-b border-charcoal/10 bg-charcoal/[0.025] px-6 py-4">
          <HeaderCell>Category</HeaderCell>
          <HeaderCell>Resources</HeaderCell>
          <HeaderCell>Created</HeaderCell>
          <span />
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className="grid min-h-[92px] grid-cols-[minmax(300px,1fr)_180px_140px_60px] items-center border-b border-charcoal/10 px-6 last:border-b-0"
          >
            <CategoryInfo
              category={category}
            />

            <div>
              <span className="inline-flex items-center gap-2 text-xs text-charcoal/55">
                <FileText
                  size={14}
                  className="text-bronze"
                />

                {category._count?.resources ?? 0}

                <span className="text-charcoal/30">
                  resource
                  {(category._count?.resources ??
                    0) === 1
                    ? ""
                    : "s"}
                </span>
              </span>
            </div>

            <div className="text-xs text-charcoal/45">
              {formatDate(
                category.createdAt,
              )}
            </div>

            <ActionMenu
              category={category}
              open={
                menuId === category.id
              }
              setOpen={(open) =>
                setMenuId(
                  open
                    ? category.id
                    : null,
                )
              }
              deleting={
                deletingId === category.id
              }
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>

      {/* Mobile / Tablet */}
      <div className="lg:hidden">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative border-b border-charcoal/10 p-5 last:border-b-0"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-bronze/10 text-bronze">
                <FolderTree size={17} />
              </div>

              <div className="min-w-0 flex-1 pr-8">
                <p className="text-sm font-medium">
                  {category.name}
                </p>

                <p className="mt-1 truncate text-[11px] text-charcoal/35">
                  /{category.slug}
                </p>

                {category.description && (
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-charcoal/45">
                    {category.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-charcoal/40">
                    <FileText size={11} />

                    {category._count?.resources ??
                      0}{" "}
                    resource
                    {(category._count?.resources ??
                      0) === 1
                      ? ""
                      : "s"}
                  </span>
                </div>

                <p className="mt-3 text-[11px] text-charcoal/35">
                  Created{" "}
                  {formatDate(
                    category.createdAt,
                  )}
                </p>
              </div>

              <ActionMenu
                category={category}
                open={
                  menuId === category.id
                }
                setOpen={(open) =>
                  setMenuId(
                    open
                      ? category.id
                      : null,
                  )
                }
                deleting={
                  deletingId === category.id
                }
                onDelete={onDelete}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Category Info                                                              */
/* -------------------------------------------------------------------------- */

function CategoryInfo({
  category,
}: {
  category: Category;
}) {
  return (
    <div className="min-w-0 pr-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-bronze/10 text-bronze">
          <FolderTree size={16} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {category.name}
          </p>

          <p className="mt-1 truncate text-[11px] text-charcoal/35">
            /{category.slug}
          </p>
        </div>
      </div>

      {category.description && (
        <p className="mt-3 max-w-xl truncate pl-12 text-xs text-charcoal/40">
          {category.description}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Action Menu                                                                */
/* -------------------------------------------------------------------------- */

function ActionMenu({
  category,
  open,
  setOpen,
  deleting,
  onDelete,
}: {
  category: Category;
  open: boolean;
  setOpen: (open: boolean) => void;
  deleting: boolean;
  onDelete: (
    category: Category,
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
        aria-label="Category actions"
      >
        <MoreHorizontal size={17} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-30 w-44 border border-charcoal/10 bg-white p-1 shadow-xl">
          <Link
            href={`/admin/dashboard/categories/${category.id}/edit`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-xs text-charcoal/65 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
          >
            <Pencil size={14} />
            Edit category
          </Link>

          <button
            type="button"
            disabled={deleting}
            onClick={() =>
              onDelete(category)
            }
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={14} />

            {deleting
              ? "Deleting..."
              : "Delete category"}
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared UI                                                                  */
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

function LoadingState() {
  return (
    <div className="border border-charcoal/10 bg-white px-6 py-20 text-center">
      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-charcoal/10 border-t-bronze" />

      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-charcoal/40">
        Loading categories
      </p>
    </div>
  );
}

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
        className="mt-5 border border-charcoal/10 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] hover:border-bronze hover:text-bronze"
      >
        Try Again
      </button>
    </div>
  );
}

function EmptyState({
  hasSearch,
}: {
  hasSearch: boolean;
}) {
  return (
    <div className="border border-charcoal/10 bg-white px-6 py-20 text-center">
      <FolderTree
        size={25}
        className="mx-auto text-charcoal/20"
        strokeWidth={1.2}
      />

      <h2 className="mt-5 text-lg font-medium">
        {hasSearch
          ? "No matching categories"
          : "No categories yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-charcoal/45">
        {hasSearch
          ? "Try changing your search."
          : "Create your first category to start organizing the ministry library."}
      </p>

      {!hasSearch && (
        <Link
          href="/admin/dashboard/categories/new"
          className="mt-6 inline-flex items-center gap-2 bg-charcoal px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-bronze"
        >
          <Plus size={14} />
          Create Category
        </Link>
      )}
    </div>
  );
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(value));
}