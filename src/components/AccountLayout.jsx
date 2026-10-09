import { Link } from "react-router-dom";
import { FaChevronRight, FaCog, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const links = [
  { id: "addresses", to: "/profile", label: "My Addresses", icon: FaMapMarkerAlt },
  { id: "settings", to: "/profile/settings", label: "Settings", icon: FaCog },
];

export default function AccountLayout({ active, children }) {
  return (
    <>
      <section className="bg-gradient-to-r from-green-500 to-green-400 text-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-xs">
            <Link to="/">Home</Link> / <span className="font-medium">My Account</span>
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl">
              <FaUser />
            </span>
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-sm">Manage your addresses and account settings</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
          <p className="border-b border-gray-100 px-3 py-3 text-sm font-semibold text-gray-900">My Account</p>
          {links.map(({ id, to, label, icon: Icon }) => (
            <Link
              key={id}
              to={to}
              className={`mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                active === id ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  active === id ? "bg-green-500 text-white" : "bg-gray-100"
                }`}
              >
                <Icon />
              </span>
              <span className="flex-1">{label}</span>
              <FaChevronRight className="text-xs" />
            </Link>
          ))}
        </aside>
        <div>{children}</div>
      </section>
    </>
  );
}
