import LegalPage from "../components/LegalPage.jsx";

const articles = [
  {
    title: "How We Use Cookies",
    items: ["We use cookies to enhance your browsing experience and remember preferences."],
  },
  {
    title: "Managing Cookies",
    items: [
      "You can control cookie settings through your browser preferences.",
      "Disabling cookies may affect the functionality of certain features.",
    ],
  },
  {
    title: "Contact Us",
    text: "For questions about how we use cookies, contact us at",
    email: "privacy@freshcart.com",
  },
];

export default function Cookies() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="February 2026"
      notice={{
        title: "About Cookies",
        text: "This Cookie Policy explains how FreshCart uses cookies when you visit our website.",
      }}
      articles={articles}
      other={{ to: "/privacy", label: "View Privacy Policy" }}
    />
  );
}
