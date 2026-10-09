import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaHeart, FaPlus, FaRegHeart, FaSyncAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import FadeImage from "./FadeImage.jsx";
import Rating from "./Rating.jsx";

const iconButtonClass =
  "flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-xs text-gray-600 hover:text-green-600";

export default function ProductCard({ product, list = false }) {
  const { _id, title, imageCover, category, price, priceAfterDiscount, ratingsAverage, ratingsQuantity } = product;
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const hasDiscount = priceAfterDiscount && priceAfterDiscount < price;
  const discount = hasDiscount ? Math.round((1 - priceAfterDiscount / price) * 100) : 0;
  const detailsPath = `/products/${_id}`;
  const inWishlist = isInWishlist(_id);

  // Guests are sent to the login page, signed in users run the action
  async function handleAction(action) {
    if (!user) return navigate("/login");
    setBusy(true);
    await action();
    setBusy(false);
  }

  return (
    <div
      className={`group relative flex rounded-lg border border-gray-200 bg-white p-3 transition-shadow duration-300 hover:shadow-lg ${
        list ? "flex-row items-center gap-4" : "flex-col"
      }`}
    >
      {hasDiscount && (
        <span className="absolute left-0 top-3 z-10 rounded-r bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
          -{discount}%
        </span>
      )}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <button
          onClick={() => handleAction(() => toggleWishlist(_id))}
          disabled={busy}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`${iconButtonClass} ${inWishlist ? "text-red-500" : ""}`}
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
        <button
          onClick={() => showToast("Compare is not available yet", "error")}
          aria-label="Compare"
          className={iconButtonClass}
        >
          <FaSyncAlt />
        </button>
        <Link to={detailsPath} aria-label="View product" className={iconButtonClass}>
          <FaEye />
        </Link>
      </div>

      <Link to={detailsPath} className={`block overflow-hidden ${list ? "w-40 shrink-0" : ""}`}>
        <FadeImage
          src={imageCover}
          alt={title}
          loading="lazy"
          className="h-44 w-full object-contain transition-all duration-500 group-hover:scale-110"
        />
      </Link>

      <div className={list ? "flex min-w-0 flex-1 flex-col pr-10" : "contents"}>
        <p className="mt-3 text-xs text-gray-500">{category?.name}</p>
        <Link to={detailsPath} className="mt-1 line-clamp-2 min-h-10 text-sm font-medium text-gray-800 hover:text-green-600">
          {title}
        </Link>
        <Rating average={ratingsAverage} count={ratingsQuantity} />

        <div className="mt-auto flex items-center justify-between pt-3">
          {hasDiscount ? (
            <p>
              <span className="font-bold text-green-600">{priceAfterDiscount} EGP</span>{" "}
              <span className="text-xs text-gray-400 line-through">{price} EGP</span>
            </p>
          ) : (
            <p className="font-bold text-gray-800">{price} EGP</p>
          )}
          <button
            onClick={() => handleAction(() => addToCart(_id))}
            disabled={busy}
            aria-label="Add to cart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
}
