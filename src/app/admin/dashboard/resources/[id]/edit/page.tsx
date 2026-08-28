"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileText,
  Headphones,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
  Eye,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getAdminCategories,
  getAdminResource,
  updateResource,
  type AdminCategory,
  type AdminResource,
  type UpdateResourceInput,
  type ResourceType,
  type MediaType,
  type MediaProvider,
} from "@/lib/admin-api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface MediaItem {
  id?: string;

  type: MediaType;
  provider: MediaProvider;

  title: string;
  url: string;
  externalId: string;

  storageKey?: string;
  mimeType?: string;

  /**
   * Prisma schema stores fileSize as String?.
   */
  fileSize?: string;

  /**
   * Duration is stored in seconds.
   */
  duration?: number;

  uploading?: boolean;
  fileName?: string;

  /**
   * Temporary browser URL used for previewing
   * a file before/during upload.
   */
  localPreviewUrl?: string;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

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
  { value: "CLOUDINARY", label: "Cloudinary" },
  { value: "EXTERNAL", label: "External URL" },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function cloudinaryConfig() {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary upload is not configured.",
    );
  }

  return {
    cloudName,
    uploadPreset,
  };
}

/**
 * Infer our Prisma MediaType from the browser File.
 */
function inferMediaType(file: File): MediaType {
  if (file.type.startsWith("audio/")) {
    return "AUDIO";
  }

  if (file.type === "application/pdf") {
    return "PDF";
  }

  if (file.type.startsWith("image/")) {
    return "IMAGE";
  }

  if (file.type.startsWith("video/")) {
    return "VIDEO";
  }

  throw new Error(
    "Unsupported file type. Please upload an audio, video, image, or PDF file.",
  );
}

/**
 * Upload a file directly to Cloudinary.
 *
 * IMPORTANT:
 * This happens immediately when the admin chooses
 * a file. It does NOT wait for Save Changes.
 */
async function uploadToCloudinary(file: File) {
  const {
    cloudName,
    uploadPreset,
  } = cloudinaryConfig();

  const form = new FormData();

  form.append("file", file);
  form.append(
    "upload_preset",
    uploadPreset,
  );

  form.append(
    "folder",
    "olawale-smith-ministries/resources",
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: form,
    },
  );

  const payload = await response.json();

  if (
    !response.ok ||
    !payload.secure_url
  ) {
    throw new Error(
      payload.error?.message ||
        "Cloudinary upload failed.",
    );
  }

  return payload as {
    secure_url: string;
    public_id?: string;
    bytes?: number;
    duration?: number;
    resource_type?: string;
    format?: string;
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();

  const resourceId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [loading, setLoading] =
    useState(true);

  const [loadingError, setLoadingError] =
    useState("");

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [categoriesError, setCategoriesError] =
    useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
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

  const [categories, setCategories] =
    useState<AdminCategory[]>([]);

  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<string[]>([]);

  const [media, setMedia] =
    useState<MediaItem[]>([]);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPreview, setShowPreview] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Load Resource                                                            */
  /* ------------------------------------------------------------------------ */

  async function loadResource() {
    if (!resourceId) {
      setLoading(false);
      setLoadingError(
        "Resource ID is missing.",
      );
      return;
    }

    try {
      setLoading(true);
      setLoadingError("");

      const response =
        await getAdminResource(resourceId);

      populateResource(response.data);
    } catch (e) {
      setLoadingError(
        e instanceof Error
          ? e.message
          : "Unable to load resource.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Load Categories                                                          */
  /* ------------------------------------------------------------------------ */

  async function loadCategories() {
    try {
      setCategoriesLoading(true);
      setCategoriesError("");

      const response =
        await getAdminCategories();

      setCategories(
        response.data ?? [],
      );
    } catch (e) {
      setCategoriesError(
        e instanceof Error
          ? e.message
          : "Unable to load categories.",
      );
    } finally {
      setCategoriesLoading(false);
    }
  }

  useEffect(() => {
    loadResource();
    loadCategories();
  }, [resourceId]);

  /* ------------------------------------------------------------------------ */
  /* Populate Form                                                            */
  /* ------------------------------------------------------------------------ */

  function populateResource(
    resource: AdminResource,
  ) {
    setTitle(resource.title ?? "");
    setSlug(resource.slug ?? "");

    setDescription(
      resource.description ?? "",
    );

    setContent(
      resource.content ?? "",
    );

    setType(
      resource.type ?? "SERMON",
    );

    setSpeaker(
      resource.speaker ?? "",
    );

    setFeatured(
      Boolean(resource.featured),
    );

    setPublished(
      Boolean(resource.published),
    );

    setSelectedCategoryIds(
      (resource.categories ?? [])
        .map(
          (category) =>
            category.categoryId ??
            category.category?.id,
        )
        .filter(
          (
            id,
          ): id is string =>
            Boolean(id),
        ),
    );

    setMedia(
      (resource.media ?? []).map(
        (mediaItem) => ({
          id: mediaItem.id,

          type: mediaItem.type,

          provider:
            mediaItem.provider,

          title:
            mediaItem.title ?? "",

          url:
            mediaItem.url ?? "",

          externalId:
            mediaItem.externalId ?? "",

          storageKey:
            mediaItem.storageKey ??
            undefined,

          mimeType:
            mediaItem.mimeType ??
            undefined,

          fileSize:
            mediaItem.fileSize ??
            undefined,

          duration:
            mediaItem.duration ??
            undefined,

          uploading: false,
        }),
      ),
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Categories                                                               */
  /* ------------------------------------------------------------------------ */

  function toggleCategory(
    id: string,
  ) {
    setSelectedCategoryIds(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) => item !== id,
            )
          : [...current, id],
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Media                                                                     */
  /* ------------------------------------------------------------------------ */

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
    patch: Partial<MediaItem>,
  ) {
    setMedia((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  function removeMedia(
    index: number,
  ) {
    setMedia((current) => {
      const item = current[index];

      if (item?.localPreviewUrl) {
        URL.revokeObjectURL(
          item.localPreviewUrl,
        );
      }

      return current.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      );
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Cloudinary Upload                                                        */
  /* ------------------------------------------------------------------------ */

  async function handleFileUpload(
    index: number,
    file?: File,
  ) {
    if (!file) {
      return;
    }

    setError("");

    let mediaType: MediaType;

    try {
      mediaType =
        inferMediaType(file);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unsupported file type.",
      );
      return;
    }

    const localPreviewUrl =
      URL.createObjectURL(file);

    /*
     * Clear any previous temporary preview.
     */
    setMedia((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (item.localPreviewUrl) {
          URL.revokeObjectURL(
            item.localPreviewUrl,
          );
        }

        return {
          ...item,

          type: mediaType,
          provider: "CLOUDINARY",

          uploading: true,

          fileName: file.name,

          localPreviewUrl,

          url: "",
          externalId: "",
          storageKey: undefined,

          mimeType:
            file.type || undefined,

          fileSize:
            String(file.size),
        };
      }),
    );

    try {
      const payload =
        await uploadToCloudinary(file);

      /*
       * IMPORTANT:
       *
       * The upload is now complete.
       * We keep the Cloudinary URL and
       * public_id in the form state.
       *
       * The resource itself is still NOT
       * saved until Save Changes is clicked.
       */
      updateMedia(index, {
        provider: "CLOUDINARY",

        type: mediaType,

        uploading: false,

        url: payload.secure_url,

        storageKey:
          payload.public_id,

        mimeType:
          file.type ||
          undefined,

        fileSize:
          String(
            payload.bytes ??
              file.size,
          ),

        duration:
          payload.duration
            ? Math.round(
                payload.duration,
              )
            : undefined,
      });

      /*
       * We can safely remove the temporary
       * browser preview after Cloudinary
       * has returned its permanent URL.
       */
      URL.revokeObjectURL(
        localPreviewUrl,
      );

      updateMedia(index, {
        localPreviewUrl:
          undefined,
      });
    } catch (e) {
      URL.revokeObjectURL(
        localPreviewUrl,
      );

      updateMedia(index, {
        uploading: false,
        localPreviewUrl:
          undefined,
        url: "",
        storageKey:
          undefined,
        fileSize:
          undefined,
      });

      setError(
        e instanceof Error
          ? e.message
          : "Unable to upload media.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Media Validation                                                         */
  /* ------------------------------------------------------------------------ */

  function validateMedia() {
    for (
      let index = 0;
      index < media.length;
      index++
    ) {
      const item = media[index];

      /*
       * Do not allow saving while Cloudinary
       * is still uploading.
       */
      if (item.uploading) {
        return `Media ${
          index + 1
        }: Please wait for the upload to finish.`;
      }

      /*
       * Completely empty media rows are allowed.
       */
      if (
        !item.url.trim() &&
        !item.externalId.trim()
      ) {
        continue;
      }

      /*
       * Every non-empty media item must
       * have a media type.
       */
      if (!item.type) {
        return `Media ${
          index + 1
        }: Media type is required.`;
      }

      /*
       * YouTube can use externalId instead
       * of a URL.
       */
      if (
        item.provider ===
        "YOUTUBE"
      ) {
        if (
          !item.url.trim() &&
          !item.externalId.trim()
        ) {
          return `Media ${
            index + 1
          }: Please provide a YouTube URL or video ID.`;
        }

        continue;
      }

      /*
       * Cloudinary and external media
       * require a URL.
       */
      if (!item.url.trim()) {
        return `Media ${
          index + 1
        }: Please provide a media URL.`;
      }
    }

    return "";
  }

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                    */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const trimmedTitle =
      title.trim();

    const trimmedSlug =
      slug.trim();

    if (!trimmedTitle) {
      setError(
        "Please enter a resource title.",
      );
      return;
    }

    if (!trimmedSlug) {
      setError(
        "Please enter a resource slug.",
      );
      return;
    }

    const mediaError =
      validateMedia();

    if (mediaError) {
      setError(mediaError);
      return;
    }

    try {
      setSaving(true);

      /*
       * Only send media rows that actually
       * contain media.
       */
      const mediaPayload =
        media
          .filter(
            (item) =>
              item.url.trim() ||
              item.externalId.trim(),
          )
          .map((item) => ({
            type: item.type,

            provider:
              item.provider,

            title:
              item.title.trim() ||
              undefined,

            url:
              item.url.trim() ||
              undefined,

            externalId:
              item.externalId.trim() ||
              undefined,

            storageKey:
              item.storageKey,

            mimeType:
              item.mimeType,

            /*
             * IMPORTANT:
             *
             * Do NOT convert this to Number().
             *
             * Your Prisma schema defines
             * MediaAsset.fileSize as String?.
             */
            fileSize:
              item.fileSize,

            duration:
              item.duration,
          }));

      const input: UpdateResourceInput = {
        title: trimmedTitle,

        slug: trimmedSlug,

        description:
          description.trim() ||
          undefined,

        content:
          content.trim() ||
          undefined,

        type,

        speaker:
          speaker.trim() ||
          undefined,

        featured,

        published,

        categoryIds:
          selectedCategoryIds,

        media: mediaPayload,
      };

      await updateResource(
        resourceId,
        input,
      );

      setShowSuccess(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to update resource.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                   */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory text-charcoal">
        <div className="flex items-center gap-3 text-sm text-charcoal/45">
          <Loader2
            size={18}
            className="animate-spin text-bronze"
          />

          Loading resource...
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Loading Error                                                             */
  /* ------------------------------------------------------------------------ */

  if (loadingError) {
    return (
      <main className="min-h-screen bg-ivory px-6 py-10 text-charcoal">
        <div className="mx-auto max-w-xl border border-red-500/15 bg-white p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-500">
            Resource Error
          </p>

          <h1 className="mt-2 text-2xl font-medium">
            Unable to load resource
          </h1>

          <p className="mt-3 text-sm leading-6 text-charcoal/45">
            {loadingError}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={loadResource}
              className="bg-charcoal px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory"
            >
              Try Again
            </button>

            <Link
              href="/admin/dashboard/resources"
              className="border border-charcoal/10 bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/60"
            >
              Back to Resources
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Main                                                                      */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <header className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-10">
          <Link
            href="/admin/dashboard/resources"
            className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/45 hover:text-bronze"
          >
            <ArrowLeft size={14} />
            Back to Resources
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bronze">
            Content Management
          </p>

          <h1 className="display-heading mt-2 text-3xl sm:text-4xl">
            Edit Resource
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-charcoal/45">
            Update the resource details,
            organization, publishing status,
            and attached media.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-12">
        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="space-y-8">
            {/* Basic Information */}
            <section className="border border-charcoal/10 bg-white">
              <SectionHead
                eyebrow="Basic Information"
                title="Resource details"
              />

              <div className="space-y-6 p-6">
                <Field
                  label="Title"
                  required
                >
                  <input
                    value={title}
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      setTitle(value);

                      if (!slug.trim()) {
                        setSlug(
                          slugify(value),
                        );
                      }
                    }}
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
                      setSlug(
                        slugify(
                          event.target.value,
                        ),
                      )
                    }
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
                            key={
                              item.value
                            }
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
                    rows={5}
                    className="input resize-y"
                  />
                </Field>

                <Field label="Article / Resource Content">
                  <textarea
                    value={content}
                    onChange={(event) =>
                      setContent(
                        event.target.value,
                      )
                    }
                    rows={14}
                    className="input resize-y"
                  />
                </Field>
              </div>
            </section>

            {/* Categories */}
            <section className="border border-charcoal/10 bg-white">
              <SectionHead
                eyebrow="Organization"
                title="Categories"
                description="Assign one or more categories to organize this resource."
              />

              <div className="p-6">
                {categoriesLoading ? (
                  <Loader2 className="animate-spin text-bronze" />
                ) : categoriesError ? (
                  <p className="text-sm text-red-600">
                    {categoriesError}
                  </p>
                ) : categories.length === 0 ? (
                  <p className="border border-dashed border-charcoal/10 p-8 text-center text-sm text-charcoal/45">
                    No categories have
                    been created yet.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {categories.map(
                      (category) => {
                        const selected =
                          selectedCategoryIds.includes(
                            category.id,
                          );

                        return (
                          <button
                            type="button"
                            key={category.id}
                            onClick={() =>
                              toggleCategory(
                                category.id,
                              )
                            }
                            className={`flex items-start gap-3 border p-4 text-left ${
                              selected
                                ? "border-bronze bg-bronze/[0.06]"
                                : "border-charcoal/10 hover:border-bronze/40"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                                selected
                                  ? "border-bronze bg-bronze text-ivory"
                                  : "border-charcoal/20"
                              }`}
                            >
                              {selected && (
                                <Check size={11} />
                              )}
                            </span>

                            <span>
                              <span className="block text-xs font-medium">
                                {
                                  category.name
                                }
                              </span>

                              <span className="mt-1 block text-[10px] text-charcoal/35">
                                /
                                {
                                  category.slug
                                }
                              </span>
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                )}

                {selectedCategoryIds.length >
                  0 && (
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-bronze">
                    {
                      selectedCategoryIds.length
                    }{" "}
                    {selectedCategoryIds.length ===
                    1
                      ? "category"
                      : "categories"}{" "}
                    selected
                  </p>
                )}
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
                    Upload device files
                    directly to Cloudinary
                    before saving, or attach
                    YouTube/external media.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addMedia}
                  className="inline-flex items-center gap-2 border border-charcoal/10 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] hover:border-bronze hover:text-bronze"
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
                      className="mx-auto text-charcoal/20"
                    />

                    <p className="mt-4 text-sm text-charcoal/45">
                      No media attached
                      yet.
                    </p>

                    <button
                      type="button"
                      onClick={addMedia}
                      className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze"
                    >
                      Add your first media
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {media.map(
                      (item, index) => (
                        <MediaEditor
                          key={
                            item.id ??
                            `new-${index}`
                          }
                          item={item}
                          index={index}
                          onUpdate={(
                            patch,
                          ) =>
                            updateMedia(
                              index,
                              patch,
                            )
                          }
                          onRemove={() =>
                            removeMedia(
                              index,
                            )
                          }
                          onFile={(file) =>
                            handleFileUpload(
                              index,
                              file,
                            )
                          }
                        />
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
              <SectionHead
                eyebrow="Publishing"
                title="Visibility"
              />

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
              <div className="border border-red-500/15 bg-red-500/[0.03] p-5 text-sm leading-6 text-red-600">
                {error}
              </div>
            )}

            <section className="border border-charcoal/10 bg-white p-6">
              <button
                type="button"
                onClick={() =>
                  setShowPreview(true)
                }
                className="flex w-full items-center justify-center gap-2 border border-charcoal/10 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] hover:border-bronze hover:text-bronze"
              >
                <Eye size={15} />
                Preview Resource
              </button>

              <button
                type="submit"
                disabled={
                  saving ||
                  media.some(
                    (item) =>
                      item.uploading,
                  )
                }
                className="mt-3 flex w-full items-center justify-center gap-2 bg-charcoal px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-bronze disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    Save Changes
                    <ArrowUpRight
                      size={14}
                    />
                  </>
                )}
              </button>

              <Link
                href="/admin/dashboard/resources"
                className="mt-3 flex w-full items-center justify-center gap-2 border border-charcoal/10 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55"
              >
                <X size={14} />
                Cancel
              </Link>
            </section>
          </aside>
        </form>
      </div>

      {showPreview && (
        <PreviewDialog
          title={title}
          description={description}
          content={content}
          type={type}
          speaker={speaker}
          media={media}
          onClose={() =>
            setShowPreview(false)
          }
        />
      )}

      {showSuccess && (
        <SuccessDialog
          onContinue={() =>
            router.push(
              "/admin/dashboard/resources",
            )
          }
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Media Editor                                                               */
/* -------------------------------------------------------------------------- */

function MediaEditor({
  item,
  index,
  onUpdate,
  onRemove,
  onFile,
}: {
  item: MediaItem;
  index: number;
  onUpdate: (
    patch: Partial<MediaItem>,
  ) => void;
  onRemove: () => void;
  onFile: (file?: File) => void;
}) {
  const icon =
    item.type === "AUDIO" ? (
      <Headphones size={16} />
    ) : item.type === "PDF" ? (
      <FileText size={16} />
    ) : item.type === "IMAGE" ? (
      <ImageIcon size={16} />
    ) : (
      <Video size={16} />
    );

  const previewUrl =
    item.localPreviewUrl ||
    item.url;

  return (
    <div className="border border-charcoal/10 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-bronze/10 text-bronze">
            {icon}
          </div>

          <div>
            <p className="text-xs font-medium">
              Media {index + 1}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-charcoal/35">
              {item.type} ·{" "}
              {item.provider}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 items-center justify-center text-charcoal/30 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Media Type">
          <select
            value={item.type}
            onChange={(event) =>
              onUpdate({
                type: event.target
                  .value as MediaType,
              })
            }
            className="input"
          >
            {mediaTypes.map(
              (mediaType) => (
                <option
                  key={
                    mediaType.value
                  }
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
            onChange={(event) => {
              const provider =
                event.target
                  .value as MediaProvider;

              onUpdate({
                provider,

                externalId:
                  provider ===
                  "YOUTUBE"
                    ? item.externalId
                    : "",

                /*
                 * When switching away from
                 * Cloudinary, don't accidentally
                 * keep Cloudinary storage data.
                 */
                ...(provider !==
                  "CLOUDINARY" && {
                  storageKey:
                    undefined,
                  mimeType:
                    undefined,
                  fileSize:
                    undefined,
                }),
              });
            }}
            className="input"
          >
            {mediaProviders.map(
              (provider) => (
                <option
                  key={
                    provider.value
                  }
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

      <div className="mt-5">
        <Field label="Media Title">
          <input
            value={item.title}
            onChange={(event) =>
              onUpdate({
                title:
                  event.target.value,
              })
            }
            className="input"
            placeholder="Walking in Purpose — Full Sermon"
          />
        </Field>
      </div>

      {/* Device Upload */}
      <div className="mt-5 border border-dashed border-bronze/30 bg-bronze/[0.03] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-bronze">
              Device Upload
            </p>

            <p className="mt-1 text-[11px] leading-5 text-charcoal/40">
              Upload immediately to
              Cloudinary. Saving the
              resource is separate.
            </p>
          </div>

          <input
            type="file"
            className="hidden"
            accept="audio/*,video/*,image/*,application/pdf"
            id={`media-upload-${index}`}
            onChange={(event) => {
              onFile(
                event.target.files?.[0],
              );

              event.currentTarget.value =
                "";
            }}
          />

          <label
            htmlFor={`media-upload-${index}`}
            className={`inline-flex cursor-pointer items-center gap-2 bg-charcoal px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory ${
              item.uploading
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >
            <Upload size={14} />

            {item.uploading
              ? "Uploading..."
              : "Choose File"}
          </label>
        </div>

        {item.fileName && (
          <p className="mt-3 truncate text-xs text-charcoal/55">
            {item.fileName}
          </p>
        )}

        {item.uploading && (
          <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-bronze">
            <Loader2
              size={13}
              className="animate-spin"
            />
            Uploading to Cloudinary...
          </div>
        )}

        {item.url &&
          item.provider ===
            "CLOUDINARY" &&
          !item.uploading && (
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-green-700">
              Uploaded to Cloudinary
            </p>
          )}
      </div>

      {/* External / YouTube */}
      {item.provider !==
        "CLOUDINARY" && (
        <>
          <div className="mt-5">
            <Field
              label="URL"
              hint={
                item.provider ===
                "YOUTUBE"
                  ? "Paste the full YouTube URL."
                  : "Paste the direct media URL."
              }
            >
              <input
                type="url"
                value={item.url}
                onChange={(event) =>
                  onUpdate({
                    url: event.target
                      .value,
                  })
                }
                placeholder={
                  item.provider ===
                  "YOUTUBE"
                    ? "https://youtu.be/..."
                    : "https://..."
                }
                className="input"
              />
            </Field>
          </div>

          {item.provider ===
            "YOUTUBE" && (
            <div className="mt-5">
              <Field
                label="YouTube Video ID"
                hint="Optional when the URL is provided."
              >
                <input
                  value={
                    item.externalId
                  }
                  onChange={(event) =>
                    onUpdate({
                      externalId:
                        event.target
                          .value,
                    })
                  }
                  placeholder="XyCHesmYev0"
                  className="input"
                />
              </Field>
            </div>
          )}
        </>
      )}

      {/* Media Preview */}
      {previewUrl && (
        <div className="mt-4 overflow-hidden border border-charcoal/10 bg-black">
          {item.type === "IMAGE" ? (
            <img
              src={previewUrl}
              alt={
                item.title ||
                "Uploaded media"
              }
              className="max-h-72 w-full object-contain"
            />
          ) : item.type === "VIDEO" &&
            item.provider ===
              "CLOUDINARY" ? (
            <video
              controls
              preload="metadata"
              className="max-h-72 w-full"
              src={previewUrl}
            />
          ) : item.type === "AUDIO" &&
            item.provider ===
              "CLOUDINARY" ? (
            <audio
              controls
              className="w-full p-4"
              src={previewUrl}
            />
          ) : item.type === "PDF" &&
            item.provider ===
              "CLOUDINARY" ? (
            <div className="p-6 text-center text-sm text-white/70">
              PDF uploaded and
              ready.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Preview Dialog                                                             */
/* -------------------------------------------------------------------------- */

function PreviewDialog({
  title,
  description,
  content,
  type,
  speaker,
  media,
  onClose,
}: {
  title: string;
  description: string;
  content: string;
  type: ResourceType;
  speaker: string;
  media: MediaItem[];
  onClose: () => void;
}) {
  const previewableMedia =
    media.filter(
      (item) =>
        item.url.trim() ||
        item.externalId.trim(),
    );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 p-4 backdrop-blur-sm">
      <div className="mx-auto my-8 max-w-4xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
              Draft Preview
            </p>

            <h2 className="mt-1 text-xl font-medium">
              Public Resource Preview
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-charcoal/10"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze">
            {type}
          </p>

          <h1 className="display-heading mt-3 text-4xl sm:text-5xl">
            {title ||
              "Untitled resource"}
          </h1>

          {speaker && (
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">
              {speaker}
            </p>
          )}

          {description && (
            <p className="mt-6 max-w-2xl text-base leading-8 text-charcoal/60">
              {description}
            </p>
          )}

          {content && (
            <div className="mt-8 whitespace-pre-wrap border-t border-charcoal/10 pt-8 text-sm leading-8 text-charcoal/70">
              {content}
            </div>
          )}

          {previewableMedia.length >
            0 && (
            <div className="mt-10 space-y-6 border-t border-charcoal/10 pt-8">
              {previewableMedia.map(
                (item, index) => (
                  <PreviewMedia
                    key={
                      item.id ??
                      index
                    }
                    media={item}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Preview Media                                                              */
/* -------------------------------------------------------------------------- */

function PreviewMedia({
  media,
}: {
  media: MediaItem;
}) {
  if (
    media.provider ===
    "YOUTUBE"
  ) {
    const id =
      media.externalId ||
      media.url.match(
        /(?:v=|youtu\.be\/|shorts\/|embed\/)([^?&/]+)/,
      )?.[1];

    return id ? (
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={
          media.title ||
          "YouTube video"
        }
        className="aspect-video w-full bg-black"
        allowFullScreen
      />
    ) : null;
  }

  if (media.type === "VIDEO") {
    return (
      <video
        controls
        className="max-h-[520px] w-full bg-black"
        src={
          media.localPreviewUrl ||
          media.url
        }
      />
    );
  }

  if (media.type === "AUDIO") {
    return (
      <audio
        controls
        className="w-full"
        src={
          media.localPreviewUrl ||
          media.url
        }
      />
    );
  }

  if (media.type === "IMAGE") {
    return (
      <img
        src={
          media.localPreviewUrl ||
          media.url
        }
        alt={
          media.title ||
          "Resource image"
        }
        className="max-h-[520px] w-full object-contain"
      />
    );
  }

  return (
    <a
      href={media.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm font-semibold text-bronze"
    >
      Open PDF
      <ArrowUpRight size={14} />
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* Section Header                                                             */
/* -------------------------------------------------------------------------- */

function SectionHead({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-charcoal/10 px-6 py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-medium">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-xs text-charcoal/40">
          {description}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Field                                                                      */
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
  children: ReactNode;
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

/* -------------------------------------------------------------------------- */
/* Toggle                                                                     */
/* -------------------------------------------------------------------------- */

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
      onClick={() =>
        onChange(!checked)
      }
      className="flex w-full items-start gap-4 text-left"
    >
      <span
        className={`relative mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full ${
          checked
            ? "bg-bronze"
            : "bg-charcoal/15"
        }`}
      >
        <span
          className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm ${
            checked
              ? "translate-x-[17px]"
              : "translate-x-[3px]"
          }`}
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

/* -------------------------------------------------------------------------- */
/* Success Dialog                                                             */
/* -------------------------------------------------------------------------- */

function SuccessDialog({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md border border-charcoal/10 bg-white p-8 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-600">
          <Check size={25} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze">
            Resource Updated
          </p>

          <h2 className="mt-2 text-2xl font-medium">
            Successfully updated
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-charcoal/45">
            The resource has been
            successfully updated in
            your ministry library.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-8 flex w-full items-center justify-center gap-2 bg-charcoal px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory"
        >
          Continue to Resources
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}