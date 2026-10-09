import LegalPage from "../components/LegalPage.jsx";

const articles = [
  {
    title: "Acceptance of Terms",
    items: [
      "By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.",
      "If you do not agree to these Terms, you must not access or use the Service.",
      "We reserve the right to modify these Terms at any time, and such modifications shall be effective immediately upon posting.",
    ],
  },
  {
    title: "User Eligibility",
    items: [
      "The Service is intended for users who are at least eighteen (18) years of age.",
      "By using the Service, you represent and warrant that you are of legal age to form a binding contract.",
      "If you are accessing the Service on behalf of a legal entity, you represent that you have the authority to bind such entity.",
    ],
  },
  {
    title: "Account Registration",
    items: [
      "You may be required to create an account to access certain features of the Service.",
      "You agree to provide accurate, current, and complete information during registration.",
      "You are solely responsible for maintaining the confidentiality of your account credentials.",
      "You agree to notify us immediately of any unauthorized use of your account.",
    ],
  },
  {
    title: "Orders and Payments",
    items: [
      "All orders placed through the Service are subject to acceptance and availability.",
      "Prices are subject to change without notice prior to order confirmation.",
      "Payment must be made in full at the time of purchase through approved payment methods.",
      "We reserve the right to refuse or cancel any order at our sole discretion.",
    ],
  },
  {
    title: "Shipping and Delivery",
    items: [
      "Shipping times are estimates only and are not guaranteed.",
      "Risk of loss and title for items purchased pass to you upon delivery to the carrier.",
      "We are not responsible for delays caused by carriers, customs, or other factors beyond our control.",
    ],
  },
  {
    title: "Returns and Refunds",
    items: [
      "Our return policy allows returns within 14 days of delivery for most items.",
      "Products must be unused and in original packaging.",
      "Refunds will be processed within 5-7 business days after receiving the returned item.",
    ],
  },
  {
    title: "Limitation of Liability",
    text: "To the maximum extent permitted by applicable law, FreshCart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.",
  },
  {
    title: "Contact Us",
    text: "If you have any questions about these Terms, please contact us at",
    email: "support@freshcart.com",
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="February 2026"
      notice={{
        title: "Important Notice",
        text: "By accessing and using FreshCart, you accept and agree to be bound by the terms and provisions of this agreement. Please read these terms carefully before using our services.",
      }}
      articles={articles}
      other={{ to: "/privacy", label: "View Privacy Policy" }}
    />
  );
}
