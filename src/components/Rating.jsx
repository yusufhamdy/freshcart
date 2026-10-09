import { FaRegStar, FaStar } from "react-icons/fa";

export function Stars({ value = 0 }) {
  const filled = Math.round(value);

  return (
    <span className="flex text-yellow-400">
      {[1, 2, 3, 4, 5].map((n) => (n <= filled ? <FaStar key={n} /> : <FaRegStar key={n} />))}
    </span>
  );
}

export default function Rating({ average = 0, count = 0 }) {
  return (
    <div className="mt-1 flex items-center gap-1 text-xs">
      <Stars value={average} />
      <span className="text-gray-500">
        {Number(average).toFixed(1).replace(".0", "")} ({count})
      </span>
    </div>
  );
}
