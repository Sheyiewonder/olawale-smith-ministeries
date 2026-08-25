"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileText,
  Headphones,
  Loader2,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";

import {
  createResource,
  type CreateResourceInput,
} from "@/lib/admin-api";

type ResourceType =
  | "SERMON"
  | "EBOOK"
  | "SONG"
  | "VIDEO"
  | "PODCAST"
  | "ARTICLE";

type MediaType =
  | "AUDIO"
  | "PDF"
  | "IMAGE"
  | "VIDEO";

type MediaProvider =
  | "R2"
  | "YOUTUBE"
  | "SUPABASE"
  | "EXTERNAL";

interface MediaItem {
  type: MediaType;
  provider: MediaProvider;
  title: string;
  url: string;
  externalId: string;
}

const resourceTypes: {
  value: ResourceType;
  label: string;
}[] = [
  { value: "SERMON", label: "Sermon" },
  { value: "EBOOK", label: "Ebook" },
  { value: "SONG", label: "Song" },
  { value: "VIDEO", label: "Video" },
  { value: "PODCAST", label: "Podcast" },
  { value: "ARTICLE", label: "Article" },
];

const mediaTypes: {
  value: MediaType;
  label: string;
}[] = [
  { value: "VIDEO", label: "Video" },
  { value: "AUDIO", label: "Audio" },
  { value: "PDF", label: "PDF" },
  { value: "IMAGE", label: "Image" },
];

const mediaProviders: {
  value: MediaProvider;
  label: string;
}[] = [
  { value: "YOUTUBE", label: "YouTube" },
  { value: "EXTERNAL", label: "External URL" },
  { value: "R2", label: "Cloudflare R2" },
  { value: "SUPABASE", label: "Supabase Storage" },
];

export default function NewResourcePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] =
    useState<ResourceType>("SERMON");
  const [speaker, setSpeaker] = useState("");

  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  const [media, setMedia] = useState<MediaItem[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(generateSlug(value));
    }
  }

  function addMedia() {
    setMedia((current) => [
      ...current,
      {
        type: "VIDEO",
        provider: "YOUTUBE",
        title: "",
        url: "",
        externalId: "",
      },
    ]);
  }

  function updateMedia(
    index: number,
    field: keyof MediaItem,
    value: string,
  ) {
    setMedia((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function removeMedia(index: number) {
    setMedia((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter a resource title.");
      return;
    }

    if (!slug.trim()) {
      setError("Please enter a resource slug.");
      return;
    }

    try {
      setSaving(true);

      const input: CreateResourceInput = {
        title: title.trim(),
        slug: slug.trim(),
        description:
          description.trim() || undefined,
        content: content.trim() || undefined,
        type,
        speaker: speaker.trim() || undefined,
        featured,
        published,

        categoryIds: [],
        tagIds: [],

        media: media
          .filter(
            (item) =>
              item.url.trim() ||
              item.externalId.trim(),
          )
          .map((item) => ({
            type: item.type,
            provider: item.provider,
            title:
              item.title.trim() || undefined,
            url: item.url.trim() || undefined,
            externalId:
              item.externalId.trim() || undefined,
          })),
      };

      await createResource(input);

      setShowSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create resource.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleSuccessClose() {
    setShowSuccess(false);
    router.push("/admin/dashboard/resources");
  }

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      {/* Header */}
      <header className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-6 lg:px-10">
          <div>
            <Link
              href="/admin/dashboard/resources"
              className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/45 transition-colors hover:text-bronze"
            >
              <ArrowLeft size={14} />
              Back to Resources
            </Link>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bronze">
              Content Management
            </p>

            <h1 className="display-heading mt-2 text-3xl sm:text-4xl">
              Create Resource
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-charcoal/45">
              Add a sermon, ebook, song, video,
              podcast, or article to the ministry
              library.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10 lg:py-12">
        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          {/* Main content */}
          <div className="space-y-8">
            {/* Basic information */}
            <section className="border border-charcoal/10 bg-white">
              <div className="border-b border-charcoal/10 px-6 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                  Basic Information
                </p>

                <h2 className="mt-2 text-xl font-medium">
                  Resource details
                </h2>
              </div>

              <div className="space-y-6 p-6">
                <Field
                  label="Title"
                  required
                >
                  <input
                    value={title}
                    onChange={(event) =>
                      handleTitleChange(
                        event.target.value,
                      )
                    }
                    placeholder="Walking in Purpose"
                    className="input"
                    required
                  />
                </Field>

                <Field
                  label="Slug"
                  required
                  hint="Used in the public resource URL."
                >
                  <input
                    value={slug}
                    onChange={(event) =>
                      setSlug(event.target.value)
                    }
                    placeholder="walking-in-purpose"
                    className="input"
                    required
                  />
                </Field>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field
                    label="Resource Type"
                    required
                  >
                    <select
                      value={type}
                      onChange={(event) =>
                        setType(
                          event.target
                            .value as ResourceType,
                        )
                      }
                      className="input"
                    >
                      {resourceTypes.map(
                        (item) => (
                          <option
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ),
                      )}
                    </select>
                  </Field>

                  <Field label="Speaker">
                    <input
                      value={speaker}
                      onChange={(event) =>
                        setSpeaker(
                          event.target.value,
                        )
                      }
                      placeholder="Pastor Olawale Smith"
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    placeholder="Brief description of this resource..."
                    rows={5}
                    className="input resize-y"
                  />
                </Field>

                <Field
                  label="Article / Resource Content"
                  hint="For articles and written resources, write the content here."
                >
                  <textarea
                    value={content}
                    onChange={(event) =>
                      setContent(
                        event.target.value,
                      )
                    }
                    placeholder="Write the resource content here..."
                    rows={14}
                    className="input resize-y"
                  />
                </Field>
              </div>
            </section>

            {/* Media */}
            <section className="border border-charcoal/10 bg-white">
              <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                    Media
                  </p>

                  <h2 className="mt-2 text-xl font-medium">
                    Attach media
                  </h2>

                  <p className="mt-1 text-xs text-charcoal/40">
                    Add YouTube links, audio URLs,
                    PDFs, or other media.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addMedia}
                  className="inline-flex items-center gap-2 border border-charcoal/10 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:border-bronze hover:text-bronze"
                >
                  <Plus size={14} />
                  Add Media
                </button>
              </div>

              <div className="p-6">
                {media.length === 0 ? (
                  <div className="border border-dashed border-charcoal/10 px-6 py-12 text-center">
                    <Video
                      size={24}
                      strokeWidth={1.2}
                      className="mx-auto text-charcoal/20"
                    />

                    <p className="mt-4 text-sm text-charcoal/45">
                      No media attached yet.
                    </p>

                    <button
                      type="button"
                      onClick={addMedia}
                      className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze hover:underline"
                    >
                      Add your first media
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {media.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="border border-charcoal/10 p-5"
                        >
                          <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center bg-bronze/10 text-bronze">
                                {item.type ===
                                "AUDIO" ? (
                                  <Headphones
                                    size={16}
                                  />
                                ) : (
                                  <Video
                                    size={16}
                                  />
                                )}
                              </div>

                              <div>
                                <p className="text-xs font-medium">
                                  Media {index + 1}
                                </p>

                                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-charcoal/35">
                                  {item.type}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeMedia(
                                  index,
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center text-charcoal/30 transition-colors hover:bg-red-50 hover:text-red-500"
                              aria-label="Remove media"
                            >
                              <Trash2
                                size={15}
                              />
                            </button>
                          </div>

                          <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Media Type">
                              <select
                                value={
                                  item.type
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateMedia(
                                    index,
                                    "type",
                                    event.target
                                      .value,
                                  )
                                }
                                className="input"
                              >
                                {mediaTypes.map(
                                  (
                                    mediaType,
                                  ) => (
                                    <option
                                      key={
                                        mediaType.value
                                      }
                                      value={
                                        mediaType.value
                                      }
                                    >
                                      {
                                        mediaType.label
                                      }
                                    </option>
                                  ),
                                )}
                              </select>
                            </Field>

                            <Field label="Provider">
                              <select
                                value={
                                  item.provider
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateMedia(
                                    index,
                                    "provider",
                                    event.target
                                      .value,
                                  )
                                }
                                className="input"
                              >
                                {mediaProviders.map(
                                  (
                                    provider,
                                  ) => (
                                    <option
                                      key={
                                        provider.value
                                      }
                                      value={
                                        provider.value
                                      }
                                    >
                                      {
                                        provider.label
                                      }
                                    </option>
                                  ),
                                )}
                              </select>
                            </Field>
                          </div>

                          <div className="mt-5">
                            <Field label="Media Title">
                              <input
                                value={
                                  item.title
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateMedia(
                                    index,
                                    "title",
                                    event.target
                                      .value,
                                  )
                                }
                                placeholder="Walking in Purpose — Full Sermon"
                                className="input"
                              />
                            </Field>
                          </div>

                          <div className="mt-5">
                            <Field
                              label="URL"
                              hint="For YouTube, paste the full YouTube URL."
                            >
                              <input
                                type="url"
                                value={
                                  item.url
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateMedia(
                                    index,
                                    "url",
                                    event.target
                                      .value,
                                  )
                                }
                                placeholder="https://youtu.be/..."
                                className="input"
                              />
                            </Field>
                          </div>

                          <div className="mt-5">
                            <Field
                              label="External ID"
                              hint="For YouTube, this is normally the video ID."
                            >
                              <input
                                value={
                                  item.externalId
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateMedia(
                                    index,
                                    "externalId",
                                    event.target
                                      .value,
                                  )
                                }
                                placeholder="XyCHesmYev0"
                                className="input"
                              />
                            </Field>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="border border-charcoal/10 bg-white">
              <div className="border-b border-charcoal/10 px-6 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                  Publishing
                </p>

                <h2 className="mt-2 text-xl font-medium">
                  Visibility
                </h2>
              </div>

              <div className="space-y-5 p-6">
                <Toggle
                  label="Published"
                  description="Make this resource visible on the public website."
                  checked={published}
                  onChange={setPublished}
                />

                <Toggle
                  label="Featured"
                  description="Highlight this resource in featured sections."
                  checked={featured}
                  onChange={setFeatured}
                />
              </div>
            </section>

            {error && (
              <div className="border border-red-500/15 bg-red-500/[0.03] p-5">
                <p className="text-sm leading-6 text-red-600">
                  {error}
                </p>
              </div>
            )}

            <section className="border border-charcoal/10 bg-white p-6">
              <button
                type="submit"
                disabled={saving}
                className="group flex w-full items-center justify-center gap-2 bg-charcoal px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Creating Resource...
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    Create Resource
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>

              <Link
                href="/admin/dashboard/resources"
                className="mt-3 flex w-full items-center justify-center gap-2 border border-charcoal/10 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55 transition-colors hover:border-charcoal/20 hover:text-charcoal"
              >
                <X size={14} />
                Cancel
              </Link>
            </section>
          </aside>
        </form>
      </div>

      {/* Success Dialog */}
      {showSuccess && (
        <SuccessDialog
          onContinue={handleSuccessClose}
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
        {label}

        {required && (
          <span className="ml-1 text-bronze">
            *
          </span>
        )}
      </label>

      {hint && (
        <p className="mt-1 text-[11px] leading-5 text-charcoal/35">
          {hint}
        </p>
      )}

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-4 text-left"
    >
      <span
        className={[
          "relative mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked
            ? "bg-bronze"
            : "bg-charcoal/15",
        ].join(" ")}
      >
        <span
          className={[
            "absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform",
            checked
              ? "translate-x-[17px]"
              : "translate-x-[3px]",
          ].join(" ")}
        />
      </span>

      <span>
        <span className="block text-xs font-medium">
          {label}
        </span>

        <span className="mt-1 block text-[11px] leading-5 text-charcoal/40">
          {description}
        </span>
      </span>
    </button>
  );
}

function SuccessDialog({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md border border-charcoal/10 bg-white p-8 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-600">
          <Check size={25} strokeWidth={2} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze">
            Resource Created
          </p>

          <h2 className="mt-2 text-2xl font-medium tracking-tight">
            Successfully created
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-charcoal/45">
            The resource has been successfully
            added to your ministry library.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-8 flex w-full items-center justify-center gap-2 bg-charcoal px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze"
        >
          Continue to Resources
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}