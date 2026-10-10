import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaApple,
  FaArrowRight,
  FaCrown,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaEnvelopeOpen,
  FaEnvelopeOpenText,
  FaGooglePlay,
  FaLeaf,
  FaHeadset,
  FaShieldAlt,
  FaStar,
  FaTicketAlt,
  FaTruck,
  FaUndo,
} from "react-icons/fa";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SkeletonGrid from "../components/Skeleton.jsx";
import Reveal from "../components/Reveal.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getCategories } from "../services/catalog.js";
import { getProducts } from "../services/products.js";
import { isValidEmail } from "../utils/validation.js";

const features = [
  { icon: FaTruck, title: "Free Shipping", text: "On orders over 500 EGP", iconColor: "text-blue-500", circle: "bg-red-50" },
  { icon: FaShieldAlt, title: "Secure Payment", text: "100% secure transactions", iconColor: "text-green-500", circle: "bg-green-50" },
  { icon: FaUndo, title: "Easy Returns", text: "14-day return policy", iconColor: "text-orange-500", circle: "bg-gray-100" },
  { icon: FaHeadset, title: "24/7 Support", text: "Dedicated support team", iconColor: "text-purple-500", circle: "bg-gray-50" },
];

const slides = [
  { image: "/hero.jpg", title: "Fresh Products Delivered to your Door", text: "Get 20% off your first order", primary: "Shop Now", secondary: "View Deals", accent: "bg-green-500 hover:bg-green-400", hoverText: "hover:text-green-600" },
  { image: "/hero-2.jpg", title: "Premium Quality Guaranteed", text: "Fresh from farm to your table", primary: "Shop Now", secondary: "Learn More", accent: "bg-orange-500 hover:bg-orange-400", hoverText: "hover:text-orange-600" },
  { image: "/hero-3.jpg", title: "Fast & Free Delivery", text: "Same day delivery available", primary: "Order Now", secondary: "Delivery Info", accent: "bg-sky-500 hover:bg-sky-400", hoverText: "hover:text-sky-600" },
];

const newsletterPerks = [
  { label: "Fresh Picks Weekly", icon: FaLeaf },
  { label: "Free Delivery Codes", icon: FaTicketAlt },
  { label: "Members-Only Deals", icon: FaCrown },
];

const deals = [
  {
    tag: "🔥 Deal of the Day",
    title: "Fresh Organic Fruits",
    text: "Get up to 40% off on selected organic fruits",
    discount: "40% OFF",
    code: "ORGANIC40",
    button: "Shop Now",
    color: "from-green-600 to-green-400",
  },
  {
    tag: "✨ New Arrivals",
    title: "Exotic Vegetables",
    text: "Discover our latest collection of premium vegetables",
    discount: "25% OFF",
    code: "FRESH25",
    button: "Explore Now",
    color: "from-orange-500 to-red-500",
  },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    Promise.all([getCategories(), getProducts({ limit: 40 })])
      .then(([categoryData, productData]) => {
        setCategories(categoryData.data);
        setProducts(productData.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // The hero changes slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => setSlide((current) => (current + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!isValidEmail(email)) return setNewsletterMessage("Enter a valid email address");
    setNewsletterMessage("Thanks for subscribing!");
    setEmail("");
  }

  return (
    <>
      <section className="relative h-[28rem] overflow-hidden bg-green-700 text-white">
        {slides.map((item, index) => (
          <div
            key={item.title}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === slide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${item.image})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/90 via-green-600/60 to-transparent" />
        <div key={slide} className="animate-fade-up relative mx-auto flex h-full max-w-7xl flex-col justify-center px-16">
          <h1 className="max-w-md text-3xl font-bold md:text-4xl">{slides[slide].title}</h1>
          <p className="mt-3">{slides[slide].text}</p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/products"
              className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 ${slides[slide].accent}`}
            >
              {slides[slide].primary}
            </Link>
            <Link
              to="/products"
              className={`rounded-full border-2 border-white px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-white ${slides[slide].hoverText}`}
            >
              {slides[slide].secondary}
            </Link>
          </div>
        </div>
        <button
          onClick={() => setSlide((slide + slides.length - 1) % slides.length)}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-green-700 hover:bg-white"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => setSlide((slide + 1) % slides.length)}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-green-700 hover:bg-white"
        >
          <FaChevronRight />
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((item, index) => (
            <button
              key={item.title}
              onClick={() => setSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${index === slide ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-6 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text, iconColor, circle }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-xl"
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${circle} ${iconColor}`}>
              <Icon className="text-lg" />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-800">{title}</p>
              <p className="text-xs text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </section>

      {loading ? (
        <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
          <SkeletonGrid count={6} variant="tile" className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6" />
          <SkeletonGrid count={10} className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-6 py-8">
            <Reveal from="up">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="border-l-4 border-green-600 pl-3 text-2xl font-bold text-gray-800">
                Shop By <span className="text-green-600">Category</span>
              </h2>
              <Link to="/categories" className="flex items-center gap-2 text-sm text-green-600 hover:underline">
                View All Categories <FaArrowRight className="text-xs" />
              </Link>
            </div>
            </Reveal>
            <div className="animate-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="group flex flex-col items-center rounded-xl border border-gray-200 p-4 text-center transition-shadow duration-300 hover:border-green-600 hover:shadow-lg"
                >
                  <img src={category.image} alt={category.name} loading="lazy" className="h-16 w-16 rounded-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <p className="mt-3 text-sm font-medium text-gray-800">{category.name}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="overflow-hidden">
            <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-2">
              {deals.map((deal, index) => (
                <Reveal key={deal.title} from={index === 0 ? "left" : "right"}>
                  <div className={`h-full rounded-2xl bg-gradient-to-r p-10 text-white ${deal.color}`}>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs">{deal.tag}</span>
                    <h3 className="mt-5 text-3xl font-bold">{deal.title}</h3>
                    <p className="mt-2">{deal.text}</p>
                    <p className="mt-5 text-sm">
                      <span className="mr-1 text-3xl font-bold">{deal.discount}</span> Use code:{" "}
                      <b className="font-bold">{deal.code}</b>
                    </p>
                    <Link to="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-gray-800 transition-transform duration-300 hover:scale-105">
                      {deal.button} <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-8">
            <Reveal from="up">
              <h2 className="mb-5 border-l-4 border-green-600 pl-3 text-2xl font-bold text-gray-800">
                Featured <span className="text-green-600">Products</span>
              </h2>
            </Reveal>
            <div className="animate-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}

      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal from="left" className="min-w-0">
        <div className="h-full rounded-2xl bg-green-50 p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
              <FaEnvelopeOpenText />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-semibold uppercase text-green-600">Newsletter</p>
              <p className="text-xs text-gray-500">50,000+ subscribers</p>
            </div>
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-800 sm:text-3xl">
            Get the Freshest Updates <span className="text-green-600">Delivered Free</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">Weekly recipes, seasonal offers & exclusive member perks.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {newsletterPerks.map(({ label, icon: Icon }) => (
              <span key={label} className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm">
                <Icon className="text-green-600" /> {label}
              </span>
            ))}
          </div>
          <form onSubmit={handleSubscribe} noValidate className="mt-5 flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600"
            />
            <button
              type="submit"
              className="group flex items-center gap-2 rounded-lg bg-green-600 px-6 text-sm font-semibold text-white hover:bg-green-700"
            >
              <FaEnvelopeOpen className="group-hover:hidden" />
              <FaEnvelope className="hidden group-hover:block" />
              Subscribe
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
          {newsletterMessage && <p className="mt-2 text-xs text-gray-600">{newsletterMessage}</p>}
          <p className="mt-2 text-xs text-gray-500">Unsubscribe anytime. No spam, ever.</p>
        </div>
        </Reveal>

        <Reveal from="right" className="min-w-0">
        <div className="h-full rounded-2xl bg-gray-900 p-8 text-white">
          <p className="text-xs font-semibold text-green-400">📱 MOBILE APP</p>
          <h2 className="mt-3 text-2xl font-bold">Shop Faster on Our App</h2>
          <p className="mt-2 text-sm text-gray-300">Get app-exclusive deals & 15% off your first order.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 hover:border-white"
            >
              <FaApple className="text-xl" />
              <span className="text-xs leading-tight">Download on<br /><b className="text-sm">App Store</b></span>
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 hover:border-white"
            >
              <FaGooglePlay className="text-lg" />
              <span className="text-xs leading-tight">Get it on<br /><b className="text-sm">Google Play</b></span>
            </a>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-gray-300">
            <span className="flex text-yellow-400"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></span>
            4.9 · 100K+ downloads
          </p>
        </div>
        </Reveal>
        </div>
      </section>
    </>
  );
}
