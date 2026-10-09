import LegalPage from "../components/LegalPage.jsx";

const articles = [
  {
    title: "Return Policy",
    items: [
      "Our return policy allows returns within 14 days of delivery for most items.",
      "Products must be unused and in original packaging.",
      "Refunds will be processed within 5-7 business days after receiving the returned item.",
    ],
  },
  {
    title: "Refunds and Exchanges",
    items: [
      "Full refund or exchange available",
      "Free return shipping on defective items",
      "Easy online return process",
    ],
  },
  {
    title: "Buyer Protection Guarantee",
    text: "Get a full refund if your order doesn't arrive or isn't as described. We ensure your shopping experience is safe and secure.",
  },
  {
    title: "Contact Us",
    text: "To start a return or ask about a refund, contact us at",
    email: "support@freshcart.com",
  },
];

export default function Returns() {
  return (
    <LegalPage
      title="Returns & Refunds"
      updated="February 2026"
      notice={{
        title: "Easy Returns",
        text: "If you are not happy with your purchase, we make it simple to return it. Read how returns and refunds work at FreshCart.",
      }}
      articles={articles}
      other={{ to: "/shipping", label: "View Shipping Info" }}
    />
  );
}
