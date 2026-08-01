'use client';

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export const Pagination = ({
  currentPage,
  totalItems,
  onPrevious,
  onNext,
  disabled = false,
}: PaginationProps) => {
  return (
    <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
      <span className="text-sm text-gray-400">
        Showing {totalItems} donors
      </span>
      <div className="flex gap-2">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1 || disabled}
          className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
        >
          <FaArrowLeft className="text-sm" />
        </button>
        <span className="px-3 py-1 text-white text-sm">{currentPage}</span>
        <button
          onClick={onNext}
          disabled={disabled}
          className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
        >
          <FaArrowRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};