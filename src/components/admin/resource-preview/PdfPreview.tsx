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
  RenderTask,
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

interface PageDimension {
  width: number;
  height: number;
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

/*
 * Number of pages rendered around the currently
 * visible area.
 */
const RENDER_BUFFER = 2;

/*
 * PDF.js canvas operations are deliberately kept
 * conservative for mobile Safari.
 */
const MAX_CANVAS_DPR_DESKTOP = 1.5;
const MAX_CANVAS_DPR_MOBILE = 1.25;

/*
 * Fallback page ratio used only until the real PDF
 * page dimensions have been measured.
 *
 * This is approximately the ratio of an A4 portrait
 * page.
 */
const DEFAULT_PAGE_RATIO = 210 / 297;

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
   * Stores the actual dimensions of each PDF page.
   *
   * These dimensions are used to create stable
   * placeholder heights before a canvas is rendered.
   *
   * Importantly, this stores only numbers — not
   * PDFPageProxy objects.
   */
  const [pageDimensions, setPageDimensions] =
    useState<
      Record<number, PageDimension>
    >({});

  /*
   * React owns all page wrapper elements.
   *
   * Refs are used only for measurement/canvas access.
   */
  const pageHostRefs =
    useRef<Record<number, HTMLDivElement | null>>(
      {},
    );

  const canvasRefs =
    useRef<Record<number, HTMLCanvasElement | null>>(
      {},
    );

  const canvasContainerRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * Only the PDF document is retained.
   *
   * Individual PDFPageProxy objects are fetched when
   * needed and are not stored here.
   */
  const pdfDocumentRef =
    useRef<PDFDocumentProxy | null>(null);

  /*
   * Active PDF.js render tasks.
   */
  const renderTasksRef =
    useRef<Record<number, RenderTask | null>>(
      {},
    );

  /*
   * Pages currently being rendered.
   */
  const renderingPagesRef =
    useRef<Set<number>>(new Set());

  /*
   * Pages whose canvases have successfully rendered.
   */
  const renderedPagesRef =
    useRef<Set<number>>(new Set());

  /*
   * Protects against stale async rendering work.
   */
  const renderGenerationRef =
    useRef(0);

  /*
   * Latest zoom value available to async callbacks.
   */
  const zoomRef =
    useRef(zoom);

  /*
   * Latest measured container width.
   */
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
  /* Cancel all active renders                                                */
  /* ------------------------------------------------------------------------ */

  const cancelAllRenderTasks =
    useCallback(() => {
      for (const pageNumber of Object.keys(
        renderTasksRef.current,
      )) {
        const numericPage =
          Number(pageNumber);

        const task =
          renderTasksRef.current[
            numericPage
          ];

        if (task) {
          try {
            task.cancel();
          } catch {
            // Ignore cancellation failures.
          }
        }

        renderTasksRef.current[
          numericPage
        ] = null;
      }

      renderingPagesRef.current.clear();
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Clear rendered canvas                                                    */
  /* ------------------------------------------------------------------------ */

  const clearCanvas =
    useCallback((pageNumber: number) => {
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

      const context =
        canvas.getContext("2d");

      if (context) {
        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height,
        );
      }

      canvas.width = 0;
      canvas.height = 0;
      canvas.style.width = "0px";
      canvas.style.height = "0px";

      renderedPagesRef.current.delete(
        pageNumber,
      );
    }, []);

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
      const width =
        element.clientWidth;

      if (width > 0) {
        setContainerWidth(width);
      }
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
        setPageDimensions({});
        return;
      }

      setLoading(true);
      setPreviewError(null);
      setDocumentReady(false);
      setPageCount(0);
      setCurrentPage(1);
      setContainerWidth(0);
      setPageDimensions({});

      renderGenerationRef.current += 1;

      cancelAllRenderTasks();

      pdfDocumentRef.current = null;

      pageHostRefs.current = {};
      canvasRefs.current = {};

      renderedPagesRef.current.clear();

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

        setPageCount(pdf.numPages);
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
        setPageDimensions({});

        setPreviewError(
          "The PDF could not be loaded for preview.",
        );
      }
    }

    void loadPdf();

    return () => {
      cancelled = true;

      renderGenerationRef.current += 1;

      cancelAllRenderTasks();

      const pdf =
        pdfDocumentRef.current;

      pdfDocumentRef.current = null;

      /*
       * cleanup() is used instead of destroy()
       * because the installed PDF.js runtime/types
       * are not exposing destroy consistently.
       */
      if (pdf) {
        void pdf.cleanup().catch(() => {
          // Ignore cleanup failures.
        });
      }

      pageHostRefs.current = {};
      canvasRefs.current = {};

      renderedPagesRef.current.clear();
      renderingPagesRef.current.clear();
      renderTasksRef.current = {};
    };
  }, [
    src,
    cancelAllRenderTasks,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Measure page dimensions                                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !documentReady ||
      pageCount <= 0
    ) {
      return;
    }

    let cancelled = false;

    async function measurePages() {
      const pdf =
        pdfDocumentRef.current;

      if (!pdf) {
        return;
      }

      const measuredDimensions: Record<
        number,
        PageDimension
      > = {};

      /*
       * Fetch page metadata only.
       *
       * No canvases are created and no page render
       * operations happen here.
       *
       * This gives every wrapper a stable aspect ratio
       * before visual rendering begins.
       */
      for (
        let pageNumber = 1;
        pageNumber <= pageCount;
        pageNumber += 1
      ) {
        if (cancelled) {
          return;
        }

        try {
          const page =
            await pdf.getPage(
              pageNumber,
            );

          if (cancelled) {
            return;
          }

          const viewport =
            page.getViewport({
              scale: 1,
            });

          if (
            Number.isFinite(
              viewport.width,
            ) &&
            Number.isFinite(
              viewport.height,
            ) &&
            viewport.width > 0 &&
            viewport.height > 0
          ) {
            measuredDimensions[
              pageNumber
            ] = {
              width:
                viewport.width,
              height:
                viewport.height,
            };
          }
        } catch (error) {
          console.warn(
            `Failed to measure PDF page ${pageNumber}:`,
            error,
          );
        }
      }

      if (
        cancelled ||
        Object.keys(
          measuredDimensions,
        ).length === 0
      ) {
        return;
      }

      setPageDimensions(
        measuredDimensions,
      );
    }

    void measurePages();

    return () => {
      cancelled = true;
    };
  }, [
    documentReady,
    pageCount,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Calculate available width                                                */
  /* ------------------------------------------------------------------------ */

  const getAvailableWidth =
    useCallback(() => {
      const width =
        containerWidthRef.current;

      if (width <= 0) {
        return 0;
      }

      const horizontalPadding =
        window.matchMedia(
          "(min-width: 640px)",
        ).matches
          ? 48
          : 24;

      return Math.max(
        width - horizontalPadding,
        280,
      );
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Calculate placeholder page height                                        */
  /* ------------------------------------------------------------------------ */

  const getPagePlaceholderHeight =
    useCallback(
      (pageNumber: number) => {
        const availableWidth =
          getAvailableWidth();

        if (availableWidth <= 0) {
          return 420;
        }

        const dimensions =
          pageDimensions[
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

        const width =
          Math.max(
            availableWidth,
            280,
          ) *
          zoom;

        /*
         * Add the vertical spacing around the page
         * so the wrapper occupies exactly the same
         * footprint as the eventual canvas.
         */
        return Math.max(
          120,
          width * ratio,
        );
      },
      [
        getAvailableWidth,
        pageDimensions,
        zoom,
      ],
    );

  /* ------------------------------------------------------------------------ */
  /* Calculate visible page range                                              */
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
      let lastVisible = pageCount;

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
          top + element.offsetHeight;

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
  /* Render a single page                                                     */
  /* ------------------------------------------------------------------------ */

  const renderPage =
    useCallback(
      async (
        pageNumber: number,
        generation: number,
      ) => {
        if (
          generation !==
          renderGenerationRef.current
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

        let page:
          Awaited<
            ReturnType<
              PDFDocumentProxy["getPage"]
            >
          > | null = null;

        try {
          page =
            await pdf.getPage(
              pageNumber,
            );

          if (
            generation !==
            renderGenerationRef.current
          ) {
            return;
          }

          const availableWidth =
            getAvailableWidth();

          if (availableWidth <= 0) {
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
            baseViewport.width <= 0
          ) {
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

          const maxDpr =
            isMobile
              ? MAX_CANVAS_DPR_MOBILE
              : MAX_CANVAS_DPR_DESKTOP;

          const devicePixelRatio =
            Math.min(
              window.devicePixelRatio ||
                1,
              maxDpr,
            );

          /*
           * Conservative limits for mobile Safari.
           */
          const MAX_CANVAS_DIMENSION =
            isMobile
              ? 4096
              : 6144;

          const pixelWidth =
            Math.min(
              Math.max(
                1,
                Math.floor(
                  viewport.width *
                    devicePixelRatio,
                ),
              ),
              MAX_CANVAS_DIMENSION,
            );

          const pixelHeight =
            Math.min(
              Math.max(
                1,
                Math.floor(
                  viewport.height *
                    devicePixelRatio,
                ),
              ),
              MAX_CANVAS_DIMENSION,
            );

          /*
           * Cancel any previous render for this page.
           */
          const previousTask =
            renderTasksRef.current[
              pageNumber
            ];

          if (previousTask) {
            try {
              previousTask.cancel();
            } catch {
              // Ignore cancellation failures.
            }
          }

          const context =
            canvas.getContext("2d", {
              alpha: false,
            });

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

          const renderTask =
            page.render(
              renderContext,
            );

          renderTasksRef.current[
            pageNumber
          ] = renderTask;

          await renderTask.promise;

          if (
            generation !==
            renderGenerationRef.current
          ) {
            return;
          }

          renderedPagesRef.current.add(
            pageNumber,
          );
        } catch (error) {
          /*
           * Cancellation is expected during scrolling,
           * zooming, resize, or unmounting.
           */
          if (
            error &&
            typeof error === "object" &&
            "name" in error &&
            error.name ===
              "RenderingCancelledException"
          ) {
            return;
          }

          if (
            generation !==
            renderGenerationRef.current
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

          renderTasksRef.current[
            pageNumber
          ] = null;

          /*
           * We intentionally do not retain the page
           * proxy. PDF.js remains responsible for the
           * document/page cache.
           */
          page = null;
        }
      },
      [getAvailableWidth],
    );

  /* ------------------------------------------------------------------------ */
  /* Render only pages near viewport                                           */
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
        renderGenerationRef.current;

      const {
        first,
        last,
      } = getVisiblePageRange();

      /*
       * Cancel pages that have moved outside the
       * render window.
       */
      for (
        const pageNumber of Object.keys(
          renderTasksRef.current,
        )
      ) {
        const numericPage =
          Number(pageNumber);

        if (
          numericPage < first ||
          numericPage > last
        ) {
          const task =
            renderTasksRef.current[
              numericPage
            ];

          if (task) {
            try {
              task.cancel();
            } catch {
              // Ignore cancellation failures.
            }
          }

          renderTasksRef.current[
            numericPage
          ] = null;

          renderingPagesRef.current.delete(
            numericPage,
          );
        }
      }

      const container =
        canvasContainerRef.current;

      const scrollTop =
        container?.scrollTop ?? 0;

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
       * Nearest page first.
       */
      pageNumbers.sort(
        (a, b) => {
          const aElement =
            pageHostRefs.current[a];

          const bElement =
            pageHostRefs.current[b];

          if (
            !aElement ||
            !bElement
          ) {
            return 0;
          }

          const aDistance =
            Math.abs(
              aElement.offsetTop -
                scrollTop,
            );

          const bDistance =
            Math.abs(
              bElement.offsetTop -
                scrollTop,
            );

          return (
            aDistance -
            bDistance
          );
        },
      );

      for (const pageNumber of pageNumbers) {
        if (
          generation !==
          renderGenerationRef.current
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
  /* Render when document/container becomes ready                             */
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
      window.requestAnimationFrame(() => {
        void renderVisiblePages();
      });

    return () => {
      window.cancelAnimationFrame(
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
  /* Re-render pages after zoom                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !documentReady ||
      pageCount <= 0 ||
      containerWidth <= 0
    ) {
      return;
    }

    renderGenerationRef.current += 1;

    cancelAllRenderTasks();

    /*
     * Copy the Set before clearing canvases because
     * clearCanvas() removes pages from the Set.
     */
    const renderedPages =
      Array.from(
        renderedPagesRef.current,
      );

    renderedPages.forEach(
      (pageNumber) => {
        clearCanvas(pageNumber);
      },
    );

    renderedPagesRef.current.clear();

    const frame =
      window.requestAnimationFrame(() => {
        void renderVisiblePages();
      });

    return () => {
      window.cancelAnimationFrame(
        frame,
      );
    };
  }, [
    zoom,
    documentReady,
    pageCount,
    containerWidth,
    cancelAllRenderTasks,
    clearCanvas,
    renderVisiblePages,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Track current page                                                       */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !documentReady ||
      pageCount === 0
    ) {
      return;
    }

    const scrollElement =
      canvasContainerRef.current;

    if (!scrollElement) {
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

      const scrollPosition =
        scrollTop + 24;

      let closestPage = 1;

      let closestDistance =
        Number.POSITIVE_INFINITY;

      for (
        let pageNumber = 1;
        pageNumber <= pageCount;
        pageNumber += 1
      ) {
        const pageElement =
          pageHostRefs.current[
            pageNumber
          ];

        if (!pageElement) {
          continue;
        }

        const distance =
          Math.abs(
            pageElement.offsetTop -
              scrollPosition,
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
        (previousPage) =>
          previousPage ===
          closestPage
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
        () => {
          updateCurrentPage();

          void renderVisiblePages();
        },
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
  /* Download PDF                                                             */
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
                {Array.from(
                  {
                    length: pageCount,
                  },
                  (_, index) => {
                    const pageNumber =
                      index + 1;

                    const pageHeight =
                      getPagePlaceholderHeight(
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
                        data-page={
                          pageNumber
                        }
                        className="mb-5 flex w-full justify-center last:mb-0"
                        style={{
                          minHeight:
                            `${pageHeight}px`,
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