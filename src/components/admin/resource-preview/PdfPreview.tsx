"use client";

import {
  Download,
  ExternalLink,
  Loader2,
  FileText,
} from "lucide-react";
import { useState } from "react";

interface PdfPreviewProps {
  src: string;
  title?: string;
  thumbnailUrl?: string | null;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Sanitize the resource title so it can safely be
 * used as a downloaded filename.
 */
function sanitizeFilenameTitle(title: string): string {
  return title
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.+$/, "")
    .slice(0, 180);
}

/**
 * Get the download filename.
 *
 * IMPORTANT:
 *
 * The resource title is the ONLY source used for the
 * downloaded filename.
 *
 * We deliberately do NOT:
 * - inspect the Cloudinary URL
 * - inspect the uploaded file name
 * - use the PDF document title
 * - use getActualFileTitle()
 */
function getDownloadFilename(title?: string): string {
  const sanitizedTitle = sanitizeFilenameTitle(
    title?.trim() || "",
  );

  if (sanitizedTitle) {
    return `${sanitizedTitle}.pdf`;
  }

  /*
   * Last-resort filename when no resource title
   * was supplied.
   */
  return "document.pdf";
}

/**
 * Resolve the display title used throughout
 * the PDF preview.
 *
 * This is ONLY for the UI.
 *
 * It does NOT control the downloaded filename.
 */
function getActualFileTitle(title?: string): string {
  const explicitTitle = title?.trim();

  if (explicitTitle) {
    return explicitTitle;
  }

  return "PDF document";
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function PdfPreview({
  src,
  title,
  thumbnailUrl,
}: PdfPreviewProps) {
  const [downloading, setDownloading] =
    useState(false);

  /*
   * The thumbnail URL is intentionally retained in
   * the component API for compatibility with existing
   * resource data and callers.
   *
   * IMPORTANT:
   *
   * The thumbnail is NOT used as the primary PDF
   * preview anymore.
   *
   * The complete PDF is rendered directly through
   * the browser's native PDF viewer immediately.
   */
  const [thumbnailFailed, setThumbnailFailed] =
    useState(false);

  const [previewFailed, setPreviewFailed] =
    useState(false);

  const [downloadError, setDownloadError] =
    useState(false);

  /**
   * Display title for the preview UI.
   *
   * NOTE:
   * This is separate from the download filename.
   */
  const actualFileTitle =
    getActualFileTitle(title);

  /*
   * Keep the thumbnail information available without
   * allowing it to replace the actual PDF document.
   *
   * This prevents older callers that still provide a
   * thumbnailUrl from changing the preview behavior.
   *
   * The thumbnail is metadata for the resource and is
   * intentionally not rendered over the PDF.
   */
  const hasThumbnail =
    Boolean(thumbnailUrl) &&
    !thumbnailFailed;

  /*
   * The values above are intentionally kept because
   * thumbnailUrl remains part of the PdfPreview contract.
   *
   * The actual PDF preview always takes priority.
   *
   * This means:
   *
   * - PDF thumbnail exists  -> show complete PDF
   * - PDF thumbnail missing -> show complete PDF
   * - PDF thumbnail fails   -> show complete PDF
   *
   * The thumbnail must never delay or replace the
   * browser PDF viewer.
   */
  void hasThumbnail;
  void setThumbnailFailed;

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

      /*
       * Fetch the actual PDF as a Blob.
       *
       * We intentionally do NOT navigate directly to
       * the Cloudinary URL because Cloudinary/browser
       * handling can use the original uploaded filename.
       */
      const response = await fetch(src, {
        method: "GET",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(
          `Unable to download PDF (${response.status}).`,
        );
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error(
          "Downloaded PDF is empty.",
        );
      }

      const objectUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      /*
       * IMPORTANT:
       *
       * Use the ORIGINAL resource title directly.
       *
       * Example:
       *
       * title = "Walking in Purpose"
       *
       * download = "Walking in Purpose.pdf"
       *
       * We do NOT use actualFileTitle here.
       */
      link.download =
        getDownloadFilename(title);

      link.href = objectUrl;
      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      link.remove();

      /*
       * Give the browser enough time to begin
       * the download before releasing the Blob URL.
       */
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

  /*
   * IMPORTANT:
   *
   * We deliberately do NOT use the PDF thumbnail
   * as the rendered preview.
   *
   * The browser PDF viewer is rendered immediately
   * regardless of whether thumbnailUrl exists.
   *
   * This allows the user to:
   *
   * - see the actual PDF
   * - scroll through all pages
   * - use the browser's native PDF controls
   * - read the document without waiting for a
   *   separate thumbnail request
   *
   * thumbnailUrl is therefore retained only for
   * compatibility with existing resource data.
   */

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
      <div className="relative min-h-[420px] w-full">
        {/* ------------------------------------------------------------------ */}
        {/* Complete PDF Browser Preview                                       */}
        {/* ------------------------------------------------------------------ */}

        {!previewFailed ? (
          <div className="relative aspect-square w-full overflow-hidden">
            <iframe
              src={src}
              title={`${actualFileTitle} PDF preview`}
              className="h-full w-full border-0"
              onError={() => {
                setPreviewFailed(true);
              }}
            />

            {/* -------------------------------------------------------------- */}
            {/* PDF Badge                                                       */}
            {/* -------------------------------------------------------------- */}

            <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-charcoal px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg sm:left-7 sm:top-7">
              <FileText size={13} />
              PDF
            </div>

            {/* -------------------------------------------------------------- */}
            {/* Actions                                                         */}
            {/* -------------------------------------------------------------- */}

            <div className="absolute right-4 top-4 z-20 flex flex-wrap justify-end gap-2 sm:right-7 sm:top-7">
              <button
                type="button"
                onClick={openPdf}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg transition hover:bg-bronze sm:px-4"
              >
                <ExternalLink size={14} />

                <span className="hidden sm:inline">
                  Open
                </span>
              </button>

              <button
                type="button"
                onClick={downloadPdf}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg transition hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
              >
                {downloading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Download size={14} />
                )}

                <span>
                  {downloading
                    ? "Downloading..."
                    : "Download PDF"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* --------------------------------------------------------------- */
          /* Browser PDF Preview Fallback                                    */
          /* --------------------------------------------------------------- */

          <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileText size={24} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                PDF preview unavailable
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                The PDF is available, but your
                browser could not display the
                preview.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={openPdf}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory transition hover:bg-bronze"
              >
                <ExternalLink size={14} />
                Open PDF
              </button>

              <button
                type="button"
                onClick={downloadPdf}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition hover:border-bronze hover:text-bronze disabled:cursor-not-allowed disabled:opacity-60"
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

        {/* ------------------------------------------------------------------ */}
        {/* PDF Preview Actions                                                */}
        {/* ------------------------------------------------------------------ */}

        {!previewFailed && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24">
            <div className="absolute left-4 top-4 pointer-events-auto sm:left-7 sm:top-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-charcoal px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg opacity-0">
                <FileText size={13} />
                PDF
              </div>
            </div>

            <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2 pointer-events-auto sm:right-7 sm:top-7">
              <button
                type="button"
                onClick={openPdf}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg transition hover:bg-bronze sm:px-4"
              >
                <ExternalLink size={14} />

                <span className="hidden sm:inline">
                  Open
                </span>
              </button>

              <button
                type="button"
                onClick={downloadPdf}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg transition hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
              >
                {downloading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Download size={14} />
                )}

                <span>
                  {downloading
                    ? "Downloading..."
                    : "Download PDF"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Download Error                                                     */}
        {/* ------------------------------------------------------------------ */}

        {downloadError && (
          <div className="absolute bottom-4 left-4 right-4 z-30 rounded-xl border border-destructive/20 bg-background/95 p-3 text-center shadow-sm backdrop-blur">
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
                downloadPdf();
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
