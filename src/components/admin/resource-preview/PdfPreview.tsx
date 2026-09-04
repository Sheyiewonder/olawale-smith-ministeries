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

function getDownloadFilename(title?: string) {
  const sanitizedTitle = (title ?? "")
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.+$/, "")
    .slice(0, 180);

  return `${sanitizedTitle || "document"}.pdf`;
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

  const [thumbnailFailed, setThumbnailFailed] =
    useState(false);

  const [previewFailed, setPreviewFailed] =
    useState(false);

  const [downloadError, setDownloadError] =
    useState(false);

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
       * Fetch the PDF as a Blob instead of navigating
       * directly to Cloudinary.
       *
       * This allows us to control the downloaded filename.
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

      link.href = objectUrl;

      /*
       * IMPORTANT:
       *
       * Always use the resource/media title for
       * the downloaded filename.
       *
       * Example:
       * "Walking in Purpose" -> "Walking in Purpose.pdf"
       */
      link.download =
        getDownloadFilename(title);

      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      link.remove();

      /*
       * Give the browser a little time to begin
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
   * A thumbnail is considered usable only when:
   *
   * 1. thumbnailUrl exists
   * 2. the image has not previously failed to load
   *
   * If the Cloudinary-generated thumbnail cannot load,
   * we fall back to the browser's native PDF renderer.
   */
  const hasThumbnail =
    Boolean(thumbnailUrl) &&
    !thumbnailFailed;

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
      <div className="relative min-h-[420px] w-full">
        {/* ------------------------------------------------------------------ */}
        {/* PDF Thumbnail                                                      */}
        {/* ------------------------------------------------------------------ */}

        {hasThumbnail ? (
          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-muted/20 p-4 sm:p-6">
            <img
              src={thumbnailUrl!}
              alt={
                title
                  ? `${title} cover`
                  : "PDF cover"
              }
              className="max-h-[620px] w-auto max-w-full rounded-lg object-contain shadow-md"
              onError={() => {
                setThumbnailFailed(true);
              }}
            />

            {/* -------------------------------------------------------------- */}
            {/* PDF Badge                                                       */}
            {/* -------------------------------------------------------------- */}

            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-charcoal px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-lg sm:left-7 sm:top-7">
              <FileText size={13} />
              PDF
            </div>

            {/* -------------------------------------------------------------- */}
            {/* Actions                                                         */}
            {/* -------------------------------------------------------------- */}

            <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2 sm:right-7 sm:top-7">
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

          <div className="relative aspect-square w-full">
            {!previewFailed ? (
              <iframe
                src={src}
                title={
                  title
                    ? `${title} PDF preview`
                    : "PDF preview"
                }
                className="h-full w-full border-0"
                onError={() => {
                  setPreviewFailed(true);
                }}
              />
            ) : (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
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

            {/* -------------------------------------------------------------- */}
            {/* Fallback Preview Actions                                       */}
            {/* -------------------------------------------------------------- */}

            {!previewFailed && (
              <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2">
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
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Download Error                                                     */}
        {/* ------------------------------------------------------------------ */}

        {downloadError && (
          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-xl border border-destructive/20 bg-background/95 p-3 text-center shadow-sm backdrop-blur">
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