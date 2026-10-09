import { Link } from "react-router-dom";
import {
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaEnvelope,
  FaFacebookF,
  FaHeadset,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaTruck,
  FaTwitter,
  FaUndo,
  FaYoutube,
} from "react-icons/fa";
import Logo from "./Logo.jsx";

const features = [
  { icon: FaTruck, title: "Free Shipping", text: "On orders over 500 EGP" },
  { icon: FaUndo, title: "Easy Returns", text: "14-day return policy" },
  { icon: FaShieldAlt, title: "Secure Payment", text: "100% secure checkout" },
  { icon: FaHeadset, title: "24/7 Support", text: "Contact us anytime" },
];

// Items without a "to" are plain text for now
const columns = [
  {
    title: "Shop",
    items: [
      { label: "All Products", to: "/products" },
      { label: "Categories", to: "/categories" },
      { label: "Brands", to: "/brands" },
      { label: "Electronics", category: "Electronics" },
      { label: "Men's Fashion", category: "Men's Fashion" },
      { label: "Women's Fashion", category: "Women's Fashion" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "My Account", to: "/profile" },
      { label: "Order History", to: "/orders" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Shopping Cart", to: "/cart" },
      { label: "Sign In", to: "/login" },
      { label: "Create Account", to: "/register" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Contact Us", to: "/contact" },
      { label: "Help Center", to: "/help" },
      { label: "Shipping Info", to: "/shipping" },
      { label: "Returns & Refunds", to: "/returns" },
      { label: "Track Order", to: "/track-order" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  },
];

const socials = [
  { icon: FaFacebookF, name: "Facebook", url: "https://www.facebook.com" },
  { icon: FaTwitter, name: "Twitter", url: "https://twitter.com" },
  { icon: FaInstagram, name: "Instagram", url: "https://www.instagram.com" },
  { icon: FaYoutube, name: "YouTube", url: "https://www.youtube.com" },
];

const payments = [
  { name: "Visa", icon: FaCcVisa },
  { name: "Mastercard", icon: FaCcMastercard },
  { name: "PayPal", icon: FaCcPaypal },
];

export default function Footer({ categories = [] }) {
  const categoryPath = (name) => {
    const found = categories.find((category) => category.name === name);
    return found ? `/products?category=${found._id}` : null;
  };

  return (
    <footer>
      <div className="bg-green-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-5 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Icon />
              </span>
              <div className="text-xs">
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 text-gray-300">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="col-span-2 lg:col-span-1">
            <div className="inline-block rounded-md bg-white px-3 py-1.5">
              <Logo />
            </div>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-gray-400">
              FreshCart is your one-stop destination for quality products. From fashion to
              electronics, we bring you the best brands at competitive prices with a seamless
              shopping experience.
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <a href="tel:+18001234567" className="flex items-center gap-2 hover:text-white">
                  <FaPhoneAlt className="text-green-500" /> +1 (800) 123-4567
                </a>
              </li>
              <li>
                <a href="mailto:support@freshcart.com" className="flex items-center gap-2 hover:text-white">
                  <FaEnvelope className="text-green-500" /> support@freshcart.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500" /> 123 Commerce Street, New York, NY 10001
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              {socials.map(({ icon: Icon, name, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-xs transition-colors hover:bg-green-600"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{column.title}</h3>
              <ul className="space-y-2.5 text-xs text-gray-400">
                {column.items.map((item) => {
                  const to = item.to || (item.category && categoryPath(item.category));
                  return (
                    <li key={item.label}>
                      {to ? (
                        <Link to={to} className="hover:text-white">
                          {item.label}
                        </Link>
                      ) : (
                        item.label
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-gray-500 sm:flex-row">
            <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
            <div className="flex gap-4">
              {payments.map(({ name, icon: Icon }) => (
                <span key={name} className="flex items-center gap-1.5">
                  <Icon className="text-xl" /> {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
