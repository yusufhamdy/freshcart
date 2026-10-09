import LegalPage from "../components/LegalPage.jsx";

const articles = [
  {
    title: "Shipping Information",
    items: [
      "Free shipping on orders over 500 EGP",
      "Standard delivery: 3-5 business days",
      "Express delivery available (1-2 business days)",
      "Track your order in real-time",
    ],
  },
  {
    title: "Delivery Terms",
    items: [
      "Shipping times are estimates only and are not guaranteed.",
      "We are not responsible for delays caused by carriers, customs, or other factors beyond our control.",
    ],
  },
  {
    title: "Buyer Protection Guarantee",
    text: "Get a full refund if your order doesn't arrive or isn't as described. We ensure your shopping experience is safe and secure.",
  },
];

export default function Shipping() {
  return (
    <LegalPage
      title="Shipping Info"
      updated="February 2026"
      notice={{
        title: "Fast and Reliable Delivery",
        text: "We deliver your order to your doorstep. Here is everything you need to know about shipping at FreshCart.",
      }}
      articles={articles}
      other={{ to: "/returns", label: "View Returns & Refunds" }}
    />
  );
}
