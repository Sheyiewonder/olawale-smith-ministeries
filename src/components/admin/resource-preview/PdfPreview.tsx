"use client";

import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getDocument,
  GlobalWorkerOptions,
} from "pdfjs-dist";
import type {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist";

import "pdfjs-dist/web/pdf_viewer.css";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfPreviewProps {
  src: string;
  title?: string;
  thumbnailUrl?: string | null;
}

interface RenderedPage {
  pageNumber: number;
  page: PDFPageProxy;
}

function sanitizeFilenameTitle(title: string): string {
  return title
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.+$/, "")
    .slice(0, 180);
}

function getDownloadFilename(title?: string): string {
  const sanitizedTitle = sanitizeFilenameTitle(
    title?.trim() || "",
  );

  if (sanitizedTitle) {
    return `${sanitizedTitle}.pdf`;
  }

  return "document.pdf";
}

export default function PdfPreview({
  src,
  title,
  thumbnailUrl,
}: PdfPreviewProps) {
  const [downloading, setDownloading] =
    useState(false);

  const [downloadError, setDownloadError] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [previewError, setPreviewError] =
    useState<string | null>(null);

  const [pageCount, setPageCount] =
    useState(0);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [zoom, setZoom] =
    useState(1);

  const [documentReady, setDocumentReady] =
    useState(false);

  const [pages, setPages] =
    useState<RenderedPage[]>([]);

  const [containerWidth, setContainerWidth] =
    useState(0);

  /*
   * References to the individual page wrappers.
   *
   * React owns these elements. We only use the refs
   * to measure their offsetTop for page tracking.
   */
  const pageHostRefs =
    useRef<Record<number, HTMLDivElement | null>>(
      {},
    );

  /*
   * Reference to the actual scrolling container.
   */
  const canvasContainerRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * References to each page's canvas.
   */
  const canvasRefs =
    useRef<Record<number, HTMLCanvasElement | null>>(
      {},
    );

  const pdfDocumentRef =
    useRef<PDFDocumentProxy | null>(null);

  /*
   * thumbnailUrl is retained in the component API
   * because other parts of the application may pass it.
   *
   * The actual PDF preview is rendered directly from src.
   */
  void thumbnailUrl;

  /* ------------------------------------------------------------------------ */
  /* Measure PDF container width                                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const element =
      canvasContainerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setContainerWidth(
        element.clientWidth,
      );
    };

    updateWidth();

    const resizeObserver =
      new ResizeObserver(updateWidth);

    resizeObserver.observe(element);

    window.addEventListener(
      "resize",
      updateWidth,
    );

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        updateWidth,
      );
    };
  }, [pages.length]);

  /* ------------------------------------------------------------------------ */
  /* Load PDF                                                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      if (!src) {
        setLoading(false);
        setDocumentReady(false);
        setPages([]);
        setPageCount(0);
        return;
      }

      setLoading(true);
      setPreviewError(null);
      setDocumentReady(false);
      setPageCount(0);
      setCurrentPage(1);
      setPages([]);
      setContainerWidth(0);

      pdfDocumentRef.current = null;

      pageHostRefs.current = {};
      canvasRefs.current = {};

      try {
        const loadingTask = getDocument({
          url: src,
          withCredentials: false,
        });

        const pdf =
          await loadingTask.promise;

        if (cancelled) {
          return;
        }

        pdfDocumentRef.current = pdf;

        setPageCount(pdf.numPages);
        setCurrentPage(1);

        const loadedPages: RenderedPage[] =
          [];

        for (
          let pageNumber = 1;
          pageNumber <= pdf.numPages;
          pageNumber += 1
        ) {
          if (cancelled) {
            return;
          }

          const page =
            await pdf.getPage(pageNumber);

          if (cancelled) {
            return;
          }

          loadedPages.push({
            pageNumber,
            page,
          });
        }

        if (cancelled) {
          return;
        }

        setPages(loadedPages);
        setDocumentReady(true);
        setLoading(false);
      } catch (error) {
        console.error(
          "PDF preview failed:",
          error,
        );

        if (cancelled) {
          return;
        }

        setLoading(false);
        setDocumentReady(false);
        setPages([]);

        setPreviewError(
          "The PDF could not be loaded for preview.",
        );
      }
    }

    void loadPdf();

    return () => {
      cancelled = true;

      pdfDocumentRef.current = null;

      pageHostRefs.current = {};
      canvasRefs.current = {};
    };
  }, [src]);

  /* ------------------------------------------------------------------------ */
  /* Calculate available width                                                */
  /* ------------------------------------------------------------------------ */

  const getAvailableWidth =
    useCallback(() => {
      if (containerWidth <= 0) {
        return 0;
      }

      const horizontalPadding =
        window.matchMedia(
          "(min-width: 640px)",
        ).matches
          ? 48
          : 24;

      return Math.max(
        containerWidth -
          horizontalPadding,
        280,
      );
    }, [containerWidth]);

  /* ------------------------------------------------------------------------ */
  /* Render PDF pages                                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !documentReady ||
      pages.length === 0 ||
      containerWidth <= 0
    ) {
      return;
    }

    let cancelled = false;

    const availableWidth =
      getAvailableWidth();

    if (availableWidth <= 0) {
      return;
    }

    async function renderPages() {
      for (const {
        pageNumber,
        page,
      } of pages) {
        if (cancelled) {
          return;
        }

        const host =
          pageHostRefs.current[
            pageNumber
          ];

        if (!host) {
          continue;
        }

        const canvas =
          canvasRefs.current[
            pageNumber
          ];

        if (!canvas) {
          continue;
        }

        const context =
          canvas.getContext("2d", {
            alpha: false,
          });

        if (!context) {
          continue;
        }

        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        const baseViewport =
          page.getViewport({
            scale: 1,
          });

        if (
          !Number.isFinite(
            baseViewport.width,
          ) ||
          baseViewport.width <= 0
        ) {
          continue;
        }

        const widthScale =
          availableWidth /
          baseViewport.width;

        const scale =
          Math.max(widthScale, 0.5) *
          zoom;

        const viewport =
          page.getViewport({
            scale,
          });

        const devicePixelRatio =
          Math.min(
            window.devicePixelRatio || 1,
            2,
          );

        canvas.width = Math.max(
          1,
          Math.floor(
            viewport.width *
              devicePixelRatio,
          ),
        );

        canvas.height = Math.max(
          1,
          Math.floor(
            viewport.height *
              devicePixelRatio,
          ),
        );

        canvas.style.width =
          `${viewport.width}px`;

        canvas.style.height =
          `${viewport.height}px`;

        context.setTransform(
          1,
          0,
          0,
          1,
          0,
          0,
        );

        try {
          const renderContext = {
            canvas,
            canvasContext: context,
            viewport,
            transform:
              devicePixelRatio !== 1
                ? [
                    devicePixelRatio,
                    0,
                    0,
                    devicePixelRatio,
                    0,
                    0,
                  ]
                : undefined,
          };

          await page.render(
            renderContext,
          ).promise;
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            `Failed to render PDF page ${pageNumber}:`,
            error,
          );
        }
      }
    }

    void renderPages();

    return () => {
      cancelled = true;
    };
  }, [
    documentReady,
    pages,
    zoom,
    containerWidth,
    getAvailableWidth,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Track current page                                                       */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !documentReady ||
      pages.length === 0
    ) {
      return;
    }

    /*
     * Capture the element once for event registration.
     *
     * We do NOT use this variable inside the callback.
     * This avoids TypeScript's nullability issue caused
     * by closures running after the effect has executed.
     */
    const scrollElement =
      canvasContainerRef.current;

    if (!scrollElement) {
      return;
    }

    let ticking = false;

    function updateCurrentPage() {
      ticking = false;

      /*
       * Read the ref directly.
       *
       * The fallback keeps this safe even if the element
       * has been removed during a React update.
       */
      const scrollTop =
        canvasContainerRef.current?.scrollTop ??
        0;

      const scrollPosition =
        scrollTop + 24;

      let closestPage = 1;

      let closestDistance =
        Number.POSITIVE_INFINITY;

      for (const { pageNumber } of pages) {
        const pageElement =
          pageHostRefs.current[
            pageNumber
          ];

        if (!pageElement) {
          continue;
        }

        const distance = Math.abs(
          pageElement.offsetTop -
            scrollPosition,
        );

        if (
          distance <
          closestDistance
        ) {
          closestDistance = distance;
          closestPage = pageNumber;
        }
      }

      setCurrentPage(
        (previousPage) =>
          previousPage === closestPage
            ? previousPage
            : closestPage,
      );
    }

    function handleScroll() {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(
        updateCurrentPage,
      );
    }

    scrollElement.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    updateCurrentPage();

    return () => {
      scrollElement.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [
    documentReady,
    pages,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Zoom controls                                                            */
  /* ------------------------------------------------------------------------ */

  function zoomIn() {
    setZoom((value) =>
      Math.min(
        Number(
          (value + 0.1).toFixed(2),
        ),
        2.5,
      ),
    );
  }

  function zoomOut() {
    setZoom((value) =>
      Math.max(
        Number(
          (value - 0.1).toFixed(2),
        ),
        0.6,
      ),
    );
  }

  function resetZoom() {
    setZoom(1);
  }

  /* ------------------------------------------------------------------------ */
  /* Download PDF                                                             */
  /* ------------------------------------------------------------------------ */

  async function downloadPdf() {
    if (!src || downloading) {
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(false);

      const response = await fetch(src, {
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
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.download =
        getDownloadFilename(title);

      link.href = objectUrl;
      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
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
    if (!src) {
      return;
    }

    window.open(
      src,
      "_blank",
      "noopener,noreferrer",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Empty state                                                              */
  /* ------------------------------------------------------------------------ */

  if (!src) {
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
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
      <div className="relative w-full">
        {/* ---------------------------------------------------------------- */}
        {/* Toolbar                                                          */}
        {/* ---------------------------------------------------------------- */}

        <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/5 bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-7">
          <div className="flex min-w-0 items-center gap-2">
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-bronze px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg">
              <FileText size={13} />

              PDF
            </div>

            {pageCount > 0 && (
              <span className="truncate text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Page {currentPage} of{" "}
                {pageCount}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Desktop zoom controls */}

            <div className="hidden items-center gap-1 rounded-full border border-bronze/30 bg-white/80 p-1 shadow-sm sm:flex">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= 0.6}
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
                disabled={zoom >= 2.5}
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
              <RotateCcw size={14} />
            </button>

            {/* Open */}

            <button
              type="button"
              onClick={openPdf}
              className="inline-flex items-center gap-2 rounded-full bg-bronze px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg transition hover:bg-bronze sm:px-4"
            >
              <ExternalLink size={14} />

              <span className="hidden sm:inline">
                Open
              </span>
            </button>

            {/* Download */}

            <button
              type="button"
              onClick={downloadPdf}
              disabled={downloading}
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

        {/* ---------------------------------------------------------------- */}
        {/* Loading state                                                    */}
        {/* ---------------------------------------------------------------- */}

        {loading && (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Loader2
                size={24}
                className="animate-spin text-bronze"
              />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Loading PDF
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Preparing the complete document…
              </p>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Preview error                                                    */}
        {/* ---------------------------------------------------------------- */}

        {!loading && previewError && (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileText size={24} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                PDF preview unavailable
              </p>

              <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                {previewError}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={openPdf}
                className="inline-flex items-center gap-2 rounded-full bg-bronze px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory transition hover:bg-bronze"
              >
                <ExternalLink size={14} />

                Open PDF
              </button>

              <button
                type="button"
                onClick={downloadPdf}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-full border border-bronze/30 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition hover:border-bronze hover:text-bronze disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Download size={14} />
                )}

                {downloading
                  ? "Downloading..."
                  : "Download PDF"}
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* PDF pages                                                        */}
        {/* ---------------------------------------------------------------- */}

        {!loading &&
          !previewError &&
          documentReady && (
            <div className="relative">
              <div
                ref={canvasContainerRef}
                className="max-h-[75vh] overflow-y-auto overscroll-contain bg-muted/30 px-3 py-5 sm:px-6 sm:py-7"
                style={{
                  WebkitOverflowScrolling:
                    "touch",
                }}
              >
                {pages.map(
                  ({
                    pageNumber,
                  }) => (
                    <div
                      key={pageNumber}
                      ref={(element) => {
                        pageHostRefs.current[
                          pageNumber
                        ] = element;
                      }}
                      data-page={pageNumber}
                      className="mb-5 flex w-full justify-center last:mb-0"
                    >
                      <canvas
                        ref={(element) => {
                          canvasRefs.current[
                            pageNumber
                          ] = element;
                        }}
                        className="block max-w-full rounded-sm bg-white shadow-sm"
                        aria-label={`PDF page ${pageNumber}`}
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        {/* ---------------------------------------------------------------- */}
        {/* Mobile zoom controls                                             */}
        {/* ---------------------------------------------------------------- */}

        {!loading &&
          !previewError &&
          documentReady && (
            <div className="flex items-center justify-center gap-2 border-t border-black/5 bg-background/90 px-4 py-3 backdrop-blur-xl sm:hidden">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= 0.6}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze/30 bg-white shadow-sm transition hover:border-bronze hover:text-bronze disabled:cursor-not-allowed disabled:opacity-40"
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
                disabled={zoom >= 2.5}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze/30 bg-white shadow-sm transition hover:border-bronze hover:text-bronze disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Zoom in"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

        {/* ---------------------------------------------------------------- */}
        {/* Download error                                                  */}
        {/* ---------------------------------------------------------------- */}

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
                setDownloadError(false);
                void downloadPdf();
              }}
              disabled={downloading}
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
