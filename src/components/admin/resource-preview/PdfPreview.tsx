"use client";

import { Download } from "lucide-react";

interface PdfPreviewProps {
  src: string;
}

export default function PdfPreview({
  src,
}: PdfPreviewProps) {
  return (
    <div className="aspect-square overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
      <div className="relative h-full w-full">
        <iframe
          src={src}
          title="PDF preview"
          className="h-full w-full"
        />

        <a
          href={src}
          download
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory transition hover:bg-bronze"
        >
          <Download size={14} />
          Download PDF
        </a>
      </div>
    </div>
  );
}