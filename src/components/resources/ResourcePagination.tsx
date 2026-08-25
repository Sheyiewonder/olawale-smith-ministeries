"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface ResourcePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ResourcePagination({
  page,
  totalPages,
  onPageChange,
}: ResourcePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-16 flex items-center justify-between border-t border-charcoal/10 pt-6">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55 transition-colors hover:text-bronze disabled:pointer-events-none disabled:opacity-25"
      >
        <ArrowLeft size={15} strokeWidth={1.5} />
        Previous
      </button>

      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55 transition-colors hover:text-bronze disabled:pointer-events-none disabled:opacity-25"
      >
        Next
        <ArrowRight size={15} strokeWidth={1.5} />
      </button>
    </div>
  );
}