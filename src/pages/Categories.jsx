import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaLayerGroup } from "react-icons/fa";
import ErrorMessage from "../components/ErrorMessage.jsx";
import FadeImage from "../components/FadeImage.jsx";
import SkeletonGrid from "../components/Skeleton.jsx";
import { getCategories, getSubcategories } from "../services/catalog.js";
import { getSubcategoryIcon } from "../utils/icons.js";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    Promise.all([getCategories(), getSubcategories()])
      .then(([categoryData, subcategoryData]) => {
        setCategories(categoryData.data);
        setSubcategories(subcategoryData.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Bring the subcategories into view when a category is selected
  useEffect(() => {
    if (selected) panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selected]);

  // The subcategories endpoint of a single category ignores the category, so it is filtered here
  const selectedSubcategories = subcategories.filter((item) => item.category === selected?._id);

  return (
    <>
      <section className="bg-gradient-to-r from-green-500 to-green-400 text-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-xs">
            <Link to="/">Home</Link> / <span className="font-medium">Categories</span>
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl">
              <FaLayerGroup />
            </span>
            <div>
              <h1 className="text-3xl font-bold">All Categories</h1>
              <p className="text-sm">Browse our wide range of product categories</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <SkeletonGrid count={10} variant="tile" className="grid grid-cols-2 gap-5 md:grid-cols-5" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <div className="animate-fade-in grid grid-cols-2 gap-5 md:grid-cols-5">
              {categories.map((category) => {
                const active = selected?._id === category._id;
                return (
                  <button
                    key={category._id}
                    onClick={() => setSelected(active ? null : category)}
                    className={`group rounded-xl border bg-white p-4 text-center shadow-sm transition-shadow duration-300 hover:border-green-400 hover:shadow-lg ${
                      active ? "border-green-400" : "border-gray-200"
                    }`}
                  >
                    <div className="overflow-hidden rounded-xl">
                      <FadeImage
                        src={category.image}
                        alt={category.name}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                    <p className={`mt-4 font-semibold group-hover:text-green-600 ${active ? "text-green-600" : "text-gray-900"}`}>
                      {category.name}
                    </p>
                    <p className={`mt-1 flex items-center justify-center gap-1 text-xs text-green-600 group-hover:opacity-100 ${active ? "opacity-100" : "opacity-0"}`}>
                      View Subcategories <FaArrowRight />
                    </p>
                  </button>
                );
              })}
            </div>

            {selected && (
              <div ref={panelRef} className="mt-8 scroll-mt-24 rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selected.name} <span className="text-green-600">Subcategories</span>
                  </h2>
                  <Link to={`/products?category=${selected._id}`} className="text-sm font-medium text-green-600 hover:underline">
                    View all {selected.name} products
                  </Link>
                </div>
                {selectedSubcategories.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">No subcategories for this category.</p>
                ) : (
                  <div className="animate-fade-in mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {selectedSubcategories.map((item) => {
                      const Icon = getSubcategoryIcon(item.name);
                      return (
                        <Link
                          key={item._id}
                          to={`/products?category=${selected._id}&subcategory=${item._id}`}
                          className="group flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-500 hover:shadow-md"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                            <Icon />
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
