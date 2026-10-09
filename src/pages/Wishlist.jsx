import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegTrashAlt, FaShoppingCart } from "react-icons/fa";
import Loader from "../components/Loader.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const money = (value) => Number(value).toLocaleString("en-US");

export default function Wishlist() {
  const { items, loading, removeItem, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [leaving, setLeaving] = useState(null);

  // Fades the row out before it is removed
  async function removeWithFade(id) {
    setLeaving(id);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await removeItem(id);
    setLeaving(null);
  }

  return (
    <div>
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-xs text-gray-500">
            <Link to="/">Home</Link> / <span className="font-medium text-gray-800">Wishlist</span>
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-red-500">
              <FaHeart />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-xs text-gray-500">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {loading ? (
            <Loader />
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-700">Your wishlist is empty.</p>
              <Link to="/products" className="mt-4 inline-block rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="hidden grid-cols-[2.5fr_1fr_1fr_1.4fr] bg-slate-50 px-6 py-3 text-xs text-gray-500 md:grid">
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Status</span>
                <span className="text-center">Actions</span>
              </div>

              {items.map((product) => {
                const inStock = product.quantity > 0;
                const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;
                return (
                  <div
                    key={product._id}
                    className={`flex flex-col gap-3 border-t border-gray-100 p-4 transition-all duration-300 md:grid md:grid-cols-[2.5fr_1fr_1fr_1.4fr] md:items-center md:px-6 ${leaving === product._id ? "scale-95 opacity-0" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <Link to={`/products/${product._id}`} className="shrink-0 rounded-lg border border-gray-100 p-1.5">
                        <img src={product.imageCover} alt={product.title} className="h-14 w-14 object-contain" />
                      </Link>
                      <div className="min-w-0">
                        <Link to={`/products/${product._id}`} className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-green-600">
                          {product.title}
                        </Link>
                        <p className="text-xs text-gray-400">{product.category?.name}</p>
                      </div>
                    </div>

                    <p className="text-sm md:text-center">
                      <span className="mr-2 text-gray-500 md:hidden">Price:</span>
                      <span className="font-semibold text-gray-900">
                        {money(hasDiscount ? product.priceAfterDiscount : product.price)} EGP
                      </span>
                      {hasDiscount && (
                        <span className="block text-xs text-gray-400 line-through">{money(product.price)} EGP</span>
                      )}
                    </p>

                    <p className="text-sm md:text-center">
                      <span className="mr-2 text-gray-500 md:hidden">Status:</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${inStock ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </p>

                    <div className="flex items-center gap-2 md:justify-center">
                      <button
                        onClick={() => addToCart(product._id)}
                        disabled={!inStock}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 md:flex-none"
                      >
                        <FaShoppingCart /> Add to Cart
                      </button>
                      <button
                        onClick={() => removeWithFade(product._id)}
                        aria-label="Remove from wishlist"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-red-500"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link to="/products" className="text-gray-500 hover:text-green-600">
              ← Continue Shopping
            </Link>
            {items.length > 0 && (
              <button onClick={clearWishlist} className="flex items-center gap-2 text-gray-500 hover:text-red-500">
                <FaRegTrashAlt /> Clear wishlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
