"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPages = (): number[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>();

    pages.add(1);
    pages.add(totalPages);

    if (page <= 3) {
      pages.add(2);
      pages.add(3);
    } else if (page >= totalPages - 2) {
      pages.add(totalPages - 2);
      pages.add(totalPages - 1);
    } else {
      pages.add(page - 1);
      pages.add(page);
      pages.add(page + 1);
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
      <p className="text-xs text-white/40">
        Page {page} sur {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Page précédente"
          className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.03] border border-white/10 text-white/50 hover:bg-white/[0.05] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, index) => {
          const previousPage = pages[index - 1];
          const hasGap =
            previousPage !== undefined && p - previousPage > 1;

          return (
            <div key={p} className="flex items-center">
              {hasGap && (
                <span
                  aria-hidden="true"
                  className="px-1 text-white/30 text-xs"
                >
                  ...
                </span>
              )}

              <button
                type="button"
                onClick={() => onPageChange(p)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                  p === page
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {p}
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Page suivante"
          className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.03] border border-white/10 text-white/50 hover:bg-white/[0.05] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
