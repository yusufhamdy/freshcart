import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTags } from "react-icons/fa";
import ErrorMessage from "../components/ErrorMessage.jsx";
import FadeImage from "../components/FadeImage.jsx";
import SkeletonGrid from "../components/Skeleton.jsx";
import { getBrands } from "../services/catalog.js";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBrands()
      .then((response) => setBrands(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-gradient-to-br from-purple-600 to-purple-400 text-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-xs">
            <Link to="/">Home</Link> / <span className="font-medium">Brands</span>
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl">
              <FaTags />
            </span>
            <div>
              <h1 className="text-3xl font-bold">Top Brands</h1>
              <p className="text-sm">Shop from your favorite brands</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <SkeletonGrid count={18} variant="tile" className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-6" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="animate-fade-in grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-6">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/products?brand=${brand._id}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-shadow duration-300 hover:border-purple-400 hover:shadow-lg"
              >
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-3">
                  <FadeImage src={brand.image} alt={brand.name} loading="lazy" className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">{brand.name}</p>
                <p className="mt-1 text-xs text-purple-600 opacity-0 group-hover:opacity-100">View Products</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
