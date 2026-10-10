import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaBox, FaFilter, FaList, FaSearch, FaThLarge } from "react-icons/fa";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SkeletonGrid from "../components/Skeleton.jsx";
import Pagination from "../components/Pagination.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getBrands, getCategories } from "../services/catalog.js";
import { getAllProducts } from "../services/products.js";

const PAGE_SIZE = 12;

const sortOptions = [
  { value: "", label: "Relevance" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-ratingsAverage", label: "Top Rated" },
];

const priceChips = [
  { label: "Under 500", max: 500 },
  { label: "Under 1K", max: 1000 },
  { label: "Under 5K", max: 5000 },
  { label: "Under 10K", max: 10000 },
];

const toggleValue = (list, value) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState("grid");
  const resultsRef = useRef(null);

  const keyword = params.get("keyword") || "";
  const page = Number(params.get("page")) || 1;
  const sort = params.get("sort") || "";
  const selectedCategories = params.getAll("category");
  const selectedBrands = params.getAll("brand");
  const min = params.get("min") || "";
  const max = params.get("max") || "";
  const subcategory = params.get("subcategory") || "";

  // Plain /products shows every product, any filter switches to the search layout
  const isSearch = params.size > 0;
  const query = params.toString();

  useEffect(() => {
    Promise.all([getCategories(), getBrands()])
      .then(([categoryData, brandData]) => {
        setCategories(categoryData.data);
        setBrands(brandData.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // The API keyword filter returns nothing, so the keyword is applied here
    const load = isSearch
      ? getAllProducts({
          sort,
          "category[in]": selectedCategories,
          "brand[in]": selectedBrands,
          "price[gte]": min,
          "price[lte]": max,
        })
      : getAllProducts();

    setLoading(true);
    setError("");
    load
      .then((response) => {
        let items = response.data;

        if (keyword) {
          const text = keyword.toLowerCase();
          items = items.filter((product) =>
            [product.title, product.brand?.name, product.category?.name].some((value) =>
              value?.toLowerCase().includes(text)
            )
          );
        }

        if (subcategory) {
          items = items.filter((product) =>
            product.subcategory?.some((item) => item._id === subcategory)
          );
        }

        setTotal(items.length);
        if (isSearch) {
          setPages(Math.max(1, Math.ceil(items.length / PAGE_SIZE)));
          setProducts(items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
        } else {
          setProducts(items);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  // Changes a filter and goes back to the first page
  function update(changes) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      next.delete(key);
      if (Array.isArray(value)) value.forEach((item) => next.append(key, item));
      else if (value) next.set(key, value);
    });
    if (!("page" in changes)) next.delete("page");
    setParams(next);
    // Bring the results into view after every filter, sort or page change
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSearch(e) {
    e.preventDefault();
    update({ keyword: new FormData(e.target).get("keyword").trim() });
  }

  const grid = loading ? (
    <SkeletonGrid
      count={isSearch ? 8 : 10}
      className={
        isSearch
          ? "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
          : "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
      }
    />
  ) : error ? (
    <ErrorMessage message={error} />
  ) : products.length === 0 ? (
    <p className="py-16 text-center text-gray-500">No products found.</p>
  ) : null;

  if (!isSearch) {
    return (
      <>
        <section className="bg-gradient-to-r from-green-500 to-green-400 text-white">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <p className="text-xs">
              <Link to="/">Home</Link> / <span className="font-medium">All Products</span>
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl">
                <FaBox />
              </span>
              <div>
                <h1 className="text-3xl font-bold">All Products</h1>
                <p className="text-sm">Explore our complete product collection</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-6 py-6">
          {!loading && !error && <p className="mb-4 text-xs text-gray-600">Showing {total} products</p>}
          {grid || (
            <div className="animate-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </>
    );
  }

  const filters = (
    <aside className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 text-sm">
      <div>
        <h2 className="mb-3 font-semibold text-gray-800">Categories</h2>
        <div className="max-h-44 space-y-2 overflow-y-auto">
          {categories.map((category) => (
            <label key={category._id} className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category._id)}
                onChange={() => update({ category: toggleValue(selectedCategories, category._id) })}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h2 className="mb-3 font-semibold text-gray-800">Price Range</h2>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
          <label>
            Min (EGP)
            <input
              key={`min${min}`}
              type="number"
              min="0"
              defaultValue={min}
              placeholder="0"
              onBlur={(e) => update({ min: e.target.value })}
              className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
            />
          </label>
          <label>
            Max (EGP)
            <input
              key={`max${max}`}
              type="number"
              min="0"
              defaultValue={max}
              placeholder="No limit"
              onBlur={(e) => update({ max: e.target.value })}
              className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {priceChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => update({ min: "", max: String(chip.max) })}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-green-100"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h2 className="mb-3 font-semibold text-gray-800">Brands</h2>
        <div className="max-h-44 space-y-2 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand._id} className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand._id)}
                onChange={() => update({ brand: toggleValue(selectedBrands, brand._id) })}
              />
              {brand.name}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <p className="text-xs text-gray-500">
        <Link to="/">Home</Link> / <span className="font-medium text-gray-800">Search Results</span>
      </p>

      <form onSubmit={handleSearch} className="relative mt-3 max-w-xl">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
        <input
          key={keyword}
          name="keyword"
          defaultValue={keyword}
          placeholder="Search for products..."
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-green-600"
        />
      </form>

      {subcategory && (
        <button
          onClick={() => update({ subcategory: "" })}
          className="mt-3 rounded-full bg-green-50 px-3 py-1 text-xs text-green-700"
        >
          Subcategory filter ✕
        </button>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className={showFilters ? "block" : "hidden lg:block"}>{filters}</div>

        <div ref={resultsRef} className="scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm lg:hidden"
            >
              <FaFilter className="text-xs" /> Filters
            </button>
            <div className="flex overflow-hidden rounded-lg border border-gray-200">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`px-3 py-2 text-sm ${view === "grid" ? "bg-green-600 text-white" : "text-gray-500"}`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`px-3 py-2 text-sm ${view === "list" ? "bg-green-600 text-white" : "text-gray-500"}`}
              >
                <FaList />
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-500 sm:ml-auto">
              Sort by:
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-800"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {grid || (
            <>
              <div className={view === "grid" ? "animate-fade-in grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} list={view === "list"} />
                ))}
              </div>
              <Pagination page={page} pages={pages} onChange={(number) => update({ page: String(number) })} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
