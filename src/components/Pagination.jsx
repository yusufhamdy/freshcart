import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const buttonClass = "flex h-8 w-8 items-center justify-center rounded text-sm";

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${buttonClass} text-gray-500 disabled:opacity-40`}
      >
        <FaChevronLeft />
      </button>
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          onClick={() => onChange(number)}
          className={`${buttonClass} ${
            number === page ? "bg-green-600 text-white" : "border border-gray-200 hover:border-green-600"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        aria-label="Next page"
        className={`${buttonClass} text-gray-500 disabled:opacity-40`}
      >
        <FaChevronRight />
      </button>
    </nav>
  );
}
