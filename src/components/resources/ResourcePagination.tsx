"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface ResourcePaginationProps {
page: number;
totalPages: number;
onPageChange: (page: number) => void;
}

type PageItem = number | "ellipsis";

export default function ResourcePagination({
page,
totalPages,
onPageChange,
}: ResourcePaginationProps) {
const getPageNumbers = (): PageItem[] => {
if (totalPages <= 7) {
return Array.from(
{ length: totalPages },
(_, index) => index + 1,
);
}


if (page <= 4) {
  return [1, 2, 3, 4, 5, "ellipsis", totalPages];
}

if (page >= totalPages - 3) {
  return [
    1,
    "ellipsis",
    totalPages - 4,
    totalPages - 3,
    totalPages - 2,
    totalPages - 1,
    totalPages,
  ];
}

return [
  1,
  "ellipsis",
  page - 1,
  page,
  page + 1,
  "ellipsis",
  totalPages,
];


};

const pageNumbers = getPageNumbers();

return (
<nav
aria-label="Resource pagination"
className={[
"relative mt-14 border-t border-charcoal/10 pt-6",
"sm:mt-16 sm:pt-7",
].join(" ")}
>
{/* Subtle blue editorial line */} <span
     aria-hidden="true"
     className="absolute left-0 top-0 h-px w-16 bg-blue/[0.35]"
   />


  <div className="flex items-center justify-between gap-4">
    {/* ---------------------------------------------------------------- */}
    {/* Previous                                                         */}
    {/* ---------------------------------------------------------------- */}

    <button
      type="button"
      disabled={page === 1}
      onClick={() => onPageChange(page - 1)}
      className={[
        "group flex shrink-0 items-center gap-2",
        "text-[9px] font-semibold uppercase tracking-[0.16em]",
        "text-charcoal/55 transition-colors duration-300",
        "hover:text-blue-deep",
        "disabled:pointer-events-none disabled:opacity-25",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 items-center justify-center",
          "rounded-full border border-charcoal/10",
          "transition-all duration-300",
          "group-hover:border-blue/[0.35]",
          "group-hover:bg-blue-soft/[0.07]",
          "group-focus-visible:border-blue/[0.45]",
        ].join(" ")}
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        />
      </span>

      <span className="hidden sm:inline">
        Previous
      </span>
    </button>

    {/* ---------------------------------------------------------------- */}
    {/* Page Numbers                                                     */}
    {/* ---------------------------------------------------------------- */}

    <div className="hidden items-center gap-1 sm:flex">
      {pageNumbers.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className={[
                "flex h-8 w-8 items-center justify-center",
                "text-[9px] text-blue-deep/30",
              ].join(" ")}
            >
              …
            </span>
          );
        }

        const isActive = item === page;

        return (
          <button
            key={item}
            type="button"
            aria-current={
              isActive ? "page" : undefined
            }
            onClick={() => onPageChange(item)}
            className={[
              "flex h-8 min-w-8 items-center justify-center",
              "rounded-full px-2",
              "text-[9px] font-semibold tracking-[0.08em]",
              "transition-all duration-300",
              isActive
                ? [
                    "bg-charcoal text-ivory",
                    "shadow-sm",
                  ].join(" ")
                : [
                    "text-charcoal/45",
                    "hover:bg-blue-soft/[0.08]",
                    "hover:text-blue-deep",
                  ].join(" "),
            ].join(" ")}
          >
            {String(item).padStart(2, "0")}
          </button>
        );
      })}
    </div>

    {/* ---------------------------------------------------------------- */}
    {/* Mobile Page Indicator                                            */}
    {/* ---------------------------------------------------------------- */}

    <span
      className={[
        "text-[9px] font-semibold uppercase",
        "tracking-[0.16em]",
        "text-charcoal/40 sm:hidden",
      ].join(" ")}
    >
      <span className="text-blue-deep/55">
        {String(page).padStart(2, "0")}
      </span>

      <span className="mx-1.5 text-charcoal/20">
        /
      </span>

      {String(totalPages).padStart(2, "0")}
    </span>

    {/* ---------------------------------------------------------------- */}
    {/* Next                                                              */}
    {/* ---------------------------------------------------------------- */}

    <button
      type="button"
      disabled={page === totalPages}
      onClick={() => onPageChange(page + 1)}
      className={[
        "group flex shrink-0 items-center gap-2",
        "text-[9px] font-semibold uppercase tracking-[0.16em]",
        "text-charcoal/55 transition-colors duration-300",
        "hover:text-blue-deep",
        "disabled:pointer-events-none disabled:opacity-25",
      ].join(" ")}
    >
      <span className="hidden sm:inline">
        Next
      </span>

      <span
        className={[
          "flex h-8 w-8 items-center justify-center",
          "rounded-full border border-charcoal/10",
          "transition-all duration-300",
          "group-hover:border-blue/[0.35]",
          "group-hover:bg-blue-soft/[0.07]",
          "group-focus-visible:border-blue/[0.45]",
        ].join(" ")}
      >
        <ArrowRight
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </button>
  </div>
</nav>


);
}
