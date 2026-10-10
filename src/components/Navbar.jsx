import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChevronDown,
  FaCog,
  FaEnvelope,
  FaGift,
  FaHeadset,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegHeart,
  FaRegUserCircle,
  FaRegUser,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaTruck,
  FaUserPlus,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import Logo from "./Logo.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium hover:text-green-600 ${isActive ? "text-green-600" : "text-gray-800"}`;

const menuLinkClass = "block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-green-50";

// Categories shown in the menu
const menuCategoryNames = ["Electronics", "Women's Fashion", "Men's Fashion", "Beauty & Health"];

export default function Navbar({ categories = [] }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuCategories = menuCategoryNames
    .map((name) => categories.find((category) => category.name === name))
    .filter(Boolean);

  function handleSearch(e) {
    e.preventDefault();
    const text = keyword.trim();
    if (!text) return;
    setMenuOpen(false);
    navigate(`/products?keyword=${encodeURIComponent(text)}`);
  }

  function handleLogout() {
    setMenuOpen(false);
    logout();
  }

  const badge = (count, color) =>
    count > 0 && (
      <span className={`absolute -right-2 -top-4 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ${color}`}>
        {count}
      </span>
    );

  const searchForm = (className) => (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search for products, brands and more..."
        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-12 text-sm outline-none focus:border-green-600"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-green-600 text-white"
      >
        <FaSearch className="text-xs" />
      </button>
    </form>
  );

  return (
    <>
      <div className="hidden border-b border-gray-100 bg-white text-xs text-gray-600 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <FaTruck className="text-green-600" /> Free Shipping on Orders Over 500 EGP
            </span>
            <span className="flex items-center gap-1.5">
              <FaGift className="text-green-600" /> New Arrivals Daily
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+18001234567" className="flex items-center gap-1.5 hover:text-green-600">
              <FaPhoneAlt /> +1 (800) 123-4567
            </a>
            <a href="mailto:support@freshcart.com" className="flex items-center gap-1.5 hover:text-green-600">
              <FaEnvelope /> support@freshcart.com
            </a>
            {user ? (
              <>
                <span className="flex items-center gap-1.5 font-medium text-gray-800">
                  <FaRegUser /> {user.name}
                </span>
                <button onClick={logout} className="hover:text-green-600">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1.5 hover:text-green-600">
                  <FaRegUser /> Sign In
                </Link>
                <Link to="/register" className="flex items-center gap-1.5 hover:text-green-600">
                  <FaUserPlus /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3 lg:gap-6">
        <Logo />
        {searchForm("hidden flex-1 md:block")}

        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>
          <div className="group relative">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-800 group-hover:text-green-600"
            >
              Categories <FaChevronDown className="text-[10px]" />
            </button>
            <div className="invisible absolute left-0 top-full z-20 min-w-44 translate-y-2 rounded-lg border border-gray-200 bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <Link to="/categories" className="block px-4 py-2 text-sm hover:text-green-600">
                All Categories
              </Link>
              {menuCategories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="block px-4 py-2 text-sm hover:text-green-600"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <NavLink to="/brands" className={navLinkClass}>
            Brands
          </NavLink>
        </nav>

        <Link to="/contact" className="hidden items-center gap-2 border-l border-gray-200 pl-5 md:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
            <FaHeadset />
          </span>
          <div className="text-xs leading-tight">
            <p className="text-gray-500">Support</p>
            <p className="font-semibold text-gray-800">24/7 Help</p>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-4 max-[360px]:gap-2 md:ml-0">
          <Link to="/wishlist" aria-label="Wishlist" className="relative text-lg text-gray-700 hover:text-green-600">
            <FaRegHeart />
            {badge(wishlistItems.length, "bg-red-500")}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative text-lg text-gray-700 hover:text-green-600">
            <FaShoppingCart />
            {badge(cart.count, "bg-green-600")}
          </Link>
          {user && (
            <Link to="/profile" aria-label="My account" className="hidden text-xl text-gray-700 hover:text-green-600 md:block">
              <FaRegUserCircle />
            </Link>
          )}
          {!user && (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 lg:flex"
            >
              <FaRegUser /> Sign In
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white lg:hidden"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="animate-slide-down absolute inset-x-0 top-full border-t border-gray-100 bg-white px-6 py-4 shadow-lg lg:hidden">
          {searchForm("mb-3 md:hidden")}
          <nav onClick={() => setMenuOpen(false)} className="space-y-1">
            <Link to="/" className={menuLinkClass}>Home</Link>
            <Link to="/products" className={menuLinkClass}>Shop</Link>
            <Link to="/categories" className={menuLinkClass}>Categories</Link>
            <Link to="/brands" className={menuLinkClass}>Brands</Link>
            <Link to="/wishlist" className={menuLinkClass}>Wishlist</Link>
            <Link to="/cart" className={menuLinkClass}>Cart</Link>
          </nav>
          <div className="mt-3 border-t border-gray-100 pt-3">
            {user ? (
              <>
                <p className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800">
                  <FaRegUser /> {user.name}
                </p>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`${menuLinkClass} flex items-center gap-3`}
                >
                  <FaMapMarkerAlt className="text-gray-500" /> My Addresses
                </Link>
                <Link
                  to="/profile/settings"
                  onClick={() => setMenuOpen(false)}
                  className={`${menuLinkClass} flex items-center gap-3`}
                >
                  <FaCog className="text-gray-500" /> Settings
                </Link>
                <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50">
                  Sign Out
                </button>
              </>
            ) : (
              <div onClick={() => setMenuOpen(false)}>
                <Link to="/login" className={menuLinkClass}>Sign In</Link>
                <Link to="/register" className={menuLinkClass}>Sign Up</Link>
              </div>
            )}
          </div>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-xs text-gray-600"
          >
            <FaHeadset className="text-green-600" /> Need Help? Contact Support
          </Link>
        </div>
      )}
      </header>
    </>
  );
}
