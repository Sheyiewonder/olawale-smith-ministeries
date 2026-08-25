"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Video,
  Headphones,
  BookOpen,
  Mic2,
  Music2,
  Save,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  getAdminResource,
  updateResource,
  type AdminResource,
  type UpdateResourceInput,
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

interface MediaForm {
  id?: string;
  type: MediaType;
  provider: MediaProvider;
  title: string;
  url: string;
  storageKey: string;
  externalId: string;
  mimeType: string;
  duration: string;
}

const resourceTypes: {
  value: ResourceType;
  label: string;
}[] = [
  {
    value: "SERMON",
    label: "Sermon",
  },
  {
    value: "EBOOK",
    label: "Ebook",
  },
  {
    value: "SONG",
    label: "Song",
  },
  {
    value: "VIDEO",
    label: "Video",
  },
  {
    value: "PODCAST",
    label: "Podcast",
  },
  {
    value: "ARTICLE",
    label: "Article",
  },
];

const mediaTypes: {
  value: MediaType;
  label: string;
}[] = [
  {
    value: "AUDIO",
    label: "Audio",
  },
  {
    value: "PDF",
    label: "PDF",
  },
  {
    value: "IMAGE",
    label: "Image",
  },
  {
    value: "VIDEO",
    label: "Video",
  },
];

const mediaProviders: {
  value: MediaProvider;
  label: string;
}[] = [
  {
    value: "R2",
    label: "Cloudflare R2",
  },
  {
    value: "YOUTUBE",
    label: "YouTube",
  },
  {
    value: "SUPABASE",
    label: "Supabase",
  },
  {
    value: "EXTERNAL",
    label: "External URL",
  },
];

export default function EditResourcePage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  const [resource, setResource] =
    useState<AdminResource | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [content, setContent] =
    useState("");

  const [type, setType] =
    useState<ResourceType>("SERMON");

  const [speaker, setSpeaker] =
    useState("");

  const [featured, setFeatured] =
    useState(false);

  const [published, setPublished] =
    useState(false);

  const [media, setMedia] =
    useState<MediaForm[]>([]);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function loadResource() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminResource(id);

        const data = response.data;

        setResource(data);

        setTitle(data.title);
        setSlug(data.slug);
        setDescription(
          data.description ?? "",
        );
        setContent(data.content ?? "");
        setType(data.type);
        setSpeaker(
          data.speaker ?? "",
        );
        setFeatured(data.featured);
        setPublished(data.published);

        setMedia(
          (data.media ?? []).map(
            (item) => ({
              id: item.id,
              type: item.type,
              provider: item.provider,
              title: item.title ?? "",
              url: item.url ?? "",
              storageKey:
                item.storageKey ?? "",
              externalId:
                item.externalId ?? "",
              mimeType:
                item.mimeType ?? "",
              duration:
                item.duration
                  ? String(item.duration)
                  : "",
            }),
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load resource.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadResource();
  }, [id]);

  function updateMedia(
    index: number,
    changes: Partial<MediaForm>,
  ) {
    setMedia((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              ...changes,
            }
          : item,
      ),
    );
  }

  function addMedia() {
    setMedia((current) => [
      ...current,
      {
        type: "VIDEO",
        provider: "YOUTUBE",
        title: "",
        url: "",
        storageKey: "",
        externalId: "",
        mimeType: "",
        duration: "",
      },
    ]);
  }

  function removeMedia(index: number) {
    setMedia((current) =>
      current.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      const payload: UpdateResourceInput = {
        title: title.trim(),
        slug: slug.trim(),
        description:
          description.trim() || undefined,
        content:
          content.trim() || undefined,
        type,
        speaker:
          speaker.trim() || undefined,
        featured,
        published,
        media: media.map((item) => ({
          id: item.id,
          type: item.type,
          provider: item.provider,
          title:
            item.title.trim() || undefined,
          url:
            item.url.trim() || undefined,
          storageKey:
            item.storageKey.trim() ||
            undefined,
          externalId:
            item.externalId.trim() ||
            undefined,
          mimeType:
            item.mimeType.trim() ||
            undefined,
          duration:
            item.duration.trim()
              ? Number(item.duration)
              : undefined,
        })),
      };

      const response =
        await updateResource(
          id,
          payload,
        );

      setResource(response.data);
      setSuccess(true);

      setTimeout(() => {
        router.push(
          "/admin/dashboard/resources",
        );
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update resource.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error && !resource) {
    return (
      <main className="min-h-screen bg-ivory text-charcoal">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <div className="w-full border border-red-500/15 bg-white p-10 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <Link
              href="/admin/dashboard/resources"
              className="mt-6 inline-flex items-center gap-2 border border-charcoal/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-bronze hover:text-bronze"
            >
              <ArrowLeft size={14} />
              Back to Resources
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <header className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-6 py-6 lg:px-10">
          <div>
            <Link
              href="/admin/dashboard/resources"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/45 transition-colors hover:text-bronze"
            >
              <ArrowLeft size={13} />
              Back to Resources
            </Link>

            <div className="mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bronze">
                Content Management
              </p>

              <h1 className="display-heading mt-2 text-3xl sm:text-4xl">
                Edit Resource
              </h1>

              {resource && (
                <p className="mt-2 text-xs text-charcoal/40">
                  Editing "{resource.title}"
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            form="edit-resource-form"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-charcoal px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <Save size={14} />
            )}

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10 lg:py-12">
        {error && (
          <div className="mb-8 flex items-start justify-between gap-4 border border-red-500/15 bg-red-500/[0.03] px-5 py-4 text-sm text-red-600">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-8 flex items-center gap-3 border border-green-500/15 bg-green-500/[0.04] px-5 py-4 text-sm text-green-700">
            <Check size={17} />
            Resource updated successfully. Redirecting...
          </div>
        )}

        <form
          id="edit-resource-form"
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="space-y-8">
            <section className="border border-charcoal/10 bg-white">
              <SectionHeading
                title="Basic Information"
                description="Core information displayed across the ministry resource library."
              />

              <div className="space-y-6 p-6 lg:p-8">
                <Field
                  label="Title"
                  required
                >
                  <input
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value,
                      )
                    }
                    required
                    className={inputClass}
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
                      setSlug(
                        event.target.value,
                      )
                    }
                    required
                    className={inputClass}
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    rows={5}
                    className={`${inputClass} resize-y py-3`}
                  />
                </Field>

                <Field
                  label="Article / Resource Content"
                  hint="For articles and written resources."
                >
                  <textarea
                    value={content}
                    onChange={(event) =>
                      setContent(
                        event.target.value,
                      )
                    }
                    rows={14}
                    className={`${inputClass} resize-y py-3`}
                    placeholder="Write the resource content here..."
                  />
                </Field>
              </div>
            </section>

            <section className="border border-charcoal/10 bg-white">
              <SectionHeading
                title="Media"
                description="Attach YouTube videos, audio, PDFs, images or external resources."
              />

              <div className="p-6 lg:p-8">
                {media.length === 0 ? (
                  <div className="border border-dashed border-charcoal/15 px-6 py-10 text-center">
                    <FileText
                      size={24}
                      strokeWidth={1.2}
                      className="mx-auto text-charcoal/20"
                    />

                    <p className="mt-4 text-sm text-charcoal/45">
                      No media attached.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {media.map(
                      (item, index) => (
                        <MediaCard
                          key={
                            item.id ??
                            `media-${index}`
                          }
                          item={item}
                          index={index}
                          onChange={
                            updateMedia
                          }
                          onRemove={
                            removeMedia
                          }
                        />
                      ),
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addMedia}
                  className="mt-5 inline-flex items-center gap-2 border border-charcoal/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-bronze hover:text-bronze"
                >
                  <Plus size={14} />
                  Add Media
                </button>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="border border-charcoal/10 bg-white">
              <SectionHeading
                title="Publishing"
                description="Control how this resource appears publicly."
              />

              <div className="space-y-5 p-6">
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
                    className={inputClass}
                  >
                    {resourceTypes.map(
                      (item) => (
                        <option
                          key={item.value}
                          value={
                            item.value
                          }
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
                    className={inputClass}
                    placeholder="Pastor Olawale Smith"
                  />
                </Field>

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

            <section className="border border-charcoal/10 bg-white p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-bronze/10 text-bronze">
                  <FileText size={16} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/35">
                    Resource ID
                  </p>

                  <p className="mt-2 break-all text-xs text-charcoal/55">
                    {id}
                  </p>
                </div>
              </div>
            </section>

            <Link
              href="/admin/dashboard/resources"
              className="flex items-center justify-center gap-2 border border-charcoal/10 bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-charcoal/25"
            >
              <ArrowLeft size={14} />
              Cancel
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}

function MediaCard({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: MediaForm;
  index: number;
  onChange: (
    index: number,
    changes: Partial<MediaForm>,
  ) => void;
  onRemove: (index: number) => void;
}) {
  const Icon =
    item.type === "VIDEO"
      ? Video
      : item.type === "AUDIO"
        ? Headphones
        : item.type === "PDF"
          ? BookOpen
          : FileText;

  return (
    <div className="border border-charcoal/10 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-bronze/10 text-bronze">
            <Icon size={16} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/35">
              Media {index + 1}
            </p>

            <p className="mt-1 text-xs text-charcoal/45">
              {item.provider}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onRemove(index)
          }
          className="flex h-8 w-8 items-center justify-center text-red-500/60 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Remove media"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Media Type">
          <select
            value={item.type}
            onChange={(event) =>
              onChange(index, {
                type: event.target
                  .value as MediaType,
              })
            }
            className={inputClass}
          >
            {mediaTypes.map(
              (mediaType) => (
                <option
                  key={mediaType.value}
                  value={
                    mediaType.value
                  }
                >
                  {mediaType.label}
                </option>
              ),
            )}
          </select>
        </Field>

        <Field label="Provider">
          <select
            value={item.provider}
            onChange={(event) =>
              onChange(index, {
                provider:
                  event.target
                    .value as MediaProvider,
              })
            }
            className={inputClass}
          >
            {mediaProviders.map(
              (provider) => (
                <option
                  key={provider.value}
                  value={
                    provider.value
                  }
                >
                  {provider.label}
                </option>
              ),
            )}
          </select>
        </Field>
      </div>

      <div className="mt-5 space-y-5">
        <Field label="Title">
          <input
            value={item.title}
            onChange={(event) =>
              onChange(index, {
                title:
                  event.target.value,
              })
            }
            className={inputClass}
            placeholder="Media title"
          />
        </Field>

        <Field
          label="URL"
          hint="YouTube link, PDF URL, audio URL, etc."
        >
          <input
            value={item.url}
            onChange={(event) =>
              onChange(index, {
                url: event.target.value,
              })
            }
            className={inputClass}
            placeholder="https://..."
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="External ID">
            <input
              value={item.externalId}
              onChange={(event) =>
                onChange(index, {
                  externalId:
                    event.target.value,
                })
              }
              className={inputClass}
              placeholder="YouTube video ID"
            />
          </Field>

          <Field label="Storage Key">
            <input
              value={item.storageKey}
              onChange={(event) =>
                onChange(index, {
                  storageKey:
                    event.target.value,
                })
              }
              className={inputClass}
              placeholder="Optional"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="MIME Type">
            <input
              value={item.mimeType}
              onChange={(event) =>
                onChange(index, {
                  mimeType:
                    event.target.value,
                })
              }
              className={inputClass}
              placeholder="application/pdf"
            />
          </Field>

          <Field label="Duration (seconds)">
            <input
              type="number"
              min="0"
              value={item.duration}
              onChange={(event) =>
                onChange(index, {
                  duration:
                    event.target.value,
                })
              }
              className={inputClass}
              placeholder="3600"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-charcoal/10 px-6 py-5 lg:px-8">
      <h2 className="text-sm font-medium">
        {title}
      </h2>

      <p className="mt-1 text-xs leading-5 text-charcoal/40">
        {description}
      </p>
    </div>
  );
}

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
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
        {label}

        {required && (
          <span className="ml-1 text-bronze">
            *
          </span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-2 text-[11px] leading-5 text-charcoal/35">
          {hint}
        </p>
      )}
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
  onChange: (
    checked: boolean,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className="flex w-full items-start gap-4 border border-charcoal/10 p-4 text-left transition-colors hover:border-bronze/30"
    >
      <span
        className={[
          "relative mt-0.5 flex h-5 w-9 shrink-0 rounded-full transition-colors",
          checked
            ? "bg-bronze"
            : "bg-charcoal/15",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform",
            checked
              ? "translate-x-[19px]"
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

function LoadingState() {
  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2
            size={25}
            className="mx-auto animate-spin text-bronze"
          />

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal/40">
            Loading resource
          </p>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  "h-11 w-full border border-charcoal/10 bg-ivory px-3 text-sm text-charcoal outline-none transition-all placeholder:text-charcoal/25 focus:border-bronze/50 focus:ring-2 focus:ring-bronze/10";