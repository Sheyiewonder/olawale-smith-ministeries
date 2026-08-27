"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import {
  FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createResource,
  getAdminCategories,
  getAdminSeries,
  uploadAdminMedia,
  type AdminCategory,
  type AdminSeries,
  type CreateResourceInput,
  type ResourceType,
  type MediaType,
  type MediaProvider,
} from "@/lib/admin-api";

/* -------------------------------------------------------------------------- */
/* Media Item                                                                 */
/* -------------------------------------------------------------------------- */

interface MediaItem {
  type: MediaType;
  provider: MediaProvider;
  title: string;

  url: string;
  storageKey: string;
  externalId: string;

  mimeType: string;
  fileSize: string;
  duration?: number;

  source: "UPLOAD" | "EXTERNAL";

  file?: File;
  uploading?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Resource Types                                                             */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Media Types                                                                */
/* -------------------------------------------------------------------------- */

const mediaTypes: {
  value: MediaType;
  label: string;
}[] = [
  {
    value: "VIDEO",
    label: "Video",
  },
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
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getUploadType(
  type: MediaType,
): "AUDIO" | "PDF" | "IMAGE" | null {
  if (
    type === "AUDIO" ||
    type === "PDF" ||
    type === "IMAGE"
  ) {
    return type;
  }

  return null;
}

function getAcceptedFileTypes(
  type: MediaType,
): string {
  switch (type) {
    case "AUDIO":
      return [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/x-wav",
        "audio/ogg",
        "audio/mp4",
        "audio/aac",
        "audio/webm",
      ].join(",");

    case "PDF":
      return "application/pdf";

    case "IMAGE":
      return "image/jpeg,image/png,image/webp";

    case "VIDEO":
      return "";

    default:
      return "";
  }
}

function getExternalProvider(
  type: MediaType,
): MediaProvider {
  if (type === "VIDEO") {
    return "YOUTUBE";
  }

  return "EXTERNAL";
}

function getMediaIcon(
  type: MediaType,
) {
  switch (type) {
    case "AUDIO":
      return Headphones;

    case "PDF":
      return FileText;

    case "IMAGE":
      return ImageIcon;

    case "VIDEO":
    default:
      return Video;
  }
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function NewResourcePage() {
  const router = useRouter();

  /* ------------------------------------------------------------------------ */
  /* Basic Resource State                                                     */
  /* ------------------------------------------------------------------------ */

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] =
    useState("");
  const [content, setContent] = useState("");

  const [type, setType] =
    useState<ResourceType>("SERMON");

  const [speaker, setSpeaker] =
    useState("");

  const [featured, setFeatured] =
    useState(false);

  const [published, setPublished] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Categories                                                               */
  /* ------------------------------------------------------------------------ */

  const [categories, setCategories] =
    useState<AdminCategory[]>([]);

  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState<string[]>([]);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [categoriesError, setCategoriesError] =
    useState("");

  /* ------------------------------------------------------------------------ */
  /* Series                                                                    */
  /* ------------------------------------------------------------------------ */

  const [series, setSeries] =
    useState<AdminSeries[]>([]);

  const [selectedSeriesId, setSelectedSeriesId] =
    useState("");

  const [seriesLoading, setSeriesLoading] =
    useState(true);

  const [seriesError, setSeriesError] =
    useState("");

  /* ------------------------------------------------------------------------ */
  /* Media                                                                    */
  /* ------------------------------------------------------------------------ */

  const [media, setMedia] =
    useState<MediaItem[]>([]);

  const fileInputRefs =
    useRef<
      Record<number, HTMLInputElement | null>
    >({});

  /* ------------------------------------------------------------------------ */
  /* Submission                                                               */
  /* ------------------------------------------------------------------------ */

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Load Categories                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const response =
          await getAdminCategories();

        if (!mounted) {
          return;
        }

        setCategories(
          response.data ?? [],
        );
      } catch (error) {
        if (!mounted) {
          return;
        }

        setCategoriesError(
          error instanceof Error
            ? error.message
            : "Unable to load categories.",
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
  /* Load Series                                                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    async function loadSeries() {
      try {
        setSeriesLoading(true);
        setSeriesError("");

        const response =
          await getAdminSeries();

        if (!mounted) {
          return;
        }

        setSeries(
          response.data ?? [],
        );
      } catch (error) {
        if (!mounted) {
          return;
        }

        setSeriesError(
          error instanceof Error
            ? error.message
            : "Unable to load series.",
        );
      } finally {
        if (mounted) {
          setSeriesLoading(false);
        }
      }
    }

    loadSeries();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Slug                                                                     */
  /* ------------------------------------------------------------------------ */

  function generateSlug(
    value: string,
  ) {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        "",
      )
      .replace(
        /\s+/g,
        "-",
      )
      .replace(
        /-+/g,
        "-",
      );
  }

  function handleTitleChange(
    value: string,
  ) {
    setTitle(value);

    if (!slug) {
      setSlug(
        generateSlug(value),
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Categories                                                               */
  /* ------------------------------------------------------------------------ */

  function toggleCategory(
    categoryId: string,
  ) {
    setSelectedCategoryIds(
      (current) => {
        if (
          current.includes(
            categoryId,
          )
        ) {
          return current.filter(
            (id) =>
              id !== categoryId,
          );
        }

        return [
          ...current,
          categoryId,
        ];
      },
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
        storageKey: "",
        externalId: "",
        mimeType: "",
        fileSize: "",
        source: "EXTERNAL",
      },
    ]);
  }

  function updateMedia(
    index: number,
    field: keyof MediaItem,
    value:
      | string
      | File
      | number
      | boolean
      | undefined,
  ) {
    setMedia((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item,
      ),
    );
  }

  function removeMedia(
    index: number,
  ) {
    setMedia(
      (current) =>
        current.filter(
          (
            _,
            itemIndex,
          ) =>
            itemIndex !==
            index,
        ),
    );

    delete fileInputRefs.current[
      index
    ];
  }

  function switchMediaSource(
    index: number,
    source: "UPLOAD" | "EXTERNAL",
  ) {
    const item = media[index];

    if (!item) {
      return;
    }

    if (
      source === "UPLOAD"
    ) {
      const uploadType =
        getUploadType(
          item.type,
        );

      if (!uploadType) {
        setError(
          "Video files cannot be uploaded from the device yet. Please use an external YouTube URL for videos.",
        );

        return;
      }
    }

    setError("");

    setMedia((current) =>
      current.map(
        (mediaItem, itemIndex) =>
          itemIndex === index
            ? {
                ...mediaItem,

                source,

                provider:
                  source === "UPLOAD"
                    ? "CLOUDINARY"
                    : getExternalProvider(
                        mediaItem.type,
                      ),

                url:
                  source === "UPLOAD"
                    ? mediaItem.url
                    : "",

                storageKey:
                  source === "UPLOAD"
                    ? mediaItem.storageKey
                    : "",

                externalId:
                  source === "EXTERNAL"
                    ? mediaItem.type ===
                      "VIDEO"
                      ? mediaItem.externalId
                      : ""
                    : "",

                mimeType:
                  source === "UPLOAD"
                    ? mediaItem.mimeType
                    : "",

                fileSize:
                  source === "UPLOAD"
                    ? mediaItem.fileSize
                    : "",

                duration:
                  source === "UPLOAD"
                    ? mediaItem.duration
                    : undefined,

                file:
                  source === "EXTERNAL"
                    ? undefined
                    : mediaItem.file,

                uploading: false,
              }
            : mediaItem,
      ),
    );
  }

  function handleMediaTypeChange(
    index: number,
    value: MediaType,
  ) {
    const currentItem =
      media[index];

    if (!currentItem) {
      return;
    }

    const uploadSupported =
      Boolean(
        getUploadType(value),
      );

    setError("");

    setMedia((current) =>
      current.map(
        (item, itemIndex) => {
          if (
            itemIndex !== index
          ) {
            return item;
          }

          const nextSource =
            item.source ===
              "UPLOAD" &&
            !uploadSupported
              ? "EXTERNAL"
              : item.source;

          return {
            ...item,

            type: value,

            source:
              nextSource,

            provider:
              nextSource ===
              "UPLOAD"
                ? "CLOUDINARY"
                : getExternalProvider(
                    value,
                  ),

            url:
              nextSource ===
              "UPLOAD"
                ? item.url
                : "",

            storageKey:
              nextSource ===
              "UPLOAD"
                ? item.storageKey
                : "",

            externalId:
              nextSource ===
              "EXTERNAL" &&
              value === "VIDEO"
                ? item.externalId
                : "",

            mimeType:
              nextSource ===
              "UPLOAD"
                ? item.mimeType
                : "",

            fileSize:
              nextSource ===
              "UPLOAD"
                ? item.fileSize
                : "",

            duration:
              nextSource ===
              "UPLOAD"
                ? item.duration
                : undefined,

            file:
              nextSource ===
              "UPLOAD"
                ? item.file
                : undefined,

            uploading: false,
          };
        },
      ),
    );
  }

  async function handleMediaFile(
    index: number,
    file: File,
  ) {
    const item = media[index];

    if (!item) {
      return;
    }

    const uploadType =
      getUploadType(item.type);

    if (!uploadType) {
      setError(
        "Video files cannot be uploaded from the device yet. Please use an external URL for videos.",
      );

      return;
    }

    try {
      setError("");

      setMedia((current) =>
        current.map(
          (
            mediaItem,
            itemIndex,
          ) =>
            itemIndex === index
              ? {
                  ...mediaItem,
                  uploading: true,
                  file,
                }
              : mediaItem,
        ),
      );

      const response =
        await uploadAdminMedia(
          file,
          uploadType,
        );

      const uploaded =
        response.data;

      setMedia((current) =>
        current.map(
          (
            mediaItem,
            itemIndex,
          ) =>
            itemIndex === index
              ? {
                  ...mediaItem,

                  source: "UPLOAD",

                  provider:
                    "CLOUDINARY",

                  url:
                    uploaded.secureUrl,

                  storageKey:
                    uploaded.publicId,

                  mimeType:
                    file.type,

                  fileSize:
                    String(
                      uploaded.bytes,
                    ),

                  duration:
                    uploaded.duration,

                  title:
                    mediaItem.title ||
                    uploaded.originalFilename,

                  file: undefined,

                  uploading: false,
                }
              : mediaItem,
        ),
      );
    } catch (error) {
      setMedia((current) =>
        current.map(
          (
            mediaItem,
            itemIndex,
          ) =>
            itemIndex === index
              ? {
                  ...mediaItem,
                  uploading: false,
                  file: undefined,
                }
              : mediaItem,
        ),
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload media.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
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

    const mediaStillUploading =
      media.some(
        (item) =>
          item.uploading,
      );

    if (mediaStillUploading) {
      setError(
        "Please wait for all media uploads to finish before creating the resource.",
      );
      return;
    }

    try {
      setSaving(true);

      const input: CreateResourceInput =
        {
          title:
            trimmedTitle,

          slug:
            trimmedSlug,

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

          tagIds: [],

          seriesId:
            selectedSeriesId ||
            null,

          media: media
            .filter(
              (item) =>
                item.url.trim() ||
                item.externalId.trim(),
            )
            .map((item) => ({
              type:
                item.type,

              provider:
                item.provider,

              title:
                item.title.trim() ||
                undefined,

              url:
                item.url.trim() ||
                undefined,

              storageKey:
                item.storageKey.trim() ||
                undefined,

              externalId:
                item.externalId.trim() ||
                undefined,

              mimeType:
                item.mimeType.trim() ||
                undefined,

              fileSize:
                item.fileSize.trim() ||
                undefined,

              duration:
                item.duration,
            })),
        };

      await createResource(
        input,
      );

      setShowSuccess(
        true,
      );
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

  /* ------------------------------------------------------------------------ */
  /* Success                                                                  */
  /* ------------------------------------------------------------------------ */

  function handleSuccessClose() {
    setShowSuccess(false);

    router.push(
      "/admin/dashboard/resources",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

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
              Add a sermon, ebook,
              song, video, podcast,
              or article to the
              ministry library.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10 lg:py-12">
        <form
          onSubmit={
            handleSubmit
          }
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          {/* Main Content */}
          <div className="space-y-8">
            {/* Basic Information */}
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
                      setSlug(
                        event.target.value,
                      )
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
                            key={
                              item.value
                            }
                            value={
                              item.value
                            }
                          >
                            {
                              item.label
                            }
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
                    value={
                      description
                    }
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

            {/* Organization */}
            <section className="border border-charcoal/10 bg-white">
              <div className="border-b border-charcoal/10 px-6 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                  Organization
                </p>

                <h2 className="mt-2 text-xl font-medium">
                  Categories & Series
                </h2>

                <p className="mt-1 text-xs text-charcoal/40">
                  Organize this resource
                  for easier discovery
                  across the ministry
                  library.
                </p>
              </div>

              <div className="space-y-8 p-6">
                {/* Categories */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
                    Categories
                  </p>

                  <div className="mt-3">
                    {categoriesLoading ? (
                      <div className="flex items-center gap-3 py-6 text-sm text-charcoal/40">
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                        Loading categories...
                      </div>
                    ) : categoriesError ? (
                      <div className="border border-red-500/15 bg-red-500/[0.03] p-4">
                        <p className="text-sm text-red-600">
                          {
                            categoriesError
                          }
                        </p>
                      </div>
                    ) : categories.length ===
                      0 ? (
                      <div className="border border-dashed border-charcoal/10 px-5 py-8 text-center">
                        <p className="text-sm text-charcoal/45">
                          No categories have
                          been created yet.
                        </p>

                        <p className="mt-2 text-[11px] leading-5 text-charcoal/35">
                          Create categories
                          from the Categories
                          section of the admin
                          dashboard.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {categories.map(
                          (
                            category,
                          ) => {
                            const selected =
                              selectedCategoryIds.includes(
                                category.id,
                              );

                            return (
                              <button
                                key={
                                  category.id
                                }
                                type="button"
                                onClick={() =>
                                  toggleCategory(
                                    category.id,
                                  )
                                }
                                className={[
                                  "flex items-start gap-3 border p-4 text-left transition-all",
                                  selected
                                    ? "border-bronze bg-bronze/[0.06]"
                                    : "border-charcoal/10 hover:border-bronze/40",
                                ].join(
                                  " ",
                                )}
                              >
                                <span
                                  className={[
                                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                                    selected
                                      ? "border-bronze bg-bronze text-ivory"
                                      : "border-charcoal/20 bg-white",
                                  ].join(
                                    " ",
                                  )}
                                >
                                  {selected && (
                                    <Check
                                      size={
                                        11
                                      }
                                      strokeWidth={
                                        2.5
                                      }
                                    />
                                  )}
                                </span>

                                <span className="min-w-0">
                                  <span className="block text-xs font-medium">
                                    {
                                      category.name
                                    }
                                  </span>

                                  <span className="mt-1 block truncate text-[10px] text-charcoal/35">
                                    /
                                    {
                                      category.slug
                                    }
                                  </span>

                                  {category.description && (
                                    <span className="mt-2 block line-clamp-2 text-[11px] leading-5 text-charcoal/40">
                                      {
                                        category.description
                                      }
                                    </span>
                                  )}
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>

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

                {/* Series */}
                <Field
                  label="Series"
                  hint="Optional. Use a series to group related sermons, teachings, or resources."
                >
                  {seriesLoading ? (
                    <div className="flex h-12 items-center gap-3 border border-charcoal/10 px-4 text-sm text-charcoal/40">
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                      Loading series...
                    </div>
                  ) : seriesError ? (
                    <div className="border border-red-500/15 bg-red-500/[0.03] p-4">
                      <p className="text-sm text-red-600">
                        {seriesError}
                      </p>
                    </div>
                  ) : (
                    <select
                      value={
                        selectedSeriesId
                      }
                      onChange={(event) =>
                        setSelectedSeriesId(
                          event.target.value,
                        )
                      }
                      className="input"
                    >
                      <option value="">
                        No series
                      </option>

                      {series.map(
                        (item) => (
                          <option
                            key={
                              item.id
                            }
                            value={
                              item.id
                            }
                          >
                            {
                              item.title
                            }
                          </option>
                        ),
                      )}
                    </select>
                  )}
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
                    Upload media from your
                    device or use an
                    externally hosted URL.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    addMedia
                  }
                  className="inline-flex items-center gap-2 border border-charcoal/10 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:border-bronze hover:text-bronze"
                >
                  <Plus size={14} />
                  Add Media
                </button>
              </div>

              <div className="p-6">
                {media.length ===
                0 ? (
                  <div className="border border-dashed border-charcoal/10 px-6 py-12 text-center">
                    <Video
                      size={24}
                      strokeWidth={1.2}
                      className="mx-auto text-charcoal/20"
                    />

                    <p className="mt-4 text-sm text-charcoal/45">
                      No media attached
                      yet.
                    </p>

                    <button
                      type="button"
                      onClick={
                        addMedia
                      }
                      className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze hover:underline"
                    >
                      Add your first
                      media
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {media.map(
                      (
                        item,
                        index,
                      ) => {
                        const Icon =
                          getMediaIcon(
                            item.type,
                          );

                        const uploadSupported =
                          Boolean(
                            getUploadType(
                              item.type,
                            ),
                          );

                        return (
                          <div
                            key={
                              index
                            }
                            className="border border-charcoal/10 p-5"
                          >
                            {/* Media Header */}
                            <div className="mb-5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center bg-bronze/10 text-bronze">
                                  <Icon
                                    size={
                                      16
                                    }
                                  />
                                </div>

                                <div>
                                  <p className="text-xs font-medium">
                                    Media{" "}
                                    {
                                      index +
                                      1
                                    }
                                  </p>

                                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-charcoal/35">
                                    {
                                      item.type
                                    }
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
                                  size={
                                    15
                                  }
                                />
                              </button>
                            </div>

                            {/* Media Type */}
                            <Field label="Media Type">
                              <select
                                value={
                                  item.type
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleMediaTypeChange(
                                    index,
                                    event
                                      .target
                                      .value as MediaType,
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

                            {/* Media Title */}
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
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  placeholder="Walking in Purpose — Full Sermon"
                                  className="input"
                                />
                              </Field>
                            </div>

                            {/* Source Selector */}
                            <div className="mt-6">
                              <Field
                                label="Media Source"
                                hint={
                                  item.type ===
                                  "VIDEO"
                                    ? "Videos are currently supported through external YouTube URLs."
                                    : "Choose whether this media should be uploaded to Cloudinary or linked from an external source."
                                }
                              >
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      switchMediaSource(
                                        index,
                                        "UPLOAD",
                                      )
                                    }
                                    disabled={
                                      !uploadSupported ||
                                      item.uploading
                                    }
                                    className={[
                                      "flex items-start gap-3 border p-4 text-left transition-all",
                                      item.source ===
                                      "UPLOAD"
                                        ? "border-bronze bg-bronze/[0.06]"
                                        : "border-charcoal/10 hover:border-bronze/40",
                                      !uploadSupported
                                        ? "cursor-not-allowed opacity-40 hover:border-charcoal/10"
                                        : "",
                                    ].join(
                                      " ",
                                    )}
                                  >
                                    <Upload
                                      size={
                                        17
                                      }
                                      className="mt-0.5 shrink-0 text-bronze"
                                    />

                                    <span>
                                      <span className="block text-xs font-medium">
                                        Upload from device
                                      </span>

                                      <span className="mt-1 block text-[10px] leading-4 text-charcoal/40">
                                        {uploadSupported
                                          ? "Upload directly to Cloudinary."
                                          : "Not available for video files yet."}
                                      </span>
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      switchMediaSource(
                                        index,
                                        "EXTERNAL",
                                      )
                                    }
                                    disabled={
                                      item.uploading
                                    }
                                    className={[
                                      "flex items-start gap-3 border p-4 text-left transition-all",
                                      item.source ===
                                      "EXTERNAL"
                                        ? "border-bronze bg-bronze/[0.06]"
                                        : "border-charcoal/10 hover:border-bronze/40",
                                    ].join(
                                      " ",
                                    )}
                                  >
                                    <ArrowUpRight
                                      size={
                                        17
                                      }
                                      className="mt-0.5 shrink-0 text-bronze"
                                    />

                                    <span>
                                      <span className="block text-xs font-medium">
                                        Use external URL
                                      </span>

                                      <span className="mt-1 block text-[10px] leading-4 text-charcoal/40">
                                        Link to externally hosted media.
                                      </span>
                                    </span>
                                  </button>
                                </div>
                              </Field>
                            </div>

                            {/* Upload */}
                            {item.source ===
                              "UPLOAD" && (
                              <div className="mt-5">
                                <input
                                  ref={(
                                    element,
                                  ) => {
                                    fileInputRefs.current[
                                      index
                                    ] =
                                      element;
                                  }}
                                  type="file"
                                  accept={getAcceptedFileTypes(
                                    item.type,
                                  )}
                                  className="hidden"
                                  onChange={(
                                    event,
                                  ) => {
                                    const file =
                                      event
                                        .target
                                        .files?.[0];

                                    if (
                                      file
                                    ) {
                                      handleMediaFile(
                                        index,
                                        file,
                                      );
                                    }

                                    event.target.value =
                                      "";
                                  }}
                                />

                                <button
                                  type="button"
                                  disabled={
                                    item.uploading
                                  }
                                  onClick={() =>
                                    fileInputRefs.current[
                                      index
                                    ]?.click()
                                  }
                                  className="flex w-full items-center justify-center gap-3 border border-dashed border-charcoal/15 px-5 py-8 text-center transition-colors hover:border-bronze hover:bg-bronze/[0.03] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {item.uploading ? (
                                    <>
                                      <Loader2
                                        size={
                                          18
                                        }
                                        className="animate-spin text-bronze"
                                      />

                                      <span>
                                        <span className="block text-xs font-medium">
                                          Uploading media...
                                        </span>

                                        <span className="mt-1 block text-[10px] text-charcoal/40">
                                          Please wait while the file is uploaded.
                                        </span>
                                      </span>
                                    </>
                                  ) : item.url ? (
                                    <>
                                      <Check
                                        size={
                                          18
                                        }
                                        className="text-green-600"
                                      />

                                      <span>
                                        <span className="block text-xs font-medium">
                                          Media uploaded successfully
                                        </span>

                                        <span className="mt-1 block text-[10px] text-charcoal/40">
                                          Click to replace the uploaded file.
                                        </span>
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload
                                        size={
                                          18
                                        }
                                        className="text-bronze"
                                      />

                                      <span>
                                        <span className="block text-xs font-medium">
                                          Choose a file
                                        </span>

                                        <span className="mt-1 block text-[10px] text-charcoal/40">
                                          {item.type ===
                                          "AUDIO"
                                            ? "MP3, WAV, OGG, AAC, M4A or WebM"
                                            : item.type ===
                                              "PDF"
                                              ? "PDF files only"
                                              : "JPG, PNG or WebP"}
                                        </span>
                                      </span>
                                    </>
                                  )}
                                </button>

                                {item.url && (
                                  <div className="mt-3 border border-green-500/15 bg-green-500/[0.03] p-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-green-700">
                                      Cloudinary
                                    </p>

                                    <p className="mt-1 truncate text-xs text-charcoal/50">
                                      {
                                        item.url
                                      }
                                    </p>

                                    {item.fileSize && (
                                      <p className="mt-1 text-[10px] text-charcoal/35">
                                        {
                                          item.fileSize
                                        }{" "}
                                        bytes
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* External URL */}
                            {item.source ===
                              "EXTERNAL" && (
                              <div className="mt-5">
                                <Field
                                  label={
                                    item.provider ===
                                    "YOUTUBE"
                                      ? "YouTube URL"
                                      : "External URL"
                                  }
                                  hint={
                                    item.provider ===
                                    "YOUTUBE"
                                      ? "Paste the full YouTube video URL."
                                      : "Paste the public URL for this media."
                                  }
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
                                        event
                                          .target
                                          .value,
                                      )
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
                            )}

                            {/* YouTube ID */}
                            {item.source ===
                              "EXTERNAL" &&
                              item.provider ===
                                "YOUTUBE" && (
                                <div className="mt-5">
                                  <Field
                                    label="YouTube Video ID"
                                    hint="Optional. This is the ID contained in the YouTube URL."
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
                                          event
                                            .target
                                            .value,
                                        )
                                      }
                                      placeholder="XyCHesmYev0"
                                      className="input"
                                    />
                                  </Field>
                                </div>
                              )}

                            {/* Upload Status */}
                            {item.source ===
                              "UPLOAD" &&
                              item.provider ===
                                "CLOUDINARY" &&
                              item.url && (
                                <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-green-600">
                                  <Check
                                    size={
                                      13
                                    }
                                  />
                                  Stored in Cloudinary
                                </div>
                              )}
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Publishing */}
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
                  checked={
                    published
                  }
                  onChange={
                    setPublished
                  }
                />

                <Toggle
                  label="Featured"
                  description="Highlight this resource in featured sections."
                  checked={
                    featured
                  }
                  onChange={
                    setFeatured
                  }
                />
              </div>
            </section>

            {/* Selected Categories */}
            {selectedCategoryIds.length >
              0 && (
              <section className="border border-charcoal/10 bg-white p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                  Organization
                </p>

                <h2 className="mt-2 text-sm font-medium">
                  Selected categories
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {categories
                    .filter(
                      (
                        category,
                      ) =>
                        selectedCategoryIds.includes(
                          category.id,
                        ),
                    )
                    .map(
                      (
                        category,
                      ) => (
                        <span
                          key={
                            category.id
                          }
                          className="inline-flex items-center gap-1.5 bg-bronze/10 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-bronze"
                        >
                          {
                            category.name
                          }
                        </span>
                      ),
                    )}
                </div>
              </section>
            )}

            {/* Selected Series */}
            {selectedSeriesId && (
              <section className="border border-charcoal/10 bg-white p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                  Series
                </p>

                <h2 className="mt-2 text-sm font-medium">
                  Selected series
                </h2>

                <p className="mt-3 text-xs text-charcoal/50">
                  {
                    series.find(
                      (item) =>
                        item.id ===
                        selectedSeriesId,
                    )?.title
                  }
                </p>
              </section>
            )}

            {/* Error */}
            {error && (
              <div className="border border-red-500/15 bg-red-500/[0.03] p-5">
                <p className="text-sm leading-6 text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <section className="border border-charcoal/10 bg-white p-6">
              <button
                type="submit"
                disabled={
                  saving ||
                  media.some(
                    (item) =>
                      item.uploading,
                  )
                }
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
          onContinue={
            handleSuccessClose
          }
        />
      )}
    </main>
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
  onChange: (
    value: boolean,
  ) => void;
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
          <Check
            size={25}
            strokeWidth={2}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze">
            Resource Created
          </p>

          <h2 className="mt-2 text-2xl font-medium tracking-tight">
            Successfully created
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-charcoal/45">
            The resource has been
            successfully added to
            your ministry library.
          </p>
        </div>

        <button
          type="button"
          onClick={
            onContinue
          }
          className="mt-8 flex w-full items-center justify-center gap-2 bg-charcoal px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze"
        >
          Continue to Resources
          <ArrowUpRight
            size={14}
          />
        </button>
      </div>
    </div>
  );
}