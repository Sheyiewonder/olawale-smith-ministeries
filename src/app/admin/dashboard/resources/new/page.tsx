"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileText,
  Files,
  Headphones,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  createResource,
  getAdminCategories,
  uploadAdminMedia,
  type AdminCategory,
  type CreateResourceInput,
  type ResourceType,
  type MediaType,
  type MediaProvider,
} from "@/lib/admin-api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface MediaItem {
  type: MediaType;
  provider: MediaProvider;
  title: string;

  url: string;
  externalId: string;

  storageKey?: string;
  mimeType?: string;
  fileSize?: string;
  duration?: number;

  uploading?: boolean;
  fileName?: string;

  /*
   * Temporary browser URL.
   * Used while a device file is being uploaded.
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

  return "VIDEO";
}

function getYouTubeId(
  url?: string,
  externalId?: string,
): string | null {
  if (externalId?.trim()) {
    return externalId.trim();
  }

  if (!url?.trim()) {
    return null;
  }

  const value = url.trim();

  const match = value.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([^?&/]+)/i,
  );

  return match?.[1] ?? null;
}

function getYouTubeEmbedUrl(
  url?: string,
  externalId?: string,
): string | null {
  const id = getYouTubeId(url, externalId);

  if (!id) {
    return null;
  }

  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}

function formatFileSize(
  bytes?: string,
): string {
  if (!bytes) {
    return "";
  }

  const value = Number(bytes);

  if (!Number.isFinite(value)) {
    return "";
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  if (value < 1024 * 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDuration(
  seconds?: number,
): string {
  if (
    seconds === undefined ||
    !Number.isFinite(seconds)
  ) {
    return "00:00";
  }

  const total = Math.max(
    0,
    Math.floor(seconds),
  );

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(
    (total % 3600) / 60,
  );
  const secs = total % 60;

  if (hours > 0) {
    return [
      hours,
      String(minutes).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ].join(":");
  }

  return [
    String(minutes).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ].join(":");
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

export default function NewResourcePage() {
  const router = useRouter();

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

  const [
    selectedCategoryIds,
    setSelectedCategoryIds,
  ] = useState<string[]>([]);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [
    categoriesError,
    setCategoriesError,
  ] = useState("");

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

  const fileInputs = useRef<
    Record<number, HTMLInputElement | null>
  >({});

  /* ------------------------------------------------------------------------ */
  /* Categories                                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    getAdminCategories()
      .then((response) => {
        if (mounted) {
          setCategories(response.data ?? []);
        }
      })
      .catch((err) => {
        if (mounted) {
          setCategoriesError(
            err instanceof Error
              ? err.message
              : "Unable to load categories.",
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setCategoriesLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Cleanup local preview URLs                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      media.forEach((item) => {
        if (item.localPreviewUrl) {
          URL.revokeObjectURL(
            item.localPreviewUrl,
          );
        }
      });
    };
  }, [media]);

  /* ------------------------------------------------------------------------ */
  /* Basic handlers                                                           */
  /* ------------------------------------------------------------------------ */

  function handleTitleChange(
    value: string,
  ) {
    setTitle(value);

    if (!slug.trim()) {
      setSlug(slugify(value));
    }
  }

  function toggleCategory(id: string) {
    setSelectedCategoryIds((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id,
          )
        : [...current, id],
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
        externalId: "",
      },
    ]);
  }

  function updateMedia(
    index: number,
    patch: Partial<MediaItem>,
  ) {
    setMedia((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  function removeMedia(index: number) {
    const item = media[index];

    if (item?.localPreviewUrl) {
      URL.revokeObjectURL(
        item.localPreviewUrl,
      );
    }

    setMedia((current) =>
      current.filter(
        (_, i) => i !== index,
      ),
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Backend media upload                                                     */
  /* ------------------------------------------------------------------------ */

  async function handleFileUpload(
    index: number,
    file?: File,
  ) {
    if (!file) {
      return;
    }

    setError("");

    const mediaType =
      inferMediaType(file);

    const localPreviewUrl =
      URL.createObjectURL(file);

    updateMedia(index, {
      type: mediaType,
      provider: "CLOUDINARY",
      uploading: true,
      fileName: file.name,
      localPreviewUrl,
      url: "",
      externalId: "",
      mimeType: file.type,
      fileSize: String(file.size),
    });

    try {
      /*
       * IMPORTANT:
       *
       * Upload goes through our authenticated
       * backend endpoint.
       *
       * The browser does NOT communicate with
       * Cloudinary directly anymore.
       */
      const uploaded =
        await uploadAdminMedia(
          file,
          mediaType as
            | "AUDIO"
            | "PDF"
            | "IMAGE",
        );

      /*
       * The backend currently supports device
       * uploads for AUDIO, PDF and IMAGE.
       *
       * VIDEO device uploads therefore should
       * not reach this point.
       */
      updateMedia(index, {
        type: mediaType,
        provider: "CLOUDINARY",
        uploading: false,
        url: uploaded.data.secureUrl,
        storageKey:
          uploaded.data.publicId,
        mimeType:
          uploaded.data.type === "AUDIO"
            ? file.type
            : file.type,
        fileSize:
          String(uploaded.data.bytes),
        duration:
          uploaded.data.duration,
      });

      /*
       * Keep the local preview URL while the
       * resource is being edited. It allows the
       * preview to work instantly even before
       * Cloudinary's URL is displayed.
       */
    } catch (err) {
      if (localPreviewUrl) {
        URL.revokeObjectURL(
          localPreviewUrl,
        );
      }

      updateMedia(index, {
        uploading: false,
        localPreviewUrl: undefined,
        url: "",
        storageKey: undefined,
      });

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload media.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Validation                                                               */
  /* ------------------------------------------------------------------------ */

  function validateMedia() {
    for (
      let i = 0;
      i < media.length;
      i++
    ) {
      const item = media[i];

      if (item.uploading) {
        return `Media ${
          i + 1
        }: Please wait for the upload to finish.`;
      }

      const hasUrl =
        !!item.url.trim();

      const hasExternalId =
        !!item.externalId.trim();

      /*
       * Empty media cards are ignored.
       */
      if (
        !hasUrl &&
        !hasExternalId
      ) {
        continue;
      }

      if (!item.type) {
        return `Media ${
          i + 1
        }: Media type is required.`;
      }

      if (
        item.provider ===
        "YOUTUBE"
      ) {
        if (
          !hasUrl &&
          !hasExternalId
        ) {
          return `Media ${
            i + 1
          }: Please provide a YouTube URL or video ID.`;
        }

        if (
          !getYouTubeId(
            item.url,
            item.externalId,
          )
        ) {
          return `Media ${
            i + 1
          }: Please provide a valid YouTube URL or video ID.`;
        }
      } else if (!hasUrl) {
        return `Media ${
          i + 1
        }: Please provide a media URL.`;
      }
    }

    return "";
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

    const mediaError =
      validateMedia();

    if (mediaError) {
      setError(mediaError);
      return;
    }

    try {
      setSaving(true);

      const input: CreateResourceInput =
        {
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

          tagIds: [],

          media: media
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

              fileSize:
                item.fileSize,

              duration:
                item.duration,
            })),
        };

      await createResource(input);

      setShowSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create resource.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
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
            Create Resource
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-charcoal/45">
            Add a sermon, ebook, song,
            video, podcast, or article
            to the ministry library.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-12">
        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="space-y-8">
            {/* ---------------------------------------------------------------- */}
            {/* Basic Information                                                */}
            {/* ---------------------------------------------------------------- */}

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
                        slugify(
                          event.target.value,
                        ),
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
                          event.target
                            .value,
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

            {/* ---------------------------------------------------------------- */}
            {/* Categories                                                        */}
            {/* ---------------------------------------------------------------- */}

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
                ) : categories.length ===
                  0 ? (
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
                            key={
                              category.id
                            }
                            type="button"
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
                                <Check
                                  size={
                                    11
                                  }
                                />
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

                              {category.description && (
                                <span className="mt-2 block text-[11px] leading-5 text-charcoal/40">
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

            {/* ---------------------------------------------------------------- */}
            {/* Media                                                             */}
            {/* ---------------------------------------------------------------- */}

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
                    Upload files from your
                    device, or attach
                    YouTube and external
                    media.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addMedia}
                  className="inline-flex items-center gap-2 border border-charcoal/10 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] hover:border-bronze hover:text-bronze"
                >
                  <Files size={14} />
                  Add Media
                </button>
              </div>

              <div className="p-6">
                {media.length === 0 ? (
                  <div className="border border-dashed border-charcoal/10 px-6 py-12 text-center">
                    <Files
                      size={26}
                      className="mx-auto text-charcoal/20"
                    />

                    <p className="mt-4 text-sm text-charcoal/45">
                      No media attached yet.
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
                          key={index}
                          item={item}
                          index={index}
                          fileInput={(element) => {
                            fileInputs.current[
                              index
                            ] = element;
                          }}
                          onFile={(file) =>
                            handleFileUpload(
                              index,
                              file,
                            )
                          }
                          onUpdate={(patch) =>
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
                        />
                      ),
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* Sidebar                                                            */}
          {/* ------------------------------------------------------------------ */}

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
                onClick={() => {
                  setError("");
                  setShowPreview(true);
                }}
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
                className="mt-3 group flex w-full items-center justify-center gap-2 bg-charcoal px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* ---------------------------------------------------------------------- */}
      {/* Preview                                                               */}
      {/* ---------------------------------------------------------------------- */}

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

      {/* ---------------------------------------------------------------------- */}
      {/* Success                                                               */}
      {/* ---------------------------------------------------------------------- */}

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

/* ========================================================================== */
/* Media Editor                                                               */
/* ========================================================================== */

function MediaEditor({
  item,
  index,
  onUpdate,
  onRemove,
  onFile,
  fileInput,
}: {
  item: MediaItem;
  index: number;
  onUpdate: (
    patch: Partial<MediaItem>,
  ) => void;
  onRemove: () => void;
  onFile: (file?: File) => void;
  fileInput: (
    element: HTMLInputElement | null,
  ) => void;
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

  const youtubeEmbed =
    item.provider === "YOUTUBE"
      ? getYouTubeEmbedUrl(
          item.url,
          item.externalId,
        )
      : null;

  return (
    <div className="border border-charcoal/10 p-5">
      {/* -------------------------------------------------------------------- */}
      {/* Header                                                               */}
      {/* -------------------------------------------------------------------- */}

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

      {/* -------------------------------------------------------------------- */}
      {/* Type / Provider                                                       */}
      {/* -------------------------------------------------------------------- */}

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

      {/* -------------------------------------------------------------------- */}
      {/* Title                                                                */}
      {/* -------------------------------------------------------------------- */}

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
            placeholder="Walking in Purpose — Full Sermon"
            className="input"
          />
        </Field>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Device Upload                                                        */}
      {/* -------------------------------------------------------------------- */}

      {item.provider ===
        "CLOUDINARY" && (
        <div className="mt-5 border border-dashed border-bronze/30 bg-bronze/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-bronze">
                Device Upload
              </p>

              <p className="mt-1 text-[11px] leading-5 text-charcoal/40">
                The file is uploaded
                securely through the
                ministry API.
              </p>
            </div>

            <input
              data-media-upload={index}
              ref={fileInput}
              type="file"
              className="hidden"
              accept="audio/*,image/*,application/pdf"
              onChange={(event) => {
                onFile(
                  event.target.files?.[0],
                );

                event.currentTarget.value =
                  "";
              }}
            />

            <button
              type="button"
              disabled={item.uploading}
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>(
                    `input[data-media-upload="${index}"]`,
                  )
                  ?.click()
              }
              className="inline-flex items-center gap-2 bg-charcoal px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory disabled:opacity-50"
            >
              <Upload size={14} />

              {item.uploading
                ? "Uploading..."
                : "Choose File"}
            </button>
          </div>

          {item.fileName && (
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="truncate text-xs text-charcoal/55">
                {item.fileName}
              </p>

              {item.fileSize && (
                <span className="shrink-0 text-[10px] uppercase tracking-[0.1em] text-charcoal/30">
                  {formatFileSize(
                    item.fileSize,
                  )}
                </span>
              )}
            </div>
          )}

          {item.uploading && (
            <div className="mt-4">
              <div className="h-1 overflow-hidden bg-charcoal/5">
                <div className="h-full w-1/2 animate-pulse bg-bronze" />
              </div>

              <p className="mt-2 text-[10px] text-charcoal/35">
                Uploading media to
                Cloudinary...
              </p>
            </div>
          )}

          {!item.uploading &&
            item.url && (
              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.1em] text-green-700">
                Media uploaded successfully
              </p>
            )}
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* External / YouTube URL                                               */}
      {/* -------------------------------------------------------------------- */}

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
                    url:
                      event.target
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

      {/* -------------------------------------------------------------------- */}
      {/* Immediate Media Preview                                              */}
      {/* -------------------------------------------------------------------- */}

      {(item.url ||
        item.localPreviewUrl ||
        youtubeEmbed) && (
        <div className="mt-5 overflow-hidden border border-charcoal/10 bg-black">
          {item.provider ===
          "YOUTUBE" ? (
            youtubeEmbed ? (
              <YouTubePlayer
                src={youtubeEmbed}
                title={
                  item.title ||
                  "YouTube media"
                }
              />
            ) : null
          ) : (
            <MediaVisualization
              media={item}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Media Visualization                                                        */
/* ========================================================================== */

function MediaVisualization({
  media,
}: {
  media: MediaItem;
}) {
  const source =
    media.url ||
    media.localPreviewUrl;

  if (!source) {
    return null;
  }

  if (media.type === "IMAGE") {
    return (
      <div className="flex max-h-80 items-center justify-center bg-charcoal/5 p-3">
        <img
          src={source}
          alt={
            media.title ||
            media.fileName ||
            "Uploaded image"
          }
          className="max-h-72 w-full object-contain"
        />
      </div>
    );
  }

  if (media.type === "PDF") {
    return (
      <div className="h-[420px] bg-white">
        <iframe
          src={source}
          title={
            media.title ||
            "PDF preview"
          }
          className="h-full w-full"
        />
      </div>
    );
  }

  if (media.type === "AUDIO") {
    return (
      <div className="bg-charcoal p-5">
        <CustomAudioPlayer
          src={source}
          title={
            media.title ||
            media.fileName ||
            "Audio"
          }
        />
      </div>
    );
  }

  return (
    <video
      controls
      preload="metadata"
      className="max-h-[420px] w-full bg-black"
      src={source}
    />
  );
}

/* ========================================================================== */
/* Custom Audio Player                                                        */
/* ========================================================================== */

function CustomAudioPlayer({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const audioRef =
    useRef<HTMLAudioElement | null>(
      null,
    );

  const [playing, setPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [muted, setMuted] =
    useState(false);

  function togglePlay() {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }

  function seek(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const value =
      Number(event.target.value);

    audio.currentTime = value;
    setCurrentTime(value);
  }

  function toggleMute() {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  function handleLoadedMetadata() {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    setDuration(
      Number.isFinite(audio.duration)
        ? audio.duration
        : 0,
    );
  }

  return (
    <div className="text-white">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(
              audioRef.current
                .currentTime,
            );
          }
        }}
        onPlay={() =>
          setPlaying(true)
        }
        onPause={() =>
          setPlaying(false)
        }
        onEnded={() =>
          setPlaying(false)
        }
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-charcoal transition hover:bg-bronze hover:text-white"
          aria-label={
            playing
              ? "Pause audio"
              : "Play audio"
          }
        >
          {playing ? (
            <Pause
              size={17}
              fill="currentColor"
            />
          ) : (
            <Play
              size={17}
              fill="currentColor"
              className="ml-0.5"
            />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">
            {title}
          </p>

          <div className="mt-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(
                currentTime,
                duration || 0,
              )}
              onChange={seek}
              className="w-full accent-[#9b6a43]"
            />
          </div>

          <div className="mt-1 flex justify-between text-[10px] text-white/40">
            <span>
              {formatDuration(
                currentTime,
              )}
            </span>

            <span>
              {formatDuration(
                duration,
              )}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="shrink-0 text-white/60 hover:text-white"
          aria-label={
            muted
              ? "Unmute audio"
              : "Mute audio"
          }
        >
          {muted ? (
            <VolumeX size={17} />
          ) : (
            <Volume2 size={17} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* YouTube Player                                                             */
/* ========================================================================== */

function YouTubePlayer({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  return (
    <div className="bg-black">
      <div className="relative aspect-video w-full">
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-white/60">
          <Video size={14} />

          <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
            YouTube Preview
          </span>
        </div>

        <span className="text-[10px] text-white/30">
          {title}
        </span>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Preview Dialog                                                             */
/* ========================================================================== */

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
  const attachedMedia =
    media.filter(
      (item) =>
        item.url ||
        item.localPreviewUrl ||
        item.externalId,
    );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 p-4 backdrop-blur-sm">
      <div className="mx-auto my-8 max-w-5xl overflow-hidden bg-white shadow-2xl">
        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

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

        {/* ------------------------------------------------------------------ */}
        {/* Content                                                            */}
        {/* ------------------------------------------------------------------ */}

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

          {/* ---------------------------------------------------------------- */}
          {/* Written content                                                   */}
          {/* ---------------------------------------------------------------- */}

          {content && (
            <div className="mt-8 whitespace-pre-wrap border-t border-charcoal/10 pt-8 text-sm leading-8 text-charcoal/70">
              {content}
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* Media                                                             */}
          {/* ---------------------------------------------------------------- */}

          {attachedMedia.length >
            0 && (
            <div className="mt-10 space-y-8 border-t border-charcoal/10 pt-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bronze">
                  Media
                </p>

                <h3 className="mt-2 text-xl font-medium">
                  Resource media
                </h3>
              </div>

              {attachedMedia.map(
                (item, index) => (
                  <PreviewMedia
                    key={index}
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

/* ========================================================================== */
/* Preview Media                                                              */
/* ========================================================================== */

function PreviewMedia({
  media,
}: {
  media: MediaItem;
}) {
  if (
    media.provider ===
    "YOUTUBE"
  ) {
    const embed =
      getYouTubeEmbedUrl(
        media.url,
        media.externalId,
      );

    if (!embed) {
      return (
        <div className="border border-red-500/10 bg-red-500/[0.03] p-5 text-sm text-red-600">
          Invalid YouTube URL or
          video ID.
        </div>
      );
    }

    return (
      <div>
        {media.title && (
          <p className="mb-3 text-xs font-medium text-charcoal/60">
            {media.title}
          </p>
        )}

        <YouTubePlayer
          src={embed}
          title={
            media.title ||
            "YouTube media"
          }
        />
      </div>
    );
  }

  const source =
    media.url ||
    media.localPreviewUrl;

  if (!source) {
    return null;
  }

  if (media.type === "IMAGE") {
    return (
      <div>
        {media.title && (
          <p className="mb-3 text-xs font-medium text-charcoal/60">
            {media.title}
          </p>
        )}

        <div className="flex min-h-40 items-center justify-center border border-charcoal/10 bg-charcoal/[0.02] p-4">
          <img
            src={source}
            alt={
              media.title ||
              "Resource image"
            }
            className="max-h-[620px] w-full object-contain"
          />
        </div>
      </div>
    );
  }

  if (media.type === "PDF") {
    return (
      <div>
        {media.title && (
          <p className="mb-3 text-xs font-medium text-charcoal/60">
            {media.title}
          </p>
        )}

        <div className="h-[650px] overflow-hidden border border-charcoal/10 bg-charcoal/5">
          <iframe
            src={source}
            title={
              media.title ||
              "PDF preview"
            }
            className="h-full w-full bg-white"
          />
        </div>
      </div>
    );
  }

  if (media.type === "AUDIO") {
    return (
      <div>
        {media.title && (
          <p className="mb-3 text-xs font-medium text-charcoal/60">
            {media.title}
          </p>
        )}

        <div className="bg-charcoal p-6">
          <CustomAudioPlayer
            src={source}
            title={
              media.title ||
              media.fileName ||
              "Audio"
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {media.title && (
        <p className="mb-3 text-xs font-medium text-charcoal/60">
          {media.title}
        </p>
      )}

      <video
        controls
        preload="metadata"
        className="max-h-[620px] w-full bg-black"
        src={source}
      />
    </div>
  );
}

/* ========================================================================== */
/* Section Head                                                               */
/* ========================================================================== */

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

/* ========================================================================== */
/* Field                                                                      */
/* ========================================================================== */

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

/* ========================================================================== */
/* Toggle                                                                     */
/* ========================================================================== */

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

/* ========================================================================== */
/* Success Dialog                                                             */
/* ========================================================================== */

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
            Resource Created
          </p>

          <h2 className="mt-2 text-2xl font-medium">
            Successfully created
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-charcoal/45">
            The resource has been
            added to your ministry
            library.
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
