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
  RenderTask,
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
 * Only pages inside this window are mounted/rendered.
 *
 * On mobile this normally means:
 *   current page
 *   previous page
 *   next page
 *
 * This is deliberately conservative for iPhone/Safari.
 */
const RENDER_BUFFER = 1;

/*
 * Keep rendering resolution conservative.
 */
const MAX_DPR_DESKTOP = 1.25;
const MAX_DPR_MOBILE = 1;

/*
 * Maximum canvas memory budget per individual page.
 */
const MAX_PIXELS_DESKTOP = 18_000_000;
const MAX_PIXELS_MOBILE = 8_000_000;

/*
 * Approximate A4 portrait ratio.
 *
 * This is only used for placeholders before a real page
 * has been loaded.
 */
const DEFAULT_PAGE_RATIO = 210 / 297;

interface PageDimensions {
  width: number;
  height: number;
}

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
   * Only pages inside this set are mounted.
   */
  const [activePages, setActivePages] =
    useState<Set<number>>(
      () => new Set(),
    );

  /*
   * Dimensions are learned lazily.
   *
   * We never call getPage() for every page up front.
   */
  const [pageDimensions, setPageDimensions] =
    useState<
      Record<number, PageDimensions>
    >({});

  /*
   * Page wrapper references.
   *
   * These remain lightweight divs and contain no
   * canvas unless the page is active.
   */
  const pageHostRefs =
    useRef<
      Record<number, HTMLDivElement | null>
    >({});

  /*
   * Canvas references only exist for active pages.
   */
  const canvasRefs =
    useRef<
      Record<number, HTMLCanvasElement | null>
    >({});

  const canvasContainerRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * Current PDF document.
   */
  const pdfDocumentRef =
    useRef<PDFDocumentProxy | null>(null);

  /*
   * Current PDF loading task.
   */
  const loadingTaskRef =
    useRef<{
      destroy?: () => Promise<void> | void;
    } | null>(null);

  /*
   * Active PDF.js render tasks.
   */
  const renderTasksRef =
    useRef<
      Record<number, RenderTask | null>
    >({});

  /*
   * Pages currently rendering.
   */
  const renderingPagesRef =
    useRef<Set<number>>(new Set());

  /*
   * Pages that successfully rendered.
   */
  const renderedPagesRef =
    useRef<Set<number>>(new Set());

  /*
   * Prevents stale asynchronous work from affecting
   * a newer document/render generation.
   */
  const generationRef =
    useRef(0);

  const zoomRef =
    useRef(zoom);

  const containerWidthRef =
    useRef(containerWidth);

  const activePagesRef =
    useRef<Set<number>>(
      new Set(),
    );

  void thumbnailUrl;

  /* ------------------------------------------------------------------------ */
  /* Synchronize refs                                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    containerWidthRef.current =
      containerWidth;
  }, [containerWidth]);

  useEffect(() => {
    activePagesRef.current =
      activePages;
  }, [activePages]);

  /* ------------------------------------------------------------------------ */
  /* Cancel one page render                                                   */
  /* ------------------------------------------------------------------------ */

  const cancelPageRender =
    useCallback(
      (pageNumber: number) => {
        const task =
          renderTasksRef.current[
            pageNumber
          ];

        if (task) {
          try {
            task.cancel();
          } catch {
            // Ignore cancellation failures.
          }
        }

        renderTasksRef.current[
          pageNumber
        ] = null;

        renderingPagesRef.current.delete(
          pageNumber,
        );
      },
      [],
    );

  /* ------------------------------------------------------------------------ */
  /* Release one canvas                                                      */
  /* ------------------------------------------------------------------------ */

  const releaseCanvas =
    useCallback(
      (pageNumber: number) => {
        cancelPageRender(pageNumber);

        const canvas =
          canvasRefs.current[
            pageNumber
          ];

        if (canvas) {
          try {
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
          } catch {
            // Ignore canvas cleanup failures.
          }

          /*
           * Reducing the backing store to 1x1 releases
           * the large bitmap allocation.
           */
          canvas.width = 1;
          canvas.height = 1;

          canvas.style.width = "0px";
          canvas.style.height = "0px";
        }

        delete canvasRefs.current[
          pageNumber
        ];

        renderedPagesRef.current.delete(
          pageNumber,
        );
      },
      [cancelPageRender],
    );

  /* ------------------------------------------------------------------------ */
  /* Release pages outside active window                                     */
  /* ------------------------------------------------------------------------ */

  const releaseInactivePages =
    useCallback(
      (nextActivePages: Set<number>) => {
        const currentlyRendered =
          Array.from(
            renderedPagesRef.current,
          );

        for (const pageNumber of currentlyRendered) {
          if (
            !nextActivePages.has(
              pageNumber,
            )
          ) {
            releaseCanvas(
              pageNumber,
            );
          }
        }

        const currentlyRendering =
          Array.from(
            renderingPagesRef.current,
          );

        for (const pageNumber of currentlyRendering) {
          if (
            !nextActivePages.has(
              pageNumber,
            )
          ) {
            cancelPageRender(
              pageNumber,
            );
          }
        }
      },
      [
        cancelPageRender,
        releaseCanvas,
      ],
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

    if (
      typeof ResizeObserver !==
      "undefined"
    ) {
      const observer =
        new ResizeObserver(
          updateWidth,
        );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }

    window.addEventListener(
      "resize",
      updateWidth,
    );

    return () => {
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
        setActivePages(
          new Set(),
        );

        return;
      }

      /*
       * Invalidate every previous async operation.
       */
      generationRef.current += 1;

      setLoading(true);
      setPreviewError(null);
      setDocumentReady(false);
      setPageCount(0);
      setCurrentPage(1);
      setContainerWidth(0);
      setPageDimensions({});
      setActivePages(
        new Set(),
      );

      /*
       * Cancel/release previous rendering.
       */
      const previousPages =
        Array.from(
          renderingPagesRef.current,
        );

      previousPages.forEach(
        cancelPageRender,
      );

      renderedPagesRef.current.clear();
      renderingPagesRef.current.clear();

      renderTasksRef.current = {};
      canvasRefs.current = {};
      pageHostRefs.current = {};

      /*
       * Destroy previous loading task if possible.
       */
      const previousLoadingTask =
        loadingTaskRef.current;

      loadingTaskRef.current = null;

      if (
        previousLoadingTask &&
        typeof previousLoadingTask.destroy ===
          "function"
      ) {
        try {
          await previousLoadingTask.destroy();
        } catch {
          // Ignore cleanup failures.
        }
      }

      /*
       * Cleanup previous PDF document.
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

      try {
        const loadingTask =
          getDocument({
            url: src,
            withCredentials: false,
          });

        loadingTaskRef.current =
          loadingTask;

        const pdf =
          await loadingTask.promise;

        if (
          cancelled ||
          generationRef.current <= 0
        ) {
          try {
            await pdf.cleanup();
          } catch {
            // Ignore cleanup failures.
          }

          return;
        }

        pdfDocumentRef.current =
          pdf;

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
        setPageDimensions({});
        setActivePages(
          new Set(),
        );

        setPreviewError(
          "The PDF could not be loaded for preview.",
        );
      }
    }

    void loadPdf();

    return () => {
      cancelled = true;

      generationRef.current += 1;

      /*
       * Cancel all active render tasks.
       */
      const renderingPages =
        Array.from(
          renderingPagesRef.current,
        );

      renderingPages.forEach(
        cancelPageRender,
      );

      /*
       * Release every active canvas.
       */
      const renderedPages =
        Array.from(
          renderedPagesRef.current,
        );

      renderedPages.forEach(
        releaseCanvas,
      );

      renderedPagesRef.current.clear();
      renderingPagesRef.current.clear();

      renderTasksRef.current = {};
      canvasRefs.current = {};
      pageHostRefs.current = {};

      /*
       * Cancel loading.
       */
      const loadingTask =
        loadingTaskRef.current;

      loadingTaskRef.current = null;

      if (
        loadingTask &&
        typeof loadingTask.destroy ===
          "function"
      ) {
        try {
          void loadingTask.destroy();
        } catch {
          // Ignore cleanup failures.
        }
      }

      /*
       * Cleanup PDF.
       */
      const pdf =
        pdfDocumentRef.current;

      pdfDocumentRef.current = null;

      if (pdf) {
        void pdf
          .cleanup()
          .catch(() => {
            // Ignore cleanup failures.
          });
      }
    };
  }, [
    src,
    cancelPageRender,
    releaseCanvas,
  ]);

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

      const isDesktop =
        window.matchMedia(
          "(min-width: 640px)",
        ).matches;

      const horizontalPadding =
        isDesktop
          ? 48
          : 24;

      return Math.max(
        width -
          horizontalPadding,
        240,
      );
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Placeholder height                                                      */
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

        return Math.max(
          320,
          width *
            ratio *
            zoom,
        );
      },
      [
        getAvailableWidth,
        pageDimensions,
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
  /* Update active pages                                                      */
  /* ------------------------------------------------------------------------ */

  const updateActivePages =
    useCallback(() => {
      if (
        !documentReady ||
        pageCount <= 0
      ) {
        return;
      }

      const {
        first,
        last,
      } = getVisiblePageRange();

      const nextPages =
        new Set<number>();

      for (
        let pageNumber = first;
        pageNumber <= last;
        pageNumber += 1
      ) {
        nextPages.add(
          pageNumber,
        );
      }

      activePagesRef.current =
        nextPages;

      setActivePages(
        nextPages,
      );

      releaseInactivePages(
        nextPages,
      );
    }, [
      documentReady,
      pageCount,
      getVisiblePageRange,
      releaseInactivePages,
    ]);

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

        if (
          !activePagesRef.current.has(
            pageNumber,
          )
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
          | PDFPageProxy
          | null = null;

        try {
          page =
            await pdf.getPage(
              pageNumber,
            );

          if (
            generation !==
            generationRef.current ||
            !activePagesRef.current.has(
              pageNumber,
            )
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
           * Save the true page dimensions.
           */
          setPageDimensions(
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

          if (
            availableWidth <= 0
          ) {
            return;
          }

          const widthScale =
            availableWidth /
            baseViewport.width;

          /*
           * Never render below 0.5 scale.
           */
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

          const maxPixels =
            isMobile
              ? MAX_PIXELS_MOBILE
              : MAX_PIXELS_DESKTOP;

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
           * Protect against huge pages.
           */
          const pixelCount =
            pixelWidth *
            pixelHeight;

          if (
            pixelCount >
            maxPixels
          ) {
            const reduction =
              Math.sqrt(
                maxPixels /
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

          /*
           * Clear any previous backing store.
           */
          canvas.width = 1;
          canvas.height = 1;

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

          if (
            generation !==
            generationRef.current ||
            !activePagesRef.current.has(
              pageNumber,
            )
          ) {
            return;
          }

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

          renderTasksRef.current[
            pageNumber
          ] = renderTask;

          await renderTask.promise;

          if (
            generation !==
            generationRef.current ||
            !activePagesRef.current.has(
              pageNumber,
            )
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
          renderTasksRef.current[
            pageNumber
          ] = null;

          renderingPagesRef.current.delete(
            pageNumber,
          );

          /*
           * PDF.js page proxies can retain significant
           * resources. Release them immediately.
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
  /* Render active pages sequentially                                         */
  /* ------------------------------------------------------------------------ */

  const renderActivePages =
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

      const pages =
        Array.from(
          activePagesRef.current,
        ).sort(
          (a, b) => a - b,
        );

      /*
       * Render sequentially.
       *
       * Never ask PDF.js to render several large pages
       * simultaneously on mobile Safari.
       */
      for (const pageNumber of pages) {
        if (
          generation !==
          generationRef.current
        ) {
          return;
        }

        if (
          !activePagesRef.current.has(
            pageNumber,
          )
        ) {
          continue;
        }

        if (
          renderedPagesRef.current.has(
            pageNumber,
          )
        ) {
          continue;
        }

        if (
          renderingPagesRef.current.has(
            pageNumber,
          )
        ) {
          continue;
        }

        /*
         * React may not have mounted the canvas yet.
         */
        const canvas =
          canvasRefs.current[
            pageNumber
          ];

        if (!canvas) {
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
      renderPage,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Initial active pages                                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !documentReady ||
      pageCount <= 0 ||
      containerWidth <= 0
    ) {
      return;
    }

    /*
     * First determine which pages should exist.
     */
    updateActivePages();

    const frame =
      requestAnimationFrame(() => {
        /*
         * React has now mounted the active canvases.
         */
        void renderActivePages();
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
    updateActivePages,
    renderActivePages,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Scroll                                                                    */
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
        ticking = false;

        updateCurrentPage();

        /*
         * Change which pages are mounted.
         */
        updateActivePages();

        /*
         * Render the newly mounted pages on the
         * following frame.
         */
        requestAnimationFrame(() => {
          void renderActivePages();
        });
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
    updateActivePages();

    requestAnimationFrame(() => {
      void renderActivePages();
    });

    return () => {
      element.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [
    documentReady,
    pageCount,
    updateActivePages,
    renderActivePages,
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

    /*
     * Invalidate all current renders.
     */
    generationRef.current += 1;

    /*
     * Cancel current render tasks.
     */
    const renderingPages =
      Array.from(
        renderingPagesRef.current,
      );

    renderingPages.forEach(
      cancelPageRender,
    );

    /*
     * Release currently rendered canvases.
     *
     * The wrappers remain, but only active pages will
     * receive a new canvas.
     */
    const renderedPages =
      Array.from(
        renderedPagesRef.current,
      );

    renderedPages.forEach(
      releaseCanvas,
    );

    renderedPagesRef.current.clear();

    const frame =
      requestAnimationFrame(() => {
        void renderActivePages();
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
    cancelPageRender,
    releaseCanvas,
    renderActivePages,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Zoom controls                                                            */
  /* ------------------------------------------------------------------------ */

  function zoomIn() {
    setZoom((value) =>
      Math.min(
        Number(
          (
            value + 0.1
          ).toFixed(2),
        ),
        2.5,
      ),
    );
  }

  function zoomOut() {
    setZoom((value) =>
      Math.max(
        Number(
          (
            value - 0.1
          ).toFixed(2),
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
    if (
      !src ||
      downloading
    ) {
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
        getDownloadFilename(
          title,
        );

      link.href =
        objectUrl;

      link.style.display =
        "none";

      document.body.appendChild(
        link,
      );

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

                    const isActive =
                      activePages.has(
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
                        {isActive && (
                          <canvas
                            ref={(element) => {
                              canvasRefs.current[
                                pageNumber
                              ] = element;
                            }}
                            className="block max-w-full rounded-sm bg-white shadow-sm"
                            aria-label={`PDF page ${pageNumber}`}
                          />
                        )}
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
