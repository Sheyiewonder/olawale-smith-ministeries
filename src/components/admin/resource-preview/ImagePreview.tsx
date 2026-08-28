"use client";

import Image from "next/image";

interface ImagePreviewProps {
  src: string;
  alt?: string;
}

export default function ImagePreview({
  src,
  alt = "Resource image",
}: ImagePreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
      <div className="relative flex min-h-[320px] items-center justify-center p-6">
        <Image
          src={src}
          alt={alt}
          width={1400}
          height={900}
          className="max-h-[600px] w-auto max-w-full rounded-lg object-contain"
          unoptimized
        />
      </div>
    </div>
  );
}