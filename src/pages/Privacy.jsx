import LegalPage from "../components/LegalPage.jsx";

const articles = [
  {
    title: "Information We Collect",
    items: [
      { label: "Personal Data:", text: "Name, email address, phone number, and shipping address." },
      { label: "Payment Data:", text: "Credit card information processed securely through our payment providers." },
      { label: "Technical Data:", text: "IP address, browser type, device information, and access times." },
      { label: "Usage Data:", text: "Pages viewed, products browsed, and actions taken within our platform." },
    ],
  },
  {
    title: "How We Use Your Information",
    items: [
      "To process and fulfill your orders.",
      "To send order confirmations and shipping updates.",
      "To provide customer support and respond to inquiries.",
      "To improve our products, services, and user experience.",
      "To send promotional communications (with your consent).",
    ],
  },
  {
    title: "Data Protection",
    items: [
      "We implement industry-standard encryption (SSL/TLS) for all data transfers.",
      "Payment information is processed by PCI-compliant payment providers.",
      "We conduct regular security audits and vulnerability assessments.",
      "Access to personal data is restricted to authorized personnel only.",
    ],
  },
  {
    title: "Information Sharing",
    items: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We may share data with trusted service providers who assist in our operations.",
      "We may disclose information when required by law or to protect our rights.",
    ],
  },
  {
    title: "Your Rights",
    items: [
      { label: "Access:", text: "Request a copy of your personal data." },
      { label: "Rectification:", text: "Request correction of inaccurate data." },
      { label: "Erasure:", text: "Request deletion of your personal data." },
      { label: "Portability:", text: "Request your data in a portable format." },
      { label: "Opt-out:", text: "Unsubscribe from marketing communications at any time." },
    ],
  },
  {
    title: "Cookies",
    items: [
      "We use cookies to enhance your browsing experience and remember preferences.",
      "You can control cookie settings through your browser preferences.",
      "Disabling cookies may affect the functionality of certain features.",
    ],
  },
  {
    title: "Data Retention",
    text: "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Account data is deleted within 30 days of account closure upon request.",
  },
  {
    title: "Contact Us",
    text: "For questions about this Privacy Policy or to exercise your rights, contact our Data Protection Officer at",
    email: "privacy@freshcart.com",
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="February 2026"
      notice={{
        title: "Your Privacy Matters",
        text: "This Privacy Policy describes how FreshCart collects, uses, and protects your personal information when you use our services. We are committed to ensuring that your privacy is protected.",
      }}
      articles={articles}
      other={{ to: "/terms", label: "View Terms of Service" }}
    />
  );
}
