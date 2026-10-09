import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-800">
      <svg
        viewBox="0 0 32 28"
        className="h-7 w-8"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 2h4l3 15h15l3-11H7" />
        <path d="M9 10h15M10 13.5h13" />
        <circle cx="11" cy="23" r="2" />
        <circle cx="21" cy="23" r="2" />
      </svg>
      FreshCart
    </Link>
  );
}
