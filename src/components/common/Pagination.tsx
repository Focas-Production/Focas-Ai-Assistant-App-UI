import React from 'react';

interface PaginationProps {
  totalItems: number;
  rowsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  rowsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-4 px-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        Prev
      </button>
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-3 py-1 rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        Next
      </button>
      <span className="ml-4 text-gray-500 text-sm">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination; 