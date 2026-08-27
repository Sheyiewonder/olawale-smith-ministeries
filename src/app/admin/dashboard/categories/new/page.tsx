"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  FolderTree,
} from "lucide-react";
import { useState } from "react";

import { adminRequest } from "@/lib/admin-api";
import AdminDialog from "@/components/admin/AdminDialog";

interface CreateCategoryResponse {
  data: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };
}

export default function NewCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Slug                                                                     */
  /* ------------------------------------------------------------------------ */

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!slugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(generateSlug(value));
  }

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    if (!trimmedSlug) {
      setError("Category slug is required.");
      return;
    }

    try {
      setSaving(true);

      await adminRequest<CreateCategoryResponse>(
        "/admin/categories",
        {
          method: "POST",
          body: JSON.stringify({
            name: trimmedName,
            slug: trimmedSlug,
            description:
              description.trim() || null,
          }),
        },
      );

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create category.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
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
              New Category
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-charcoal/45">
              Create a category to organize resources
              across the ministry library.
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
                    Give this category a clear and
                    recognizable identity.
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
                    handleNameChange(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Faith & Growth"
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
                    placeholder="faith-growth"
                    disabled={saving}
                    autoComplete="off"
                    className="h-full min-w-0 flex-1 bg-transparent px-2 pr-4 text-sm outline-none placeholder:text-charcoal/25 disabled:cursor-not-allowed"
                  />
                </div>

                <p className="mt-2 text-[11px] leading-5 text-charcoal/35">
                  Used in URLs and automatically
                  generated from the category name.
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
                  placeholder="Briefly describe what belongs in this category..."
                  disabled={saving}
                  rows={5}
                  className="mt-2 w-full resize-none border border-charcoal/10 bg-ivory/40 px-4 py-3 text-sm leading-6 outline-none transition-all placeholder:text-charcoal/25 focus:border-bronze/50 focus:bg-white focus:ring-2 focus:ring-bronze/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="mt-2 flex justify-end">
                  <span className="text-[10px] text-charcoal/25">
                    {description.length} characters
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
                    ? "Creating..."
                    : "Create Category"}

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

          {/* Sidebar Information */}
          <aside className="hidden lg:block">
            <div className="border border-charcoal/10 bg-white p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze">
                About Categories
              </p>

              <h2 className="mt-3 text-xl font-medium tracking-[-0.02em]">
                Keep the library organized.
              </h2>

              <p className="mt-4 text-sm leading-7 text-charcoal/45">
                Categories help visitors discover
                related ministry resources more easily.
              </p>

              <div className="mt-7 border-t border-charcoal/10 pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
                  Examples
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    "Faith & Growth",
                    "Marriage & Family",
                    "Prayer",
                    "Leadership",
                    "Christian Living",
                  ].map((example) => (
                    <div
                      key={example}
                      className="flex items-center gap-3 text-xs text-charcoal/55"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-bronze/60" />
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 border border-charcoal/10 bg-charcoal/[0.025] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/35">
                Tip
              </p>

              <p className="mt-3 text-xs leading-6 text-charcoal/45">
                Use short, descriptive category names.
                A resource can belong to multiple
                categories, so you don't need to create
                overly broad categories.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Error Dialog                                                       */}
      {/* ------------------------------------------------------------------ */}

      <AdminDialog
        open={Boolean(error)}
        variant="danger"
        title="Unable to Create Category"
        description={error}
        confirmLabel="Close"
        cancelLabel="Dismiss"
        onConfirm={() => setError("")}
        onCancel={() => setError("")}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Success Dialog                                                     */}
      {/* ------------------------------------------------------------------ */}

      <AdminDialog
        open={success}
        variant="success"
        title="Category Created"
        description={`“${name.trim()}” has been successfully added to your ministry library.`}
        confirmLabel="View Categories"
        cancelLabel="Close"
        onConfirm={() => {
          window.location.href =
            "/admin/dashboard/categories";
        }}
        onCancel={() => setSuccess(false)}
      />
    </main>
  );
}
