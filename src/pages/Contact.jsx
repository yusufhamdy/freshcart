import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { inputClass, primaryButtonClass } from "../components/formStyles.js";
import { isValidEmail } from "../utils/validation.js";

const subjects = [
  "General Inquiry",
  "Order Support",
  "Shipping Question",
  "Returns & Refunds",
  "Product Information",
  "Feedback & Suggestions",
  "Other",
];

const socials = [
  { icon: FaFacebookF, name: "Facebook", url: "https://www.facebook.com" },
  { icon: FaTwitter, name: "Twitter", url: "https://twitter.com" },
  { icon: FaInstagram, name: "Instagram", url: "https://www.instagram.com" },
  { icon: FaYoutube, name: "YouTube", url: "https://www.youtube.com" },
];

const emptyForm = { name: "", email: "", subject: "", message: "" };

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
        <Icon />
      </span>
      <div className="text-sm text-gray-600">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSent(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 3) found.name = "Enter your full name";
    if (!isValidEmail(form.email)) found.email = "Enter a valid email address";
    if (!form.subject) found.subject = "Select a subject";
    if (form.message.trim().length < 10) found.message = "Your message must be at least 10 characters";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setForm(emptyForm);
    setSent(true);
  }

  const labelClass = "mb-1 block text-xs font-semibold text-gray-700";
  const errorText = (name) => errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>;

  return (
    <>
      <section className="bg-gradient-to-r from-green-500 to-green-400 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-xs">
            <Link to="/">Home</Link> / <span className="font-medium">Contact Us</span>
          </p>
          <h1 className="mt-4 text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-sm">We'd love to hear from you. Get in touch with our team.</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <InfoCard icon={FaPhoneAlt} title="Phone">
            <p>Mon-Fri from 8am to 6pm</p>
            <a href="tel:+18001234567" className="font-medium text-green-600 hover:underline">+1 (800) 123-4567</a>
          </InfoCard>
          <InfoCard icon={FaEnvelope} title="Email">
            <p>We'll respond within 24 hours</p>
            <a href="mailto:support@freshcart.com" className="font-medium text-green-600 hover:underline">support@freshcart.com</a>
          </InfoCard>
          <InfoCard icon={FaMapMarkerAlt} title="Office">
            <p>123 Commerce Street<br />New York, NY 10001<br />United States</p>
          </InfoCard>
          <InfoCard icon={FaClock} title="Business Hours">
            <p>Monday - Friday: 8am - 6pm<br />Saturday: 9am - 4pm<br />Sunday: Closed</p>
          </InfoCard>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Follow Us</h3>
            <div className="mt-3 flex gap-2">
              {socials.map(({ icon: Icon, name, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-green-600 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
              <p className="text-sm text-gray-500">Fill out the form and we'll get back to you</p>
            </div>
            {sent && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Thank you! Your message has been received.</p>}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>Full Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} className={inputClass} />
                {errorText("name")}
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
                {errorText("email")}
              </div>
            </div>
            <div>
              <label htmlFor="subject" className={labelClass}>Subject</label>
              <select id="subject" name="subject" value={form.subject} onChange={handleChange} className={inputClass}>
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              {errorText("subject")}
            </div>
            <div>
              <label htmlFor="message" className={labelClass}>Message</label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} className={inputClass} />
              {errorText("message")}
            </div>
            <button type="submit" className={`${primaryButtonClass} md:w-auto md:px-8`}>
              <FaPaperPlane /> Send Message
            </button>
          </form>

          <div className="rounded-2xl bg-green-50 p-6">
            <h3 className="font-bold text-gray-900">Looking for quick answers?</h3>
            <p className="mt-1 text-sm text-gray-600">
              Check out our Help Center for frequently asked questions about orders, shipping, returns, and more.
            </p>
            <Link to="/help" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:underline">
              Visit Help Center <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
