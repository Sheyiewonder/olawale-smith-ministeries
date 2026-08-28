"use client";

interface PdfPreviewProps {
  src: string;
}

export default function PdfPreview({
  src,
}: PdfPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
      <div className="h-[600px] w-full">
        <iframe
          src={src}
          title="PDF preview"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}