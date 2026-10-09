import { FaCheck, FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa";

const sections = [
  {
    title: "Shipping Information",
    icon: FaTruck,
    items: [
      "Free shipping on orders over 500 EGP",
      "Standard delivery: 3-5 business days",
      "Express delivery available (1-2 business days)",
      "Track your order in real-time",
    ],
  },
  {
    title: "Returns & Refunds",
    icon: FaUndo,
    items: [
      "14-day hassle-free returns",
      "Full refund or exchange available",
      "Free return shipping on defective items",
      "Easy online return process",
    ],
  },
];

export default function ShippingInfo() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(({ title, icon: Icon, items }) => (
          <div key={title} className="rounded-lg bg-slate-50 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Icon className="text-xs" />
              </span>
              {title}
            </h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheck className="text-xs text-green-600" /> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-4 rounded-lg border border-green-100 bg-green-50 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
          <FaShieldAlt />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Buyer Protection Guarantee</h3>
          <p className="mt-1 text-sm text-gray-600">
            Get a full refund if your order doesn't arrive or isn't as described. We ensure your shopping
            experience is safe and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
