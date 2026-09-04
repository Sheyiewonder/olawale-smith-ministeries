"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileText,
  Files,
  Headphones,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
  Video,
  X,
  Eye,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import {
  getAdminCategories,
  getAdminResource,
  updateResource,
  uploadAdminMedia,
  type AdminCategory,
  type AdminResource,
  type UpdateResourceInput,
  type ResourceType,
  type MediaType,
  type MediaProvider,
} from "@/lib/admin-api";

import ResourceMediaPreview from "@/components/admin/resource-preview/ResourceMediaPreview";


/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface ThumbnailItem {
  type: "IMAGE";
  provider: "CLOUDINARY";
  title: string;

  url: string;
  storageKey?: string;
  mimeType?: string;
  fileSize?: string;

  uploading?: boolean;
  fileName?: string;

  /**
   * Browser-only preview URL.
   */
  localPreviewUrl?: string;

  /**
   * Cloudinary-generated thumbnail URL.
   */
  thumbnailUrl?: string | null;
}

interface MediaItem {
  id?: string;

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

  /**
   * Browser-only preview URL.
   *
   * This allows a selected file to remain
   * previewable while the Cloudinary upload
   * is happening.
   */
  localPreviewUrl?: string;

  /**
   * Cloudinary-generated thumbnail.
   *
   * For PDFs:
   *   This is the generated first-page preview.
   *
   * For AUDIO:
   *   This may contain a generated thumbnail,
   *   but an explicitly uploaded audio thumbnail
   *   takes priority.
   */
  thumbnailUrl?: string | null;

  /**
   * Optional manually uploaded thumbnail.
   *
   * Kept for compatibility with the existing
   * audio thumbnail structure.
   */
  thumbnail?: ThumbnailItem;
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

  if (file.type.startsWith("video/")) {
    return "VIDEO";
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

  return `https://www.youtube.com/embed/${id}`;
}

function formatFileSize(value?: string): string {
  const bytes = Number(value);

  if (!Number.isFinite(bytes)) {
    return "";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
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

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  const [loading, setLoading] =
    useState(true);

  const [loadingError, setLoadingError] =
    useState("");

  /* ------------------------------------------------------------------------ */
  /* Resource                                                                 */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Categories                                                               */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Media                                                                    */
  /* ------------------------------------------------------------------------ */

  const [media, setMedia] =
    useState<MediaItem[]>([]);

  /**
   * Browser-created object URLs.
   *
   * We keep them here so they can be revoked
   * safely when no longer needed.
   */
  const previewUrlsRef =
    useRef<Set<string>>(new Set());

  /* ------------------------------------------------------------------------ */
  /* Submission                                                               */
  /* ------------------------------------------------------------------------ */

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

  const thumbnailInputs = useRef<
    Record<number, HTMLInputElement | null>
  >({});

  /* ------------------------------------------------------------------------ */
  /* Load resource                                                            */
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
    } catch (err) {
      setLoadingError(
        err instanceof Error
          ? err.message
          : "Unable to load resource.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Load categories                                                          */
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
    } catch (err) {
      setCategoriesError(
        err instanceof Error
          ? err.message
          : "Unable to load categories.",
      );
    } finally {
      setCategoriesLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Initial load                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    loadResource();
    loadCategories();
  }, [resourceId]);

  /* ------------------------------------------------------------------------ */
  /* Cleanup                                                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach(
        (url) => {
          URL.revokeObjectURL(url);
        },
      );

      previewUrlsRef.current.clear();
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Populate resource                                                        */
  /* ------------------------------------------------------------------------ */

  function populateResource(
    resource: AdminResource,
  ) {
    setTitle(
      resource.title ?? "",
    );

    setSlug(
      resource.slug ?? "",
    );

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

    const categoryIds = (
      resource.categories ?? []
    )
      .map(
        (item) =>
          item.categoryId ??
          item.category?.id,
      )
      .filter(
        (
          id,
        ): id is string =>
          Boolean(id),
      );

    setSelectedCategoryIds(
      categoryIds,
    );

    setMedia(
      (resource.media ?? []).map(
        (item) => ({
          id: item.id,

          type: item.type,

          provider:
            item.provider,

          title:
            item.title ?? "",

          url:
            item.url ?? "",

          externalId:
            item.externalId ?? "",

          storageKey:
            item.storageKey ??
            undefined,

          mimeType:
            item.mimeType ??
            undefined,

          fileSize:
            item.fileSize != null
              ? String(item.fileSize)
              : undefined,

          duration:
            typeof item.duration ===
            "number"
              ? item.duration
              : undefined,

          /**
           * IMPORTANT:
           *
           * Preserve the Cloudinary-generated
           * thumbnail returned by the backend.
           *
           * For PDFs this is the generated
           * first-page thumbnail.
           *
           * For audio it may be a generated
           * thumbnail, while an explicit
           * thumbnail object remains separate.
           */
          thumbnailUrl:
            item.thumbnailUrl ??
            null,

          uploading: false,
        }),
      ),
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Basic handlers                                                           */
  /* ------------------------------------------------------------------------ */

  function handleTitleChange(
    value: string,
  ) {
    setTitle(value);

    if (!slug.trim()) {
      setSlug(
        slugify(value),
      );
    }
  }

  function handleSlugChange(
    value: string,
  ) {
    setSlug(
      slugify(value),
    );
  }

  function toggleCategory(
    id: string,
  ) {
    setSelectedCategoryIds(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id,
            )
          : [
              ...current,
              id,
            ],
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Media handlers                                                           */
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
        uploading: false,
        thumbnailUrl: null,
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

  function removeMedia(
    index: number,
  ) {
    const item = media[index];

    if (item?.localPreviewUrl) {
      previewUrlsRef.current.delete(
        item.localPreviewUrl,
      );

      URL.revokeObjectURL(
        item.localPreviewUrl,
      );
    }

    if (
      item?.thumbnail
        ?.localPreviewUrl
    ) {
      previewUrlsRef.current.delete(
        item.thumbnail.localPreviewUrl,
      );

      URL.revokeObjectURL(
        item.thumbnail.localPreviewUrl,
      );
    }

    setMedia((current) =>
      current.filter(
        (_, i) => i !== index,
      ),
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Device upload                                                            */
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

    const existingItem =
      media[index];

    /**
     * Revoke the old browser preview
     * before replacing the file.
     */
    if (
      existingItem?.localPreviewUrl
    ) {
      previewUrlsRef.current.delete(
        existingItem.localPreviewUrl,
      );

      URL.revokeObjectURL(
        existingItem.localPreviewUrl,
      );
    }

    const localPreviewUrl =
      URL.createObjectURL(file);

    previewUrlsRef.current.add(
      localPreviewUrl,
    );

    /**
     * Preserve the existing persisted
     * thumbnail until the new Cloudinary
     * upload succeeds.
     *
     * We only clear the thumbnail after
     * successful replacement.
     */
    const previousThumbnailUrl =
      existingItem?.thumbnailUrl ??
      null;

    /**
     * Immediately update the UI.
     *
     * The local preview becomes available
     * before Cloudinary finishes uploading.
     */
    updateMedia(index, {
      type: mediaType,

      provider:
        "CLOUDINARY",

      uploading: true,

      fileName:
        file.name,

      localPreviewUrl,

      url: "",

      externalId: "",

      storageKey:
        undefined,

      mimeType:
        file.type,

      fileSize:
        String(file.size),

      duration:
        undefined,

      /**
       * Do not carry over the old thumbnail
       * into the temporary upload state.
       *
       * For an existing PDF, the previous
       * thumbnail is restored if the upload fails.
       */
      thumbnailUrl:
        mediaType === "PDF" ||
        mediaType === "AUDIO"
          ? previousThumbnailUrl
          : null,

      thumbnail:
        mediaType === "AUDIO"
          ? existingItem?.thumbnail
          : undefined,
    });

    try {
      /**
       * VIDEO uploads are not supported by the
       * current backend upload API.
       *
       * Videos should use YouTube.
       */
      if (
        mediaType === "VIDEO"
      ) {
        throw new Error(
          "Video files cannot be uploaded from the device. Please use a YouTube URL for video resources.",
        );
      }

      const uploaded =
        await uploadAdminMedia(
          file,
          mediaType as
            | "AUDIO"
            | "PDF"
            | "IMAGE",
        );

      /**
       * Cloudinary upload succeeded.
       *
       * Replace the temporary browser URL
       * with the permanent Cloudinary URL.
       *
       * IMPORTANT:
       *
       * The backend now returns thumbnailUrl
       * for PDF uploads, so we preserve it here.
       */
      updateMedia(index, {
        type: mediaType,

        provider:
          "CLOUDINARY",

        uploading: false,

        url:
          uploaded.data.secureUrl,

        storageKey:
          uploaded.data.publicId,

        mimeType:
          uploaded.data.mimeType ??
          file.type,

        fileSize:
          String(
            uploaded.data.bytes ??
              file.size,
          ),

        duration:
          uploaded.data.duration,

        thumbnailUrl:
          uploaded.data.thumbnailUrl ??
          null,

        localPreviewUrl:
          undefined,

        /**
         * A newly uploaded PDF/image/audio
         * replaces the previous media file.
         *
         * Only keep the manually uploaded
         * audio thumbnail object when the
         * media itself is still AUDIO.
         */
        ...(mediaType !== "AUDIO"
          ? {
              thumbnail:
                undefined,
            }
          : {}),
      });

      previewUrlsRef.current.delete(
        localPreviewUrl,
      );

      URL.revokeObjectURL(
        localPreviewUrl,
      );
    } catch (err) {
      /**
       * Keep the local preview after failure.
       *
       * Restore the previously persisted
       * thumbnail so an upload failure does
       * not destroy the existing preview.
       */
      updateMedia(index, {
        uploading: false,

        localPreviewUrl,

        url: "",

        storageKey:
          undefined,

        mimeType:
          file.type,

        fileSize:
          String(file.size),

        duration:
          undefined,

        thumbnailUrl:
          previousThumbnailUrl,
      });

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload media.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Audio Thumbnail Upload                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleThumbnailUpload(
    index: number,
    file?: File,
  ) {
    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setError(
        "Audio thumbnails must be image files.",
      );
      return;
    }

    setError("");

    const localPreviewUrl =
      URL.createObjectURL(file);

    previewUrlsRef.current.add(
      localPreviewUrl,
    );

    const current =
      media[index];

    if (
      current?.thumbnail
        ?.localPreviewUrl
    ) {
      previewUrlsRef.current.delete(
        current.thumbnail.localPreviewUrl,
      );

      URL.revokeObjectURL(
        current.thumbnail.localPreviewUrl,
      );
    }

    updateMedia(index, {
      thumbnail: {
        type: "IMAGE",

        provider:
          "CLOUDINARY",

        title:
          `${title || "Resource"} thumbnail`,

        url: "",

        storageKey:
          undefined,

        mimeType:
          file.type,

        fileSize:
          String(file.size),

        uploading: true,

        fileName:
          file.name,

        localPreviewUrl,

        thumbnailUrl:
          null,
      },
    });

    try {
      const uploaded =
        await uploadAdminMedia(
          file,
          "IMAGE",
        );

      updateMedia(index, {
        thumbnail: {
          type: "IMAGE",

          provider:
            "CLOUDINARY",

          title:
            `${title || "Resource"} thumbnail`,

          url:
            uploaded.data.secureUrl,

          storageKey:
            uploaded.data.publicId,

          mimeType:
            uploaded.data.mimeType ??
            file.type,

          fileSize:
            String(
              uploaded.data.bytes ??
                file.size,
            ),

          uploading: false,

          fileName:
            file.name,

          thumbnailUrl:
            uploaded.data.thumbnailUrl ??
            null,
        },

        /**
         * The manually selected thumbnail
         * becomes the primary thumbnail used
         * by the audio player.
         */
        thumbnailUrl:
          uploaded.data.secureUrl,
      });

      previewUrlsRef.current.delete(
        localPreviewUrl,
      );

      URL.revokeObjectURL(
        localPreviewUrl,
      );
    } catch (err) {
      updateMedia(index, {
        thumbnail: {
          type: "IMAGE",

          provider:
            "CLOUDINARY",

          title:
            `${title || "Resource"} thumbnail`,

          url: "",

          storageKey:
            undefined,

          mimeType:
            file.type,

          fileSize:
            String(file.size),

          uploading: false,

          fileName:
            file.name,

          localPreviewUrl,
        },
      });

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload audio thumbnail.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Media validation                                                         */
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

      if (
        item.thumbnail?.uploading
      ) {
        return `Media ${
          i + 1
        }: Please wait for the audio thumbnail upload to finish.`;
      }

      const hasUrl =
        Boolean(
          item.url?.trim(),
        );

      const hasExternalId =
        Boolean(
          item.externalId?.trim(),
        );

      const hasLocalPreview =
        Boolean(
          item.localPreviewUrl,
        );

      /**
       * Completely empty cards are ignored.
       */
      if (
        !hasUrl &&
        !hasExternalId &&
        !hasLocalPreview
      ) {
        continue;
      }

      /**
       * A Cloudinary item must have a permanent
       * URL before it can be saved.
       */
      if (
        item.provider ===
          "CLOUDINARY" &&
        !hasUrl
      ) {
        return `Media ${
          i + 1
        }: Please upload the selected file successfully before saving.`;
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

      /**
       * Audio thumbnail uploads must have
       * finished before saving.
       */
      if (
        item.type === "AUDIO" &&
        item.thumbnail?.uploading
      ) {
        return `Media ${
          i + 1
        }: Please wait for the audio thumbnail upload to finish.`;
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

    if (!resourceId) {
      setError(
        "Resource ID is missing.",
      );
      return;
    }

    if (
      media.some(
        (item) => item.uploading,
      )
    ) {
      setError(
        "Please wait for all media uploads to finish.",
      );
      return;
    }

    if (
      media.some(
        (item) =>
          item.thumbnail?.uploading,
      )
    ) {
      setError(
        "Please wait for all audio thumbnail uploads to finish.",
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

      /**
       * Only submit media that has a permanent
       * URL or an external ID.
       */
      const cleanedMedia =
        media
          .filter(
            (item) =>
              item.url?.trim() ||
              item.externalId?.trim(),
          )
          .map((item) => ({
            ...(item.id
              ? {
                  id: item.id,
                }
              : {}),

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

            /**
             * IMPORTANT:
             *
             * Persist the Cloudinary-generated
             * thumbnail together with the media.
             *
             * For PDFs this is the first-page
             * thumbnail generated by Cloudinary.
             *
             * For AUDIO, an explicitly uploaded
             * thumbnail takes priority.
             */
            thumbnailUrl:
              item.type === "AUDIO"
                ? item.thumbnail?.url ||
                  item.thumbnailUrl ||
                  undefined
                : item.thumbnailUrl ||
                  undefined,
          }));

      const input: UpdateResourceInput =
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

          media:
            cleanedMedia,
        };

      await updateResource(
        resourceId,
        input,
      );

      setShowSuccess(true);
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

  /* ------------------------------------------------------------------------ */
  /* Loading state                                                             */
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
  /* Loading error                                                             */
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

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadResource}
              className="inline-flex items-center gap-2 bg-charcoal px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze"
            >
              <Loader2 size={14} />
              Try Again
            </button>

            <Link
              href="/admin/dashboard/resources"
              className="inline-flex items-center gap-2 border border-charcoal/10 bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/60 transition-colors hover:border-charcoal/20 hover:text-charcoal"
            >
              <ArrowLeft size={14} />
              Back to Resources
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      {/* Header -------------------------------------------------------------- */}

      <header className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-10">
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
            Edit Resource
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-charcoal/45">
            Update the resource details,
            organization, publishing
            status, and attached media.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-12">
        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="space-y-8">
            {/* Basic Information -------------------------------------------- */}

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
                  hint="Used in the public resource URL. Changing this may change the public URL."
                >
                  <input
                    value={slug}
                    onChange={(event) =>
                      handleSlugChange(
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

            {/* Categories ---------------------------------------------------- */}

            <section className="border border-charcoal/10 bg-white">
              <SectionHead
                eyebrow="Organization"
                title="Categories"
                description="Assign one or more categories to organize this resource."
              />

              <div className="p-6">
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
                      {categoriesError}
                    </p>

                    <button
                      type="button"
                      onClick={loadCategories}
                      className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-bronze hover:underline"
                    >
                      Try again
                    </button>
                  </div>
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
                            className={`flex items-start gap-3 border p-4 text-left transition-all ${
                              selected
                                ? "border-bronze bg-bronze/[0.06]"
                                : "border-charcoal/10 hover:border-bronze/40"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                                selected
                                  ? "border-bronze bg-bronze text-ivory"
                                  : "border-charcoal/20 bg-white"
                              }`}
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

            {/* Media --------------------------------------------------------- */}

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
                  className="inline-flex items-center gap-2 border border-charcoal/10 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:border-bronze hover:text-bronze"
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
                      No media attached
                      yet.
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
                        <MediaEditor
                          key={
                            item.id ??
                            `new-${index}`
                          }
                          item={item}
                          index={index}
                          resourceTitle={title}
                          fileInput={(element) => {
                            fileInputs.current[
                              index
                            ] = element;
                          }}
                          thumbnailInput={(
                            element,
                          ) => {
                            thumbnailInputs.current[
                              index
                            ] = element;
                          }}
                          onFile={(file) =>
                            handleFileUpload(
                              index,
                              file,
                            )
                          }
                          onThumbnailFile={(
                            file,
                          ) =>
                            handleThumbnailUpload(
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

          {/* Sidebar --------------------------------------------------------- */}

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
                    .filter((category) =>
                      selectedCategoryIds.includes(
                        category.id,
                      ),
                    )
                    .map((category) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center gap-1.5 bg-bronze/10 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-bronze"
                      >
                        {category.name}
                      </span>
                    ))}
                </div>
              </section>
            )}

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
                className="flex w-full items-center justify-center gap-2 border border-charcoal/10 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-bronze hover:text-bronze"
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
                      item.uploading ||
                      item.thumbnail
                        ?.uploading,
                  )
                }
                className="group mt-3 flex w-full items-center justify-center gap-2 bg-charcoal px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Preview ------------------------------------------------------------- */}

      {showPreview && (
        <PreviewDialog
          title={title}
          description={description}
          content={content}
          type={type}
          speaker={speaker}
          media={media}
          resourceTitle={title}
          onClose={() =>
            setShowPreview(false)
          }
        />
      )}

      {/* Success ------------------------------------------------------------- */}

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
  resourceTitle,
  onUpdate,
  onRemove,
  onFile,
  onThumbnailFile,
  fileInput,
  thumbnailInput,
}: {
  item: MediaItem;
  index: number;
  resourceTitle: string;

  onUpdate: (
    patch: Partial<MediaItem>,
  ) => void;

  onRemove: () => void;

  onFile: (
    file?: File,
  ) => void;

  onThumbnailFile: (
    file?: File,
  ) => void;

  fileInput: (
    element: HTMLInputElement | null,
  ) => void;

  thumbnailInput: (
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

  const source =
    item.url ||
    item.localPreviewUrl ||
    youtubeEmbed;

  /**
   * Explicitly uploaded audio thumbnail
   * takes priority over the media thumbnail.
   */
  const audioThumbnail =
    item.thumbnail?.url ||
    item.thumbnail?.localPreviewUrl ||
    item.thumbnailUrl ||
    undefined;

  /**
   * PDF thumbnail comes directly from the
   * media's Cloudinary thumbnailUrl.
   */
  const pdfThumbnail =
    item.type === "PDF"
      ? item.thumbnailUrl ||
        undefined
      : undefined;

  return (
    <div className="border border-charcoal/10 p-5">
      {/* Header -------------------------------------------------------------- */}

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
          className="flex h-8 w-8 items-center justify-center text-charcoal/30 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label={`Remove media ${
            index + 1
          }`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Type / Provider ----------------------------------------------------- */}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Media Type">
          <select
            value={item.type}
            onChange={(event) => {
              const nextType =
                event.target
                  .value as MediaType;

              onUpdate({
                type: nextType,

                ...(nextType !==
                "AUDIO"
                  ? {
                      thumbnail:
                        undefined,
                    }
                  : {}),
              });
            }}
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

                /**
                 * When switching away from
                 * Cloudinary, do not accidentally
                 * keep a Cloudinary local file.
                 */
                ...(provider !==
                "CLOUDINARY"
                  ? {
                      uploading:
                        false,
                      localPreviewUrl:
                        undefined,
                    }
                  : {}),
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

      {/* Title ---------------------------------------------------------------- */}

      <div className="mt-5">
        <Field label="Media Title">
          <input
            value={item.title}
            onChange={(event) =>
              onUpdate({
                title:
                  event.target
                    .value,
              })
            }
            placeholder="Walking in Purpose — Full Sermon"
            className="input"
          />
        </Field>
      </div>

      {/* Device upload -------------------------------------------------------- */}

      {item.provider ===
        "CLOUDINARY" && (
        <div className="mt-5 border border-dashed border-bronze/30 bg-bronze/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-bronze">
                Device Upload
              </p>

              <p className="mt-1 text-[11px] leading-5 text-charcoal/40">
                Upload a new file to
                Cloudinary. The upload
                happens before the resource
                changes are saved.
              </p>
            </div>

            <input
              data-media-upload={index}
              ref={fileInput}
              type="file"
              className="hidden"
              accept="audio/*,image/*,application/pdf"
              onChange={(
                event: ChangeEvent<HTMLInputElement>,
              ) => {
                onFile(
                  event.target.files?.[0],
                );

                event.currentTarget.value =
                  "";
              }}
            />

            <button
              type="button"
              disabled={
                item.uploading
              }
              onClick={() =>
                fileInput(
                  document.querySelector<HTMLInputElement>(
                    `input[data-media-upload="${index}"]`,
                  ),
                )
              }
              className="inline-flex items-center gap-2 bg-charcoal px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload size={14} />

              {item.uploading
                ? "Uploading..."
                : item.url
                  ? "Replace File"
                  : "Choose File"}
            </button>
          </div>

          {item.fileName && (
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="truncate text-xs text-charcoal/55">
                {item.fileName}
              </p>

              {item.fileSize !==
                undefined && (
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
                Media uploaded
                successfully
              </p>
            )}

          {!item.uploading &&
            item.localPreviewUrl &&
            !item.url && (
              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.1em] text-red-600">
                Upload failed — the local
                preview is still available.
                Please retry.
              </p>
            )}
        </div>
      )}

      {/* Audio thumbnail ----------------------------------------------------- */}

      {item.provider ===
        "CLOUDINARY" &&
        item.type ===
          "AUDIO" && (
          <div className="mt-5 border border-charcoal/10 bg-charcoal/[0.02] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-bronze">
                  Audio Thumbnail
                </p>

                <p className="mt-1 max-w-md text-[11px] leading-5 text-charcoal/40">
                  Optional. This image is used
                  as the visual background of
                  the audio player.
                </p>
              </div>

              <input
                data-thumbnail-upload={
                  index
                }
                ref={thumbnailInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(
                  event,
                ) => {
                  onThumbnailFile(
                    event.target.files?.[0],
                  );

                  event.currentTarget.value =
                    "";
                }}
              />

              <button
                type="button"
                disabled={
                  item.thumbnail
                    ?.uploading
                }
                onClick={() =>
                  thumbnailInput(
                    document.querySelector<HTMLInputElement>(
                      `input[data-thumbnail-upload="${index}"]`,
                    ),
                  )
                }
                className="inline-flex items-center gap-2 border border-charcoal/10 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-bronze hover:text-bronze disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImageIcon
                  size={14}
                />

                {item.thumbnail
                  ?.uploading
                  ? "Uploading..."
                  : audioThumbnail
                    ? "Replace Thumbnail"
                    : "Choose Thumbnail"}
              </button>
            </div>

            {audioThumbnail && (
              <div className="mt-4 overflow-hidden border border-charcoal/10 bg-charcoal">
                <img
                  src={
                    audioThumbnail
                  }
                  alt={
                    item.title ||
                    "Audio thumbnail"
                  }
                  className="max-h-64 w-full object-cover"
                />
              </div>
            )}

            {item.thumbnail
              ?.uploading && (
              <div className="mt-4">
                <div className="h-1 overflow-hidden bg-charcoal/5">
                  <div className="h-full w-1/2 animate-pulse bg-bronze" />
                </div>

                <p className="mt-2 text-[10px] text-charcoal/35">
                  Uploading thumbnail
                  to Cloudinary...
                </p>
              </div>
            )}

            {!item.thumbnail
              ?.uploading &&
              item.thumbnail?.url && (
                <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.1em] text-green-700">
                  Thumbnail uploaded
                </p>
              )}

            {!item.thumbnail
              ?.uploading &&
              item.thumbnail
                ?.localPreviewUrl &&
              !item.thumbnail
                ?.url && (
                <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.1em] text-red-600">
                  Thumbnail upload failed —
                  the local preview is still
                  available. Please retry.
                </p>
              )}
          </div>
        )}

      {/* External / YouTube -------------------------------------------------- */}

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

      {/* Immediate Media Preview --------------------------------------------- */}

      {source && (
        <div className="mt-5 overflow-hidden border border-charcoal/10 bg-black">
          <ResourceMediaPreview
            media={item}
            localPreviewUrl={
              item.localPreviewUrl
            }
            thumbnailUrl={
              item.type === "AUDIO"
                ? audioThumbnail
                : item.type === "PDF"
                  ? pdfThumbnail
                  : undefined
            }
            title={
              resourceTitle.trim() ||
              item.title.trim() ||
              item.fileName ||
              "Media preview"
            }
          />
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Preview Dialog                                                              */
/* ========================================================================== */

function PreviewDialog({
  title,
  resourceTitle,
  description,
  content,
  type,
  speaker,
  media,
  onClose,
}: {
  title: string;
  resourceTitle: string;
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
        {/* Header ------------------------------------------------------------ */}

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
            className="flex h-9 w-9 items-center justify-center border border-charcoal/10 transition-colors hover:border-bronze hover:text-bronze"
            aria-label="Close preview"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content ----------------------------------------------------------- */}

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
                    key={
                      item.id ??
                      `preview-${index}`
                    }
                    media={item}
                    resourceTitle={
                      resourceTitle
                    }
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
  resourceTitle,
}: {
  media: MediaItem;
  resourceTitle: string;
}) {
  /**
   * Audio:
   *   Explicitly uploaded thumbnail wins.
   *
   * PDF:
   *   Cloudinary-generated first-page thumbnail.
   *
   * Other media:
   *   Use their own thumbnailUrl if one exists.
   */
  const thumbnailUrl =
    media.type === "AUDIO"
      ? media.thumbnail?.url ||
        media.thumbnail?.localPreviewUrl ||
        media.thumbnailUrl ||
        undefined
      : media.type === "PDF"
        ? media.thumbnailUrl ||
          undefined
        : media.thumbnailUrl ||
          undefined;

  return (
    <div>
      {media.title && (
        <p className="mb-3 text-xs font-medium text-charcoal/60">
          {media.title}
        </p>
      )}

      <ResourceMediaPreview
        media={media}
        localPreviewUrl={
          media.localPreviewUrl
        }
        thumbnailUrl={
          thumbnailUrl
        }
        title={
          resourceTitle
        }
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
        className={`relative mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked
            ? "bg-bronze"
            : "bg-charcoal/15"
        }`}
      >
        <span
          className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
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
          <Check
            size={25}
            strokeWidth={2}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze">
            Resource Updated
          </p>

          <h2 className="mt-2 text-2xl font-medium tracking-tight">
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
          className="mt-8 flex w-full items-center justify-center gap-2 bg-charcoal px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze"
        >
          Continue to Resources
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}