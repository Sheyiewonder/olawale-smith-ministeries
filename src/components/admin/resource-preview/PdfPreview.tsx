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
} from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfPreviewProps {
  src: string;
  title?: string;
  thumbnailUrl?: string | null;
}

/*
 * Keep the number of pages actively rendered very small.
 *
 * This is intentionally conservative for iPhone/Safari.
 */
const RENDER_BUFFER = 1;

/*
 * Conservative canvas resolution.
 */
const MAX_DPR_DESKTOP = 1.35;
const MAX_DPR_MOBILE = 1.1;

/*
 * Approximate A4 portrait ratio.
 *
 * Used only as a temporary placeholder until an
 * individual page is actually rendered.
 */
const DEFAULT_PAGE_RATIO = 210 / 297;

function sanitizeFilenameTitle(
  title: string,
): string {
  return title
    .trim()
    .replace(
      /[<>:"/\\|?*\u0000-\u001F]/g,
      "",
    )
    .replace(/\s+/g, " ")
    .replace(/\.+$/, "")
    .slice(0, 180);
}

function getDownloadFilename(
  title?: string,
): string {
  const sanitizedTitle =
    sanitizeFilenameTitle(
      title?.trim() || "",
    );

  if (sanitizedTitle) {
    return `${sanitizedTitle}.pdf`;
  }

  return "document.pdf";
}

interface PageRatio {
  width: number;
  height: number;
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

  const [containerWidth, setContainerWidth] =
    useState(0);

  /*
   * Only stores numeric page dimensions.
   *
   * Unlike the previous implementation, we DON'T
   * fetch every page just to populate this object.
   *
   * A page is added here only after it is actually
   * needed for rendering.
   */
  const [pageRatios, setPageRatios] =
    useState<Record<number, PageRatio>>(
      {},
    );

  /*
   * Page wrapper references.
   */
  const pageHostRefs =
    useRef<
      Record<number, HTMLDivElement | null>
    >({});

  /*
   * Canvas references.
   */
  const canvasRefs =
    useRef<
      Record<number, HTMLCanvasElement | null>
    >({});

  const canvasContainerRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * The PDF document itself.
   *
   * No PDFPageProxy objects are retained.
   */
  const pdfDocumentRef =
    useRef<PDFDocumentProxy | null>(null);

  /*
   * Active rendering page numbers.
   */
  const renderingPagesRef =
    useRef<Set<number>>(new Set());

  /*
   * Pages whose canvas has successfully rendered.
   */
  const renderedPagesRef =
    useRef<Set<number>>(new Set());

  /*
   * Prevents stale asynchronous work from touching
   * a newer PDF/render generation.
   */
  const generationRef =
    useRef(0);

  const zoomRef =
    useRef(zoom);

  const containerWidthRef =
    useRef(containerWidth);

  void thumbnailUrl;

  /* ------------------------------------------------------------------------ */
  /* Keep refs synchronized                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    containerWidthRef.current =
      containerWidth;
  }, [containerWidth]);

  /* ------------------------------------------------------------------------ */
  /* Clear one canvas                                                         */
  /* ------------------------------------------------------------------------ */

  const clearCanvas =
    useCallback(
      (pageNumber: number) => {
        const canvas =
          canvasRefs.current[
            pageNumber
          ];

        if (!canvas) {
          renderedPagesRef.current.delete(
            pageNumber,
          );

          return;
        }

        /*
         * Release the backing canvas memory.
         */
        canvas.width = 1;
        canvas.height = 1;

        canvas.style.width = "0px";
        canvas.style.height = "0px";

        renderedPagesRef.current.delete(
          pageNumber,
        );
      },
      [],
    );

  /* ------------------------------------------------------------------------ */
  /* Measure container                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const element =
      canvasContainerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      const width =
        element.clientWidth;

      if (width > 0) {
        setContainerWidth(width);
      }
    };

    updateWidth();

    const observer =
      new ResizeObserver(
        updateWidth,
      );

    observer.observe(element);

    window.addEventListener(
      "resize",
      updateWidth,
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateWidth,
      );
    };
  }, [documentReady]);

  /* ------------------------------------------------------------------------ */
  /* Load PDF                                                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      if (!src) {
        setLoading(false);
        setDocumentReady(false);
        setPageCount(0);
        setPageRatios({});
        return;
      }

      setLoading(true);
      setPreviewError(null);
      setDocumentReady(false);
      setPageCount(0);
      setCurrentPage(1);
      setContainerWidth(0);
      setPageRatios({});

      generationRef.current += 1;

      /*
       * Release references to the previous document.
       */
      const previousPdf =
        pdfDocumentRef.current;

      pdfDocumentRef.current = null;

      if (previousPdf) {
        try {
          await previousPdf.cleanup();
        } catch {
          // Ignore cleanup failures.
        }
      }

      renderedPagesRef.current.clear();
      renderingPagesRef.current.clear();

      pageHostRefs.current = {};
      canvasRefs.current = {};

      try {
        const loadingTask =
          getDocument({
            url: src,
            withCredentials: false,
          });

        const pdf =
          await loadingTask.promise;

        if (cancelled) {
          try {
            await pdf.cleanup();
          } catch {
            // Ignore cleanup failures.
          }

          return;
        }

        pdfDocumentRef.current = pdf;

        setPageCount(
          pdf.numPages,
        );

        setCurrentPage(1);
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
        setPageCount(0);
        setPageRatios({});

        setPreviewError(
          "The PDF could not be loaded for preview.",
        );
      }
    }

    void loadPdf();

    return () => {
      cancelled = true;

      generationRef.current += 1;

      const pdf =
        pdfDocumentRef.current;

      pdfDocumentRef.current = null;

      renderedPagesRef.current.clear();
      renderingPagesRef.current.clear();

      pageHostRefs.current = {};
      canvasRefs.current = {};

      if (pdf) {
        void pdf
          .cleanup()
          .catch(() => {
            // Ignore cleanup failures.
          });
      }
    };
  }, [src]);

  /* ------------------------------------------------------------------------ */
  /* Available page width                                                     */
  /* ------------------------------------------------------------------------ */

  const getAvailableWidth =
    useCallback(() => {
      const width =
        containerWidthRef.current;

      if (width <= 0) {
        return 0;
      }

      /*
       * px-3 on mobile = 12px each side.
       * px-6 on desktop = 24px each side.
       */
      const horizontalPadding =
        window.matchMedia(
          "(min-width: 640px)",
        ).matches
          ? 48
          : 24;

      return Math.max(
        width - horizontalPadding,
        240,
      );
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Placeholder height                                                       */
  /* ------------------------------------------------------------------------ */

  const getPageHeight =
    useCallback(
      (pageNumber: number) => {
        const width =
          getAvailableWidth();

        if (width <= 0) {
          return 420;
        }

        const dimensions =
          pageRatios[
            pageNumber
          ];

        const ratio =
          dimensions &&
          dimensions.width > 0 &&
          dimensions.height > 0
            ? dimensions.height /
              dimensions.width
            : 1 /
              DEFAULT_PAGE_RATIO;

        return Math.max(
          320,
          width *
            ratio *
            zoom,
        );
      },
      [
        getAvailableWidth,
        pageRatios,
        zoom,
      ],
    );

  /* ------------------------------------------------------------------------ */
  /* Determine visible page range                                             */
  /* ------------------------------------------------------------------------ */

  const getVisiblePageRange =
    useCallback(() => {
      const container =
        canvasContainerRef.current;

      if (
        !container ||
        pageCount <= 0
      ) {
        return {
          first: 1,
          last: Math.min(
            pageCount || 1,
            1 + RENDER_BUFFER,
          ),
        };
      }

      const scrollTop =
        container.scrollTop;

      const viewportBottom =
        scrollTop +
        container.clientHeight;

      let firstVisible = 1;
      let lastVisible = 1;

      let foundFirst = false;

      for (
        let pageNumber = 1;
        pageNumber <= pageCount;
        pageNumber += 1
      ) {
        const element =
          pageHostRefs.current[
            pageNumber
          ];

        if (!element) {
          continue;
        }

        const top =
          element.offsetTop;

        const bottom =
          top +
          element.offsetHeight;

        if (
          !foundFirst &&
          bottom >= scrollTop
        ) {
          firstVisible =
            pageNumber;

          foundFirst = true;
        }

        if (
          top <= viewportBottom
        ) {
          lastVisible =
            pageNumber;
        } else if (foundFirst) {
          break;
        }
      }

      return {
        first: Math.max(
          1,
          firstVisible -
            RENDER_BUFFER,
        ),
        last: Math.min(
          pageCount,
          lastVisible +
            RENDER_BUFFER,
        ),
      };
    }, [pageCount]);

  /* ------------------------------------------------------------------------ */
  /* Render one page                                                          */
  /* ------------------------------------------------------------------------ */

  const renderPage =
    useCallback(
      async (
        pageNumber: number,
        generation: number,
      ) => {
        if (
          generation !==
          generationRef.current
        ) {
          return;
        }

        const pdf =
          pdfDocumentRef.current;

        if (!pdf) {
          return;
        }

        const canvas =
          canvasRefs.current[
            pageNumber
          ];

        if (!canvas) {
          return;
        }

        if (
          renderingPagesRef.current.has(
            pageNumber,
          )
        ) {
          return;
        }

        renderingPagesRef.current.add(
          pageNumber,
        );

        let page = null;

        try {
          page =
            await pdf.getPage(
              pageNumber,
            );

          if (
            generation !==
            generationRef.current
          ) {
            return;
          }

          const baseViewport =
            page.getViewport({
              scale: 1,
            });

          if (
            !Number.isFinite(
              baseViewport.width,
            ) ||
            !Number.isFinite(
              baseViewport.height,
            ) ||
            baseViewport.width <= 0 ||
            baseViewport.height <= 0
          ) {
            return;
          }

          /*
           * Store dimensions only for this page.
           */
          setPageRatios(
            (previous) => {
              const existing =
                previous[
                  pageNumber
                ];

              if (
                existing &&
                existing.width ===
                  baseViewport.width &&
                existing.height ===
                  baseViewport.height
              ) {
                return previous;
              }

              return {
                ...previous,
                [pageNumber]: {
                  width:
                    baseViewport.width,
                  height:
                    baseViewport.height,
                },
              };
            },
          );

          const availableWidth =
            getAvailableWidth();

          if (availableWidth <= 0) {
            return;
          }

          const widthScale =
            availableWidth /
            baseViewport.width;

          const scale =
            Math.max(
              widthScale,
              0.5,
            ) *
            zoomRef.current;

          const viewport =
            page.getViewport({
              scale,
            });

          const isMobile =
            window.matchMedia(
              "(max-width: 639px)",
            ).matches;

          const dpr =
            Math.min(
              window.devicePixelRatio ||
                1,
              isMobile
                ? MAX_DPR_MOBILE
                : MAX_DPR_DESKTOP,
            );

          /*
           * Hard mobile safety cap.
           */
          const MAX_PIXELS =
            isMobile
              ? 12_000_000
              : 24_000_000;

          let pixelWidth =
            Math.max(
              1,
              Math.floor(
                viewport.width *
                  dpr,
              ),
            );

          let pixelHeight =
            Math.max(
              1,
              Math.floor(
                viewport.height *
                  dpr,
              ),
            );

          /*
           * Prevent enormous canvas allocations.
           */
          const pixelCount =
            pixelWidth *
            pixelHeight;

          if (
            pixelCount >
            MAX_PIXELS
          ) {
            const reduction =
              Math.sqrt(
                MAX_PIXELS /
                  pixelCount,
              );

            pixelWidth =
              Math.max(
                1,
                Math.floor(
                  pixelWidth *
                    reduction,
                ),
              );

            pixelHeight =
              Math.max(
                1,
                Math.floor(
                  pixelHeight *
                    reduction,
                ),
              );
          }

          const context =
            canvas.getContext(
              "2d",
              {
                alpha: false,
              },
            );

          if (!context) {
            return;
          }

          canvas.width =
            pixelWidth;

          canvas.height =
            pixelHeight;

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

          context.fillStyle =
            "#ffffff";

          context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height,
          );

          const renderTask =
            page.render({
              canvas,
              canvasContext:
                context,
              viewport,
              transform:
                dpr !== 1
                  ? [
                      dpr,
                      0,
                      0,
                      dpr,
                      0,
                      0,
                    ]
                  : undefined,
            });

          await renderTask.promise;

          if (
            generation !==
            generationRef.current
          ) {
            return;
          }

          renderedPagesRef.current.add(
            pageNumber,
          );
        } catch (error) {
          if (
            error &&
            typeof error ===
              "object" &&
            "name" in error &&
            error.name ===
              "RenderingCancelledException"
          ) {
            return;
          }

          if (
            generation !==
            generationRef.current
          ) {
            return;
          }

          console.error(
            `Failed to render PDF page ${pageNumber}:`,
            error,
          );
        } finally {
          renderingPagesRef.current.delete(
            pageNumber,
          );

          /*
           * Explicitly release the page proxy if supported.
           */
          if (
            page &&
            typeof (
              page as {
                cleanup?: () => void;
              }
            ).cleanup ===
              "function"
          ) {
            try {
              (
                page as {
                  cleanup: () => void;
                }
              ).cleanup();
            } catch {
              // Ignore page cleanup failures.
            }
          }

          page = null;
        }
      },
      [getAvailableWidth],
    );

  /* ------------------------------------------------------------------------ */
  /* Render visible pages                                                     */
  /* ------------------------------------------------------------------------ */

  const renderVisiblePages =
    useCallback(async () => {
      if (
        !documentReady ||
        pageCount <= 0 ||
        containerWidthRef.current <= 0
      ) {
        return;
      }

      const generation =
        generationRef.current;

      const {
        first,
        last,
      } = getVisiblePageRange();

      const pageNumbers =
        Array.from(
          {
            length:
              last - first + 1,
          },
          (_, index) =>
            first + index,
        );

      /*
       * Render sequentially.
       *
       * This is intentional.
       *
       * Parallel PDF.js canvas rendering is more
       * memory-hungry on mobile Safari.
       */
      for (const pageNumber of pageNumbers) {
        if (
          generation !==
          generationRef.current
        ) {
          return;
        }

        if (
          renderedPagesRef.current.has(
            pageNumber,
          ) ||
          renderingPagesRef.current.has(
            pageNumber,
          )
        ) {
          continue;
        }

        await renderPage(
          pageNumber,
          generation,
        );
      }
    }, [
      documentReady,
      pageCount,
      getVisiblePageRange,
      renderPage,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Initial rendering                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !documentReady ||
      pageCount <= 0 ||
      containerWidth <= 0
    ) {
      return;
    }

    const frame =
      requestAnimationFrame(() => {
        void renderVisiblePages();
      });

    return () => {
      cancelAnimationFrame(
        frame,
      );
    };
  }, [
    documentReady,
    pageCount,
    containerWidth,
    renderVisiblePages,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Zoom                                                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !documentReady ||
      pageCount <= 0 ||
      containerWidth <= 0
    ) {
      return;
    }

    generationRef.current += 1;

    /*
     * Release existing canvas backing stores.
     */
    const renderedPages =
      Array.from(
        renderedPagesRef.current,
      );

    renderedPages.forEach(
      clearCanvas,
    );

    renderedPagesRef.current.clear();
    renderingPagesRef.current.clear();

    const frame =
      requestAnimationFrame(() => {
        void renderVisiblePages();
      });

    return () => {
      cancelAnimationFrame(
        frame,
      );
    };
  }, [
    zoom,
    documentReady,
    pageCount,
    containerWidth,
    clearCanvas,
    renderVisiblePages,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Track current page                                                       */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !documentReady ||
      pageCount <= 0
    ) {
      return;
    }

    const element =
      canvasContainerRef.current;

    if (!element) {
      return;
    }

    let ticking = false;

    function updateCurrentPage() {
      ticking = false;

      const container =
        canvasContainerRef.current;

      if (!container) {
        return;
      }

      const scrollTop =
        container.scrollTop;

      const position =
        scrollTop + 32;

      let closestPage = 1;
      let closestDistance =
        Number.POSITIVE_INFINITY;

      for (
        let pageNumber = 1;
        pageNumber <= pageCount;
        pageNumber += 1
      ) {
        const page =
          pageHostRefs.current[
            pageNumber
          ];

        if (!page) {
          continue;
        }

        const distance =
          Math.abs(
            page.offsetTop -
              position,
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
    }

    function handleScroll() {
      if (ticking) {
        return;
      }

      ticking = true;

      requestAnimationFrame(() => {
        updateCurrentPage();

        void renderVisiblePages();
      });
    }

    element.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    updateCurrentPage();

    return () => {
      element.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [
    documentReady,
    pageCount,
    renderVisiblePages,
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
  /* Download                                                                 */
  /* ------------------------------------------------------------------------ */

  async function downloadPdf() {
    if (!src || downloading) {
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(false);

      const response =
        await fetch(src, {
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
        URL.revokeObjectURL(
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
        {/* Toolbar */}

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
            {/* Desktop zoom */}

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

        {/* Loading */}

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

        {/* Error */}

        {!loading &&
          previewError && (
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
                  className="inline-flex items-center gap-2 rounded-full bg-bronze px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory"
                >
                  <ExternalLink size={14} />
                  Open PDF
                </button>

                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 rounded-full border border-bronze/30 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition hover:border-bronze hover:text-bronze disabled:opacity-60"
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

        {/* PDF */}

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
                {Array.from(
                  {
                    length: pageCount,
                  },
                  (_, index) => {
                    const pageNumber =
                      index + 1;

                    const height =
                      getPageHeight(
                        pageNumber,
                      );

                    return (
                      <div
                        key={pageNumber}
                        ref={(element) => {
                          pageHostRefs.current[
                            pageNumber
                          ] = element;
                        }}
                        className="mb-5 flex w-full justify-center last:mb-0"
                        style={{
                          minHeight:
                            `${height}px`,
                        }}
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
                    );
                  },
                )}
              </div>
            </div>
          )}

        {/* Mobile controls */}

        {!loading &&
          !previewError &&
          documentReady && (
            <div className="flex items-center justify-center gap-2 border-t border-black/5 bg-background/90 px-4 py-3 backdrop-blur-xl sm:hidden">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= 0.6}
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
                disabled={zoom >= 2.5}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze/30 bg-white shadow-sm transition hover:border-bronze hover:text-bronze disabled:opacity-40"
                aria-label="Zoom in"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

        {/* Download error */}

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