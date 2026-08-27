"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  FolderTree,
} from "lucide-react";
import { useEffect, useState } from "react";

import { adminRequest } from "@/lib/admin-api";
import AdminDialog from "@/components/admin/AdminDialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    resources: number;
  };
}

interface CategoryResponse {
  data: Category;
}

export default function EditCategoryPage() {
  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  const [category, setCategory] =
    useState<Category | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successDialogOpen, setSuccessDialogOpen] =
    useState(false);

  const [errorDialogOpen, setErrorDialogOpen] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Load Category                                                            */
  /* ------------------------------------------------------------------------ */

  async function loadCategory() {
    if (!id) {
      setError("Invalid category ID.");
      setErrorDialogOpen(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await adminRequest<CategoryResponse>(
          `/admin/categories/${id}`,
        );

      const data = response.data;

      setCategory(data);
      setName(data.name);
      setSlug(data.slug);
      setDescription(
        data.description ?? "",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load category.";

      setError(message);
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategory();
  }, [id]);

  /* ------------------------------------------------------------------------ */
  /* Slug                                                                      */
  /* ------------------------------------------------------------------------ */

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleSlugChange(value: string) {
    setSlug(generateSlug(value));
  }

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                    */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) {
      setError(
        "Category name is required.",
      );
      setErrorDialogOpen(true);
      return;
    }

    if (!trimmedSlug) {
      setError(
        "Category slug is required.",
      );
      setErrorDialogOpen(true);
      return;
    }

    if (!id) {
      setError("Invalid category ID.");
      setErrorDialogOpen(true);
      return;
    }

    try {
      setSaving(true);

      const response =
        await adminRequest<CategoryResponse>(
          `/admin/categories/${id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              name: trimmedName,
              slug: trimmedSlug,
              description:
                description.trim() || null,
            }),
          },
        );

      const updatedCategory =
        response.data;

      setCategory(updatedCategory);
      setName(updatedCategory.name);
      setSlug(updatedCategory.slug);
      setDescription(
        updatedCategory.description ?? "",
      );

      setSuccessDialogOpen(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update category.";

      setError(message);
      setErrorDialogOpen(true);
    } finally {
      setSaving(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Loading State                                                             */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="min-h-screen bg-ivory text-charcoal">
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-charcoal/10 border-t-bronze" />

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal/40">
              Loading category
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error / Not Found                                                        */
  /* ------------------------------------------------------------------------ */

  if (!category) {
    return (
      <>
        <main className="min-h-screen bg-ivory text-charcoal">
          <header className="border-b border-charcoal/10 bg-white">
            <div className="mx-auto w-full max-w-[1600px] px-6 py-6 lg:px-10">
              <Link
                href="/admin/dashboard/categories"
                className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/40 transition-colors hover:text-bronze"
              >
                <ArrowLeft size={14} />
                Back to Categories
              </Link>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-10">
            <div className="border border-red-500/15 bg-white px-6 py-16 text-center">
              <FolderTree
                size={28}
                strokeWidth={1.2}
                className="mx-auto text-red-500/50"
              />

              <h1 className="mt-5 text-xl font-medium">
                Category unavailable
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-charcoal/45">
                {error ||
                  "The category could not be found."}
              </p>

              <div className="mt-7 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={loadCategory}
                  className="border border-charcoal/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-bronze hover:text-bronze"
                >
                  Try Again
                </button>

                <Link
                  href="/admin/dashboard/categories"
                  className="inline-flex items-center gap-2 bg-charcoal px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze"
                >
                  View Categories
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </main>

        <AdminDialog
          open={errorDialogOpen}
          title="Unable to Load Category"
          description={
            error ||
            "The category could not be loaded."
          }
          variant="danger"
          confirmLabel="Try Again"
          cancelLabel="Close"
          onConfirm={() => {
            setErrorDialogOpen(false);
            loadCategory();
          }}
          onCancel={() =>
            setErrorDialogOpen(false)
          }
        />
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-ivory text-charcoal">
        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

        <header className="border-b border-charcoal/10 bg-white">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 lg:px-10">
            <div>
              <Link
                href="/admin/dashboard/categories"
                className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/40 transition-colors hover:text-bronze"
              >
                <ArrowLeft size={14} />
                Back to Categories
              </Link>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bronze">
                Content Management
              </p>

              <h1 className="display-heading mt-2 text-3xl sm:text-4xl">
                Edit Category
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-charcoal/45">
                Update the details and organization of
                this ministry library category.
              </p>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/* Content                                                            */}
        {/* ------------------------------------------------------------------ */}

        <div className="mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,760px)_1fr]">
            {/* Form */}
            <section className="border border-charcoal/10 bg-white">
              <div className="border-b border-charcoal/10 px-6 py-6 lg:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center bg-bronze/10 text-bronze">
                    <FolderTree size={19} />
                  </div>

                  <div>
                    <h2 className="text-base font-medium">
                      Category Details
                    </h2>

                    <p className="mt-1 text-xs text-charcoal/40">
                      Modify the category information
                      below.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="px-6 py-7 lg:px-8 lg:py-8"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50"
                  >
                    Category Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value,
                      )
                    }
                    disabled={saving}
                    autoComplete="off"
                    className="mt-2 h-12 w-full border border-charcoal/10 bg-ivory/40 px-4 text-sm outline-none transition-all placeholder:text-charcoal/25 focus:border-bronze/50 focus:bg-white focus:ring-2 focus:ring-bronze/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-[11px] leading-5 text-charcoal/35">
                    This is the name administrators and
                    visitors will see.
                  </p>
                </div>

                {/* Slug */}
                <div className="mt-7">
                  <label
                    htmlFor="slug"
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50"
                  >
                    Slug
                  </label>

                  <div className="mt-2 flex h-12 items-center border border-charcoal/10 bg-ivory/40 transition-all focus-within:border-bronze/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-bronze/10">
                    <span className="pl-4 text-sm text-charcoal/30">
                      /
                    </span>

                    <input
                      id="slug"
                      type="text"
                      value={slug}
                      onChange={(event) =>
                        handleSlugChange(
                          event.target.value,
                        )
                      }
                      disabled={saving}
                      autoComplete="off"
                      className="h-full min-w-0 flex-1 bg-transparent px-2 pr-4 text-sm outline-none placeholder:text-charcoal/25 disabled:cursor-not-allowed"
                    />
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-charcoal/35">
                    Changing the slug may change the URL
                    used to identify this category.
                  </p>
                </div>

                {/* Description */}
                <div className="mt-7">
                  <label
                    htmlFor="description"
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50"
                  >
                    Description
                    <span className="ml-2 font-normal tracking-normal text-charcoal/25">
                      Optional
                    </span>
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    disabled={saving}
                    rows={5}
                    placeholder="Briefly describe what belongs in this category..."
                    className="mt-2 w-full resize-none border border-charcoal/10 bg-ivory/40 px-4 py-3 text-sm leading-6 outline-none transition-all placeholder:text-charcoal/25 focus:border-bronze/50 focus:bg-white focus:ring-2 focus:ring-bronze/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <div className="mt-2 flex justify-end">
                    <span className="text-[10px] text-charcoal/25">
                      {description.length} characters
                    </span>
                  </div>
                </div>

                {/* Resource Count */}
                <div className="mt-7 border border-charcoal/10 bg-charcoal/[0.025] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-charcoal/40">
                        Assigned Resources
                      </p>

                      <p className="mt-1 text-xs text-charcoal/40">
                        Resources currently using this
                        category.
                      </p>
                    </div>

                    <span className="text-xl font-medium">
                      {category._count?.resources ??
                        0}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-charcoal/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/admin/dashboard/categories"
                    className="inline-flex h-11 items-center justify-center border border-charcoal/10 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55 transition-colors hover:border-charcoal/20 hover:text-charcoal"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="group inline-flex h-11 items-center justify-center gap-2 bg-charcoal px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving Changes..."
                      : "Save Changes"}

                    {!saving && (
                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* Information */}
            <aside className="hidden lg:block">
              <div className="border border-charcoal/10 bg-white p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze">
                  Category Overview
                </p>

                <h2 className="mt-3 text-xl font-medium tracking-[-0.02em]">
                  {category.name}
                </h2>

                <p className="mt-2 text-xs text-charcoal/35">
                  /{category.slug}
                </p>

                <div className="mt-7 border-t border-charcoal/10 pt-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
                    Library Usage
                  </p>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-3xl font-medium tracking-[-0.04em]">
                      {category._count?.resources ??
                        0}
                    </span>

                    <span className="pb-1 text-xs text-charcoal/35">
                      resource
                      {(category._count?.resources ??
                        0) === 1
                        ? ""
                        : "s"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-6 text-charcoal/40">
                    {category._count?.resources
                      ? "This category is actively being used by your resource library."
                      : "This category is not currently assigned to any resources."}
                  </p>
                </div>
              </div>

              <div className="mt-4 border border-charcoal/10 bg-charcoal/[0.025] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/35">
                  Important
                </p>

                <p className="mt-3 text-xs leading-6 text-charcoal/45">
                  Updating a category does not change the
                  resources assigned to it. Existing
                  resource relationships remain intact.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Success Dialog                                                     */}
      {/* ------------------------------------------------------------------ */}

      <AdminDialog
        open={successDialogOpen}
        title="Changes Saved"
        description={`"${name.trim()}" has been successfully updated in your ministry library.`}
        variant="success"
        confirmLabel="Back to Categories"
        cancelLabel="Stay Here"
        onConfirm={() => {
          window.location.href =
            "/admin/dashboard/categories";
        }}
        onCancel={() =>
          setSuccessDialogOpen(false)
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Error Dialog                                                       */}
      {/* ------------------------------------------------------------------ */}

      <AdminDialog
        open={errorDialogOpen}
        title="Unable to Save Changes"
        description={
          error ||
          "Something went wrong while updating the category."
        }
        variant="danger"
        confirmLabel="Close"
        cancelLabel="Dismiss"
        onConfirm={() =>
          setErrorDialogOpen(false)
        }
        onCancel={() =>
          setErrorDialogOpen(false)
        }
      />
    </>
  );
}