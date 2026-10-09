// Grey placeholders with the shape of the cards that are about to appear
export default function SkeletonGrid({ count = 10, variant = "product", className = "" }) {
  return (
    <div className={className} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse rounded-xl border border-gray-100 bg-white p-3">
          <div className={`rounded-lg bg-gray-100 ${variant === "tile" ? "aspect-square" : "h-40"}`} />
          <div className="mx-auto mt-3 h-3 w-2/3 rounded bg-gray-100" />
          {variant === "product" && (
            <>
              <div className="mt-2 h-4 w-4/5 rounded bg-gray-100" />
              <div className="mt-3 h-4 w-1/2 rounded bg-gray-100" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
