"use client";

import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface PdfPreviewProps {
  src: string;
  title?: string;
  thumbnailUrl?: string | null;
  pageCount?: number | null;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.1;

const DEFAULT_PAGE_COUNT = 1;
const DEFAULT_PAGE_RATIO = 210 / 297;
const PAGE_GAP = 20;

/**
 * Number of pages around the visible viewport that are allowed
 * to mount their actual <img> element.
 *
 * This is deliberately small so a 100+ page PDF does not trigger
 * hundreds of Cloudinary requests at once.
 */
const PAGE_RENDER_MARGIN = 2;

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface PageState {
  loaded: boolean;
  error: boolean;
}

/* -------------------------------------------------------------------------- */
/* Filename helpers                                                           */
/* -------------------------------------------------------------------------- */

function sanitizeFilenameTitle(title: string): string {
  return title
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.+$/, "")
    .slice(0, 180);
}

function getDownloadFilename(title?: string): string {
  const sanitized = sanitizeFilenameTitle(title ?? "");

  return sanitized
    ? `${sanitized}.pdf`
    : "document.pdf";
}

/* -------------------------------------------------------------------------- */
/* PDF helpers                                                                */
/* -------------------------------------------------------------------------- */

function isCloudinaryPdf(src: string): boolean {
  const value = src.trim();

  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    const pathname = url.pathname.toLowerCase();

    return (
      url.hostname.includes("cloudinary.com") &&
      pathname.includes("/image/upload/") &&
      pathname.endsWith(".pdf")
    );
  } catch {
    return (
      value.includes("/image/upload/") &&
      /\.pdf(?:$|[?#])/i.test(value)
    );
  }
}

/**
 * Converts:
 *
 * /image/upload/v123/file.pdf
 *
 * into:
 *
 * /image/upload/pg_1,f_jpg,q_auto/v123/file.jpg
 *
 * The transformation is inserted directly before the
 * Cloudinary version/public-id portion.
 */
function getCloudinaryPageUrl(
  src: string,
  pageNumber: number,
): string {
  const value = src.trim();

  if (!value || pageNumber < 1) {
    return "";
  }

  const marker = "/image/upload/";
  const markerIndex = value.indexOf(marker);

  if (markerIndex === -1) {
    return "";
  }

  const prefixEnd = markerIndex + marker.length;

  const prefix = value.slice(0, prefixEnd);
  const remainder = value.slice(prefixEnd);

  /*
   * Keep query strings and fragments outside
   * the Cloudinary transformation path.
   */
  const queryIndex = remainder.search(/[?#]/);

  const pathname =
    queryIndex === -1
      ? remainder
      : remainder.slice(0, queryIndex);

  const suffix =
    queryIndex === -1
      ? ""
      : remainder.slice(queryIndex);

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  if (pathParts.length === 0) {
    return "";
  }

  /*
   * Find the Cloudinary version.
   *
   * Example:
   * v1788487514
   */
  const versionIndex = pathParts.findIndex(
    (part) => /^v\d+$/.test(part),
  );

  /*
   * Cloudinary PDF page delivery:
   *
   * pg_1,f_jpg,q_auto
   *
   * selects page 1 and converts it to JPEG.
   */
  const transformation =
    `pg_${pageNumber},f_jpg,q_auto`;

  /*
   * The source PDF ends with:
   *
   * file.pdf
   *
   * The delivered page should be:
   *
   * file.jpg
   */
  const lastPartIndex =
    pathParts.length - 1;

  const lastPart =
    pathParts[lastPartIndex];

  const imageFilename =
    /\.pdf$/i.test(lastPart)
      ? lastPart.replace(
          /\.pdf$/i,
          ".jpg",
        )
      : `${lastPart}.jpg`;

  pathParts[lastPartIndex] =
    imageFilename;

  /*
   * Normal Cloudinary URL:
   *
   * /image/upload/v123/file.pdf
   *
   * becomes:
   *
   * /image/upload/pg_1,f_jpg,q_auto/v123/file.jpg
   */
  if (versionIndex >= 0) {
    const existingTransformations =
      pathParts.slice(
        0,
        versionIndex,
      );

    const versionAndPublicId =
      pathParts.slice(versionIndex);

    return [
      prefix.replace(/\/$/, ""),
      ...existingTransformations,
      transformation,
      ...versionAndPublicId,
    ].join("/") + suffix;
  }

  /*
   * Fallback for Cloudinary URLs
   * without an explicit version.
   */
  return [
    prefix.replace(/\/$/, ""),
    transformation,
    ...pathParts,
  ].join("/") + suffix;
}

/* -------------------------------------------------------------------------- */
/* Thumbnail helper                                                           */
/* -------------------------------------------------------------------------- */

function getFallbackThumbnailUrl(
  thumbnailUrl?: string | null,
): string {
  return thumbnailUrl?.trim() ?? "";
}

/* -------------------------------------------------------------------------- */
/* Page image                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Individual page renderer.
 *
 * This component handles:
 *
 * 1. Lazy mounting through IntersectionObserver.
 * 2. Cached image detection.
 * 3. Normal image onLoad/onError handling.
 *
 * Keeping this separate prevents the parent PDF component from
 * having to manage browser observers for every page itself.
 */
interface PdfPageProps {
  pageNumber: number;
  pageUrl: string;
  title?: string;
  zoom: number;
  loaded: boolean;
  hasError: boolean;
  fallbackThumbnailUrl: string;
  normalizedPageCount: number;
  onLoad: (pageNumber: number) => void;
  onError: (pageNumber: number) => void;
  onRetry: (pageNumber: number) => void;
  registerPageRef: (
    pageNumber: number,
    element: HTMLDivElement | null,
  ) => void;
}

function PdfPage({
  pageNumber,
  pageUrl,
  title,
  zoom,
  loaded,
  hasError,
  fallbackThumbnailUrl,
  normalizedPageCount,
  onLoad,
  onError,
  onRetry,
  registerPageRef,
}: PdfPageProps) {
  const pageContainerRef =
    useRef<HTMLDivElement | null>(null);

  const imageRef =
    useRef<HTMLImageElement | null>(null);

  const [shouldRenderImage, setShouldRenderImage] =
    useState(pageNumber <= 2);

  /*
   * Register the page element with the parent's
   * current-page tracking system.
   */
  useEffect(() => {
    registerPageRef(
      pageNumber,
      pageContainerRef.current,
    );

    return () => {
      registerPageRef(
        pageNumber,
        null,
      );
    };
  }, [
    pageNumber,
    registerPageRef,
  ]);

  /*
   * Only mount images when they are close to the viewport.
   *
   * Page 1 and page 2 are mounted immediately because they
   * are the first visible pages.
   */
  useEffect(() => {
    if (
      pageNumber <= 2 ||
      shouldRenderImage
    ) {
      return;
    }

    const element =
      pageContainerRef.current;

    if (!element) {
      return;
    }

    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      setShouldRenderImage(true);
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          if (
            entry?.isIntersecting
          ) {
            setShouldRenderImage(true);
            observer.disconnect();
          }
        },
        {
          root: null,
          rootMargin: `${PAGE_RENDER_MARGIN * 100}% 0px`,
          threshold: 0,
        },
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    pageNumber,
    shouldRenderImage,
  ]);

  /*
   * If the page URL cannot be generated, mark it as an error
   * instead of leaving the page stuck on "Loading page X".
   */
  useEffect(() => {
    if (
      !pageUrl &&
      !hasError
    ) {
      onError(pageNumber);
    }
  }, [
    pageUrl,
    hasError,
    pageNumber,
    onError,
  ]);

  /*
   * Browser/cache safeguard.
   *
   * If the image was already cached before React's normal
   * onLoad callback fired, naturalWidth will still tell us
   * that the image successfully exists.
   */
  useEffect(() => {
    const image =
      imageRef.current;

    if (
      !image ||
      !shouldRenderImage ||
      !pageUrl
    ) {
      return;
    }

    if (
      image.complete &&
      image.naturalWidth > 0
    ) {
      onLoad(pageNumber);
    }
  }, [
    pageNumber,
    pageUrl,
    shouldRenderImage,
    onLoad,
  ]);

  const pageError =
    hasError ||
    !pageUrl;

  return (
    <div
      ref={pageContainerRef}
      className="relative w-full"
      style={{
        marginBottom:
          pageNumber <
          normalizedPageCount
            ? PAGE_GAP
            : 0,
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Stable page surface                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="relative w-full overflow-hidden rounded-sm border border-black/5 bg-white shadow-sm"
        style={{
          aspectRatio:
            DEFAULT_PAGE_RATIO,
        }}
      >
        {/* -------------------------------------------------------------- */}
        {/* Loading state                                                    */}
        {/* -------------------------------------------------------------- */}

        {!loaded &&
          !pageError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                  <Loader2
                    size={20}
                    className="animate-spin text-bronze"
                  />
                </div>

                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  Loading page{" "}
                  {pageNumber}
                </span>
              </div>
            </div>
          )}

        {/* -------------------------------------------------------------- */}
        {/* Error state                                                      */}
        {/* -------------------------------------------------------------- */}

        {pageError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white p-8 text-center">
            <div className="w-full max-w-sm">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <FileText
                  size={20}
                />
              </div>

              <p className="mt-3 text-xs font-semibold">
                Unable to load page{" "}
                {pageNumber}
              </p>

              <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                {!pageUrl
                  ? "A valid preview URL could not be generated for this page."
                  : "The page image could not be loaded."}
              </p>

              <button
                type="button"
                onClick={() =>
                  onRetry(pageNumber)
                }
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-bronze px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ivory"
              >
                <RefreshCw
                  size={13}
                />
                Retry
              </button>

              {pageNumber === 1 &&
                fallbackThumbnailUrl && (
                  <div className="mt-5 overflow-hidden rounded-xl border border-black/5">
                    <img
                      src={
                        fallbackThumbnailUrl
                      }
                      alt={
                        title
                          ? `${title} PDF preview`
                          : "PDF preview"
                      }
                      className="block h-auto w-full"
                      draggable={false}
                    />
                  </div>
                )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* Page image                                                       */}
        {/* -------------------------------------------------------------- */}

        {shouldRenderImage &&
          pageUrl && (
            <img
              ref={imageRef}
              src={pageUrl}
              alt={`${title || "PDF"} page ${pageNumber}`}
              loading={
                pageNumber <= 2
                  ? "eager"
                  : "lazy"
              }
              decoding="async"
              fetchPriority={
                pageNumber === 1
                  ? "high"
                  : pageNumber === 2
                    ? "auto"
                    : "low"
              }
              draggable={false}
              onLoad={() =>
                onLoad(pageNumber)
              }
              onError={() =>
                onError(pageNumber)
              }
              className={[
                "absolute inset-0 block h-full w-full",
                "select-none object-contain",
                "bg-white",
                "transition-opacity duration-200",
                loaded
                  ? "opacity-100"
                  : "opacity-0",
              ].join(" ")}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin:
                  "center top",
                transition:
                  "opacity 200ms ease, transform 180ms ease",
              }}
            />
          )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

function PdfPreview({
  src,
  title,
  thumbnailUrl,
  pageCount,
}: PdfPreviewProps) {
  const [downloading, setDownloading] =
    useState(false);

  const [downloadError, setDownloadError] =
    useState(false);

  const [zoom, setZoom] = useState(1);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [previewError, setPreviewError] =
    useState<string | null>(null);

  const [pageStates, setPageStates] =
    useState<Record<number, PageState>>({});

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const pageRefs =
    useRef<
      Record<
        number,
        HTMLDivElement | null
      >
    >({});

  /* ------------------------------------------------------------------------ */
  /* Normalized page count                                                    */
  /* ------------------------------------------------------------------------ */

  const normalizedPageCount =
    useMemo(() => {
      const numericPageCount =
        typeof pageCount === "number"
          ? pageCount
          : Number(pageCount);

      if (
        !Number.isFinite(
          numericPageCount,
        ) ||
        numericPageCount <= 0
      ) {
        return DEFAULT_PAGE_COUNT;
      }

      return Math.max(
        1,
        Math.floor(
          numericPageCount,
        ),
      );
    }, [pageCount]);

  const fallbackThumbnailUrl =
    useMemo(
      () =>
        getFallbackThumbnailUrl(
          thumbnailUrl,
        ),
      [thumbnailUrl],
    );

  /* ------------------------------------------------------------------------ */
  /* Pre-generate page URLs                                                   */
  /* ------------------------------------------------------------------------ */

  const pageUrls = useMemo(() => {
    const urls: Record<
      number,
      string
    > = {};

    for (
      let pageNumber = 1;
      pageNumber <=
      normalizedPageCount;
      pageNumber += 1
    ) {
      urls[pageNumber] =
        getCloudinaryPageUrl(
          src,
          pageNumber,
        );
    }

    return urls;
  }, [
    src,
    normalizedPageCount,
  ]);

  useEffect(() => {
    console.log(
      "PDF SOURCE:",
      src,
    );

    console.log(
      "PDF PAGE COUNT:",
      normalizedPageCount,
    );

    console.log(
      "PDF PAGE 1 URL:",
      pageUrls[1],
    );

    console.log(
      "PDF PAGE 2 URL:",
      pageUrls[2],
    );
  }, [
    src,
    normalizedPageCount,
    pageUrls,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Reset when document changes                                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    setDownloading(false);
    setDownloadError(false);
    setPreviewError(null);
    setZoom(1);
    setCurrentPage(1);
    setPageStates({});

    pageRefs.current = {};
  }, [
    src,
    normalizedPageCount,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Validate source                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const value = src.trim();

    if (!value) {
      setPreviewError(
        "PDF source is unavailable.",
      );

      return;
    }

    if (!isCloudinaryPdf(value)) {
      if (fallbackThumbnailUrl) {
        setPreviewError(null);
        return;
      }

      setPreviewError(
        "This PDF cannot be rendered as a page preview.",
      );

      return;
    }

    setPreviewError(null);
  }, [
    src,
    fallbackThumbnailUrl,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Page ref registration                                                    */
  /* ------------------------------------------------------------------------ */

  const registerPageRef =
    useCallback(
      (
        pageNumber: number,
        element: HTMLDivElement | null,
      ) => {
        pageRefs.current[
          pageNumber
        ] = element;
      },
      [],
    );

  /* ------------------------------------------------------------------------ */
  /* Page state helpers                                                       */
  /* ------------------------------------------------------------------------ */

  const handlePageLoad =
    useCallback(
      (pageNumber: number) => {
        setPageStates(
          (previous) => ({
            ...previous,
            [pageNumber]: {
              loaded: true,
              error: false,
            },
          }),
        );
      },
      [],
    );

  const handlePageError =
    useCallback(
      (pageNumber: number) => {
        const pageUrl =
          pageUrls[pageNumber];

        console.error(
          `Failed to load PDF page ${pageNumber}.`,
          {
            pageNumber,
            pageUrl,
          },
        );

        setPageStates(
          (previous) => ({
            ...previous,
            [pageNumber]: {
              loaded: false,
              error: true,
            },
          }),
        );
      },
      [pageUrls],
    );

  /* ------------------------------------------------------------------------ */
  /* Retry individual page                                                   */
  /* ------------------------------------------------------------------------ */

  const retryPage =
    useCallback(
      (pageNumber: number) => {
        setPageStates(
          (previous) => ({
            ...previous,
            [pageNumber]: {
              loaded: false,
              error: false,
            },
          }),
        );
      },
      [],
    );

  /* ------------------------------------------------------------------------ */
  /* Current page tracking                                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const container =
      containerRef.current;

    if (
      !container ||
      !src ||
      previewError
    ) {
      return;
    }

    let ticking = false;

    const updateCurrentPage =
      () => {
        const scrollTop =
          container.scrollTop;

        const target =
          scrollTop + 80;

        let closestPage = 1;

        let closestDistance =
          Number.POSITIVE_INFINITY;

        for (
          let pageNumber = 1;
          pageNumber <=
          normalizedPageCount;
          pageNumber += 1
        ) {
          const page =
            pageRefs.current[
              pageNumber
            ];

          if (!page) {
            continue;
          }

          const distance =
            Math.abs(
              page.offsetTop -
                target,
            );

          if (
            distance <
            closestDistance
          ) {
            closestDistance =
              distance;

            closestPage =
              pageNumber;
          }
        }

        setCurrentPage(
          (previous) =>
            previous ===
            closestPage
              ? previous
              : closestPage,
        );
      };

    const handleScroll =
      () => {
        if (ticking) {
          return;
        }

        ticking = true;

        window.requestAnimationFrame(
          () => {
            ticking = false;
            updateCurrentPage();
          },
        );
      };

    container.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    updateCurrentPage();

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [
    src,
    normalizedPageCount,
    previewError,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Zoom                                                                     */
  /* ------------------------------------------------------------------------ */

  function zoomIn() {
    setZoom((previous) =>
      Math.min(
        Number(
          (
            previous +
            ZOOM_STEP
          ).toFixed(2),
        ),
        MAX_ZOOM,
      ),
    );
  }

  function zoomOut() {
    setZoom((previous) =>
      Math.max(
        Number(
          (
            previous -
            ZOOM_STEP
          ).toFixed(2),
        ),
        MIN_ZOOM,
      ),
    );
  }

  function resetZoom() {
    setZoom(1);
  }

  /* ------------------------------------------------------------------------ */
  /* Download                                                                 */
  /* ------------------------------------------------------------------------ */

  async function downloadPdf() {
    const value = src.trim();

    if (!value || downloading) {
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(false);

      const response =
        await fetch(value, {
          method: "GET",
          credentials: "omit",
        });

      if (!response.ok) {
        throw new Error(
          `Unable to download PDF (${response.status}).`,
        );
      }

      const blob =
        await response.blob();

      if (!blob.size) {
        throw new Error(
          "Downloaded PDF is empty.",
        );
      }

      const objectUrl =
        window.URL.createObjectURL(
          blob,
        );

      const link =
        document.createElement(
          "a",
        );

      link.href = objectUrl;

      link.download =
        getDownloadFilename(
          title,
        );

      link.style.display =
        "none";

      document.body.appendChild(
        link,
      );

      link.click();

      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(
          objectUrl,
        );
      }, 2000);
    } catch (error) {
      console.error(
        "PDF download failed:",
        error,
      );

      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Open PDF                                                                 */
  /* ------------------------------------------------------------------------ */

  function openPdf() {
    const value = src.trim();

    if (!value) {
      return;
    }

    window.open(
      value,
      "_blank",
      "noopener,noreferrer",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Empty source                                                             */
  /* ------------------------------------------------------------------------ */

  if (!src.trim()) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-2xl border bg-muted/20 p-8 text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <FileText size={24} />
          </div>

          <p className="mt-4 text-sm font-medium">
            PDF unavailable
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Preview unavailable                                                      */
  /* ------------------------------------------------------------------------ */

  if (previewError) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
        <div className="relative w-full">
          <div className="flex items-center justify-between gap-3 border-b border-black/5 bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-7">
            <div className="flex min-w-0 items-center gap-2">
              <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-bronze px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg">
                <FileText size={13} />
                PDF
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={openPdf}
                className="inline-flex items-center gap-2 rounded-full bg-bronze px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg"
              >
                <ExternalLink
                  size={14}
                />

                <span className="hidden sm:inline">
                  Open
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  void downloadPdf();
                }}
                disabled={
                  downloading
                }
                className="inline-flex items-center gap-2 rounded-full bg-bronze px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Download
                    size={14}
                  />
                )}

                <span className="hidden sm:inline">
                  {downloading
                    ? "Downloading..."
                    : "Download PDF"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 p-8 text-center">
            {fallbackThumbnailUrl ? (
              <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
                <img
                  src={
                    fallbackThumbnailUrl
                  }
                  alt={
                    title
                      ? `${title} PDF preview`
                      : "PDF preview"
                  }
                  className="block h-auto w-full"
                  draggable={false}
                />
              </div>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <FileText
                    size={24}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    PDF preview unavailable
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                    {previewError}
                  </p>
                </div>
              </>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={openPdf}
                className="inline-flex items-center gap-2 rounded-full bg-bronze px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory"
              >
                <ExternalLink
                  size={14}
                />
                Open PDF
              </button>

              <button
                type="button"
                onClick={() => {
                  void downloadPdf();
                }}
                disabled={
                  downloading
                }
                className="inline-flex items-center gap-2 rounded-full border border-bronze/30 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition hover:border-bronze hover:text-bronze disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Download
                    size={14}
                  />
                )}

                {downloading
                  ? "Downloading..."
                  : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
      <div className="relative w-full">

        {/* ------------------------------------------------------------------ */}
        {/* Toolbar                                                            */}
        {/* ------------------------------------------------------------------ */}

        <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/5 bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-7">
          <div className="flex min-w-0 items-center gap-2">
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-bronze px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg">
              <FileText size={13} />
              PDF
            </div>

            <span className="truncate text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
              Page {currentPage} of{" "}
              {normalizedPageCount}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">

            {/* Desktop zoom */}

            <div className="hidden items-center gap-1 rounded-full border border-bronze/30 bg-white/80 p-1 shadow-sm sm:flex">
              <button
                type="button"
                onClick={zoomOut}
                disabled={
                  zoom <= MIN_ZOOM
                }
                aria-label="Zoom out"
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={14} />
              </button>

              <button
                type="button"
                onClick={resetZoom}
                aria-label="Reset zoom"
                className="flex h-8 min-w-12 items-center justify-center rounded-full px-2 text-[10px] font-semibold"
              >
                {Math.round(
                  zoom * 100,
                )}
                %
              </button>

              <button
                type="button"
                onClick={zoomIn}
                disabled={
                  zoom >= MAX_ZOOM
                }
                aria-label="Zoom in"
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Mobile reset */}

            <button
              type="button"
              onClick={resetZoom}
              aria-label="Reset zoom"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze/30 bg-white/80 shadow-sm transition hover:border-bronze hover:text-bronze sm:hidden"
            >
              <RotateCcw
                size={14}
              />
            </button>

            {/* Open */}

            <button
              type="button"
              onClick={openPdf}
              className="inline-flex items-center gap-2 rounded-full bg-bronze px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg transition hover:bg-bronze sm:px-4"
            >
              <ExternalLink
                size={14}
              />

              <span className="hidden sm:inline">
                Open
              </span>
            </button>

            {/* Download */}

            <button
              type="button"
              onClick={() => {
                void downloadPdf();
              }}
              disabled={
                downloading
              }
              className="inline-flex items-center gap-2 rounded-full bg-bronze px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg transition hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
            >
              {downloading ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Download size={14} />
              )}

              <span className="hidden sm:inline">
                {downloading
                  ? "Downloading..."
                  : "Download PDF"}
              </span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Pages                                                              */}
        {/* ------------------------------------------------------------------ */}

        <div
          ref={containerRef}
          className="max-h-[75vh] overflow-y-auto overscroll-contain bg-muted/30 px-3 py-5 sm:px-6 sm:py-7"
          style={{
            WebkitOverflowScrolling:
              "touch",
          }}
        >
          <div className="mx-auto w-full max-w-4xl">

            {Array.from(
              {
                length:
                  normalizedPageCount,
              },
              (_, index) => {
                const pageNumber =
                  index + 1;

                const pageUrl =
                  pageUrls[
                    pageNumber
                  ];

                const state =
                  pageStates[
                    pageNumber
                  ];

                const loaded =
                  state?.loaded ??
                  false;

                const hasError =
                  state?.error ??
                  false;

                return (
                  <PdfPage
                    key={pageNumber}
                    pageNumber={
                      pageNumber
                    }
                    pageUrl={pageUrl}
                    title={title}
                    zoom={zoom}
                    loaded={loaded}
                    hasError={hasError}
                    fallbackThumbnailUrl={
                      fallbackThumbnailUrl
                    }
                    normalizedPageCount={
                      normalizedPageCount
                    }
                    onLoad={
                      handlePageLoad
                    }
                    onError={
                      handlePageError
                    }
                    onRetry={
                      retryPage
                    }
                    registerPageRef={
                      registerPageRef
                    }
                  />
                );
              },
            )}

          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Mobile controls                                                    */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-center justify-center gap-2 border-t border-black/5 bg-background/90 px-4 py-3 backdrop-blur-xl sm:hidden">
          <button
            type="button"
            onClick={zoomOut}
            disabled={
              zoom <= MIN_ZOOM
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze/30 bg-white shadow-sm transition hover:border-bronze hover:text-bronze disabled:opacity-40"
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>

          <button
            type="button"
            onClick={resetZoom}
            className="flex h-9 min-w-16 items-center justify-center rounded-full border border-bronze/30 bg-white px-3 text-[10px] font-semibold shadow-sm"
          >
            {Math.round(
              zoom * 100,
            )}
            %
          </button>

          <button
            type="button"
            onClick={zoomIn}
            disabled={
              zoom >= MAX_ZOOM
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze/30 bg-white shadow-sm transition hover:border-bronze hover:text-bronze disabled:opacity-40"
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Download error                                                     */}
        {/* ------------------------------------------------------------------ */}

        {downloadError && (
          <div className="absolute bottom-4 left-4 right-4 z-40 rounded-xl border border-destructive/20 bg-background/95 p-3 text-center shadow-sm backdrop-blur">
            <p className="text-xs font-medium text-destructive">
              Unable to download this PDF.
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Please check your connection and
              try again.
            </p>

            <button
              type="button"
              onClick={() => {
                setDownloadError(
                  false,
                );

                void downloadPdf();
              }}
              disabled={
                downloading
              }
              className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] underline underline-offset-4 disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { PdfPreview };

export default PdfPreview;