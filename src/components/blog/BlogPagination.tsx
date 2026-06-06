import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 mt-12 select-none" role="navigation" aria-label="Pagination">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-gray-150 dark:border-gray-750 text-[#1B2A4A] dark:text-gray-300 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
        aria-label="Previous Page"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isActive
                ? 'bg-[#E31E24] text-white border-transparent shadow-sm'
                : 'bg-white dark:bg-gray-800 border-gray-150 dark:border-gray-750 text-[#1B2A4A] dark:text-gray-300 hover:border-[#E31E24]'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-gray-150 dark:border-gray-750 text-[#1B2A4A] dark:text-gray-300 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
        aria-label="Next Page"
      >
        Next
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
