import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

const questions = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3-5 business days. Express delivery (1-2 business days) is available.",
  },
  {
    q: "Is shipping free?",
    a: "Shipping is free on orders over 500 EGP. For smaller orders, shipping and taxes are added when you place the order and are shown on the My Orders page.",
  },
  {
    q: "How can I track my order?",
    a: "Open My Orders from your account to see every order and its status: Processing, On the way or Delivered.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "You can pay with cash on delivery, or online with a credit or debit card through Stripe.",
  },
  {
    q: "What is your return policy?",
    a: "Returns are accepted within 14 days of delivery for most items. Products must be unused and in original packaging. Refunds are processed within 5-7 business days after we receive the item.",
  },
  {
    q: "How do I change my address or personal details?",
    a: "Open My Account to add, edit or delete your addresses. Use Settings to update your name, email, phone number or password.",
  },
  {
    q: "I forgot my password. What should I do?",
    a: "Choose Forgot Password on the sign in page. We send a 6-digit code to your email, then you can create a new password.",
  },
  {
    q: "How can I contact support?",
    a: "Use the Contact Us page or email support@freshcart.com. We respond within 24 hours, Monday to Friday from 8am to 6pm.",
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <section className="bg-gradient-to-r from-green-500 to-green-400 text-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs">
            <Link to="/">Home</Link> / <span className="font-medium">Help Center</span>
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl">
              <FaQuestionCircle />
            </span>
            <div>
              <h1 className="text-4xl font-bold">Help Center</h1>
              <p className="mt-1 text-sm">Answers to the questions we hear the most</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-3 px-6 py-10">
        {questions.map((item, index) => {
          const open = openIndex === index;
          return (
            <div key={item.q} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-gray-900 hover:text-green-600"
              >
                {item.q}
                <FaChevronDown className={`shrink-0 text-xs transition-transform duration-300 ${open ? "rotate-180 text-green-600" : ""}`} />
              </button>
              {open && <p className="animate-fade-in px-5 pb-5 text-sm leading-relaxed text-gray-600">{item.a}</p>}
            </div>
          );
        })}

        <div className="rounded-2xl bg-green-50 p-6 text-center">
          <h2 className="font-bold text-gray-900">Still need help?</h2>
          <p className="mt-1 text-sm text-gray-600">Our team is happy to answer any other question.</p>
          <Link to="/contact" className="mt-4 inline-block rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}
