import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaBolt,
  FaBox,
  FaCheck,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaShieldAlt,
  FaShoppingCart,
  FaStar,
  FaTruck,
  FaUndo,
} from "react-icons/fa";
import Loader from "../components/Loader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import NotFound from "./NotFound.jsx";
import ProductReviews from "../components/ProductReviews.jsx";
import ShippingInfo from "../components/ShippingInfo.jsx";
import { Stars } from "../components/Rating.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { getAllProducts, getProduct } from "../services/products.js";

const tabs = [
  { id: "details", label: "Product Details", icon: FaBox },
  { id: "reviews", label: "Reviews", icon: FaStar },
  { id: "shipping", label: "Shipping & Returns", icon: FaTruck },
];

const perks = [
  { icon: FaTruck, title: "Free Delivery", text: "Orders over 500 EGP" },
  { icon: FaUndo, title: "14 Days Return", text: "Money back" },
  { icon: FaShieldAlt, title: "Secure Payment", text: "100% Protected" },
];

const features = [
  "Premium Quality Product",
  "100% Authentic Guarantee",
  "Fast & Secure Packaging",
  "Quality Tested",
];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("details");
  const sliderRef = useRef(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  // Guests are sent to the login page, signed in users run the action
  async function handleAction(action) {
    if (!user) return navigate("/login");
    setBusy(true);
    const result = await action();
    setBusy(false);
    return result;
  }

  async function loadProduct() {
    try {
      const response = await getProduct(id);
      setProduct(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setError("");
    setImageIndex(0);
    setQuantity(1);
    setTab("details");
    loadProduct();
  }, [id]);

  const categoryId = product?.category?._id;

  useEffect(() => {
    if (!categoryId) return;
    getAllProducts({ "category[in]": categoryId })
      .then((response) => setRelated(response.data.filter((item) => item._id !== id).slice(0, 10)))
      .catch(() => setRelated([]));
  }, [categoryId, id]);

  if (loading) return <Loader />;
  if (error || !product) return <NotFound message={error || "This product does not exist."} />;

  const images = [product.imageCover, ...(product.images || [])].filter(
    (image, index, list) => list.indexOf(image) === index
  );
  const price = product.priceAfterDiscount || product.price;
  const hasDiscount = price < product.price;
  const inStock = product.quantity > 0;
  const subcategory = product.subcategory?.[0]?.name;

  const rows = [
    ["Category", product.category?.name],
    ["Subcategory", subcategory],
    ["Brand", product.brand?.name],
    ["Items Sold", `${product.sold}+ sold`],
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${categoryId}`} className="hover:text-green-600">
          {product.category?.name}
        </Link>
        {subcategory && (
          <>
            <span>/</span>
            <span>{subcategory}</span>
          </>
        )}
        <span>/</span>
        <span className="font-medium text-gray-800">{product.title}</span>
      </nav>

      <div className="mt-5 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-3">
          <img src={images[imageIndex]} alt={product.title} className="h-96 w-full object-contain" />
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image}
                onClick={() => setImageIndex(index)}
                className={`h-16 w-16 shrink-0 rounded border-2 ${
                  index === imageIndex ? "border-gray-800" : "border-transparent"
                }`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">{product.category?.name}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">{product.brand?.name}</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{product.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Stars value={product.ratingsAverage} />
            {Number(product.ratingsAverage).toFixed(1).replace(".0", "")} ({product.ratingsQuantity} reviews)
          </div>

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {price} EGP{" "}
            {hasDiscount && <span className="text-base font-normal text-gray-400 line-through">{product.price} EGP</span>}
          </p>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>

          <p className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600">{product.description}</p>

          <p className="mt-4 text-sm text-gray-600">Quantity</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="px-3 py-2 text-gray-600 hover:text-green-600"
              >
                <FaMinus />
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                aria-label="Increase quantity"
                className="px-3 py-2 text-gray-600 hover:text-green-600"
              >
                <FaPlus />
              </button>
            </div>
            <span className="text-xs text-gray-500">{product.quantity} available</span>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">Total Price:</span>
            <span className="text-xl font-bold text-green-600">{(price * quantity).toFixed(2)} EGP</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => handleAction(() => addToCart(product._id, quantity))}
              disabled={busy || !inStock}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={async () => {
                const added = await handleAction(() => addToCart(product._id, quantity));
                if (added) navigate("/checkout");
              }}
              disabled={busy || !inStock}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
            >
              <FaBolt /> Buy Now
            </button>
          </div>
          <button
            onClick={() => handleAction(() => toggleWishlist(product._id))}
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm text-gray-700 hover:border-green-600 disabled:opacity-60"
          >
            {isInWishlist(product._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            {isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
            {perks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Icon />
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-gray-800">{title}</p>
                  <p className="text-gray-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex overflow-x-auto border-b border-gray-200 bg-slate-50">
          {tabs.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setTab(tabId)}
              className={`flex items-center gap-2 whitespace-nowrap px-6 py-3.5 text-sm transition-colors ${
                tab === tabId
                  ? "-mb-px border-b-2 border-green-600 bg-white font-medium text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <Icon className="text-xs" />
              {label}
              {tabId === "reviews" && ` (${product.ratingsQuantity})`}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "details" && (
            <>
              <h2 className="font-semibold text-gray-900">About this Product</h2>
              <p className="mt-2 text-sm text-gray-600">{product.description}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-800">Product Information</h3>
                  {rows.map(([label, value]) => (
                    <div key={label} className="flex justify-between py-1 text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-800">Key Features</h3>
                  {features.map((feature) => (
                    <p key={feature} className="flex items-center gap-2 py-1 text-sm text-gray-600">
                      <FaCheck className="text-green-600" /> {feature}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          {tab === "reviews" && <ProductReviews productId={id} onChange={loadProduct} />}
          {tab === "shipping" && <ShippingInfo />}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="border-l-4 border-green-600 pl-3 text-xl font-bold text-gray-800">
              You May Also <span className="text-green-600">Like</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })}
                aria-label="Previous products"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                onClick={() => sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })}
                aria-label="Next products"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
          <div ref={sliderRef} className="flex gap-4 overflow-x-auto pb-2">
            {related.map((item) => (
              <div key={item._id} className="w-56 shrink-0">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
